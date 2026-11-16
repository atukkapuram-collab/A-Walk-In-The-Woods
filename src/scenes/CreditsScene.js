import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { CREDITS } from '../data/credits.js';
import { Controls } from '../systems/Input.js';
import { closeOverlay } from '../systems/Transitions.js';
import { Menu } from '../ui/Menu.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// Credits (design blueprint, All screens): the book, the makers, the tools.
// Opened over the title or the ending card; Back (or Esc) returns.
export class CreditsScene extends Scene {
    constructor() {
        super('Credits');
    }

    init(data) {
        this.pausedUnder = data?.paused ?? [];
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.75).setOrigin(0);
        const w = 760;
        const x = (GAME_WIDTH - w) / 2;
        const y = 30;
        drawPanel(this.add.graphics(), x, y, w, 420);
        let lineY = y + 26;
        for (const line of CREDITS) {
            const heading = line.startsWith('# ');
            const text = heading ? line.slice(2) : line;
            if (!text) {
                lineY += 12;
                continue;
            }
            // Space each line by its real height, so a wrapped line never overlaps the next.
            const obj = this.add.text(GAME_WIDTH / 2, lineY, text, textStyle(heading ? 24 : 17, {
                color: heading ? UI.name : UI.text, align: 'center', wordWrap: { width: w - 80 }
            })).setOrigin(0.5, 0);
            lineY += obj.height + (heading ? 10 : 6);
        }
        this.controls = new Controls(this);
        this.menu = new Menu(this, {
            x: GAME_WIDTH / 2, y: y + 436, width: 220, rowHeight: 40, fontSize: 20,
            items: [{ label: 'Back', onSelect: () => closeOverlay(this) }]
        });
    }

    update() {
        if (this.controls.justPressed('pause')) return closeOverlay(this);
        this.menu.update(this.controls);
    }
}
