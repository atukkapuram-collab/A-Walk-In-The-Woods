import { describe, it, expect } from 'vitest';
import { EventRunner } from '../src/systems/EventRunner.js';
import { EVENTS } from '../src/data/events/index.js';
import { OPENING } from '../src/data/opening.js';
import { ENDINGS, endingEvent, katzFinalLine } from '../src/data/endings.js';
import { KATZ_LINES, KATZ_MAP_LINES, KATZ_WORRIED, katzLinesFor } from '../src/data/katz-lines.js';
import { MAPS } from '../src/data/maps/index.js';
import { SPEAKERS } from '../src/data/speakers.js';
import { JOURNEY } from '../src/data/journey.js';
import { sceneForStep } from '../src/systems/Journey.js';
import { checkEnding } from '../src/state/endings.js';

// Milestone 5: story content, checked against the outline, plus a walk
// through every branch with many different states. Since Milestone 11 the
// scenes are checked against the outline in tests/story-part1.test.js,
// story-part2.test.js and story-part3.test.js; this file keeps the general
// checks that run over every event and ending.

const options = (id) => EVENTS[id].steps.find((s) => s.choose).choose;
const state = (over = {}) => ({
    stamina: 6, supplies: 6, bond: 5, morale: 6, miles: 0,
    skippedAhead: false, leftWilderness: false, choices: {}, ...over
});

// Plays an event, picking option `pick`, and returns every step shown.
function play(event, pick, st, random = () => 0.1) {
    const runner = new EventRunner(event, { state: st, random });
    const steps = [];
    for (let guard = 0; guard < 100; guard++) {
        const step = runner.next();
        steps.push(step);
        if (step.type === 'choose') runner.choose(pick);
        if (step.type === 'end') return steps;
    }
    throw new Error('never ended');
}
const texts = (steps) => steps.filter((s) => s.text).map((s) => s.text);

describe('every choice and stat change matches the scene outline', () => {
    const effects = (id) => options(id).map((o) => o.effects);

    it('the Final Crossroads: the three choices from the docs, no stat changes', () => {
        expect(options('final_crossroads').map((o) => [o.text, o.final, o.effects])).toEqual([
            ['"Summit or nothing."', 'summit', undefined],
            ['"Let\'s go home."', 'home', undefined],
            ['"Let\'s finish it our way."', 'ourWay', undefined]
        ]);
    });

    it('no placeholder text is left in any scene', () => {
        for (const event of Object.values(EVENTS)) {
            expect(event.placeholder, event.id).toBeFalsy();
            expect(JSON.stringify(event.steps)).not.toMatch(/placeholder/i);
        }
    });
});

describe('option ids (remembered for callbacks)', () => {
    it('every option has an id, unique within its event', () => {
        for (const event of Object.values(EVENTS)) {
            for (const step of event.steps.filter((s) => s.choose)) {
                const ids = step.choose.map((o) => o.id);
                ids.forEach((id) => expect(id, `${event.id}: ${JSON.stringify(ids)}`).toBeTruthy());
                expect(new Set(ids).size).toBe(ids.length);
            }
        }
    });

});

// Every combination that changes which lines show.
const BONDS = [0, 2, 3, 4, 5, 6, 7, 10];
const STAMINAS = [3, 4, 5];
const SUPPLIES = [2, 3];
const FLAG_SETS = [{}, { skippedAhead: true }, { leftWilderness: true }, { skippedAhead: true, leftWilderness: true }];
const CHOICE_SETS = [
    {},
    { e1_outfitter: 'buyAll', e4_snowstorm: 'down', e6_rental_car: 'rentCar', e8_katz_goes_home: 'invite', e13_katz_is_lost: 'hikeOut' },
    { e1_outfitter: 'guidebook', e3_mary_ellen: 'tagAlong' },
    { e1_outfitter: 'katzRoom', e8_katz_goes_home: 'sayLittle' }
];
function* allStates() {
    for (const bond of BONDS) for (const stamina of STAMINAS) for (const supplies of SUPPLIES)
        for (const flags of FLAG_SETS) for (const choices of CHOICE_SETS)
            yield state({ bond, stamina, supplies, ...flags, choices });
}

// Box sizes (TextBox: 3 lines of 22px monospace; narration is wider than
// dialogue, which has a portrait). Checked by eye in the browser too.
const MAX = { narrate: 185, say: 160, result: 140, option: 70 };

describe('walking every branch', () => {
    it('every event plays to the end for every option and state, with text in every box', () => {
        for (const event of Object.values(EVENTS)) {
            const n = event.steps.find((s) => s.choose)?.choose.length ?? 1;
            for (const st of allStates()) {
                for (let i = 0; i < n; i++) {
                    const hasChance = event.steps.some((x) => x.choose?.[i]?.chance);
                    for (const random of hasChance ? [() => 0.1, () => 0.9] : [() => 0.1]) {
                        const steps = play(event, i, st, random);
                        expect(steps.at(-1).type).toBe('end');
                        for (const s of steps) {
                            if (s.type === 'narrate' || s.type === 'say' || s.type === 'result') {
                                expect(typeof s.text, `${event.id} ${JSON.stringify(s)}`).toBe('string');
                                expect(s.text.length).toBeGreaterThan(0);
                                expect(s.text.length, s.text).toBeLessThanOrEqual(MAX[s.type]);
                            }
                            if (s.type === 'say') expect(SPEAKERS[s.speaker], s.speaker).toBeDefined();
                            if (s.type === 'choose') s.options.forEach((o) => expect(o.length, o).toBeLessThanOrEqual(MAX.option));
                        }
                    }
                }
            }
        }
    }, 60000);

    it('side characters say three lines or fewer per scene (outline)', () => {
        for (const event of Object.values(EVENTS)) {
            for (const st of [state(), state({ bond: 2 }), state({ bond: 8 })]) {
                const n = event.steps.find((s) => s.choose)?.choose.length ?? 1;
                for (let i = 0; i < n; i++) {
                    const says = play(event, i, st).filter((s) => s.type === 'say' && s.speaker !== 'katz');
                    const by = {};
                    says.forEach((s) => { by[s.speaker] = (by[s.speaker] ?? 0) + 1; });
                    Object.values(by).forEach((count) => expect(count, event.id).toBeLessThanOrEqual(3));
                }
            }
        }
    });
});

describe('Bond changes the lines, never the branch', () => {
    it('talking to Katz: a line for every band, plus one for each map he walks', () => {
        // On the Act III maps Katz is home in Iowa (journey `katzAway`): no lines there.
        const away = new Set(JOURNEY.filter((s) => s.katzAway).map((s) => s.map));
        for (const band of ['warm', 'neutral', 'sarcastic']) {
            expect(KATZ_LINES[band].length).toBeGreaterThanOrEqual(3);
            for (const map of Object.keys(MAPS).filter((m) => !away.has(m))) {
                expect(katzLinesFor(band, map)).toEqual(expect.arrayContaining(KATZ_MAP_LINES[map]));
            }
        }
        expect(Object.keys(KATZ_WORRIED).sort()).toEqual(['bond', 'morale', 'stamina', 'supplies']);
    });
});

describe('Scenes 20-23: the endings', () => {
    const endingTexts = (id, over = {}, final = null) => texts(play(endingEvent(id), 0, { ...state(over), final }));

    it.each(Object.keys(ENDINGS))('%s has 3-6 boxes, a lesson and a final Katz line for each band it can reach', (id) => {
        for (const st of allStates()) {
            for (const final of [null, 'summit', 'home', 'ourWay']) {
              for (const at of ['e6_rental_car', 'e8_katz_goes_home', 'e11_phone_call', 'final_crossroads']) {
                const steps = play(endingEvent(id), 0, { ...st, final, at });
                const boxes = steps.filter((s) => s.text);
                expect(boxes.length).toBeGreaterThanOrEqual(3);
                expect(boxes.length).toBeLessThanOrEqual(6);
                boxes.forEach((b) => expect(b.text.length, b.text).toBeLessThanOrEqual(MAX[b.type]));
              }
            }
        }
        expect(ENDINGS[id].lesson).toBeTruthy();
        for (const band of ['warm', 'neutral', 'sarcastic']) expect(katzFinalLine(id, band)).toBeTruthy();
    }, 60000);

    it('the ending rules are unchanged (each ending is reachable from the Final Crossroads)', () => {
        expect(checkEnding(state({ bond: 2 }), 'summit')).toBe('brokenPartnership');
        expect(checkEnding(state(), 'home')).toBe('earlyDeparture');
        expect(checkEnding(state(), 'summit')).toBe('finishedTrail');
        expect(checkEnding(state(), 'ourWay')).toBe('changedRoute');
        expect(checkEnding(state({ skippedAhead: true }), 'summit')).toBe('changedRoute');
    });
});

describe('signs and overlooks', () => {
    it('every map sign and overlook has its narrator line, short enough for the box', () => {
        for (const [key, map] of Object.entries(MAPS)) {
            for (const sign of map.signs ?? []) {
                expect(sign.text.length, key).toBeLessThanOrEqual(MAX.narrate);
                if (!map.placeholder) expect(sign.text).not.toMatch(/placeholder/i);
            }
            if (map.overlook) {
                expect(map.overlook.text.length, key).toBeLessThanOrEqual(MAX.result);
            }
        }
    });
});
