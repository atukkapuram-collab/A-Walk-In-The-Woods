import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { Controls } from '../systems/Input.js';
import { closeOverlay, openOverlay, fadeTo } from '../systems/Transitions.js';
import { Menu } from '../ui/Menu.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// Pause menu (Esc on the trail; design blueprint, All screens): Resume,
// Settings, Quit to Title. The trail and any open dialogue box are paused
// underneath, so an event in progress carries on exactly where it was.
export class PauseScene extends Scene {
    constructor() {
        super('Pause');
    }

    init(data) {
        this.pausedUnder = data?.paused ?? [];
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55).setOrigin(0);
        const cx = GAME_WIDTH / 2;
        drawPanel(this.add.graphics(), cx - 220, 100, 440, 310);
        this.add.text(cx, 150, 'Paused', textStyle(40, { color: UI.name })).setOrigin(0.5);
        this.controls = new Controls(this);
        this.menu = new Menu(this, {
            x: cx, y: 190, width: 340, panel: false,
            items: [
                { label: 'Resume', onSelect: () => this.resume() },
                { label: 'Settings', onSelect: () => openOverlay(this, 'Settings') },
                { label: 'Quit to Title', onSelect: () => fadeTo(this, 'Title') }
            ]
        });
        this.add.text(cx, 380, 'Esc to resume', textStyle(14, { color: UI.muted })).setOrigin(0.5);
    }

    resume() {
        closeOverlay(this);
    }

    update() {
        if (this.controls.justPressed('pause')) return this.resume();
        this.menu.update(this.controls);
    }
}
