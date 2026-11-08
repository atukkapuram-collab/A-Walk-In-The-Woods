import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { resolveEffects } from '../state/GameState.js';
import { UI, textStyle, drawPanel } from './theme.js';

const WIDTH = 600;
const LINE = 30;

// Display order and labels for stat changes. Icon frame = stat key.
export const STAT_LABELS = [
    ['stamina', 'Stamina'],
    ['supplies', 'Supplies'],
    ['bond', 'Bond'],
    ['morale', 'Morale'],
    ['miles', 'Miles']
];

// Turns an effects object into display lines: [{ key, arrow, label, amount, color }].
// Miles words become numbers (TUNING.miles). Pure, so it can be tested.
export function describeEffects(effects = {}) {
    const resolved = resolveEffects(effects);
    const lines = [];
    for (const [key, label] of STAT_LABELS) {
        const value = resolved[key];
        if (!value) continue;
        lines.push({
            key,
            arrow: value > 0 ? '▲' : '▼',
            label,
            amount: value > 0 ? `+${value}` : `−${Math.abs(value)}`,
            color: value > 0 ? UI.up : UI.down
        });
    }
    return lines;
}

// The small panel after a choice: what happened, then each stat change with
// its icon. The HUD bars flash at the same moment (the stats change now).
export class ResultCard {
    constructor(scene) {
        this.scene = scene;
        this.panel = scene.add.graphics();
        this.text = scene.add.text(0, 0, '', textStyle(21, { wordWrap: { width: WIDTH - 56 }, lineSpacing: 6 }));
        this.prompt = scene.add.text(0, 0, 'Space to continue', textStyle(14, { color: UI.muted }));
        this.parts = [];
        this.hide();
    }

    show(text, effects) {
        this.clearLines();
        const rows = describeEffects(effects);

        this.text.setText(text);
        const textH = this.text.height;
        const h = 28 + textH + 18 + rows.length * LINE + 44;
        const x = (GAME_WIDTH - WIDTH) / 2;
        const y = Math.max(UI.margin, (GAME_HEIGHT - h) / 2 - 40);
        drawPanel(this.panel, x, y, WIDTH, h);
        this.text.setPosition(x + 28, y + 28);

        rows.forEach((r, i) => {
            const rowY = y + 28 + textH + 18 + i * LINE;
            this.parts.push(
                this.scene.add.image(x + 40, rowY + 11, 'icons', r.key).setScale(2),
                this.scene.add.text(x + 64, rowY, `${r.arrow}  ${r.label}  ${r.amount}`, textStyle(20, { color: r.color }))
            );
        });
        this.prompt.setPosition(x + WIDTH - 28 - this.prompt.width, y + h - 30);

        [this.panel, this.text, this.prompt].forEach((p) => p.setVisible(true));

        // A small bounce in: up 10 px from below while fading in (game-feel, kept light).
        const targets = [this.panel, this.text, this.prompt, ...this.parts];
        this.scene.tweens.killTweensOf(targets);
        targets.forEach((t) => { t.y += 10; t.setAlpha(0); });
        this.scene.tweens.add({ targets, y: '-=10', alpha: 1, duration: 220, ease: 'Back.easeOut' });
    }

    clearLines() {
        this.parts.forEach((p) => p.destroy());
        this.parts = [];
    }

    hide() {
        this.scene.tweens.killTweensOf([this.panel, this.text, this.prompt]);
        this.panel.y = 0;
        [this.panel, this.text, this.prompt].forEach((p) => p.setVisible(false).setAlpha(1));
        this.clearLines();
    }
}
