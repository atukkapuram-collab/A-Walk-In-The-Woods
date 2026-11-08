import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { SPEAKERS } from '../data/speakers.js';
import { textCps } from '../state/settings.js';
import { audio } from '../systems/Audio.js';
import { resolveEffects, STATS } from '../state/GameState.js';
import { EventRunner } from '../systems/EventRunner.js';
import { Controls } from '../systems/Input.js';
import { TextBox } from '../ui/TextBox.js';
import { ChoiceMenu } from '../ui/ChoiceMenu.js';
import { ResultCard } from '../ui/ResultCard.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// The overlay above the trail map (zoom 1, so text is sharp). TrailScene
// launches it once and calls play(event, onFinish) to run an event; while an
// event plays, TrailScene freezes movement. Also shows the Map 1 tutorial hints.
export class DialogueScene extends Scene {
    constructor() {
        super('Dialogue');
    }

    create() {
        this.dim = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, UI.dim).setOrigin(0).setVisible(false);
        this.box = new TextBox(this);
        this.menu = new ChoiceMenu(this, this.box);
        this.card = new ResultCard(this);
        this.controls = new Controls(this);

        this.hintPanel = this.add.graphics().setVisible(false);
        this.hintText = this.add.text(GAME_WIDTH / 2, UI.margin + 16, '', textStyle(18)).setOrigin(0.5, 0).setVisible(false);

        this.runner = null;
        this.mode = null; // 'text' | 'choose' | 'result'
    }

    get playing() {
        return this.runner !== null;
    }

    // onResult(outcome) runs when the result card appears: that is the moment
    // stats change (design blueprint), so the HUD flashes along with the card.
    play(event, onFinish, { state = {}, onResult = null } = {}) {
        this.runner = new EventRunner(event, { state });
        this.cps = textCps(); // the player's text speed setting (slow, normal, instant)
        this.onFinish = onFinish;
        this.onResult = onResult;
        this.resultApplied = false;
        this.dim.setVisible(true);
        this.controls.flush();
        audio.duck(true);
        this.advance();
    }

    advance() {
        const step = this.runner.next();
        this.card.hide();
        this.menu.hide();

        switch (step.type) {
            case 'narrate':
                this.box.show(step.text, null, this.cps, 'narrator');
                this.mode = 'text';
                break;
            case 'say':
                this.box.show(step.text, SPEAKERS[step.speaker] ?? { name: step.speaker }, this.cps, step.speaker);
                this.mode = 'text';
                break;
            case 'choose':
                // The last line stays visible under the menu.
                this.box.complete();
                this.box.hidePrompt();
                this.menu.show(step.options);
                this.mode = 'choose';
                break;
            case 'result':
                this.box.hide();
                this.card.show(step.text, step.effects);
                this.mode = 'result';
                if (step.fromChoice) this.resultApplied = true;
                this.onResult?.({ effects: step.effects, flags: step.flags });
                this.statSound(step.effects);
                break;
            case 'end':
                this.finish(step.outcome);
                break;
        }
    }

    // A rising chime if any stat went up, a falling one if any went down.
    statSound(effects = {}) {
        const changes = Object.entries(resolveEffects(effects)).filter(([k, v]) => STATS.includes(k) && v);
        const up = changes.some(([, v]) => v > 0);
        const down = changes.some(([, v]) => v < 0);
        if (up) audio.sfx('statUp');
        if (down) this.time.delayedCall(up ? 260 : 0, () => audio.sfx('statDown'));
    }

    finish(outcome) {
        // A choice with no result card (e.g. the Final Crossroads) still counts.
        if (!this.resultApplied && outcome.choice !== null) {
            this.resultApplied = true;
            this.onResult?.(outcome);
        }
        this.box.hide();
        this.menu.hide();
        this.card.hide();
        this.dim.setVisible(false);
        audio.duck(false);
        this.runner = null;
        this.mode = null;
        const done = this.onFinish;
        this.onFinish = null;
        this.onResult = null;
        done?.(outcome);
    }

    update(time, delta) {
        if (!this.runner) return;
        this.box.update(delta);
        const c = this.controls;

        if (this.mode === 'text') {
            if (c.justPressed('confirm')) {
                // First press finishes the line; the next press moves on.
                if (this.box.typing) this.box.complete();
                else this.advance();
            }
        } else if (this.mode === 'choose') {
            if (c.justPressed('up')) { this.menu.move(-1); audio.sfx('move'); }
            if (c.justPressed('down')) { this.menu.move(1); audio.sfx('move'); }
            for (let i = 0; i < 4; i++) {
                if (c.justPressed(`choice${i + 1}`) && this.menu.select(i)) audio.sfx('move');
            }
            if (c.justPressed('confirm')) {
                audio.sfx('confirm');
                this.runner.choose(this.menu.index);
                this.advance();
            }
        } else if (this.mode === 'result') {
            if (c.justPressed('confirm')) this.advance();
        }
    }

    showHint(text) {
        if (!text) {
            this.hintPanel.setVisible(false);
            this.hintText.setVisible(false);
            return;
        }
        this.hintText.setText(text).setVisible(true);
        const w = this.hintText.width + 40;
        drawPanel(this.hintPanel, (GAME_WIDTH - w) / 2, UI.margin, w, this.hintText.height + 32);
        this.hintPanel.setVisible(true);
    }
}
