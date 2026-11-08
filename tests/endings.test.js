import { describe, it, expect } from 'vitest';
import { checkEnding, bondRating, bondBand } from '../src/state/endings.js';

// A healthy state that passes every Finished Trail requirement.
const ok = { stamina: 5, supplies: 3, bond: 5, morale: 6, miles: 0, skippedAhead: false, leftWilderness: false };
const at = (changes) => ({ ...ok, ...changes });

describe('mid-trip ending checks (after Events 5 and 8)', () => {
    it('lets the walk go on when nothing is wrong', () => {
        expect(checkEnding(ok)).toBe(null);
    });

    it('Broken Partnership at Bond 2 or less (not 3)', () => {
        expect(checkEnding(at({ bond: 2 }))).toBe('brokenPartnership');
        expect(checkEnding(at({ bond: 3 }))).toBe(null);
    });

    it('Early Departure at Stamina 0, Supplies 0, or Morale 2 or less', () => {
        expect(checkEnding(at({ stamina: 0 }))).toBe('earlyDeparture');
        expect(checkEnding(at({ supplies: 0 }))).toBe('earlyDeparture');
        expect(checkEnding(at({ morale: 2 }))).toBe('earlyDeparture');
        expect(checkEnding(at({ stamina: 1, supplies: 1, morale: 3 }))).toBe(null);
    });

    it('checks Broken Partnership first: Bond 2 and Stamina 0 is Broken Partnership', () => {
        expect(checkEnding(at({ bond: 2, stamina: 0 }))).toBe('brokenPartnership');
    });
});

describe('Final Crossroads', () => {
    it('"Summit or nothing" with Stamina 5+, Supplies 3+, Bond 5+ and no flags is Finished Trail', () => {
        expect(checkEnding(ok, 'summit')).toBe('finishedTrail');
    });

    it('falls back to Changed Route just below each requirement', () => {
        expect(checkEnding(at({ stamina: 4 }), 'summit')).toBe('changedRoute');
        expect(checkEnding(at({ supplies: 2 }), 'summit')).toBe('changedRoute');
        expect(checkEnding(at({ bond: 4 }), 'summit')).toBe('changedRoute');
    });

    it('either flag blocks Finished Trail', () => {
        expect(checkEnding(at({ skippedAhead: true }), 'summit')).toBe('changedRoute');
        expect(checkEnding(at({ leftWilderness: true }), 'summit')).toBe('changedRoute');
    });

    it('"Let\'s go home" is Early Departure; "our way" is Changed Route', () => {
        expect(checkEnding(ok, 'home')).toBe('earlyDeparture');
        expect(checkEnding(at({ stamina: 10, bond: 10 }), 'ourWay')).toBe('changedRoute');
    });

    it('still checks Broken Partnership and Early Departure first', () => {
        expect(checkEnding(at({ bond: 2 }), 'summit')).toBe('brokenPartnership');
        expect(checkEnding(at({ morale: 2 }), 'ourWay')).toBe('earlyDeparture');
        expect(checkEnding(at({ bond: 1 }), 'home')).toBe('brokenPartnership');
    });

    it('rejects an unknown final choice', () => {
        expect(() => checkEnding(ok, 'fly')).toThrow();
    });
});

describe('Bond rating and Katz tone', () => {
    it('Strangers 0-3, Hiking Buddies 4-6, Trail Family 7-10', () => {
        expect([0, 3, 4, 6, 7, 10].map(bondRating)).toEqual([
            'Strangers', 'Strangers', 'Hiking Buddies', 'Hiking Buddies', 'Trail Family', 'Trail Family'
        ]);
    });

    it('Katz is warm at 7+, sarcastic at 4 or less, neutral between', () => {
        expect([7, 6, 5, 4].map(bondBand)).toEqual(['warm', 'neutral', 'neutral', 'sarcastic']);
    });
});
