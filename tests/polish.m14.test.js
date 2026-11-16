import { describe, it, expect } from 'vitest';
import { JOURNEY } from '../src/data/journey.js';
import { MAPS } from '../src/data/maps/index.js';
import { MUSIC } from '../src/data/audio.js';
import { CREDITS } from '../src/data/credits.js';
import { GameState } from '../src/state/GameState.js';
import { PLACES, placeOfMap, travelledPieces } from '../src/systems/TravelPath.js';
import { applyDebugStart, parseDebugParams } from '../src/systems/Debug.js';
import { buildCharacterFrames, BILL_SHAPE, MARY_ELLEN_SHAPE } from '../src/art/sprites.js';
import { HIKER, MARY_ELLEN } from '../src/art/palettes.js';
import { TILE_DEFS } from '../src/art/tiles.js';
import { BOOK_MILES } from '../src/data/endings.js';
import { scoreEvents } from '../src/systems/Audio.js';

// Milestone 14: polish. Miles, the travel map, art, music and credits.

const travel = JOURNEY.filter((s) => s.type === 'travel');

describe('miles', () => {
    it("on the book's path (the car from Gatlinburg) the travel screens add up to Bryson and Katz's ~870", () => {
        const book = travel.reduce((sum, t) => sum + (t.carIfSkipped ? 0 : t.miles), 0);
        expect(book).toBe(BOOK_MILES);
    });

    it('every travel screen moves the marker forward to the next map\'s place on the trail', () => {
        const maps = JOURNEY.filter((s) => s.type === 'map').map((s) => s.map);
        travel.forEach((t, i) => {
            expect(t.to, t.label).toBe(placeOfMap(maps[i + 1]));
            expect(t.miles, t.label).toBeGreaterThan(0);
            expect(t.miles, t.label).toBeLessThanOrEqual(t.to - (i ? travel[i - 1].to : 0));
        });
        PLACES.slice(1).forEach((p, i) => expect(p.miles).toBeGreaterThan(PLACES[i].miles));
    });

    it('travelTo moves the marker and records a driven stretch as skipped', () => {
        const s = new GameState();
        s.travelTo(165);
        s.travelTo(860, { skipped: true });
        s.travelTo(500); // never backwards
        expect(s.trailPos).toBe(860);
        expect(s.skippedRanges).toEqual([[165, 860]]);
        expect(s.skippedMiles).toBe(695);
        s.reset();
        expect([s.trailPos, s.skippedRanges.length, s.skippedMiles]).toEqual([0, 0, 0]);
    });

    it('the travel map splits the trail behind the marker into walked and driven pieces', () => {
        expect(travelledPieces(1150, [[165, 860]])).toEqual([
            { from: 0, to: 165, skipped: false },
            { from: 165, to: 860, skipped: true },
            { from: 860, to: 1150, skipped: false }
        ]);
        expect(travelledPieces(500, [[165, 860]])).toEqual([
            { from: 0, to: 165, skipped: false },
            { from: 165, to: 500, skipped: true }
        ]);
        expect(travelledPieces(0, [])).toEqual([]);
    });

    it('a debug start puts the marker at that map', () => {
        const s = new GameState();
        applyDebugStart(s, parseDebugParams('?debug=1&map=maine'));
        expect(s.trailPos).toBe(2060);
    });
});

describe('art', () => {
    const check = (frames, palette) => {
        for (const rows of Object.values(frames)) {
            expect(rows).toHaveLength(16);
            for (const row of rows) {
                expect(row).toHaveLength(16);
                for (const ch of row) if (ch !== '.') expect(palette[ch], ch).toBeDefined();
            }
        }
    };

    it('Bill (with his beard) and Mary Ellen (bandana, long hair) have their own shapes', () => {
        const bill = buildCharacterFrames(BILL_SHAPE);
        const me = buildCharacterFrames(MARY_ELLEN_SHAPE);
        check(bill, HIKER);
        check(me, MARY_ELLEN);
        expect(bill['down-stand'][6]).toBe('.....rrrrrr.....');
        expect(me['down-stand']).not.toEqual(buildCharacterFrames()['down-stand']);
    });

    it('the sign and the overlook ledge have alpine versions, used above the treeline', () => {
        const names = TILE_DEFS.map((t) => t.name);
        expect(names).toEqual(expect.arrayContaining(['signAlpine', 'ledgeAlpine']));
        const rows = MAPS.newengland.rows.join('');
        expect(rows).toContain('%');
        expect(rows).toContain('&');
    });
});

describe('music and credits', () => {
    it('Act III and Maine have their own loops; every map names a loop that exists', () => {
        expect(MAPS.pennsylvania.music).toBe('alone');
        expect(MAPS.newengland.music).toBe('alone');
        expect(MAPS.maine.music).toBe('wilderness');
        for (const [key, m] of Object.entries(MAPS)) if (m.music) expect(MUSIC[m.music], key).toBeDefined();
        for (const name of ['alone', 'wilderness']) {
            expect(MUSIC[name].bars).toHaveLength(8);
            expect(scoreEvents(MUSIC[name]).length).toBeGreaterThan(20);
        }
    });

    it('the credits name the book and its author', () => {
        expect(CREDITS.join(' ')).toMatch(/A Walk in the Woods by Bill Bryson/);
        expect(CREDITS[0]).toBe('# Trail Mix');
    });
});
