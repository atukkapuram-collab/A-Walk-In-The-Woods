import { describe, it, expect } from 'vitest';
import { EVENTS } from '../src/data/events/index.js';
import { EventRunner } from '../src/systems/EventRunner.js';
import { GameState } from '../src/state/GameState.js';
import { checkEnding } from '../src/state/endings.js';

// Milestone 8 balance check: plays the real event data through EVERY
// combination of choices (both sides of the Event 6 coin flip, with and
// without the optional overlooks), applying effects exactly as the game does,
// and records which ending each path reaches and where.

// The order the story's decision events happen in (story beats with no
// choice change no stats). `check` marks the mid-trip ending checks; the
// overlook (Morale +1, optional) can be visited on each map before its events.
// The whole book (Milestones 11-13): E1-E13 and the Final Crossroads. Bond is
// frozen from E8 until the phone call (E11), exactly as in the game. Scenes
// with no choice (Home in Hanover, the Reunion) apply their cards, if any.
const ROUTE = [
    'e1_outfitter',
    { overlook: true }, 'e2_lightens_load', 'e3_mary_ellen',
    { overlook: true }, 'e4_snowstorm', 'e5_night_noises', { id: 'e6_rental_car', check: true },
    { overlook: true }, 'e7_skyline', { id: 'e8_katz_goes_home', check: true },
    'home_in_hanover', { overlook: true }, 'e9_car_hiking',
    { overlook: true }, 'e10_mount_washington', { id: 'e11_phone_call', check: true },
    'reunion', { overlook: true }, 'e12_river', { id: 'e13_katz_is_lost', check: true },
    'final_crossroads'
];

function optionCount(event) {
    return event.steps.find((s) => s.choose)?.choose.length ?? 0;
}

// Plays one event with option `i` and a coin-flip roll; returns its outcome.
function playEvent(event, i, state, roll) {
    const runner = new EventRunner(event, { state: state.snapshot, random: () => roll });
    for (let guard = 0; guard < 100; guard++) {
        const step = runner.next();
        if (step.type === 'choose') runner.choose(i);
        if (step.type === 'end') return step.outcome;
    }
    throw new Error('never ended');
}

function clone(state) {
    const s = new GameState();
    s.stats = { ...state.stats };
    s.miles = state.miles;
    s.flags = { ...state.flags };
    return s;
}

export function simulate({ overlooks }) {
    const results = [];
    const walk = (k, state, path) => {
        const stop = ROUTE[k];
        if (stop.overlook) {
            const next = clone(state);
            if (overlooks) next.apply({ morale: +1 });
            return walk(k + 1, next, path);
        }
        const id = stop.id ?? stop;
        const event = EVENTS[id];
        if (optionCount(event) === 0) {
            // A scene with a fixed result card and no choice.
            const next = clone(state);
            for (const s of event.steps.filter((x) => x.result !== undefined)) next.apply(s.effects ?? {}, s.flags ?? {});
            return walk(k + 1, next, path);
        }
        const hasCoin = (i) => event.steps.find((s) => s.choose).choose[i].chance;
        for (let i = 0; i < optionCount(event); i++) {
            for (const roll of hasCoin(i) ? [0.1, 0.9] : [0.1]) {
                const next = clone(state);
                const outcome = playEvent(event, i, next, roll);
                next.apply(outcome.effects, outcome.flags, { bondWhileAway: Boolean(event.bondWhileAway) });
                const p = [...path, `${id}:${outcome.optionId}`];
                if (outcome.final) {
                    results.push({ ending: checkEnding(next.snapshot, outcome.final), at: 'final', path: p, state: next.snapshot });
                    continue;
                }
                if (stop.check) {
                    const ending = checkEnding(next.snapshot, null);
                    if (ending) {
                        results.push({ ending, at: id, path: p, state: next.snapshot });
                        continue;
                    }
                }
                walk(k + 1, next, p);
            }
        }
    };
    walk(0, new GameState(), []);
    return results;
}

export function summarize(results) {
    const table = {};
    for (const r of results) {
        const key = `${r.ending} @ ${r.at}`;
        table[key] = (table[key] ?? 0) + 1;
    }
    return table;
}

describe('balance: every path through the story', () => {
    const withOverlooks = simulate({ overlooks: true });
    const without = simulate({ overlooks: false });
    const reached = (results, ending, at) => results.some((r) => r.ending === ending && (!at || r.at === at));

    it('walks every combination of choices', () => {
        // 3^13 paths through the decision events, minus the ones that end early.
        expect(without.length).toBeGreaterThan(1000);
    });

    it('all four endings can be reached, with or without the overlooks', () => {
        for (const results of [withOverlooks, without]) {
            for (const ending of ['brokenPartnership', 'earlyDeparture', 'finishedTrail', 'changedRoute']) {
                expect(reached(results, ending), ending).toBe(true);
            }
        }
    });

    // Milestone 9's numbers fixed the Milestone 8 finding: both early endings
    // can now trigger at the first check (E6) as well as at E8.
    it('Broken Partnership and Early Departure can both trigger at every check: E6, E8, E11 and E13', () => {
        for (const at of ['e6_rental_car', 'e8_katz_goes_home', 'e11_phone_call', 'e13_katz_is_lost']) {
            expect(reached(without, 'brokenPartnership', at), `broken @ ${at}`).toBe(true);
            expect(reached(without, 'earlyDeparture', at), `early @ ${at}`).toBe(true);
        }
    });

    it('Changed Route, the book\'s ending, is the most common ending', () => {
        for (const results of [withOverlooks, without]) {
            const count = (id) => results.filter((r) => r.ending === id).length;
            for (const other of ['brokenPartnership', 'earlyDeparture', 'finishedTrail']) {
                expect(count('changedRoute'), other).toBeGreaterThan(count(other));
            }
        }
    });

    it('Finished Trail is never reached with a flag set', () => {
        for (const r of [...withOverlooks, ...without].filter((x) => x.ending === 'finishedTrail')) {
            expect(r.state.skippedAhead || r.state.leftWilderness).toBe(false);
        }
    });

    it('prints the distribution (for the playtest report)', () => {
        const pct = (results) => {
            const t = summarize(results);
            const total = results.length;
            return Object.fromEntries(Object.entries(t).sort().map(([k, v]) => [k, `${v} (${((v / total) * 100).toFixed(1)}%)`]));
        };
        console.log('WITHOUT overlooks', without.length, pct(without));
        console.log('WITH all overlooks', withOverlooks.length, pct(withOverlooks));
    });
});
