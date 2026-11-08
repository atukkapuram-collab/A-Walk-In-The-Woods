import { audio } from '../systems/Audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { UI, textStyle, drawPanel } from './theme.js';

const HEIGHT = 140;
const PORTRAIT = 64; // a 16px sprite at 4x

// The box at the bottom of the screen for narration and dialogue.
// Narration: italic, no name, no portrait. Dialogue: speaker name tab and portrait.
// Text types out letter by letter; complete() shows the rest at once.
export class TextBox {
    constructor(scene) {
        this.scene = scene;
        const x = UI.margin;
        const y = GAME_HEIGHT - UI.margin - HEIGHT;
        const w = GAME_WIDTH - UI.margin * 2;
        this.bounds = { x, y, w, h: HEIGHT };

        this.panel = scene.add.graphics();
        drawPanel(this.panel, x, y, w, HEIGHT);

        this.nameTab = scene.add.graphics();
        this.nameText = scene.add.text(x + 16, y - 30, '', textStyle(18, { color: UI.name }));

        this.portrait = scene.add.image(x + 20 + PORTRAIT / 2, y + HEIGHT / 2, '__DEFAULT').setScale(PORTRAIT / 16);

        this.body = scene.add.text(0, y + 20, '', textStyle(22, { lineSpacing: 8 }));
        this.prompt = scene.add.text(x + w - 28, y + HEIGHT - 30, '▼', textStyle(16, { color: UI.muted }));

        this.parts = [this.panel, this.nameTab, this.nameText, this.portrait, this.body, this.prompt];
        this.hide();
    }

    // speaker: { name, portrait } or null for narration.
    // voice: whose typewriter blip to play (src/data/audio.js VOICES).
    show(text, speaker, charsPerSecond, voice = 'narrator') {
        this.voice = voice;
        const { x, y, w } = this.bounds;
        const hasPortrait = Boolean(speaker?.portrait);
        const left = x + 24 + (hasPortrait ? PORTRAIT + 24 : 0);

        this.body.setPosition(left, y + 22);
        this.body.setFontStyle(speaker ? 'normal' : 'italic');
        this.body.setWordWrapWidth(x + w - 28 - left);

        // Wrap once up front, so words don't jump lines while typing.
        this.full = this.body.getWrappedText(text).join('\n');
        this.shown = 0;
        this.cps = charsPerSecond;
        this.body.setText('');

        this.portrait.setVisible(hasPortrait);
        if (hasPortrait) this.portrait.setTexture(speaker.portrait, 'down-stand');

        this.nameText.setText(speaker?.name ?? '');
        this.nameTab.clear();
        if (speaker) {
            drawPanel(this.nameTab, x + 4, y - 38, this.nameText.width + 24, 34);
        }
        this.nameText.setVisible(Boolean(speaker));
        this.nameTab.setVisible(Boolean(speaker));

        this.panel.setVisible(true);
        this.body.setVisible(true);
        this.prompt.setVisible(false);
        if (!Number.isFinite(this.cps)) this.complete();
    }

    get typing() {
        return this.shown < this.full.length;
    }

    update(delta) {
        if (!this.panel.visible || !this.typing) return;
        const before = Math.floor(this.shown);
        this.shown = Math.min(this.full.length, this.shown + (this.cps * delta) / 1000);
        const now = Math.floor(this.shown);
        // A soft blip as letters appear (not for spaces), in the speaker's voice.
        if (now > before && /\S/.test(this.full.slice(before, now))) audio.blip(this.voice);
        this.body.setText(this.full.slice(0, now));
        if (!this.typing) this.prompt.setVisible(true);
    }

    complete() {
        this.shown = this.full.length;
        this.body.setText(this.full);
        this.prompt.setVisible(true);
    }

    // Keep the box on screen (e.g. under the choice menu) but without the ▼ prompt.
    hidePrompt() {
        this.prompt.setVisible(false);
    }

    hide() {
        this.parts.forEach((p) => p.setVisible(false));
    }

    get visible() {
        return this.panel.visible;
    }
}
