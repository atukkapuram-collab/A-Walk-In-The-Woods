import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { Controls } from '../systems/Input.js';
import { closeOverlay } from '../systems/Transitions.js';
import { getSettings, saveSettings, TEXT_SPEEDS } from '../state/settings.js';
import { Menu } from '../ui/Menu.js';
import { audio } from '../systems/Audio.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// Settings (design blueprint, All screens): music volume, sound effects
// volume and text speed, saved to localStorage as soon as they change.
// Opened over the title or the pause menu; Back (or Esc) returns there.
// Volume changes are heard right away (src/systems/Audio.js).
export class SettingsScene extends Scene {
    constructor() {
        super('Settings');
    }

    init(data) {
        this.pausedUnder = data?.paused ?? [];
    }

    create() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65).setOrigin(0);
        this.settings = getSettings();
        const cx = GAME_WIDTH / 2;
        drawPanel(this.add.graphics(), cx - 330, 80, 660, 360);
        this.add.text(cx, 120, 'Settings', textStyle(36, { color: UI.name })).setOrigin(0.5);

        const pct = (v) => `${Math.round(v * 100)}%`;
        const nudge = (key, d) => () => this.change(key, Math.round(Math.max(0, Math.min(1, this.settings[key] + d)) * 10) / 10);
        const speed = (d) => () => {
            const i = TEXT_SPEEDS.indexOf(this.settings.textSpeed);
            this.change('textSpeed', TEXT_SPEEDS[(i + d + TEXT_SPEEDS.length) % TEXT_SPEEDS.length]);
        };
        const cap = (s) => s[0].toUpperCase() + s.slice(1);

        this.controls = new Controls(this);
        this.menu = new Menu(this, {
            x: cx, y: 160, width: 560, panel: false,
            items: [
                { label: 'Music volume', value: () => pct(this.settings.music), onLeft: nudge('music', -0.1), onRight: nudge('music', 0.1) },
                { label: 'Sound effects', value: () => pct(this.settings.sfx), onLeft: nudge('sfx', -0.1), onRight: nudge('sfx', 0.1) },
                { label: 'Text speed', value: () => cap(this.settings.textSpeed), onLeft: speed(-1), onRight: speed(1) },
                { label: 'Back', onSelect: () => this.back() }
            ]
        });
        this.add.text(cx, 400, '←/→ to change  ·  saved automatically', textStyle(14, { color: UI.muted, align: 'center', lineSpacing: 4 })).setOrigin(0.5);
    }

    change(key, value) {
        this.settings = saveSettings({ ...this.settings, [key]: value });
        audio.applySettings(this.settings); // volumes change right away
    }

    back() {
        closeOverlay(this);
    }

    update() {
        if (this.controls.justPressed('pause')) return this.back();
        this.menu.update(this.controls);
    }
}
