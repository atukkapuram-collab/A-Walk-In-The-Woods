import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { TUNING } from '../data/tuning.js';
import { gameState } from '../state/GameState.js';
import { nextStep } from '../systems/Journey.js';
import { fadeIn } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { PLACES, pointForMiles, travelledPieces } from '../systems/TravelPath.js';
import { addIllustration, ILL_SCALE } from '../art/illustrations.js';
import { audio } from '../systems/Audio.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// The travel screen between maps (design blueprint, "the Oregon Trail
// moment"): the two hikers walk the ribbon of trail across a simple East Coast
// map for about 4-5 seconds while the miles tick up, with a season and place
// label and an optional narrator line. With "skipped ahead" set, the rental
// car version (the book's skip; those miles count as skipped, not walked).
// While Katz is away (Act III), Bryson walks alone: one sprite.
// The marker's place on the trail is miles walked plus miles skipped.
// Start with { label, miles, line, solo, carLine, carIfSkipped }. Space skips.
// The trail behind the marker is drawn solid where walked, dashed where driven.
export class TravelScene extends Scene {
    constructor() {
        super('Travel');
    }

    init(data) {
        this.step = data;
        this.done = false;
    }

    create() {
        fadeIn(this);
        addIllustration(this, 'travelMap');
        const truck = this.step.carIfSkipped && gameState.flags.skippedAhead;
        const alone = this.step.solo || gameState.flags.katzAway;

        // The marker moves along the trail to the next map (`to`); the counter
        // shows miles WALKED, which the car doesn't add to.
        const walkedFrom = gameState.miles;
        const walked = truck ? 0 : this.step.miles;
        const from = gameState.trailPos;
        const to = Math.max(from, this.step.to ?? from + this.step.miles);
        const pastRanges = [...gameState.skippedRanges];
        gameState.travelTo(to, { skipped: truck });
        if (walked) gameState.apply({ miles: walked });
        const at = (miles) => pointForMiles(miles).map((v) => v * ILL_SCALE);

        // The trail behind the marker: solid gold where it was walked, dashed
        // grey where the rental car carried them (redrawn as the marker moves).
        this.trailLine = this.add.graphics();
        const drawTrail = (pos) => {
            const g = this.trailLine.clear();
            const ranges = truck ? [...pastRanges, [from, to]] : pastRanges;
            for (const piece of travelledPieces(pos, ranges)) {
                for (let m = piece.from; m < piece.to; m += 6) {
                    if (piece.skipped && Math.floor(m / 24) % 2 === 1) continue; // the gaps in the dashes
                    const [x, y] = at(m);
                    g.fillStyle(0x1b1610, 1).fillRect(x - 1, y - 1, 10, 10);
                    g.fillStyle(piece.skipped ? 0xc9c5bd : 0xf2c46d, 1).fillRect(x, y, 8, 8);
                }
            }
        };

        for (const place of PLACES) {
            const [x, y] = at(place.miles);
            this.add.text(x - 14, y + 6, place.name, textStyle(15, { color: '#f4f1e8', stroke: '#1b1610', strokeThickness: 4 })).setOrigin(1, 0);
        }

        // The label, top centre, and the miles counter, top right.
        const labelPanel = this.add.graphics();
        const label = this.add.text(GAME_WIDTH / 2, 36, this.step.label, textStyle(24, { color: UI.name })).setOrigin(0.5);
        drawPanel(labelPanel, GAME_WIDTH / 2 - label.width / 2 - 24, 14, label.width + 48, 46);
        const milesPanel = this.add.graphics();
        drawPanel(milesPanel, UI.margin, 80, 196, 46);
        this.milesText = this.add.text(UI.margin + 98, 103, `Miles ${walkedFrom}`, textStyle(22)).setOrigin(0.5);
        // A small key under the counter.
        this.add.text(UI.margin + 8, 134, truck || pastRanges.length ? 'gold: walked   grey dashes: driven' : 'gold: walked', textStyle(13, { color: '#f4f1e8', stroke: '#1b1610', strokeThickness: 4 }));

        // The walkers (or the truck).
        if (truck) {
            this.walkers = [this.add.image(0, 0, 'fx-car').setScale(3)];
            this.time.delayedCall(400, () => audio.sfx('honk'));
        } else {
            this.walkers = [this.add.sprite(0, 0, 'katz', 'right-stand').setScale(3), this.add.sprite(0, 0, 'hiker', 'right-stand').setScale(3)];
            if (alone) this.walkers[0].setVisible(false);
        }

        const place = (t) => {
            const m = from + (to - from) * t;
            // The counter shows miles walked: it stays put while the car drives.
            this.milesText.setText(`Miles ${Math.round(walkedFrom + walked * t)}`);
            drawTrail(m);
            if (truck) {
                const [x, y] = at(m);
                this.walkers[0].setPosition(x, y - 18);
            } else {
                const [kx, ky] = at(Math.max(from, m - 40));
                const [hx, hy] = at(m);
                this.walkers[0].setPosition(kx - 10, ky - 22);
                this.walkers[1].setPosition(hx, hy - 22);
            }
        };
        place(0);
        this.counter = this.tweens.addCounter({
            from: 0, to: 1, duration: TUNING.travelMs,
            ease: truck ? 'Cubic.easeIn' : 'Sine.easeInOut',
            onUpdate: (tw) => place(tw.getValue()),
            onComplete: () => this.time.delayedCall(900, () => this.next())
        });
        if (!truck) {
            let pose = 0;
            this.time.addEvent({
                delay: 180, loop: true, callback: () => {
                    pose = 1 - pose;
                    this.walkers.forEach((s) => s.setFrame(pose ? 'right-stepA' : 'right-stepB'));
                }
            });
        }

        const line = truck ? this.step.carLine : this.step.line;
        if (line) {
            const box = this.add.graphics();
            drawPanel(box, UI.margin, GAME_HEIGHT - 104, GAME_WIDTH - UI.margin * 2, 80);
            const text = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 64, line, textStyle(19, { fontStyle: 'italic', align: 'center', wordWrap: { width: GAME_WIDTH - 120 } })).setOrigin(0.5);
            [box, text].forEach((o) => o.setAlpha(0));
            this.tweens.add({ targets: [box, text], alpha: 1, delay: 500, duration: 500 });
        }

        this.controls = new Controls(this);
    }

    next() {
        if (this.done) return;
        this.done = true;
        nextStep(this);
    }

    update() {
        if (this.controls.justPressed('confirm')) {
            this.counter?.complete?.();
            this.next();
        }
    }
}
