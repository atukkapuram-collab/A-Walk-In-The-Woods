import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { TUNING } from '../data/tuning.js';
import { gameState } from '../state/GameState.js';
import { nextStep } from '../systems/Journey.js';
import { fadeIn } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { PLACES, pointForMiles } from '../systems/TravelPath.js';
import { addIllustration, ILL_SCALE } from '../art/illustrations.js';
import { audio } from '../systems/Audio.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// The travel screen between maps (design blueprint, "the Oregon Trail
// moment"): the two hikers walk the ribbon of trail across a simple East Coast
// map for about 4-5 seconds while the miles tick up, with a season and place
// label and an optional narrator line. With "skipped ahead" set, the pickup
// truck version (a visual joke and a reminder of the choice).
// Start with { label, miles, line, truckLine, truckIfSkipped }. Space skips.
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
        const truck = this.step.truckIfSkipped && gameState.flags.skippedAhead;

        const from = gameState.miles;
        gameState.apply({ miles: this.step.miles });
        const to = gameState.miles;
        const at = (miles) => pointForMiles(miles).map((v) => v * ILL_SCALE);

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
        this.milesText = this.add.text(UI.margin + 98, 103, `Miles ${from}`, textStyle(22)).setOrigin(0.5);

        // The walkers (or the truck).
        if (truck) {
            this.walkers = [this.add.image(0, 0, 'fx-truck').setScale(3)];
            this.time.delayedCall(400, () => audio.sfx('honk'));
        } else {
            this.walkers = [this.add.sprite(0, 0, 'katz', 'right-stand').setScale(3), this.add.sprite(0, 0, 'hiker', 'right-stand').setScale(3)];
        }

        const place = (t) => {
            const m = from + (to - from) * t;
            this.milesText.setText(`Miles ${Math.round(m)}`);
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

        const line = truck ? this.step.truckLine : this.step.line;
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
