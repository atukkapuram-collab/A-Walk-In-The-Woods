import { Scene } from 'phaser';
import { GAME_WIDTH } from '../config.js';
import { gameState, STATS, isInDanger } from '../state/GameState.js';
import { UI, textStyle, drawPanel } from '../ui/theme.js';

// Stat panel (top-left) and Miles counter (top-right), at zoom 1 above the map.
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
    flash: 0xffffff
};

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

        this.blinkOn = false;
        this.blinkTimer = this.time.addEvent({
            delay: 320,
            loop: true,
            callback: () => {
                this.blinkOn = !this.blinkOn;
                STATS.forEach((s) => isInDanger(s, gameState.stats[s]) && this.drawBar(s));
            }
        });

        STATS.forEach((s) => this.drawBar(s));
        this.drawMiles();

        // Listen to the game state; stop listening when this scene shuts down.
        const offs = [
            gameState.on('stat-changed', (c) => this.onChange(c)),
            gameState.on('reset', () => { STATS.forEach((s) => this.drawBar(s)); this.drawMiles(); })
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

    drawBar(stat) {
        const { x, y, bars } = this.rows[stat];
        const value = gameState.stats[stat];
        const danger = isInDanger(stat, value);
        bars.clear();
        for (let i = 0; i < SEGMENTS; i++) {
            const filled = i < value;
            let color = filled ? COLORS[stat] : COLORS.empty;
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

    flashMiles() {
        this.tweens.killTweensOf(this.milesText);
        this.milesText.setScale(1);
        this.tweens.add({ targets: this.milesText, scale: 1.15, duration: 160, yoyo: true, repeat: 1 });
    }
}
