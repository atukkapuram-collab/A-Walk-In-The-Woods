import { Geom } from 'phaser';

// Light weather from one particle emitter (design blueprint: weather reflects
// changing conditions). Rain in Georgia, snow in the Smokies, falling leaves
// in Maine. Particles spawn in a band just above the visible area and fall
// through it; the band follows the camera. Kept sparse and semi-transparent so
// it never hides the player or text (weather sits below the night tint and
// all UI scenes).
const KINDS = {
    rain: { texture: 'fx-rain', frequency: 18, quantity: 2, speedY: { min: 190, max: 240 }, speedX: { min: -25, max: -15 }, lifespan: 1300, alpha: 0.55 },
    snow: { texture: 'fx-snow', frequency: 60, quantity: 1, speedY: { min: 18, max: 35 }, speedX: { min: -12, max: 12 }, lifespan: 7000, alpha: 0.85 },
    leaves: { texture: 'fx-leaf', frequency: 140, quantity: 1, speedY: { min: 14, max: 26 }, speedX: { min: -20, max: 8 }, lifespan: 8000, alpha: 0.9, rotate: { min: 0, max: 360 } }
};

export class Weather {
    constructor(scene, kind) {
        this.scene = scene;
        const cfg = KINDS[kind];
        if (!cfg) {
            this.emitter = null;
            return;
        }
        const cam = scene.cameras.main;
        this.zone = new Geom.Rectangle(0, 0, cam.worldView.width + 40, 20);
        const { texture, ...particles } = cfg;
        this.emitter = scene.add.particles(0, 0, texture, {
            ...particles,
            emitZone: { type: 'random', source: this.zone }
        }).setDepth(90000);
    }

    // Keep the spawn band just above what the camera shows.
    update() {
        if (!this.emitter) return;
        const view = this.scene.cameras.main.worldView;
        this.emitter.setPosition(view.x - 20, view.y - 24);
    }
}
