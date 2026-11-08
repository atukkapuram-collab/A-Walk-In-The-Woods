import { describe, it, expect } from 'vitest';
import { GameState, resolveEffects, isInDanger } from '../src/state/GameState.js';
import { TUNING } from '../src/data/tuning.js';

describe('GameState', () => {
    it('starts at Stamina 6, Supplies 6, Bond 5, Morale 6, Miles 0, no flags', () => {
        const s = new GameState();
        expect(s.snapshot).toEqual({
            stamina: 6, supplies: 6, bond: 5, morale: 6, miles: 0,
            skippedAhead: false, leftWilderness: false, choices: {}
        });
    });

    it('remembers which option was picked in each event, and forgets on reset', () => {
        const s = new GameState();
        s.recordChoice('event1_outfitter', 'katz');
        s.recordChoice('event2_going_home', null); // no option id: nothing recorded
        expect(s.snapshot.choices).toEqual({ event1_outfitter: 'katz' });
        s.reset();
        expect(s.snapshot.choices).toEqual({});
    });

    it('clamps stats to 0-10 and reports only real changes', () => {
        const s = new GameState();
        expect(s.apply({ stamina: +9, bond: -9 })).toEqual([
            { key: 'stamina', from: 6, to: 10 },
            { key: 'bond', from: 5, to: 0 }
        ]);
        expect(s.apply({ stamina: +1, bond: -1 })).toEqual([]); // already at the limits
        expect(s.stats.stamina).toBe(10);
        expect(s.stats.bond).toBe(0);
    });

    it('turns miles words into numbers and never goes below 0 miles', () => {
        const s = new GameState();
        s.apply({ miles: 'plus' });
        expect(s.miles).toBe(TUNING.miles.plus);
        s.apply({ miles: -1000 });
        expect(s.miles).toBe(0);
        expect(resolveEffects({ miles: 'big', bond: 1 })).toEqual({ miles: TUNING.miles.big, bond: 1 });
        expect(() => resolveEffects({ miles: 'lots' })).toThrow();
    });

    it('sets flags from an outcome and rejects unknown stats and flags', () => {
        const s = new GameState();
        s.apply({ morale: 1 }, { skippedAhead: true });
        expect(s.flags.skippedAhead).toBe(true);
        expect(() => s.apply({ luck: 1 })).toThrow();
        expect(() => s.setFlag('teleported')).toThrow();
    });

    it('emits stat-changed for each change, so the HUD never polls', () => {
        const s = new GameState();
        const seen = [];
        const off = s.on('stat-changed', (c) => seen.push(c.key));
        s.apply({ supplies: 2, stamina: -1 });
        off();
        s.apply({ bond: 1 });
        expect(seen).toEqual(['supplies', 'stamina']); // in the order the event lists them; bond came after off()
    });

    it('reset() starts a clean run', () => {
        const s = new GameState();
        s.apply({ bond: -3, miles: 40 }, { leftWilderness: true });
        s.markDone('event1_outfitter');
        s.reset();
        expect(s.snapshot.bond).toBe(5);
        expect(s.miles).toBe(0);
        expect(s.flags.leftWilderness).toBe(false);
        expect(s.eventsDone.size).toBe(0);
    });

    it('danger zones: Bond or Morale 3 or less, Stamina or Supplies 2 or less', () => {
        expect(isInDanger('bond', 3)).toBe(true);
        expect(isInDanger('bond', 4)).toBe(false);
        expect(isInDanger('morale', 3)).toBe(true);
        expect(isInDanger('stamina', 2)).toBe(true);
        expect(isInDanger('stamina', 3)).toBe(false);
        expect(isInDanger('supplies', 2)).toBe(true);
    });

    it('reports a stat only when it newly enters its danger zone', () => {
        const s = new GameState();
        s.set('bond', 4);
        expect(s.newDangers(s.apply({ bond: -1 }))).toEqual(['bond']); // 4 -> 3
        expect(s.newDangers(s.apply({ bond: -1 }))).toEqual([]);       // 3 -> 2: already warned
        expect(s.newDangers(s.apply({ bond: +3, morale: -3 }))).toEqual(['morale']);
    });
});
