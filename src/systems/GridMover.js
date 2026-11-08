// Tile-by-tile walking for one character (the Hiker, Katz, later NPCs).
// Pure logic with no Phaser, so it can be unit-tested; TrailScene copies
// `position` and `frame` onto a sprite every frame.

export const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

// The direction from tile a to an adjacent tile b, or null if they aren't neighbors.
export function dirBetween(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Object.keys(DIRS).find((d) => DIRS[d].x === dx && DIRS[d].y === dy) ?? null;
}

export class GridMover {
    constructor({ x, y, facing = 'down', stepMs }) {
        this.tile = { x, y };   // the tile this character occupies (its destination while walking)
        this.from = { x, y };   // the tile it is walking from
        this.facing = facing;
        this.stepMs = stepMs;
        this.progress = 1;      // 0..1 through the current step
        this.moving = false;
        this.steps = 0;         // alternates the walk-cycle frame
    }

    face(dir) {
        this.facing = dir;
    }

    // Start walking into an adjacent tile. Collision is checked by the caller.
    stepTo(x, y) {
        const dir = dirBetween(this.tile, { x, y });
        if (!dir) {
            throw new Error(`stepTo(${x}, ${y}) is not next to (${this.tile.x}, ${this.tile.y}).`);
        }
        this.facing = dir;
        this.from = { ...this.tile };
        this.tile = { x, y };
        this.progress = 0;
        this.moving = true;
        this.steps += 1;
    }

    // Move time forward. Returns the milliseconds left over if a step finished
    // during this call (so the next step can start without a pause), else 0.
    advance(ms) {
        if (!this.moving) return 0;
        this.progress += ms / this.stepMs;
        if (this.progress < 1) return 0;
        const leftover = (this.progress - 1) * this.stepMs;
        this.progress = 1;
        this.moving = false;
        return leftover;
    }

    // Position in tiles; fractional while walking.
    get position() {
        const p = this.progress;
        return {
            x: this.from.x + (this.tile.x - this.from.x) * p,
            y: this.from.y + (this.tile.y - this.from.y) * p
        };
    }

    // Walk-cycle pose: a stepping frame for the first half of each step,
    // alternating feet between steps, then standing.
    get pose() {
        if (!this.moving || this.progress >= 0.5) return 'stand';
        return this.steps % 2 === 1 ? 'stepA' : 'stepB';
    }

    // Texture frame name, matching src/art/sprites.js.
    get frame() {
        return `${this.facing}-${this.pose}`;
    }
}
