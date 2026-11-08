import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { TUNING } from '../data/tuning.js';
import { nextStep } from '../systems/Journey.js';
import { fadeIn } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { UI, textStyle } from '../ui/theme.js';

// Act title cards (design blueprint, Transitions): "Act I: The Beginning",
// "Act II: The Middle", "Act III: The Climax", about 2 seconds each.
// Start with { title, subtitle }. Space skips.
export class ActCardScene extends Scene {
    constructor() {
        super('ActCard');
    }

    init(data) {
        this.card = data;
        this.done = false;
    }

    create() {
        fadeIn(this);
        const cx = GAME_WIDTH / 2;
        const cy = GAME_HEIGHT / 2;
        const [act, name] = this.card.title.split(': ');
        this.add.text(cx, cy - 56, act, textStyle(22, { color: UI.muted })).setOrigin(0.5);
        this.add.text(cx, cy - 10, name ?? act, textStyle(44, { color: UI.name })).setOrigin(0.5);
        this.add.rectangle(cx, cy + 34, 220, 2, 0xe8dcc0).setOrigin(0.5);
        if (this.card.subtitle) this.add.text(cx, cy + 62, this.card.subtitle, textStyle(18, { fontStyle: 'italic' })).setOrigin(0.5);

        // A row of small pines along the bottom.
        const g = this.add.graphics();
        g.fillStyle(0x244a21, 1);
        for (let x = 20; x < GAME_WIDTH; x += 46) {
            const h = 30 + ((x * 7) % 23);
            g.fillTriangle(x, GAME_HEIGHT - 20 - h, x - h * 0.35, GAME_HEIGHT - 20, x + h * 0.35, GAME_HEIGHT - 20);
        }

        this.controls = new Controls(this);
        this.time.delayedCall(TUNING.actCardMs, () => this.next());
    }

    next() {
        if (this.done) return;
        this.done = true;
        nextStep(this);
    }

    update() {
        if (this.controls.justPressed('confirm')) this.next();
    }
}
