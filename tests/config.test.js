import { describe, it, expect } from 'vitest';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, WORLD_ZOOM } from '../src/config.js';

// Proves the test runner works, and guards the screen setup from the plan
// (docs/implementation-plan.md, section 2) that later milestones build on.
describe('config', () => {
    it('uses a 16:9 canvas of 960x540', () => {
        expect(GAME_WIDTH).toBe(960);
        expect(GAME_HEIGHT).toBe(540);
    });

    it('uses 16px tiles at 3x world zoom', () => {
        expect(TILE_SIZE).toBe(16);
        expect(WORLD_ZOOM).toBe(3);
    });
});
