import { Scene } from 'phaser';
import { GAME_WIDTH } from '../config.js';
import { gameState, STATS, isInDanger } from '../state/GameState.js';
import { JOURNAL_TOTAL } from '../data/journal.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// Stat panel (top-left), Miles counter and Journal count (top-right), at zoom 1 above the map.
// While Katz is away (Act III) the Bond bar is greyed and labelled "Katz: home in Iowa".
// Event-driven: it redraws when gameState emits 'stat-changed', never by polling.
// A changed bar flashes; a bar in its danger zone blinks red.

const SEGMENTS = 10;
const SEG_W = 14;
const SEG_H = 12;
const SEG_GAP = 3;
const ROW_H = 26;
const PANEL_W = 46 + SEGMENTS * (SEG_W + SEG_GAP) + 10;
const PANEL_H = 16 + STATS.length * ROW_H;

const COLORS = {
    stamina: 0xc9935c,
    supplies: 0xe08a3c,
    bond: 0xe0524a,
    morale: 0xf5cf4a,
    empty: 0x3a332a,
    danger: 0xff3b30,
    flash: 0xffffff,
    away: 0x6b6458
};

export const KATZ_AWAY_LABEL = 'Katz: home in Iowa';

export class HUDScene extends Scene {
    constructor() {
        super('HUD');
    }

    create() {
        const x = UI.margin;
        const y = UI.margin;

        this.panel = this.add.graphics();
        drawPanel(this.panel, x, y, PANEL_W, PANEL_H);

        this.rows = {};
        STATS.forEach((stat, i) => {
            const rowY = y + 8 + i * ROW_H;
            this.add.image(x + 22, rowY + ROW_H / 2, 'icons', stat).setScale(2);
            this.rows[stat] = {
                x: x + 44,
                y: rowY + (ROW_H - SEG_H) / 2,
                bars: this.add.graphics(),
                flash: this.add.graphics()
            };
        });

        // Miles counter, top-right.
        this.milesText = this.add.text(0, 0, '', textStyle(20));
        this.milesPanel = this.add.graphics();
        this.milesIcon = this.add.image(0, 0, 'icons', 'miles').setScale(2);
        this.milesPanel.setDepth(-1);

        // Journal count, under the miles.
        this.journalPanel = this.add.graphics().setDepth(-1);
        this.journalText = this.add.text(0, 0, '', textStyle(16));

        // Over the Bond bar while Katz is away.
        const bondRow = this.rows.bond;
        this.awayLabel = this.add.text(bondRow.x + (SEGMENTS * (SEG_W + SEG_GAP)) / 2, bondRow.y + SEG_H / 2, KATZ_AWAY_LABEL,
            textStyle(14, { color: '#f2efe6', stroke: '#1b1610', strokeThickness: 4 })).setOrigin(0.5).setVisible(false);

        this.blinkOn = false;
        this.blinkTimer = this.time.addEvent({
            delay: 320,
            loop: true,
            callback: () => {
                this.blinkOn = !this.blinkOn;
                STATS.forEach((s) => isInDanger(s, gameState.stats[s]) && !this.frozen(s) && this.drawBar(s));
            }
        });

        STATS.forEach((s) => this.drawBar(s));
        this.drawMiles();
        this.drawJournal();

        // Listen to the game state; stop listening when this scene shuts down.
        const offs = [
            gameState.on('stat-changed', (c) => this.onChange(c)),
            gameState.on('reset', () => { STATS.forEach((s) => this.drawBar(s)); this.drawMiles(); this.drawJournal(); }),
            gameState.on('flag-changed', ({ flag }) => flag === 'katzAway' && this.drawBar('bond')),
            gameState.on('journal-unlocked', () => this.drawJournal())
        ];
        this.events.once('shutdown', () => offs.forEach((off) => off()));
    }

    onChange({ key }) {
        if (key === 'miles') {
            this.drawMiles();
            this.flashMiles();
            return;
        }
        this.drawBar(key);
        this.flashBar(key);
    }

    // Bond can't change while Katz is away, so its bar is greyed out.
    frozen(stat) {
        return stat === 'bond' && gameState.flags.katzAway;
    }

    drawBar(stat) {
        const { x, y, bars } = this.rows[stat];
        const value = gameState.stats[stat];
        const frozen = this.frozen(stat);
        const danger = isInDanger(stat, value) && !frozen;
        if (stat === 'bond') this.awayLabel.setVisible(frozen);
        bars.clear();
        for (let i = 0; i < SEGMENTS; i++) {
            const filled = i < value;
            let color = filled ? (frozen ? COLORS.away : COLORS[stat]) : COLORS.empty;
            if (filled && danger && this.blinkOn) color = COLORS.danger;
            bars.fillStyle(color, 1);
            bars.fillRect(x + i * (SEG_W + SEG_GAP), y, SEG_W, SEG_H);
        }
    }

    flashBar(stat) {
        const { x, y, flash } = this.rows[stat];
        flash.clear();
        flash.fillStyle(COLORS.flash, 1);
        flash.fillRect(x - 3, y - 3, SEGMENTS * (SEG_W + SEG_GAP) + 3, SEG_H + 6);
        flash.setAlpha(0.8);
        this.tweens.killTweensOf(flash);
        this.tweens.add({ targets: flash, alpha: 0, duration: 220, yoyo: true, repeat: 1, onComplete: () => flash.setAlpha(0) });
    }

    drawMiles() {
        this.milesText.setText(`Miles ${gameState.miles}`);
        const w = this.milesText.width + 64;
        const h = 44;
        const x = GAME_WIDTH - UI.margin - w;
        drawPanel(this.milesPanel, x, UI.margin, w, h);
        this.milesIcon.setPosition(x + 24, UI.margin + h / 2);
        this.milesText.setPosition(x + 44, UI.margin + (h - this.milesText.height) / 2);
    }

    drawJournal() {
        this.journalText.setText(`Journal ${gameState.journal.size}/${JOURNAL_TOTAL}`);
        const w = this.journalText.width + 28;
        const h = 32;
        const x = GAME_WIDTH - UI.margin - w;
        const y = UI.margin + 44 + 8;
        drawPanel(this.journalPanel, x, y, w, h);
        this.journalText.setPosition(x + 14, y + (h - this.journalText.height) / 2);
    }

    flashMiles() {
        this.tweens.killTweensOf(this.milesText);
        this.milesText.setScale(1);
        this.tweens.add({ targets: this.milesText, scale: 1.15, duration: 160, yoyo: true, repeat: 1 });
    }
}
