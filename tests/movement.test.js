import { describe, it, expect } from 'vitest';
import { GridMover, dirBetween } from '../src/systems/GridMover.js';
import { updateParty } from '../src/systems/Follower.js';
import { parseMap, isBlocked } from '../src/systems/MapBuilder.js';

const STEP = 200;

// A tiny test map: walls around a 4x3 room, with a rock at (3,2).
//   TTTTTT
//   T,,,,T
//   T,PR,T
//   T,K,,T
//   TTTTTT
const room = parseMap({
    key: 'room',
    legend: { T: 'tree', R: 'rock', ',': 'grass' },
    rows: ['TTTTTT', 'T,,,,T', 'T,PR,T', 'T,K,,T', 'TTTTTT']
});

function makeParty() {
    const { player, katz } = room.spawns;
    return {
        player: new GridMover({ ...player, facing: 'up', stepMs: STEP }),
        katz: new GridMover({ ...katz, facing: 'up', stepMs: STEP })
    };
}

// Simulate holding `dir` for `ms` milliseconds at 60 fps.
function hold(party, dir, ms, frame = 1000 / 60) {
    let t = 0;
    while (t < ms - 1e-9) {
        const d = Math.min(frame, ms - t);
        updateParty({ ...party, dir, delta: d, isBlocked: (x, y) => isBlocked(room, x, y) });
        t += d;
    }
}

// Release all keys and let any step in progress finish.
function settle(party) {
    hold(party, null, STEP * 2);
}

describe('GridMover', () => {
    it('walks exactly one tile per step and ends on a whole tile', () => {
        const m = new GridMover({ x: 1, y: 1, stepMs: STEP });
        m.stepTo(2, 1);
        m.advance(STEP / 2);
        expect(m.position).toEqual({ x: 1.5, y: 1 });
        m.advance(STEP / 2);
        expect(m.moving).toBe(false);
        expect(m.position).toEqual({ x: 2, y: 1 });
        expect(m.facing).toBe('right');
    });

    it('refuses diagonal or long steps', () => {
        const m = new GridMover({ x: 1, y: 1, stepMs: STEP });
        expect(() => m.stepTo(2, 2)).toThrow();
        expect(() => m.stepTo(3, 1)).toThrow();
    });

    it('alternates feet between steps and stands still when idle', () => {
        const m = new GridMover({ x: 1, y: 1, stepMs: STEP });
        expect(m.frame).toBe('down-stand');
        m.stepTo(1, 2);
        expect(m.frame).toBe('down-stepA');
        m.advance(STEP);
        m.stepTo(1, 3);
        expect(m.frame).toBe('down-stepB');
    });

    it('knows the direction between neighbors', () => {
        expect(dirBetween({ x: 1, y: 1 }, { x: 1, y: 0 })).toBe('up');
        expect(dirBetween({ x: 1, y: 1 }, { x: 2, y: 2 })).toBe(null);
    });
});

describe('player and Katz together', () => {
    it('blocked: the player turns to face the wall but does not move', () => {
        const party = makeParty();
        hold(party, 'right', STEP * 3); // the rock is right of the start
        settle(party);
        expect(party.player.tile).toEqual({ x: 2, y: 2 });
        expect(party.player.facing).toBe('right');
        expect(party.katz.tile).toEqual({ x: 2, y: 3 });
    });

    it('holding a key walks tile after tile with no pauses, and Katz takes the tile just left', () => {
        const party = makeParty();
        hold(party, 'up', STEP); // one full step up
        expect(party.player.tile).toEqual({ x: 2, y: 1 });
        expect(party.katz.tile).toEqual({ x: 2, y: 2 });

        hold(party, 'left', STEP); // around the corner
        settle(party);
        expect(party.player.tile).toEqual({ x: 1, y: 1 });
        expect(party.katz.tile).toEqual({ x: 2, y: 1 });
        expect(party.katz.facing).toBe('up');
    });

    it('moves along one axis per step (no diagonals)', () => {
        const party = makeParty();
        hold(party, 'left', STEP);
        settle(party);
        expect(party.player.tile).toEqual({ x: 1, y: 2 });
    });

    it('walking back into Katz swaps places, so he never blocks the path', () => {
        const party = makeParty();
        hold(party, 'up', STEP);
        settle(party);
        hold(party, 'down', STEP); // Katz is directly below
        settle(party);
        expect(party.player.tile).toEqual({ x: 2, y: 2 });
        expect(party.katz.tile).toEqual({ x: 2, y: 1 });
    });

    it('a quick tap still finishes the whole step', () => {
        const party = makeParty();
        hold(party, 'up', 20);
        settle(party);
        expect(party.player.tile).toEqual({ x: 2, y: 1 });
        expect(party.player.position).toEqual({ x: 2, y: 1 });
    });

    it('covers the same number of tiles at 30 fps and 144 fps', () => {
        const slow = makeParty();
        const fast = makeParty();
        hold(slow, 'up', STEP * 1.5, 1000 / 30);
        hold(fast, 'up', STEP * 1.5, 1000 / 144);
        settle(slow);
        settle(fast);
        expect(slow.player.tile).toEqual(fast.player.tile);
    });
});
