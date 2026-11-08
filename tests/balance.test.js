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
const ROUTE = [
    { overlook: true }, 'event1_outfitter', 'event2_going_home',
    { overlook: true }, 'event3_whiteout', 'event4_night_visitor',
    { overlook: true }, { id: 'event5_pine_gap', check: true }, 'event6_last_bottle',
    { overlook: true }, 'event7_river', { id: 'event8_fall', check: true },
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
        const hasCoin = (i) => event.steps.find((s) => s.choose).choose[i].chance;
        for (let i = 0; i < optionCount(event); i++) {
            for (const roll of hasCoin(i) ? [0.1, 0.9] : [0.1]) {
                const next = clone(state);
                const outcome = playEvent(event, i, next, roll);
                next.apply(outcome.effects, outcome.flags);
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
        // 3*3*3*3*4*(3+1 coin)*3*3*3 paths, minus the ones that end early.
        expect(without.length).toBeGreaterThan(1000);
    });

    it('all four endings can be reached, with or without the overlooks', () => {
        for (const results of [withOverlooks, without]) {
            for (const ending of ['brokenPartnership', 'earlyDeparture', 'finishedTrail', 'changedRoute']) {
                expect(reached(results, ending), ending).toBe(true);
            }
        }
    });

    it('Broken Partnership can trigger after Event 5 and after Event 8; Early Departure after Event 8', () => {
        expect(reached(without, 'brokenPartnership', 'event5_pine_gap')).toBe(true);
        expect(reached(without, 'brokenPartnership', 'event8_fall')).toBe(true);
        expect(reached(without, 'earlyDeparture', 'event8_fall')).toBe(true);
    });

    // PLAYTEST FINDING (Milestone 8, owner's decision): with the outline's
    // numbers, Early Departure can NOT trigger at the check after Event 5. The
    // worst case by then is Stamina 2, Supplies 2, Morale 4 (the check needs a
    // 0, or Morale 2 or less). The plan's test list expects it to be possible.
    // This test states today's fact so any change to the numbers shows up here.
    it('Early Departure after Event 5 is currently impossible (see docs/handoff.md)', () => {
        expect(reached(without, 'earlyDeparture', 'event5_pine_gap')).toBe(false);
        expect(reached(withOverlooks, 'earlyDeparture', 'event5_pine_gap')).toBe(false);
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
