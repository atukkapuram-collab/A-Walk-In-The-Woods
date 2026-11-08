import { Scene, Input } from 'phaser';
import { TILE_SIZE, WORLD_ZOOM } from '../config.js';
import { MAPS } from '../data/maps/index.js';
import { EVENTS } from '../data/events/index.js';
import { katzLinesFor, KATZ_WORRIED } from '../data/katz-lines.js';
import { TUNING } from '../data/tuning.js';
import { TILE_DEFS } from '../art/tiles.js';
import { gameState } from '../state/GameState.js';
import { checkEnding, bondBand } from '../state/endings.js';
import { parseMap, isBlocked, buildTilemapLayer, openGate } from '../systems/MapBuilder.js';
import { GridMover, dirBetween } from '../systems/GridMover.js';
import { updateParty } from '../systems/Follower.js';
import { stepTriggerAt, talkTarget, gatesOpenedBy, inRect } from '../systems/Interactions.js';
import { Controls } from '../systems/Input.js';
import { Lighting } from '../systems/Lighting.js';
import { Weather } from '../systems/Weather.js';
import { nextStep, goToMap, detourFor, go } from '../systems/Journey.js';
import { DEBUG } from '../systems/Debug.js';
import { openOverlay } from '../systems/Transitions.js';

const CAMPFIRE = TILE_DEFS.findIndex((t) => t.name === 'campfire');

// One scene for every trail map: start it with { map: 'georgia' } etc.
// Walking, collision, camera and Katz (M1); events, NPCs, gates, hints (M2);
// stats, ending checks, worried lines, debug menu (M3); season tilesets,
// signs, overlooks, night tint, weather and the Journey between maps (M4).
// The HUD (HUDScene) and the dialogue overlay (DialogueScene) run above it.
export class TrailScene extends Scene {
    constructor() {
        super('Trail');
    }

    init(data) {
        // Reset per-visit state here, not in the constructor (Phaser reuses scene
        // instances). Run state (stats, events done) lives in gameState.
        this.mapKey = data?.map ?? 'georgia';
        this.frozen = false;
        this.leaving = false;
        this.stepsTaken = 0;
        this.hintStage = null;
        this.lastKatzLine = -1;
        this.pendingWorries = [];
    }

    create() {
        this.map = MAPS[this.mapKey];
        if (!this.map) throw new Error(`Unknown map "${this.mapKey}".`);
        this.grid = parseMap(this.map);
        this.layer = buildTilemapLayer(this, this.grid, `tiles-${this.map.palette ?? 'spring'}`);

        // Gates whose event already happened (e.g. a debug start) start open.
        for (const gate of this.map.gates ?? []) {
            if (gameState.eventsDone.has(gate.opensAfter)) openGate(this.grid, gate, this.layer);
        }

        const { player, katz } = this.grid.spawns;
        this.player = new GridMover({ ...player, facing: 'up', stepMs: TUNING.stepMs });
        this.katz = new GridMover({ ...katz, facing: 'up', stepMs: TUNING.stepMs });
        this.playerSprite = this.add.sprite(0, 0, 'hiker', this.player.frame);
        this.katzSprite = this.add.sprite(0, 0, 'katz', this.katz.frame);

        // NPCs stand still and block their tile.
        this.npcs = (this.map.npcs ?? []).map((npc) => ({
            ...npc,
            sprite: this.add.sprite(npc.x * TILE_SIZE + TILE_SIZE / 2, npc.y * TILE_SIZE + TILE_SIZE / 2,
                npc.sprite, `${npc.facing ?? 'down'}-stand`).setDepth(npc.y * TILE_SIZE + TILE_SIZE / 2)
        }));
        this.syncSprites();

        // Footstep dust (game-feel, kept light): a tiny puff behind each step.
        this.dust = this.add.particles(0, 0, 'fx-dust', {
            emitting: false,
            lifespan: { min: 220, max: 380 },
            speed: { min: 4, max: 14 },
            angle: { min: 200, max: 340 },
            gravityY: 18,
            scale: { start: 1, end: 0.4 },
            alpha: { start: 0.7, end: 0 }
        });

        this.controls = new Controls(this);
        if (DEBUG.enabled) this.debugKey = this.input.keyboard.addKey('F2');

        // Camera: zoomed 3x, locked to the map so it never shows past the edges,
        // following the Hiker with a small deadzone. Positions are whole pixels,
        // so with roundPixels nothing shimmers.
        const cam = this.cameras.main;
        cam.setZoom(WORLD_ZOOM);
        cam.setBounds(0, 0, this.grid.width * TILE_SIZE, this.grid.height * TILE_SIZE);
        cam.startFollow(this.playerSprite, true, 1, 1);
        cam.setDeadzone(TILE_SIZE * 2, TILE_SIZE);
        cam.fadeIn(TUNING.fadeMs, 0, 0, 0);

        this.lighting = new Lighting(this, this.grid, CAMPFIRE);
        this.weather = new Weather(this, this.map.weather);

        // Overlays: launch each only once (launching a running scene restarts it).
        if (!this.scene.isActive('HUD')) this.scene.launch('HUD');
        if (this.scene.isActive('Dialogue')) {
            this.onDialogueReady();
        } else {
            this.scene.launch('Dialogue');
            this.scene.get('Dialogue').events.once('create', () => this.onDialogueReady());
        }
    }

    onDialogueReady() {
        this.dialogue = this.scene.get('Dialogue');
        this.scene.bringToTop('HUD');
        this.scene.bringToTop('Dialogue');
        if (this.map.tutorialHints && !DEBUG.enabled) this.setHint('walk');
        // A map can start with an event (the roadside campground's Final Crossroads).
        if (this.map.autoEvent && !gameState.eventsDone.has(this.map.autoEvent)) {
            this.time.delayedCall(500, () => this.startEvent(this.map.autoEvent));
        }
    }

    update(time, delta) {
        this.weather.update();
        // Esc pauses, even in the middle of a dialogue box: the box is paused
        // with the trail and carries on where it was (PauseScene).
        if (!this.leaving && this.controls.justPressed('pause')) {
            openOverlay(this, 'Pause', ['Trail', 'Dialogue']);
            return;
        }

        if (this.frozen || this.leaving) {
            this.syncSprites();
            return;
        }

        if (this.debugKey && Input.Keyboard.JustDown(this.debugKey)) {
            this.debugMenu();
            return;
        }

        if (this.controls.justPressed('confirm') && !this.player.moving) {
            this.talk();
            if (this.frozen) return;
        }

        const { started, finished } = updateParty({
            player: this.player,
            katz: this.katz,
            dir: this.controls.direction,
            // Cap long frames (e.g. after switching tabs) so nobody skips tiles.
            delta: Math.min(delta, TUNING.stepMs / 2),
            isBlocked: (x, y) => this.isBlocked(x, y),
            onArrive: (tile) => this.arrive(tile)
        });

        if (finished) this.events.emit('step-end', finished.tile);
        if (started) {
            this.events.emit('step-start', started.from, started.to);
            const fx = started.from.x * TILE_SIZE + TILE_SIZE / 2;
            const fy = started.from.y * TILE_SIZE + TILE_SIZE - 2;
            this.dust.setDepth(fy - 4).explode(3, fx, fy);
            this.stepsTaken += 1;
            if (this.hintStage === 'walk' && this.stepsTaken >= TUNING.hintSteps) this.setHint('talk');
        }

        this.syncSprites();
    }

    isBlocked(x, y) {
        return isBlocked(this.grid, x, y, this.npcs);
    }

    // A step just ended on `tile`. Returns true if something took over (an event or the exit).
    arrive(tile) {
        const eventId = stepTriggerAt(this.map, tile, gameState.eventsDone);
        if (eventId) {
            this.startEvent(eventId);
            return true;
        }
        if (this.map.exit && inRect(this.map.exit, tile)) {
            this.leaveMap();
            return true;
        }
        return false;
    }

    // Space/Enter: talk to the NPC, sign or overlook in front, otherwise to Katz.
    talk() {
        const target = talkTarget(this.map, this.player, gameState.eventsDone);
        if (target.npc) {
            // The NPC turns to face the Hiker.
            const npc = this.npcs.find((n) => n.id === target.npc.id);
            const dir = dirBetween(npc, this.player.tile);
            if (dir) npc.sprite.setFrame(`${dir}-stand`);
        }
        switch (target.kind) {
            case 'event': this.startEvent(target.event); break;
            case 'sign': this.runEvent({ id: 'sign', steps: [{ narrate: target.text }] }, () => {}); break;
            case 'overlook': this.overlook(target.text); break;
            case 'katz': this.katzTalk(); break;
        }
    }

    // The scenic overlook: a narrated moment of wonder, Morale +1 once per map.
    overlook(text) {
        if (gameState.overlooksSeen.has(this.mapKey)) {
            this.runEvent({ id: 'overlook', steps: [{ narrate: text }] }, () => {});
            return;
        }
        gameState.overlooksSeen.add(this.mapKey);
        this.runEvent({ id: 'overlook', steps: [{ result: text, effects: { morale: +1 } }] }, () => this.sayWorries());
    }

    katzTalk() {
        // A line matching his current Bond, never the same one twice in a row.
        const lines = katzLinesFor(bondBand(gameState.stats.bond), this.mapKey);
        let i = Math.floor(Math.random() * lines.length);
        if (lines.length > 1 && i === this.lastKatzLine) i = (i + 1) % lines.length;
        this.lastKatzLine = i;
        this.runEvent({ id: 'katz_talk', steps: [{ say: 'katz', text: lines[i] }] }, () => {});
    }

    startEvent(eventId) {
        const event = EVENTS[eventId];
        if (!event) throw new Error(`Map "${this.mapKey}" points at unknown event "${eventId}".`);
        this.runEvent(event, (outcome) => this.eventFinished(event, outcome));
    }

    runEvent(event, onFinish) {
        if (!this.dialogue || this.dialogue.playing) return;
        if (this.hintStage) this.setHint(null);
        this.frozen = true;
        if (event.night) this.lighting.setNight(true);
        this.dialogue.play(event, (outcome) => {
            this.frozen = false;
            this.controls.flush(); // the Space press that closed the box shouldn't count here too
            if (event.night) this.lighting.setNight(false);
            onFinish(outcome);
        }, {
            state: gameState.snapshot,
            // Stats change when the result card appears (design blueprint).
            onResult: ({ effects, flags }) => {
                const changes = gameState.apply(effects, flags);
                this.pendingWorries.push(...gameState.newDangers(changes));
            }
        });
    }

    eventFinished(event, outcome) {
        gameState.markDone(outcome.eventId);
        gameState.recordChoice(outcome.eventId, outcome.optionId);
        for (const gate of gatesOpenedBy(this.map, outcome.eventId)) {
            openGate(this.grid, gate, this.layer);
        }
        this.events.emit('event-finished', outcome);

        // Ending checks: after Events 5 and 8 (endingCheck) and at the Final Crossroads (final).
        if (outcome.final || event.endingCheck) {
            const ending = checkEnding(gameState.snapshot, outcome.final ?? null);
            if (ending) {
                this.goToEnding({ ending, final: outcome.final ?? null });
                return;
            }
        }

        // "Left the wilderness": skip the rest of Maine (src/data/journey.js).
        const detour = detourFor(this.mapKey, outcome.eventId, gameState.flags);
        if (detour) {
            this.leaving = true;
            goToMap(this, detour);
            return;
        }
        this.sayWorries();
    }

    // Katz says a worried line once when a stat enters its danger zone.
    sayWorries() {
        const worries = this.pendingWorries.filter((stat) => KATZ_WORRIED[stat]);
        this.pendingWorries = [];
        if (!worries.length) return;
        this.runEvent({ id: 'katz_worried', steps: worries.map((stat) => ({ say: 'katz', text: KATZ_WORRIED[stat] })) }, () => {});
    }

    // The map's exit: on to the next step of the journey (a travel screen).
    leaveMap() {
        this.leaving = true;
        nextStep(this);
    }

    goToEnding(data) {
        this.leaving = true;
        go(this, 'Ending', data);
    }

    // Debug mode only (?debug=1): F2 shows the state and runs ending checks.
    debugMenu() {
        const s = gameState.snapshot;
        console.table(s);
        const actions = [null, 'summit', 'home', 'ourWay'];
        this.runEvent({
            id: 'debug',
            steps: [
                { narrate: `Debug (${this.mapKey}). Stamina ${s.stamina}, Supplies ${s.supplies}, Bond ${s.bond}, Morale ${s.morale}, Miles ${s.miles}. Skipped ahead: ${s.skippedAhead}. Left the wilderness: ${s.leftWilderness}. Events done: ${[...gameState.eventsDone].join(', ') || 'none'}.` },
                { choose: [
                    { text: 'Run the mid-trip ending check (as after Event 5 or 8)' },
                    { text: 'Final Crossroads: "Summit or nothing"' },
                    { text: 'Final Crossroads: "Let\'s go home"' },
                    { text: 'Final Crossroads: "Let\'s finish it our way"' }
                ] }
            ]
        }, (outcome) => {
            const final = actions[outcome.choice];
            const ending = checkEnding(gameState.snapshot, final);
            if (ending) this.goToEnding({ ending });
            else this.runEvent({ id: 'debug_result', steps: [{ narrate: 'No ending: the walk goes on.' }] }, () => {});
        });
    }

    setHint(stage) {
        this.hintStage = stage;
        const text = { walk: 'Arrow keys or WASD to walk', talk: 'Space or Enter to talk' }[stage] ?? null;
        this.dialogue?.showHint(text);
    }

    syncSprites() {
        for (const [sprite, mover] of [[this.playerSprite, this.player], [this.katzSprite, this.katz]]) {
            const { x, y } = mover.position;
            sprite.setPosition(Math.round(x * TILE_SIZE + TILE_SIZE / 2), Math.round(y * TILE_SIZE + TILE_SIZE / 2));
            sprite.setFrame(mover.frame);
            sprite.setDepth(sprite.y); // lower on screen draws in front
        }
    }
}
