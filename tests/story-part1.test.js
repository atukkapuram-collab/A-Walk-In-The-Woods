import { describe, it, expect } from 'vitest';
import { EVENTS } from '../src/data/events/index.js';
import { EventRunner } from '../src/systems/EventRunner.js';
import { OPENING, OPENING_PANELS } from '../src/data/opening.js';
import { MAPS } from '../src/data/maps/index.js';
import { JOURNAL } from '../src/data/journal.js';
import { GameState } from '../src/state/GameState.js';

// Milestone 11: Part 1 of the book (Prologue to E8, Scenes 1-11 of
// docs/scene-outline.md), checked against the outline.

const PART1 = ['e1_outfitter', 'e2_lightens_load', 'e3_mary_ellen', 'act1_close', 'e4_snowstorm',
    'e5_night_noises', 'e6_rental_car', 'e7_skyline', 'midpoint_campfire', 'e8_katz_goes_home'];
const PART1_MAPS = ['georgia', 'smokies', 'shenandoah'];

const options = (id) => EVENTS[id].steps.find((s) => s.choose).choose;
const state = (over = {}) => ({
    stamina: 6, supplies: 6, bond: 5, morale: 6, miles: 0,
    skippedAhead: false, invited: false, katzAway: false, leftWilderness: false, choices: {}, ...over
});
function play(event, pick, st = state()) {
    const runner = new EventRunner(event, { state: st });
    const steps = [];
    for (let guard = 0; guard < 100; guard++) {
        const step = runner.next();
        steps.push(step);
        if (step.type === 'choose') runner.choose(pick);
        if (step.type === 'end') return steps;
    }
    throw new Error('never ended');
}
const shown = (id, pick = 0, over = {}) => play(EVENTS[id], pick, state(over)).filter((s) => s.text).map((s) => s.text).join(' | ');
const katzSays = (id, over) => play(EVENTS[id], 0, state(over)).filter((s) => s.speaker === 'katz').map((s) => s.text);

describe('every choice, stat change and flag matches the scene outline', () => {
    const table = (id) => options(id).map((o) => ({ id: o.id, effects: o.effects, flags: o.flags ?? {} }));

    it('E1, The Outfitter', () => {
        expect(table('e1_outfitter')).toEqual([
            { id: 'buyAll', effects: { supplies: 2, stamina: -1 }, flags: {} },
            { id: 'guidebook', effects: { stamina: 1, supplies: -1 }, flags: {} },
            { id: 'katzRoom', effects: { bond: 1, morale: 1, supplies: -1 }, flags: {} }
        ]);
    });

    it('E2, Katz Lightens His Load', () => {
        expect(table('e2_lightens_load')).toEqual([
            { id: 'fetch', effects: { supplies: 1, stamina: -2 }, flags: {} },
            { id: 'share', effects: { bond: 2, supplies: -2 }, flags: {} },
            { id: 'laugh', effects: { morale: 1, bond: -1 }, flags: {} }
        ]);
    });

    it('E3, Mary Ellen', () => {
        expect(table('e3_mary_ellen')).toEqual([
            { id: 'tagAlong', effects: { supplies: 1, morale: -2 }, flags: {} },
            { id: 'slipAway', effects: { bond: 1, stamina: -1 }, flags: {} },
            { id: 'tellHer', effects: { morale: 1, bond: -1 }, flags: {} }
        ]);
    });

    it('E4, Snowstorm', () => {
        expect(table('e4_snowstorm')).toEqual([
            { id: 'wait', effects: { stamina: 1, morale: -1 }, flags: {} },
            { id: 'push', effects: { miles: 'plus', stamina: -2 }, flags: {} },
            { id: 'down', effects: { supplies: 1, miles: 'minus' }, flags: {} }
        ]);
    });

    it('E5, Night Noises', () => {
        expect(table('e5_night_noises')).toEqual([
            { id: 'hangFood', effects: { stamina: -1, morale: 1 }, flags: {} },
            { id: 'wakeKatz', effects: { bond: 1, stamina: -1 }, flags: {} },
            { id: 'lieStill', effects: { morale: -2 }, flags: {} }
        ]);
    });

    it('E6, The Rental Car: only the car (the book\'s choice) skips ahead; ending check after', () => {
        expect(table('e6_rental_car')).toEqual([
            { id: 'rentCar', effects: { morale: 1, supplies: -1 }, flags: { skippedAhead: true } },
            { id: 'walkOn', effects: { stamina: -2, bond: -1 }, flags: {} },
            { id: 'zeroDays', effects: { stamina: 2, supplies: -1, morale: -1 }, flags: {} }
        ]);
        expect(EVENTS.e6_rental_car.endingCheck).toBe(true);
    });

    it('E7, Skyline Drive', () => {
        expect(table('e7_skyline')).toEqual([
            { id: 'everyMile', effects: { stamina: -1, morale: 1 }, flags: {} },
            { id: 'waysides', effects: { bond: 1, morale: 1, supplies: -1 }, flags: {} },
            { id: 'hitch', effects: { stamina: 1, morale: -1 }, flags: {} }
        ]);
    });

    it('E8, Katz Goes Home: every option sends him home, only the first invites him back; ending check after', () => {
        expect(table('e8_katz_goes_home')).toEqual([
            { id: 'invite', effects: { bond: 1, morale: -1 }, flags: { invited: true, katzAway: true } },
            { id: 'glad', effects: { bond: 2, morale: -2 }, flags: { katzAway: true } },
            { id: 'sayLittle', effects: { morale: 1, bond: -2 }, flags: { katzAway: true } }
        ]);
        expect(EVENTS.e8_katz_goes_home.endingCheck).toBe(true);
    });

    it('E8\'s Bond change counts, even though Katz leaves on the same card', () => {
        const s = new GameState();
        const glad = options('e8_katz_goes_home')[1];
        s.apply(glad.effects, glad.flags);
        expect(s.stats.bond).toBe(7);
        expect(s.flags.katzAway).toBe(true);
    });

    it('only E6 and E8 run ending checks in Part 1; the quiet scenes have no choice', () => {
        for (const id of PART1) expect(Boolean(EVENTS[id].endingCheck), id).toBe(['e6_rental_car', 'e8_katz_goes_home'].includes(id));
        for (const id of ['act1_close', 'midpoint_campfire']) expect(EVENTS[id].steps.some((s) => s.choose), id).toBe(false);
        expect(OPENING.steps.some((s) => s.choose)).toBe(false);
    });
});

describe('the opening (Prologue, Chapter 1)', () => {
    it('Hanover, the bear books, the invitations, Katz calling, Atlanta: no name entry, Bill narrates', () => {
        const text = OPENING.steps.map((s) => s.narrate ?? s.text).join(' ');
        for (const bit of [/Hanover/, /bear attacks/, /Stephen Katz/, /Des Moines/, /Atlanta/, /Little Debbie/]) expect(text).toMatch(bit);
        expect(text).toMatch(/don't drink anymore/);
        expect(text).not.toMatch(/name/i);
    });

    it('E1 is played inside the opening, between the bear books and the phone call', () => {
        const i = OPENING_PANELS.findIndex((p) => p.event === 'e1_outfitter');
        expect(i).toBe(1);
        expect(EVENTS.e1_outfitter.map).toBe('opening');
    });
});

describe('Bond changes the lines, never the branch', () => {
    it('Act I close: a warmer last line with Bond 5+', () => {
        expect(shown('act1_close', 0, { bond: 5 })).toMatch(/Same time tomorrow/);
        expect(shown('act1_close', 0, { bond: 4 })).toMatch(/Neither of us said good night/);
        expect(shown('act1_close', 0, { bond: 4 })).not.toMatch(/Same time tomorrow/);
    });

    it('midpoint: Bond 5+ Katz talks honestly about drinking and why he came; 4 or less, flights home', () => {
        const high = shown('midpoint_campfire', 0, { bond: 5 });
        const low = shown('midpoint_campfire', 0, { bond: 4 });
        expect(high).toMatch(/sober/);
        expect(high).toMatch(/glad he came/);
        expect(high).not.toMatch(/flights home/);
        expect(low).toMatch(/flights home/);
        expect(low).not.toMatch(/sober/);
    });

    it("Katz's lines in E4, E6, E7 and E8 follow his Bond band", () => {
        for (const id of ['e4_snowstorm', 'e6_rental_car', 'e7_skyline', 'e8_katz_goes_home']) {
            const [warm, neutral, sharp] = [8, 6, 3].map((bond) => katzSays(id, { bond })[0]);
            expect(new Set([warm, neutral, sharp]).size, id).toBe(3);
        }
    });
});

describe('callbacks and continuity', () => {
    it('E2 remembers what was bought at the outfitter (E1)', () => {
        expect(shown('e2_lightens_load', 0, { choices: { e1_outfitter: 'buyAll' } })).toMatch(/everything the salesman sold me/);
        expect(shown('e2_lightens_load', 0, { choices: { e1_outfitter: 'guidebook' } })).toMatch(/light pack/);
        expect(shown('e2_lightens_load', 0, { choices: { e1_outfitter: 'katzRoom' } })).toMatch(/Little Debbie/);
    });

    it('E5: whatever you pick, they never find out what it was', () => {
        for (let i = 0; i < 3; i++) expect(shown('e5_night_noises', i)).toMatch(/we never find out/);
        expect(EVENTS.e5_night_noises.night).toBe(true);
    });

    it('E6 happens in Gatlinburg, after two days of silence (Chapter 7), and unlocks the Gatlinburg entry', () => {
        expect(shown('e6_rental_car')).toMatch(/Gatlinburg/);
        expect(shown('e6_rental_car')).toMatch(/for two days now, Katz has barely said a word/);
        // With a warm Bond (7+) the silence softens; the scene is the same.
        expect(shown('e6_rental_car', 0, { bond: 8 })).not.toMatch(/barely said a word/);
        expect(shown('e6_rental_car', 0, { bond: 8 })).toMatch(/running out of jokes/);
        expect(play(EVENTS.e6_rental_car, 0).some((s) => s.type === 'journal' && s.id === 'gatlinburg')).toBe(true);
    });

    it('the made-up characters are gone from Part 1: no Dale, Sunshine, Hazel or Pine Gap', () => {
        for (const id of PART1) {
            const all = JSON.stringify(EVENTS[id].steps);
            expect(all, id).not.toMatch(/dale|sunshine|hazel|Pine Gap|raccoon/i);
        }
        for (const key of PART1_MAPS) expect(JSON.stringify(MAPS[key]), key).not.toMatch(/dale|sunshine|hazel|Pine Gap/i);
    });

    it('Part 1 narration is first person (Bill Bryson), never "you"', () => {
        const narration = [...OPENING.steps, ...PART1.flatMap((id) => {
            const ev = EVENTS[id];
            return [...ev.steps, ...ev.steps.flatMap((s) => (s.choose ?? []).flatMap((o) => [{ result: o.result }, ...(o.after ?? [])]))];
        })].map((s) => s.narrate ?? s.result).filter(Boolean);
        for (const line of narration) expect(line, line).not.toMatch(/\b(you|your)\b/i);
    });
});

describe('the maps hold Part 1 in the book\'s order', () => {
    const allTriggers = (key) => (MAPS[key].triggers ?? []).map((t) => t.event);
    const allTalk = (key) => (MAPS[key].npcs ?? []).filter((n) => n.talk).map((n) => n.talk);

    it('Georgia: E2, then Mary Ellen (E3), then the woods at night', () => {
        expect(allTriggers('georgia')).toEqual(['e2_lightens_load', 'e3_mary_ellen', 'act1_close']);
        expect(MAPS.georgia.npcs.map((n) => n.id)).toEqual(['maryEllen']);
    });

    it('Smokies: E4, E5, then Gatlinburg (E6)', () => {
        expect(allTriggers('smokies')).toEqual(['e4_snowstorm', 'e5_night_noises', 'e6_rental_car']);
    });

    it('Shenandoah: the day-tripper (E7), the campfire, then Katz goes home (E8)', () => {
        expect(allTalk('shenandoah')).toEqual(['e7_skyline']);
        expect(allTriggers('shenandoah')).toEqual(['midpoint_campfire', 'e8_katz_goes_home']);
    });
});

describe('Trail Journal entries 1-10', () => {
    const first10 = JOURNAL.slice(0, 10);

    it('are written (no placeholder), 2-3 sentences each', () => {
        for (const e of first10) {
            expect(e.text, e.id).not.toMatch(/not written yet/i);
            const sentences = e.text.split(/[.!?](\s|$)/).filter((x) => x && x.trim().length > 1).length;
            expect(sentences, e.id).toBeGreaterThanOrEqual(2);
            expect(sentences, e.id).toBeLessThanOrEqual(3);
            expect(e.text.length, e.id).toBeLessThanOrEqual(260);
        }
    });

    it('can each be found exactly once in Part 1 (a sign, an overlook or an event)', () => {
        const found = [];
        for (const key of PART1_MAPS) {
            for (const sign of MAPS[key].signs ?? []) if (sign.journal) found.push(sign.journal);
            if (MAPS[key].overlook?.journal) found.push(MAPS[key].overlook.journal);
        }
        for (const id of PART1) EVENTS[id].steps.forEach((s) => s.journal && found.push(s.journal));
        expect(found.sort()).toEqual(first10.map((e) => e.id).sort());
    });
});
