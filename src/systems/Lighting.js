import { TILE_SIZE } from '../config.js';

// Night tint for night scenes (Event 4 and the campfires; design blueprint,
// Transitions): a dark blue overlay over the map plus a warm glow around each
// campfire, so no new art is needed. Faded in when a `night: true` event starts
// and back out when it ends.
const NIGHT_ALPHA = 0.62;

export class Lighting {
    constructor(scene, grid, campfireIndex) {
        this.scene = scene;
        const w = grid.width * TILE_SIZE;
        const h = grid.height * TILE_SIZE;
        this.overlay = scene.add.rectangle(0, 0, w, h, 0x0b1636, 1).setOrigin(0).setDepth(100000).setAlpha(0);

        this.glows = [];
        grid.tiles.forEach((row, y) => row.forEach((index, x) => {
            if (index !== campfireIndex) return;
            this.glows.push(
                scene.add.image((x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'fx-glow')
                    .setDepth(100001).setBlendMode('ADD').setAlpha(0).setScale(1.4)
            );
        }));
    }

    setNight(on, duration = 700) {
        this.scene.tweens.killTweensOf([this.overlay, ...this.glows]);
        this.scene.tweens.add({ targets: this.overlay, alpha: on ? NIGHT_ALPHA : 0, duration });
        if (this.glows.length) {
            this.scene.tweens.add({ targets: this.glows, alpha: on ? 1 : 0, duration });
        }
    }
}
