import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { gameState } from '../state/GameState.js';
import { loadSave } from '../state/persistence.js';
import { DEBUG, applyDebugStart } from '../systems/Debug.js';
import { startJourney } from '../systems/Journey.js';
import { fadeIn, openOverlay } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { addIllustration } from '../art/illustrations.js';
import { Menu } from '../ui/Menu.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

let debugAutoStarted = false;

// Title screen (design blueprint, All screens): a pixel trail scene,
// "Trail Mix", and Start, Settings and Quit. A browser tab can't close
// itself, so Quit shows a short goodbye card instead.
export class TitleScene extends Scene {
    constructor() {
        super('Title');
    }

    init() {
        this.started = false;
        this.goodbye = null;
    }

    create() {
        // A debug link with a map (?debug=1&map=georgia...) skips the title once.
        if (DEBUG.enabled && DEBUG.map && !debugAutoStarted) {
            debugAutoStarted = true;
            this.startRun();
            return;
        }

        fadeIn(this);
        addIllustration(this, 'title');
        const cx = GAME_WIDTH / 2;

        this.add.text(cx + 4, 64, 'Trail Mix', textStyle(72, { color: '#1b1610' })).setOrigin(0.5);
        this.add.text(cx, 60, 'Trail Mix', textStyle(72, { color: '#f4e9cf' })).setOrigin(0.5);
        this.add.text(cx, 116, 'Georgia to Maine. 2,190 miles. Two friends.', textStyle(18, { color: '#f4e9cf', fontStyle: 'italic' })).setOrigin(0.5);
        // Credit to the source book (an original game inspired by it, not a retelling).
        this.add.text(cx, 146, 'Inspired by the book A Walk in the Woods by Bill Bryson', textStyle(15, { color: '#e8dfca', stroke: '#1b1610', strokeThickness: 4 })).setOrigin(0.5);

        this.controls = new Controls(this);
        this.menu = new Menu(this, {
            x: GAME_WIDTH - 190, y: 250, width: 280,
            items: [
                { label: 'Start', onSelect: () => this.startRun() },
                { label: 'Settings', onSelect: () => openOverlay(this, 'Settings') },
                { label: 'Quit', onSelect: () => this.showGoodbye() }
            ]
        });

        const found = loadSave().endingsFound.length;
        const note = `Endings found: ${found} of 4${DEBUG.enabled ? '  ·  DEBUG MODE (F2 on the trail)' : ''}`;
        this.add.text(cx, GAME_HEIGHT - 28, note, textStyle(15, { color: '#f4e9cf' })).setOrigin(0.5);
    }

    update() {
        if (!this.controls || this.started) return;
        if (this.goodbye) {
            if (this.controls.justPressed('confirm') || this.controls.justPressed('pause')) this.hideGoodbye();
            return;
        }
        this.menu.update(this.controls);
    }

    showGoodbye() {
        this.menu.setVisible(false);
        const w = 560;
        const h = 150;
        const x = (GAME_WIDTH - w) / 2;
        const y = 280;
        const panel = this.add.graphics();
        drawPanel(panel, x, y, w, h);
        const text = this.add.text(GAME_WIDTH / 2, y + 50, 'Thanks for walking.\nYou can close this tab whenever you like.', textStyle(20, { align: 'center', lineSpacing: 8 })).setOrigin(0.5);
        const hint = this.add.text(GAME_WIDTH / 2, y + h - 26, 'Space: back to the title', textStyle(14, { color: UI.muted })).setOrigin(0.5);
        this.goodbye = [panel, text, hint];
        this.controls.flush();
    }

    hideGoodbye() {
        this.goodbye.forEach((o) => o.destroy());
        this.goodbye = null;
        this.menu.setVisible(true);
        this.controls.flush();
    }

    // Every run starts from fresh stats (debug starts then override them).
    startRun() {
        if (this.started) return;
        this.started = true;
        gameState.reset();
        if (DEBUG.enabled) applyDebugStart(gameState, DEBUG);
        // The Journey runs the opening, act cards, maps and travel screens in order.
        startJourney(this, (DEBUG.enabled && DEBUG.map) || null);
    }
}
