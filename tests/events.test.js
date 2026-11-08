import { describe, it, expect } from 'vitest';
import { EventRunner } from '../src/systems/EventRunner.js';
import { EVENTS } from '../src/data/events/index.js';
import { SPEAKERS } from '../src/data/speakers.js';
import { describeEffects } from '../src/ui/ResultCard.js';

const STATS = ['stamina', 'supplies', 'bond', 'morale', 'miles'];
const MILES_WORDS = ['plus', 'minus', 'slow', 'big'];

// Walk an event, always picking option `pick`, and return every step shown.
function playThrough(event, pick = 0, opts = {}) {
    const runner = new EventRunner(event, opts);
    const steps = [];
    for (let guard = 0; guard < 100; guard++) {
        const step = runner.next();
        steps.push(step);
        if (step.type === 'choose') runner.choose(pick);
        if (step.type === 'end') return steps;
    }
    throw new Error('event never ended');
}

describe('EventRunner', () => {
    const sample = {
        id: 'sample',
        steps: [
            { narrate: 'Rain.' },
            { say: 'katz', text: 'Hi.', when: (s) => s.bond >= 7 },
            { say: 'katz', text: 'Hmph.', when: (s) => s.bond < 7 },
            {
                choose: [
                    { text: 'A', effects: { bond: +1 }, result: 'Did A.' },
                    { text: 'B', effects: (s) => ({ supplies: s.stamina <= 3 ? -1 : 0 }), result: 'Did B.', flags: { skippedAhead: true } },
                    { text: 'C', chance: [{ p: 0.5, effects: { morale: +2 }, result: 'Lucky.' }, { p: 0.5, effects: { stamina: -1 }, result: 'Unlucky.' }] },
                    { text: 'Hidden', when: () => false, result: 'never' }
                ]
            },
            { narrate: 'After.' }
        ]
    };

    it('plays steps in order, then the result card, then the rest, then ends', () => {
        const types = playThrough(sample, 0, { state: { bond: 5 } }).map((s) => s.type);
        expect(types).toEqual(['narrate', 'say', 'choose', 'result', 'narrate', 'end']);
    });

    it('skips steps and options whose `when` is false', () => {
        const steps = playThrough(sample, 0, { state: { bond: 8 } });
        expect(steps[1].text).toBe('Hi.');
        expect(steps[2].options).toEqual(['A', 'B', 'C']);
    });

    it('reports the choice, its effects and flags back', () => {
        const end = playThrough(sample, 1, { state: { bond: 5, stamina: 2 } }).at(-1);
        expect(end.outcome).toEqual({
            eventId: 'sample', choice: 1, choiceText: 'B', optionId: null,
            effects: { supplies: -1 }, flags: { skippedAhead: true }, final: null
        });
    });

    it('rolls coin-flip options with the given random source', () => {
        const lucky = playThrough(sample, 2, { random: () => 0.1 });
        const unlucky = playThrough(sample, 2, { random: () => 0.9 });
        expect(lucky.find((s) => s.type === 'result').text).toBe('Lucky.');
        expect(unlucky.at(-1).outcome.effects).toEqual({ stamina: -1 });
    });

    it('refuses to move on while a choice is waiting', () => {
        const runner = new EventRunner({ id: 'x', steps: [{ choose: [{ text: 'a' }, { text: 'b' }] }] });
        runner.next();
        expect(() => runner.next()).toThrow(/choose/);
        expect(() => runner.choose(5)).toThrow();
    });
});

// Every event file follows the format in src/data/events/act1.js.
describe.each(Object.values(EVENTS))('event $id', (event) => {
    it('uses only known step types and known speakers', () => {
        for (const step of event.steps) {
            const kinds = ['narrate', 'say', 'choose'].filter((k) => step[k] !== undefined);
            expect(kinds.length, JSON.stringify(step)).toBe(1);
            if (step.say) expect(SPEAKERS[step.say], step.say).toBeDefined();
        }
    });

    it('has 2-4 options, each with text, a result (unless final) and known stats', () => {
        for (const step of event.steps.filter((s) => s.choose)) {
            expect(step.choose.length).toBeGreaterThanOrEqual(2);
            expect(step.choose.length).toBeLessThanOrEqual(4);
            for (const option of step.choose) {
                expect(option.text).toBeTruthy();
                if (option.final) expect(['summit', 'home', 'ourWay']).toContain(option.final);
                for (const outcome of option.chance ?? [option]) {
                    // Final Crossroads options go straight to an ending, so they need no result card.
                    if (!option.final) expect(outcome.result).toBeTruthy();
                    if (typeof outcome.effects === 'object') {
                        for (const [stat, value] of Object.entries(outcome.effects)) {
                            expect(STATS, stat).toContain(stat);
                            if (typeof value === 'string') {
                                expect(stat).toBe('miles');
                                expect(MILES_WORDS).toContain(value);
                            }
                        }
                    }
                }
            }
        }
    });

    it('plays through every option to the end', () => {
        const options = event.steps.find((s) => s.choose)?.choose.length ?? 1;
        for (let i = 0; i < options; i++) {
            expect(playThrough(event, i).at(-1).type).toBe('end');
        }
    });
});

describe('Events 1 and 2 match the scene outline', () => {
    const effectsOf = (id) => EVENTS[id].steps.find((s) => s.choose).choose.map((o) => o.effects);

    it('Event 1: the Outfitter', () => {
        expect(effectsOf('event1_outfitter')).toEqual([
            { supplies: 2, stamina: -1 },
            { stamina: 1, supplies: -1 },
            { morale: 1, bond: 1, supplies: -1 }
        ]);
    });

    it("Event 2: I'm Going Home", () => {
        expect(effectsOf('event2_going_home')).toEqual([
            { miles: 'plus', bond: -1 },
            { bond: 2, supplies: -1, miles: 'slow' },
            { morale: 1 }
        ]);
    });
});

describe('result card lines', () => {
    it('shows each change with an arrow, in a fixed order, skipping zeros', () => {
        const lines = describeEffects({ bond: 2, stamina: -1, morale: 0, miles: 'slow' });
        expect(lines.map((l) => `${l.arrow} ${l.label} ${l.amount}`)).toEqual([
            '▼ Stamina −1',
            '▲ Bond +2',
            '▼ Miles −5' // 'slow' = TUNING.miles.slow
        ]);
    });
});
