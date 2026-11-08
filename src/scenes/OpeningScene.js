import { Scene } from 'phaser';
import { GAME_WIDTH } from '../config.js';
import { OPENING_PANELS } from '../data/opening.js';
import { gameState } from '../state/GameState.js';
import { nextStep } from '../systems/Journey.js';
import { fadeIn } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { addIllustration } from '../art/illustrations.js';
import { audio } from '../systems/Audio.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';
import { editName, NAME_MAX, DEFAULT_NAME } from '../systems/NameEntry.js';

// Scene 1, the opening (design blueprint, Location Progression): name entry,
// then three illustrated still panels with narration, from src/data/opening.js.
// Esc skips the panels (for replays). Then the Journey moves on to Act I.
export class OpeningScene extends Scene {
    constructor() {
        super('Opening');
    }

    init() {
        this.name = '';
        this.naming = false;
        this.leaving = false;
    }

    create() {
        fadeIn(this);
        this.art = addIllustration(this, OPENING_PANELS[0].art);
        this.controls = new Controls(this);
        this.scene.launch('Dialogue');
        this.scene.get('Dialogue').events.once('create', () => {
            this.dialogue = this.scene.get('Dialogue');
            this.scene.bringToTop('Dialogue');
            this.askName();
        });
    }

    askName() {
        this.naming = true;
        const w = 620;
        const x = (GAME_WIDTH - w) / 2;
        const y = 150;
        const panel = this.add.graphics();
        drawPanel(panel, x, y, w, 190);
        const prompt = this.add.text(GAME_WIDTH / 2, y + 40, 'Before you set out: what is your name?', textStyle(22)).setOrigin(0.5);
        this.nameText = this.add.text(GAME_WIDTH / 2, y + 95, '', textStyle(30, { color: UI.name })).setOrigin(0.5);
        const hint = this.add.text(GAME_WIDTH / 2, y + 150, `Type up to ${NAME_MAX} letters, then press Enter`, textStyle(15, { color: UI.muted })).setOrigin(0.5);
        this.nameUi = [panel, prompt, this.nameText, hint];
        this.cursorOn = true;
        this.blink = this.time.addEvent({ delay: 450, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.drawName(); } });
        this.drawName();

        this.onKey = (event) => {
            if (event.key === 'Enter') return this.finishName();
            const next = editName(this.name, event.key);
            if (next !== this.name) audio.blip('narrator');
            this.name = next;
            this.drawName();
        };
        this.input.keyboard.on('keydown', this.onKey);
    }

    drawName() {
        this.nameText.setText(`${this.name}${this.cursorOn ? '_' : ' '}`);
    }

    finishName() {
        this.input.keyboard.off('keydown', this.onKey);
        this.blink.remove();
        this.nameUi.forEach((o) => o.destroy());
        this.naming = false;
        gameState.playerName = this.name.trim() || DEFAULT_NAME;
        this.controls.flush();
        this.dialogue.controls.flush(); // the Enter (or spaces) typed shouldn't advance the first box
        this.playPanel(0);
    }

    playPanel(i) {
        if (this.leaving) return;
        const panel = OPENING_PANELS[i];
        if (!panel) return this.leave();
        if (i > 0) this.showArt(panel.art);
        this.time.delayedCall(i > 0 ? 450 : 200, () => {
            if (this.leaving) return;
            this.dialogue.play({ id: `opening_${i}`, steps: panel.steps }, () => this.playPanel(i + 1), { state: gameState.snapshot });
        });
    }

    // Cross-fade to the next picture.
    showArt(name) {
        const old = this.art;
        this.art = addIllustration(this, name).setAlpha(0); // added last, so drawn on top
        this.tweens.add({ targets: this.art, alpha: 1, duration: 400, onComplete: () => old.destroy() });
    }

    leave() {
        if (this.leaving) return;
        this.leaving = true;
        nextStep(this);
    }

    update() {
        if (!this.naming && !this.leaving && this.controls.justPressed('pause')) this.leave();
    }
}
