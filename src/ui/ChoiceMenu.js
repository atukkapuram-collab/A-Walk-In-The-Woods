import { GAME_WIDTH } from '../config.js';
import { UI, textStyle, drawPanel } from './theme.js';

const PAD = 16;
const GAP = 10;
const WIDTH = 760;
const TEXT_LEFT = 52;

// Oregon Trail-style numbered list of 2-4 options, in a box above the dialogue box.
// Only the option text is shown, never the stat effects.
// Arrow keys move the cursor, 1-4 picks directly, confirm chooses.
export class ChoiceMenu {
    constructor(scene, textBox) {
        this.scene = scene;
        this.textBox = textBox;
        this.panel = scene.add.graphics();
        this.cursor = scene.add.text(0, 0, '▶', textStyle(20, { color: UI.name }));
        this.help = scene.add.text(0, 0, '↑/↓ or 1-4 to pick · Space or Enter to choose', textStyle(14, { color: UI.muted }));
        this.rows = [];
        this.options = [];
        this.index = 0;
        this.hide();
    }

    show(options) {
        this.hide();
        this.options = options;
        this.index = 0;

        const x = GAME_WIDTH - UI.margin - WIDTH;
        this.rows = options.map((text, i) =>
            this.scene.add.text(x + TEXT_LEFT, 0, `${i + 1}. ${text}`,
                textStyle(19, { wordWrap: { width: WIDTH - TEXT_LEFT - PAD }, lineSpacing: 4 }))
        );

        // Rows can wrap to two lines, so stack them by their real height.
        const h = PAD * 2 + this.rows.reduce((sum, r) => sum + r.height, 0) + GAP * (this.rows.length - 1);
        const y = this.textBox.bounds.y - 46 - h;
        let rowY = y + PAD;
        for (const row of this.rows) {
            row.setY(rowY);
            rowY += row.height + GAP;
        }

        drawPanel(this.panel, x, y, WIDTH, h);
        this.left = x;
        this.help.setPosition(x, y - 24);
        [this.panel, this.cursor, this.help].forEach((p) => p.setVisible(true));
        this.updateCursor();
    }

    move(step) {
        this.index = (this.index + step + this.options.length) % this.options.length;
        this.updateCursor();
    }

    // Returns true if `i` is a valid option (for the 1-4 keys).
    select(i) {
        if (i < 0 || i >= this.options.length) return false;
        this.index = i;
        this.updateCursor();
        return true;
    }

    updateCursor() {
        const row = this.rows[this.index];
        this.cursor.setPosition(this.left + 22, row.y);
        this.rows.forEach((r, i) => r.setColor(i === this.index ? UI.text : UI.muted));
    }

    hide() {
        [this.panel, this.cursor, this.help].forEach((p) => p.setVisible(false));
        this.rows.forEach((r) => r.destroy());
        this.rows = [];
    }
}
