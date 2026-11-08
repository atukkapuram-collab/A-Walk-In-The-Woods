import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { ENDINGS, EARLY_ENDING_LINE, endingEvent, katzFinalLine } from '../data/endings.js';
import { gameState } from '../state/GameState.js';
import { bondRating, bondBand } from '../state/endings.js';
import { recordEnding } from '../state/persistence.js';
import { fadeIn, fadeTo, openOverlay } from '../systems/Transitions.js';
import { Controls } from '../systems/Input.js';
import { addIllustration } from '../art/illustrations.js';
import { Menu } from '../ui/Menu.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// The ending template, the same for all four (design blueprint, Ending
// presentation):
//   (early endings only) a slow fade and "And that's where the trail ended for us."
//   1. a full-screen pixel illustration
//   2. the ending's narration and Katz dialogue (src/data/endings.js)
//   3. the Journey card: ending name, miles walked, Bond rating, a final Katz
//      line and the lesson in italics
//   4. Walk Again (back to the title) and See Endings Found
//
// Start with { ending, final }. `final` is the Final Crossroads choice, or null
// when a mid-trip check (after Event 5 or 8) ended the run early.
export class EndingScene extends Scene {
    constructor() {
        super('Ending');
    }

    init(data) {
        this.endingId = data?.ending;
        this.final = data?.final ?? null;
        this.menu = null;
    }

    create() {
        recordEnding(this.endingId);
        this.controls = new Controls(this);
        if (this.final === null) this.earlyLine();
        else this.showStory();
    }

    earlyLine() {
        const text = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, EARLY_ENDING_LINE, textStyle(26, { fontStyle: 'italic' })).setOrigin(0.5).setAlpha(0);
        this.tweens.chain({
            targets: text,
            tweens: [
                { alpha: 1, duration: 1400 },
                { alpha: 1, duration: 1600 },
                { alpha: 0, duration: 900 }
            ],
            onComplete: () => { text.destroy(); this.showStory(); }
        });
    }

    showStory() {
        const ending = ENDINGS[this.endingId];
        this.art = addIllustration(this, ending.art);
        fadeIn(this, 700);
        this.scene.launch('Dialogue');
        this.scene.get('Dialogue').events.once('create', () => {
            this.scene.bringToTop('Dialogue');
            this.time.delayedCall(900, () => {
                this.scene.get('Dialogue').play(endingEvent(this.endingId), () => {
                    this.scene.stop('Dialogue');
                    this.showCard();
                }, { state: { ...gameState.snapshot, final: this.final } });
            });
        });
    }

    // The Journey card.
    showCard() {
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45).setOrigin(0);
        const w = 780;
        const h = 330;
        const x = (GAME_WIDTH - w) / 2;
        const y = 34;
        drawPanel(this.add.graphics(), x, y, w, h);

        const ending = ENDINGS[this.endingId];
        const s = gameState.stats;
        const line = katzFinalLine(this.endingId, bondBand(s.bond));
        const cx = GAME_WIDTH / 2;

        this.add.text(cx, y + 26, ending.name, textStyle(34, { color: UI.name })).setOrigin(0.5, 0);
        this.add.text(cx, y + 70, `The journey of ${gameState.playerName} and Katz`, textStyle(17, { color: UI.muted })).setOrigin(0.5, 0);
        this.add.text(x + 56, y + 112, `Miles walked: ${gameState.miles.toLocaleString('en-US')}`, textStyle(20));
        this.add.text(x + w - 56, y + 112, `Bond: ${bondRating(s.bond)}`, textStyle(20)).setOrigin(1, 0);
        this.add.text(x + 56, y + 160, `Katz: "${line}"`, textStyle(20, { wordWrap: { width: w - 112 }, lineSpacing: 6 }));
        this.add.text(cx, y + h - 60, ending.lesson, textStyle(19, { fontStyle: 'italic', color: '#e8dcc0', align: 'center', wordWrap: { width: w - 112 }, lineSpacing: 6 })).setOrigin(0.5);

        this.menu = new Menu(this, {
            x: cx, y: y + h + 18, width: 360, rowHeight: 40, fontSize: 20,
            items: [
                { label: 'Walk Again', onSelect: () => fadeTo(this, 'Title') },
                { label: 'See Endings Found', onSelect: () => openOverlay(this, 'EndingsFound') }
            ]
        });
        this.controls.flush();
    }

    update() {
        this.menu?.update(this.controls);
    }
}
