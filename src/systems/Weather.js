import { Geom } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, WORLD_ZOOM } from '../config.js';

// Light weather from one particle emitter (design blueprint: weather reflects
// changing conditions). Rain in Georgia, snow in the Smokies, falling leaves
// in Maine. Kept sparse and semi-transparent so it never hides the player or
// text (weather sits below the night tint and all UI scenes).
//
// The emitter is pinned to the screen (scrollFactor 0), so it always covers
// the whole view wherever the camera is. A pinned object is still scaled by
// the camera's zoom around the screen's centre, so the visible area, in the
// emitter's own units, is the screen divided by the zoom (see visibleArea).
// Each kind lives long enough to fall from above the top edge to past the bottom.
const KINDS = {
    rain: { texture: 'fx-rain', frequency: 14, quantity: 2, speedY: { min: 190, max: 240 }, speedX: { min: -25, max: -15 }, alpha: 0.55 },
    snow: { texture: 'fx-snow', frequency: 45, quantity: 1, speedY: { min: 18, max: 35 }, speedX: { min: -12, max: 12 }, alpha: 0.85 },
    leaves: { texture: 'fx-leaf', frequency: 110, quantity: 1, speedY: { min: 14, max: 26 }, speedX: { min: -20, max: 8 }, alpha: 0.9, rotate: { min: 0, max: 360 } }
};

// Where the band that spawns particles starts above the visible area.
const BAND = 24;

// The screen, in the units of a pinned object under the given zoom.
export function visibleArea(zoom = WORLD_ZOOM, width = GAME_WIDTH, height = GAME_HEIGHT) {
    const w = width / zoom;
    const h = height / zoom;
    return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}

// How long a particle must live to fall from the band to past the bottom
// edge at its slowest speed (ms).
export function lifespanFor(kind, zoom = WORLD_ZOOM) {
    const { height } = visibleArea(zoom);
    return Math.ceil(((height + BAND * 2) / KINDS[kind].speedY.min) * 1000);
}

// The spawn band: the full width plus room for sideways drift on both sides.
export function spawnZone(kind, zoom = WORLD_ZOOM) {
    const area = visibleArea(zoom);
    const { speedX } = KINDS[kind];
    const drift = Math.ceil((Math.max(Math.abs(speedX.min), Math.abs(speedX.max)) * lifespanFor(kind, zoom)) / 1000);
    return { x: area.x - drift, y: area.y - BAND, width: area.width + drift * 2, height: BAND };
}

export class Weather {
    constructor(scene, kind) {
        this.scene = scene;
        const cfg = KINDS[kind];
        if (!cfg) {
            this.emitter = null;
            return;
        }
        const zoom = scene.cameras.main.zoom || WORLD_ZOOM;
        const z = spawnZone(kind, zoom);
        const { texture, ...particles } = cfg;
        this.emitter = scene.add.particles(0, 0, texture, {
            ...particles,
            lifespan: lifespanFor(kind, zoom),
            emitZone: { type: 'random', source: new Geom.Rectangle(z.x, z.y, z.width, z.height) }
        }).setScrollFactor(0).setDepth(90000);
        // Start with the sky already full, not empty for the first few seconds.
        this.emitter.fastForward(lifespanFor(kind, zoom));
    }

    // Pinned to the screen: nothing to follow.
    update() {}
}
