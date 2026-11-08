import { describe, it, expect } from 'vitest';
import { buildCharacterFrames, KATZ_SHAPE, FACINGS, POSES } from '../src/art/sprites.js';
import { HIKER, KATZ, SALESMAN, DALE } from '../src/art/palettes.js';
import { TILE_DEFS } from '../src/art/tiles.js';
import { ICONS, ICON_SIZE } from '../src/art/icons.js';
import { STATS } from '../src/state/GameState.js';

describe.each([
    ['hiker', buildCharacterFrames(), HIKER],
    ['katz', buildCharacterFrames(KATZ_SHAPE), KATZ],
    ['salesman', buildCharacterFrames(KATZ_SHAPE), SALESMAN],
    ['dale', buildCharacterFrames(), DALE]
])('%s sprite', (name, frames, palette) => {
    it('has all 12 frames (4 facings x stand + 2 walk poses)', () => {
        const expected = FACINGS.flatMap((f) => POSES.map((p) => `${f}-${p}`)).sort();
        expect(Object.keys(frames).sort()).toEqual(expected);
    });

    it('is 16x16 and uses only colors in its palette', () => {
        for (const [frame, rows] of Object.entries(frames)) {
            expect(rows.length, frame).toBe(16);
            for (const row of rows) {
                expect(row.length, `${frame}: "${row}"`).toBe(16);
                for (const ch of row) {
                    if (ch !== '.') expect(palette[ch], `${frame}: color "${ch}"`).toBeDefined();
                }
            }
        }
    });
});

describe('tiles', () => {
    it('has unique names and the tiles Milestone 1 needs', () => {
        const names = TILE_DEFS.map((t) => t.name);
        expect(new Set(names).size).toBe(names.length);
        expect(names).toEqual(expect.arrayContaining(['grass', 'path', 'tree', 'blazeTree', 'rock', 'water', 'gate']));
    });

    it('only ground tiles are walkable (grass, path, snow, road, river stepping stones)', () => {
        const walkable = TILE_DEFS.filter((t) => !t.solid).map((t) => t.name).sort();
        expect(walkable).toEqual(['ford', 'grass', 'path', 'road', 'snow']);
    });
});

describe('stat icons', () => {
    it('has an icon for every stat and Miles, each 10x10 with known colors', () => {
        expect(Object.keys(ICONS).sort()).toEqual([...STATS, 'miles'].sort());
        for (const [name, { palette, rows }] of Object.entries(ICONS)) {
            expect(rows.length, name).toBe(ICON_SIZE);
            for (const row of rows) {
                expect(row.length, `${name}: "${row}"`).toBe(ICON_SIZE);
                for (const ch of row) if (ch !== '.') expect(palette[ch], `${name}: "${ch}"`).toBeDefined();
            }
        }
    });
});
