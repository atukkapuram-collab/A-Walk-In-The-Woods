import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { JOURNAL } from '../data/journal.js';
import { gameState } from '../state/GameState.js';
import { loadSave, foundJournalIds } from '../state/persistence.js';
import { Controls } from '../systems/Input.js';
import { closeOverlay } from '../systems/Transitions.js';
import { audio } from '../systems/Audio.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// The Trail Journal (design blueprint, Journal screen), opened from the pause
// menu: a two-page book. The left page lists the 13 entries ("???" until
// found, on this walk or an earlier one); the right page shows the selected
// entry. Up/Down move, Esc goes back to the pause menu.
export const LOCKED_TITLE = '???';

export class JournalScene extends Scene {
    constructor() {
        super('Journal');
    }

    init(data) {
        this.pausedUnder = data?.paused ?? [];
        this.index = 0;
    }

    create() {
        this.found = foundJournalIds(loadSave(), gameState.journal);
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6).setOrigin(0);

        const x = 50;
        const y = 30;
        const w = GAME_WIDTH - 100;
        const h = GAME_HEIGHT - 60;
        drawPanel(this.add.graphics(), x, y, w, h);
        // The book's spine.
        this.add.rectangle(x + 340, y + 16, 2, h - 32, 0xe8dcc0).setOrigin(0.5, 0).setAlpha(0.6);

        this.add.text(x + 24, y + 18, `Trail Journal  ${this.found.size}/${JOURNAL.length}`, textStyle(22, { color: UI.name }));
        this.rows = JOURNAL.map((entry, i) => {
            const row = this.add.text(x + 44, y + 62 + i * 29, '', textStyle(17));
            row.setInteractive({ useHandCursor: true });
            row.on('pointerover', () => this.select(i));
            return row;
        });
        this.cursor = this.add.text(x + 20, 0, '▶', textStyle(17, { color: UI.name }));

        const px = x + 368;
        const pw = w - 368 - 28;
        this.pageTitle = this.add.text(px, y + 24, '', textStyle(24, { color: UI.name, wordWrap: { width: pw } }));
        this.pageChapter = this.add.text(px, y + 64, '', textStyle(16, { color: UI.muted, fontStyle: 'italic' }));
        this.pageText = this.add.text(px, y + 100, '', textStyle(18, { wordWrap: { width: pw }, lineSpacing: 8 }));
        this.add.text(GAME_WIDTH / 2, y + h - 26, 'Up/Down to turn pages · Esc to go back', textStyle(14, { color: UI.muted })).setOrigin(0.5);

        this.controls = new Controls(this);
        this.select(0);
    }

    select(i) {
        this.index = (i + JOURNAL.length) % JOURNAL.length;
        JOURNAL.forEach((entry, j) => {
            const known = this.found.has(entry.id);
            this.rows[j].setText(known ? entry.title : LOCKED_TITLE);
            this.rows[j].setColor(j === this.index ? UI.name : known ? UI.text : UI.muted);
        });
        this.cursor.setY(this.rows[this.index].y);

        const entry = JOURNAL[this.index];
        const known = this.found.has(entry.id);
        this.pageTitle.setText(known ? entry.title : LOCKED_TITLE);
        this.pageChapter.setText(known ? `A Walk in the Woods, ${entry.chapter}` : '');
        this.pageText.setText(known ? entry.text : 'Not found yet. Keep an eye on the signs and the views along the trail.');
    }

    update() {
        const c = this.controls;
        if (c.justPressed('pause')) return closeOverlay(this);
        if (c.justPressed('up')) { this.select(this.index - 1); audio.sfx('move'); }
        if (c.justPressed('down')) { this.select(this.index + 1); audio.sfx('move'); }
    }
}
