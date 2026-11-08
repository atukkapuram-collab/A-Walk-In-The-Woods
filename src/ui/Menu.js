import { UI, textStyle, drawPanel } from './theme.js';
import { audio } from '../systems/Audio.js';

// A vertical keyboard menu used by every screen (title, pause, settings,
// ending buttons, endings found). game-ui-ux: one item always has focus; Up and
// Down move it, Space or Enter picks it, Left and Right change a value item.
// The mouse works too (hover to focus, click to pick).
//
// items: [{ label, onSelect?, value?: () => string, onLeft?, onRight? }]
// The owning scene calls menu.update(controls) every frame.
export class Menu {
    constructor(scene, { x, y, width, items, rowHeight = 44, fontSize = 22, panel = true }) {
        this.scene = scene;
        this.items = items;
        this.index = 0;
        this.width = width;
        this.rowHeight = rowHeight;
        const h = items.length * rowHeight + 24;
        this.bounds = { x: x - width / 2, y, w: width, h };

        this.panel = scene.add.graphics();
        if (panel) drawPanel(this.panel, this.bounds.x, y, width, h);
        this.cursor = scene.add.text(0, 0, '▶', textStyle(fontSize, { color: UI.name }));
        this.rows = items.map((item, i) => {
            const row = scene.add.text(x, y + 12 + i * rowHeight + rowHeight / 2, '', textStyle(fontSize)).setOrigin(0.5);
            row.setInteractive({ useHandCursor: true });
            row.on('pointerover', () => this.focus(i));
            row.on('pointerdown', () => { this.focus(i); this.pick(); });
            return row;
        });
        this.refresh();
    }

    focus(i) {
        this.index = (i + this.items.length) % this.items.length;
        this.refresh();
    }

    refresh() {
        if (!this.rows[0]?.scene) return; // destroyed (the scene changed after a pick)
        this.items.forEach((item, i) => {
            const value = item.value ? `   ◀ ${item.value()} ▶` : '';
            this.rows[i].setText(`${item.label}${value}`);
            this.rows[i].setColor(i === this.index ? UI.name : UI.text);
        });
        const row = this.rows[this.index];
        this.cursor.setPosition(row.x - row.width / 2 - 34, row.y - this.cursor.height / 2);
    }

    pick() {
        const item = this.items[this.index];
        audio.sfx(item.onSelect ? 'confirm' : 'move');
        (item.onSelect ?? item.onRight)?.();
        this.refresh();
    }

    update(controls) {
        if (controls.justPressed('up')) { this.focus(this.index - 1); audio.sfx('move'); }
        if (controls.justPressed('down')) { this.focus(this.index + 1); audio.sfx('move'); }
        const item = this.items[this.index];
        if (controls.justPressed('left') && item.onLeft) { item.onLeft(); this.refresh(); audio.sfx('move'); }
        if (controls.justPressed('right') && item.onRight) { item.onRight(); this.refresh(); audio.sfx('move'); }
        if (controls.justPressed('confirm')) this.pick();
    }

    setVisible(v) {
        [this.panel, this.cursor, ...this.rows].forEach((o) => o.setVisible(v));
    }

    destroy() {
        [this.panel, this.cursor, ...this.rows].forEach((o) => o.destroy());
    }
}
