import { Scene } from 'phaser';
import { OPENING_PANELS } from '../data/opening.js';
import { EVENTS } from '../data/events/index.js';
import { gameState } from '../state/GameState.js';
import { nextStep } from '../systems/Journey.js';
import { fadeIn } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { addIllustration } from '../art/illustrations.js';

// Scene 1, the opening (design blueprint, Location Progression): illustrated
// still panels with narration, from src/data/opening.js. There is no name
// entry: the player is Bill Bryson (Milestone 10). A panel can play an event
// instead (E1, the Outfitter): its result card changes the stats, as on the trail.
// Esc skips the panels (for replays). Then the Journey moves on to Act I.
export class OpeningScene extends Scene {
    constructor() {
        super('Opening');
    }

    init() {
        this.leaving = false;
        this.current = -1;   // the panel being shown
        this.skipTo = null;  // set by Esc: the E1 panel to jump to
    }

    create() {
        fadeIn(this);
        this.art = addIllustration(this, OPENING_PANELS[0].art);
        this.controls = new Controls(this);
        this.scene.launch('Dialogue');
        this.scene.get('Dialogue').events.once('create', () => {
            this.dialogue = this.scene.get('Dialogue');
            this.scene.bringToTop('Dialogue');
            this.playPanel(0);
        });
    }

    playPanel(i) {
        if (this.leaving) return;
        if (this.skipTo !== null && i < this.skipTo) i = this.skipTo;
        this.skipTo = null;
        this.current = i;
        const panel = OPENING_PANELS[i];
        if (!panel) return this.leave();
        if (i > 0) this.showArt(panel.art);
        this.time.delayedCall(i > 0 ? 450 : 200, () => {
            if (this.leaving) return;
            if (this.skipTo !== null) return this.playPanel(this.skipTo); // Esc during the cross-fade
            if (panel.event) return this.playEvent(EVENTS[panel.event], () => this.playPanel(i + 1));
            this.dialogue.play({ id: `opening_${i}`, steps: panel.steps }, () => this.playPanel(i + 1), { state: gameState.snapshot });
        });
    }

    // An event inside the opening (E1): stats change at its result card, and
    // the choice is remembered for later callbacks.
    playEvent(event, next) {
        if (!event) throw new Error('An opening panel points at an unknown event.');
        this.dialogue.play(event, (outcome) => {
            gameState.markDone(outcome.eventId);
            gameState.recordChoice(outcome.eventId, outcome.optionId);
            next();
        }, {
            state: gameState.snapshot,
            onResult: ({ effects, flags }) => gameState.apply(effects, flags)
        });
    }

    // Cross-fade to the next picture.
    showArt(name) {
        const old = this.art;
        this.art = addIllustration(this, name).setAlpha(0); // added last, so drawn on top
        this.tweens.add({ targets: this.art, alpha: 1, duration: 400, onComplete: () => old.destroy() });
    }

    // Esc skips the panels (for replays), but never E1's choice: it jumps to
    // E1 if it hasn't been played yet, otherwise on to Act I.
    skip() {
        if (OPENING_PANELS[this.current]?.event) return; // the choice can't be skipped
        const e1 = OPENING_PANELS.findIndex((p) => p.event && !gameState.eventsDone.has(p.event));
        if (e1 < 0) {
            if (this.dialogue?.playing) this.dialogue.finish({ choice: null, eventId: null });
            return this.leave();
        }
        this.skipTo = e1;
        // Ending the current box moves on to the next panel, which jumps to E1.
        if (this.dialogue?.playing) this.dialogue.finish({ choice: null, eventId: null });
    }

    leave() {
        if (this.leaving) return;
        this.leaving = true;
        nextStep(this);
    }

    update() {
        if (!this.leaving && this.controls.justPressed('pause')) this.skip();
    }
}
