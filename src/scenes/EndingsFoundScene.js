import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { endingsFoundList } from '../data/endings.js';
import { loadSave } from '../state/persistence.js';
import { Controls } from '../systems/Input.js';
import { closeOverlay } from '../systems/Transitions.js';
import { Menu } from '../ui/Menu.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// Endings Found (design blueprint, Ending presentation): the four endings,
// with ones not reached yet shown as "???". Read from the save, so it
// survives a reload. Opened over the ending screen; Back (or Esc) returns.
export class EndingsFoundScene extends Scene {
    constructor() {
        super('EndingsFound');
    }

    init(data) {
        this.pausedUnder = data?.paused ?? [];
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7).setOrigin(0);
        const list = endingsFoundList(loadSave().endingsFound);
        const w = 720;
        const x = (GAME_WIDTH - w) / 2;
        const y = 40;
        drawPanel(this.add.graphics(), x, y, w, 380);
        const count = list.filter((e) => e.found).length;
        this.add.text(GAME_WIDTH / 2, y + 24, `Endings Found: ${count} of ${list.length}`, textStyle(28, { color: UI.name })).setOrigin(0.5, 0);

        list.forEach((e, i) => {
            const rowY = y + 86 + i * 72;
            this.add.text(x + 48, rowY, `${i + 1}.  ${e.name}`, textStyle(22, { color: e.found ? UI.text : UI.muted }));
            if (e.found) this.add.text(x + 92, rowY + 30, e.lesson, textStyle(15, { fontStyle: 'italic', color: UI.muted, wordWrap: { width: w - 140 } }));
        });

        this.controls = new Controls(this);
        this.menu = new Menu(this, {
            x: GAME_WIDTH / 2, y: y + 396, width: 220, rowHeight: 40, fontSize: 20,
            items: [{ label: 'Back', onSelect: () => closeOverlay(this) }]
        });
    }

    update() {
        if (this.controls.justPressed('pause')) return closeOverlay(this);
        this.menu.update(this.controls);
    }
}
