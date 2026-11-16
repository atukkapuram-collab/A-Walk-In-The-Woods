import { describe, it, expect, vi } from 'vitest';

// Weather.js imports Phaser only for Geom.Rectangle; the math below is pure.
vi.mock('phaser', () => ({ Geom: { Rectangle: class {} } }));
const { visibleArea, lifespanFor, spawnZone } = await import('../src/systems/Weather.js');

describe('weather covers the whole screen', () => {
    it('the visible area of a pinned object under zoom 3 is the middle third of the screen', () => {
        expect(visibleArea(3, 960, 540)).toEqual({ x: 320, y: 180, width: 320, height: 180 });
        expect(visibleArea(1, 960, 540)).toEqual({ x: 0, y: 0, width: 960, height: 540 });
    });

    it.each(['rain', 'snow', 'leaves'])('%s spawns across the full width (plus drift) and lives long enough to reach the bottom', (kind) => {
        const area = visibleArea(3);
        const zone = spawnZone(kind, 3);
        expect(zone.x).toBeLessThanOrEqual(area.x);
        expect(zone.x + zone.width).toBeGreaterThanOrEqual(area.x + area.width);
        expect(zone.y + zone.height).toBeLessThanOrEqual(area.y);
        // At its slowest, a particle from the top of the band passes the bottom edge.
        const slowest = { rain: 190, snow: 18, leaves: 14 }[kind];
        const fallen = (slowest * lifespanFor(kind, 3)) / 1000;
        expect(zone.y + fallen).toBeGreaterThanOrEqual(area.y + area.height);
    });
});
