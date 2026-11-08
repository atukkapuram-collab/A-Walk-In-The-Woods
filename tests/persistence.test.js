import { describe, it, expect } from 'vitest';
import { loadSave, writeSave, recordEnding, defaultSave, SAVE_KEY } from '../src/state/persistence.js';
import { parseDebugParams, applyDebugStart } from '../src/systems/Debug.js';
import { GameState } from '../src/state/GameState.js';

// A stand-in for localStorage.
function memoryStore(initial = {}) {
    const data = { ...initial };
    return {
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = String(v); },
        data
    };
}

describe('saving endings found', () => {
    it('starts empty and remembers each ending once', () => {
        const store = memoryStore();
        expect(loadSave(store)).toEqual(defaultSave());
        recordEnding('changedRoute', store);
        recordEnding('changedRoute', store);
        recordEnding('earlyDeparture', store);
        expect(loadSave(store).endingsFound).toEqual(['changedRoute', 'earlyDeparture']);
        expect(JSON.parse(store.data[SAVE_KEY]).version).toBe(1);
    });

    it('never crashes on a corrupt, foreign or newer record', () => {
        expect(loadSave(memoryStore({ [SAVE_KEY]: '{not json' }))).toEqual(defaultSave());
        expect(loadSave(memoryStore({ [SAVE_KEY]: '{"version":1,"endingsFound":"oops","settings":{}}' }))).toEqual(defaultSave());
        expect(loadSave(memoryStore({ [SAVE_KEY]: '{"version":99,"endingsFound":[],"settings":{}}' }))).toEqual(defaultSave());
    });

    it('keeps working when storage is missing or throws', () => {
        expect(loadSave(null)).toEqual(defaultSave());
        const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('full'); } };
        expect(loadSave(broken)).toEqual(defaultSave());
        expect(writeSave(defaultSave(), broken)).toBe(false);
    });
});

describe('debug starts', () => {
    it('is off without ?debug=1', () => {
        expect(parseDebugParams('?map=maine').enabled).toBe(false);
    });

    it('reads map, stats (stamina,supplies,bond,morale), flags, done and miles', () => {
        const d = parseDebugParams('?debug=1&map=georgia&stats=3,3,5,6&flags=skippedAhead,bogus&done=event1_outfitter&miles=40&choices=event1_outfitter:katz,bad');
        expect(d).toEqual({
            enabled: true, map: 'georgia',
            stats: { stamina: 3, supplies: 3, bond: 5, morale: 6 },
            flags: { skippedAhead: true },
            done: ['event1_outfitter'],
            choices: { event1_outfitter: 'katz' },
            miles: 40
        });
    });

    it('allows partial stats and applies them to a fresh run', () => {
        const d = parseDebugParams('?debug=1&stats=,,3');
        const s = new GameState();
        applyDebugStart(s, d);
        expect(s.snapshot).toMatchObject({ stamina: 6, supplies: 6, bond: 3, morale: 6 });
    });
});
