import { describe, it, expect } from 'vitest';
import { GameState, FLAGS } from '../src/state/GameState.js';
import { EventRunner } from '../src/systems/EventRunner.js';
import { talkTarget } from '../src/systems/Interactions.js';
import { parseDebugParams, applyDebugStart, impliedFlagsForMap } from '../src/systems/Debug.js';
import { loadSave, writeSave, recordJournal, foundJournalIds, defaultSave, SAVE_KEY } from '../src/state/persistence.js';
import { checkEnding } from '../src/state/endings.js';
import { JOURNAL, JOURNAL_BY_ID, JOURNAL_TOTAL } from '../src/data/journal.js';
import { MAPS } from '../src/data/maps/index.js';
import { EVENTS } from '../src/data/events/index.js';
import { ALONE_LINES, ALONE_WORRIED, KATZ_WORRIED } from '../src/data/katz-lines.js';

// Milestone 10: the engine changes for the book-accurate expansion
// (docs/implementation-plan.md, section 5b).

function memoryStore(initial = {}) {
    const data = { ...initial };
    return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, data };
}

// Every step of an event, picking option `pick` at each menu.
function play(event, pick = 0) {
    const runner = new EventRunner(event);
    const out = [];
    for (let step = runner.next(); step.type !== 'end'; step = runner.next()) {
        out.push(step);
        if (step.type === 'choose') runner.choose(pick);
    }
    return out;
}

describe('the player is Bill Bryson', () => {
    it('a run has no player name to set', () => {
        expect(new GameState()).not.toHaveProperty('playerName');
    });
});

describe('flags for the book\'s story', () => {
    it('knows the four flags, all off at the start of a walk', () => {
        expect(FLAGS).toEqual(['skippedAhead', 'invited', 'katzAway', 'leftWilderness']);
        const s = new GameState();
        s.setFlag('invited');
        s.setFlag('katzAway');
        s.reset();
        for (const f of FLAGS) expect(s.flags[f], f).toBe(false);
    });
});

describe('Katz-away mode (E8 to E11)', () => {
    it('freezes Bond while Katz is away; the other stats still change', () => {
        const s = new GameState();
        s.setFlag('katzAway');
        expect(s.apply({ bond: -3, morale: +1 })).toEqual([{ key: 'morale', from: 6, to: 7 }]);
        expect(s.stats.bond).toBe(5);
    });

    it('lets the phone call (bondWhileAway) change Bond, then brings Katz back', () => {
        const s = new GameState();
        s.setFlag('katzAway');
        s.apply({ bond: +2, morale: -1 }, { katzAway: false }, { bondWhileAway: true });
        expect(s.stats.bond).toBe(7);
        expect(s.flags.katzAway).toBe(false);
        s.apply({ bond: -1 });
        expect(s.stats.bond).toBe(6); // he's back: Bond moves again
    });

    it('applies the Bond change on the choice that sends Katz home (effects before flags)', () => {
        const s = new GameState();
        s.apply({ bond: +1, morale: -1 }, { invited: true, katzAway: true });
        expect(s.stats.bond).toBe(6);
        expect(s.flags).toMatchObject({ invited: true, katzAway: true });
    });

    it('a Bond of 2 or less still ends in Broken Partnership at a check while he is away (E11: he says no)', () => {
        expect(checkEnding({ stamina: 6, supplies: 6, bond: 2, morale: 6, katzAway: true })).toBe('brokenPartnership');
    });

    it('has a narrator line for talking on the empty trail and for every danger warning', () => {
        expect(ALONE_LINES.length).toBeGreaterThanOrEqual(3);
        expect(Object.keys(ALONE_WORRIED).sort()).toEqual(Object.keys(KATZ_WORRIED).sort());
        for (const line of [...ALONE_LINES, ...Object.values(ALONE_WORRIED)]) expect(line.length).toBeLessThanOrEqual(160);
    });
});

describe('miles walked and miles skipped', () => {
    it('counts the rental car\'s miles as skipped, not walked', () => {
        const s = new GameState();
        s.apply({ miles: 160 });
        s.skipMiles(650);
        s.skipMiles(-5); // never negative
        expect(s.miles).toBe(160);
        expect(s.skippedMiles).toBe(650);
        s.reset();
        expect(s.skippedMiles).toBe(0);
    });
});

describe('fixed result cards (a scene with set effects and no choice)', () => {
    it('shows one result card with the effects and offers no menu', () => {
        const steps = play({ id: 'home_in_hanover', steps: [{ narrate: 'Home.' }, { result: 'Rested.', effects: { stamina: +1, supplies: +2 } }] });
        expect(steps.map((s) => s.type)).toEqual(['narrate', 'result']);
        expect(steps[1]).toMatchObject({ text: 'Rested.', effects: { stamina: 1, supplies: 2 }, fromChoice: false });
    });
});

describe('the Trail Journal', () => {
    it('has 13 entries with unique ids, a title and a chapter', () => {
        expect(JOURNAL_TOTAL).toBe(13);
        expect(new Set(JOURNAL.map((e) => e.id)).size).toBe(13);
        for (const e of JOURNAL) {
            expect(e.title, e.id).toBeTruthy();
            expect(e.chapter, e.id).toMatch(/^Chapter /);
            expect(e.text, e.id).toBeTruthy();
            expect(JOURNAL_BY_ID[e.id]).toBe(e);
        }
    });

    it('an event step can unlock an entry', () => {
        const steps = play({ id: 'x', steps: [{ narrate: 'Smoke rises from the road.' }, { journal: 'centralia' }] });
        expect(steps[1]).toEqual({ type: 'journal', id: 'centralia' });
    });

    it('unlocks each entry once per walk, tells listeners, and forgets on a new walk', () => {
        const s = new GameState();
        const heard = [];
        s.on('journal-unlocked', (id) => heard.push(id));
        expect(s.unlockJournal('shaffer')).toBe(true);
        expect(s.unlockJournal('shaffer')).toBe(false);
        expect(heard).toEqual(['shaffer']);
        s.reset();
        expect(s.journal.size).toBe(0);
    });

    it('signs and overlooks can carry a Journal entry, and talking to them reports it', () => {
        const map = { signs: [{ x: 1, y: 0, text: 'A sign.', journal: 'blazes' }], overlook: { x: 0, y: 1, text: 'A view.', journal: 'firs' } };
        expect(talkTarget(map, { tile: { x: 1, y: 1 }, facing: 'up' }, new Set())).toEqual({ kind: 'sign', text: 'A sign.', journal: 'blazes' });
        expect(talkTarget(map, { tile: { x: 1, y: 1 }, facing: 'left' }, new Set())).toEqual({ kind: 'overlook', text: 'A view.', journal: 'firs' });
        expect(talkTarget({ signs: [{ x: 1, y: 0, text: 'Plain.' }] }, { tile: { x: 1, y: 1 }, facing: 'up' }, new Set()).journal).toBe(null);
    });

    it('every Journal id used by a map or an event exists', () => {
        const used = [];
        for (const map of Object.values(MAPS)) {
            for (const sign of map.signs ?? []) if (sign.journal) used.push(sign.journal);
            if (map.overlook?.journal) used.push(map.overlook.journal);
        }
        const walk = (steps = []) => steps.forEach((st) => {
            if (st.journal) used.push(st.journal);
            (st.choose ?? []).forEach((o) => walk(o.after));
        });
        Object.values(EVENTS).forEach((e) => walk(e.steps));
        for (const id of used) expect(JOURNAL_BY_ID[id], id).toBeDefined();
    });

    it('keeps found entries between walks, and the screen shows earlier walks\' and this walk\'s', () => {
        const store = memoryStore();
        recordJournal('mackaye', store);
        recordJournal('mackaye', store);
        expect(loadSave(store).journalFound).toEqual(['mackaye']);
        expect([...foundJournalIds(loadSave(store), new Set(['avery']))].sort()).toEqual(['avery', 'mackaye']);
    });
});

describe('save version 2', () => {
    it('upgrades a version 1 save, keeping the endings found and settings', () => {
        const store = memoryStore({ [SAVE_KEY]: JSON.stringify({ version: 1, endingsFound: ['changedRoute'], settings: { textSpeed: 'slow' } }) });
        expect(loadSave(store)).toEqual({ version: 2, endingsFound: ['changedRoute'], journalFound: [], settings: { textSpeed: 'slow' } });
    });

    it('writes version 2 with an empty Journal by default', () => {
        const store = memoryStore();
        writeSave(defaultSave(), store);
        expect(JSON.parse(store.data[SAVE_KEY])).toEqual({ version: 2, endingsFound: [], journalFound: [], settings: {} });
    });
});

describe('debug starts on any of the six maps', () => {
    it('accepts the new flags', () => {
        expect(parseDebugParams('?debug=1&flags=invited,katzAway,bogus').flags).toEqual({ invited: true, katzAway: true });
    });

    it('starting on an Act III map sets katzAway (the start skips E8); other maps set nothing', () => {
        expect(impliedFlagsForMap('pennsylvania')).toEqual({ katzAway: true });
        expect(impliedFlagsForMap('newengland')).toEqual({ katzAway: true });
        for (const m of ['georgia', 'smokies', 'shenandoah', 'maine', 'roadside']) expect(impliedFlagsForMap(m), m).toEqual({});
        const s = new GameState();
        applyDebugStart(s, parseDebugParams('?debug=1&map=pennsylvania'));
        expect(s.flags.katzAway).toBe(true);
    });
});
