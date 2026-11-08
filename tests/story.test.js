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

// Milestone 5: story content for all 16 scenes. These tests are the
// "checklist against the outline" from the plan, plus a walk through every
// branch with many different states.

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

    it('Event 3, Whiteout', () => {
        expect(effects('event3_whiteout')).toEqual([
            { stamina: 1, morale: -1 },
            { miles: 'plus', stamina: -2 },
            { supplies: 1, miles: 'minus' }
        ]);
    });

    it('Event 4, Night Visitor', () => {
        expect(effects('event4_night_visitor')).toEqual([
            { stamina: -1 },
            { bond: 1, morale: 1, supplies: -1 },
            { supplies: -2 }
        ]);
    });

    it('Event 5, Pine Gap (and only "Ride ahead together" skips ahead)', () => {
        expect(effects('event5_pine_gap')).toEqual([
            { stamina: 2, morale: 1, miles: 'minus' },
            { supplies: 2, morale: -1 },
            { miles: 'big', morale: 1 },
            { bond: -2 }
        ]);
        expect(options('event5_pine_gap').map((o) => o.flags ?? {})).toEqual([{}, {}, { skippedAhead: true }, {}]);
        expect(EVENTS.event5_pine_gap.endingCheck).toBe(true);
    });

    it('Event 6, The Last Bottle (a coin flip for the gamble)', () => {
        const [split, ration, gamble] = options('event6_last_bottle');
        expect(split.effects).toEqual({ bond: 2, stamina: -1 });
        expect(ration.effects).toEqual({ bond: -1 });
        expect(gamble.chance.map((c) => [c.p, c.effects])).toEqual([
            [0.5, { morale: 2 }],
            [0.5, { stamina: -1, miles: 'minus' }]
        ]);
    });

    it('Event 7, The River (fording with Stamina 3 or less also loses Supplies)', () => {
        const [ford, wait, upstream] = options('event7_river');
        expect(ford.effects(state({ stamina: 4 }))).toEqual({ bond: 1, stamina: -1 });
        expect(ford.effects(state({ stamina: 3 }))).toEqual({ bond: 1, stamina: -1, supplies: -1 });
        expect(wait.effects).toEqual({ supplies: -2, morale: -1 });
        expect(upstream.effects).toEqual({ stamina: -1, miles: 'minus' });
    });

    it('Event 8, The Fall (and only walking him out leaves the wilderness)', () => {
        expect(effects('event8_fall')).toEqual([
            { stamina: -2, bond: 2 },
            { miles: 'plus', bond: -1 },
            { morale: -1 }
        ]);
        expect(options('event8_fall').map((o) => o.flags ?? {})).toEqual([{}, {}, { leftWilderness: true }]);
        expect(EVENTS.event8_fall.endingCheck).toBe(true);
    });

    it('the Final Crossroads: the three choices from the docs, no stat changes', () => {
        expect(options('final_crossroads').map((o) => [o.text, o.final, o.effects])).toEqual([
            ['"Summit or nothing."', 'summit', undefined],
            ['"Let\'s go home."', 'home', undefined],
            ['"Let\'s finish it our way."', 'ourWay', undefined]
        ]);
    });

    it('scenes without a choice have none: the Act I close, the midpoint, Sunshine', () => {
        for (const id of ['act1_close', 'midpoint_campfire', 'sunshine_morning']) {
            expect(EVENTS[id].steps.some((s) => s.choose), id).toBe(false);
        }
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

    it('a coin flip reports which side came up', () => {
        const ev = EVENTS.event6_last_bottle;
        expect(play(ev, 2, state(), () => 0.1).at(-1).outcome.optionId).toBe('gambleWon');
        expect(play(ev, 2, state(), () => 0.9).at(-1).outcome.optionId).toBe('gambleLost');
    });
});

// Every combination that changes which lines show.
const BONDS = [0, 2, 3, 4, 5, 6, 7, 10];
const STAMINAS = [3, 4, 5];
const SUPPLIES = [2, 3];
const FLAG_SETS = [{}, { skippedAhead: true }, { leftWilderness: true }, { skippedAhead: true, leftWilderness: true }];
const CHOICE_SETS = [
    {},
    { event1_outfitter: 'buyAll', event3_whiteout: 'town', event5_pine_gap: 'katzAlone', event8_fall: 'alone' },
    { event1_outfitter: 'ultralight' },
    { event1_outfitter: 'katz' }
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
    it('Act I close: a warmer last look at Katz with Bond 5+', () => {
        const hi = texts(play(EVENTS.act1_close, 0, state({ bond: 5 }))).join(' ');
        const lo = texts(play(EVENTS.act1_close, 0, state({ bond: 4 }))).join(' ');
        expect(hi).toMatch(/Same time tomorrow/);
        expect(lo).toMatch(/Neither of you said good night/);
        expect(hi).toMatch(/Am I hiking the trail/);
        expect(lo).toMatch(/Am I hiking the trail/);
    });

    it('midpoint: Bond 5+ Katz opens up; 4 or less he checks bus schedules; Sunshine either way', () => {
        const hi = texts(play(EVENTS.midpoint_campfire, 0, state({ bond: 5 }))).join(' ');
        const lo = texts(play(EVENTS.midpoint_campfire, 0, state({ bond: 4 }))).join(' ');
        expect(hi).toMatch(/hadn't finished anything in years/);
        expect(hi).not.toMatch(/bus schedules/);
        expect(lo).toMatch(/bus schedules/);
        expect(lo).not.toMatch(/hadn't finished/);
        for (const t of [hi, lo]) expect(t).toContain('Nobody walks the trail they planned. You walk the one that shows up.');
    });

    it("Katz's lines in Pine Gap and at the river follow his Bond band", () => {
        for (const id of ['event5_pine_gap', 'event7_river']) {
            const katzLines = (bond) => play(EVENTS[id], 0, state({ bond })).filter((s) => s.speaker === 'katz').map((s) => s.text);
            const warm = katzLines(8);
            const neutral = katzLines(6);
            const sharp = katzLines(3);
            expect(warm.length).toBeGreaterThan(0);
            expect(warm[0]).not.toBe(neutral[0]);
            expect(neutral[0]).not.toBe(sharp[0]);
        }
    });

    it('talking to Katz: a line for every band, plus one for each map', () => {
        for (const band of ['warm', 'neutral', 'sarcastic']) {
            expect(KATZ_LINES[band].length).toBeGreaterThanOrEqual(3);
            for (const map of Object.keys(MAPS)) {
                expect(katzLinesFor(band, map)).toEqual(expect.arrayContaining(KATZ_MAP_LINES[map]));
            }
        }
        expect(Object.keys(KATZ_WORRIED).sort()).toEqual(['bond', 'morale', 'stamina', 'supplies']);
    });
});

describe('callbacks and continuity (scene outline, Continuity Rules)', () => {
    const shown = (id, pick, over) => texts(play(EVENTS[id], pick, state(over))).join(' | ');

    it('snack cakes: always there in Event 2, bought at the outfitter or packed "for emergencies"', () => {
        expect(shown('event2_going_home', 1, { choices: { event1_outfitter: 'katz' } })).toMatch(/fourteen snack cakes/);
        expect(shown('event2_going_home', 1, { choices: { event1_outfitter: 'katz' } })).not.toMatch(/For emergencies/);
        for (const pick of ['buyAll', 'ultralight', undefined]) {
            expect(shown('event2_going_home', 1, { choices: { event1_outfitter: pick } })).toMatch(/For emergencies/);
        }
        expect(shown('event2_going_home', 1, {})).toMatch(/last snack cake/);
    });

    it('Dale remembers your outfitter choice in the Whiteout', () => {
        expect(shown('event3_whiteout', 0, { choices: { event1_outfitter: 'buyAll' } })).toMatch(/its own weather/);
        expect(shown('event3_whiteout', 0, { choices: { event1_outfitter: 'ultralight' } })).toMatch(/Toothbrush buddy/);
        expect(shown('event3_whiteout', 0, { choices: { event1_outfitter: 'katz' } })).toMatch(/hammock is not a shelter/);
    });

    it('the raccoon is revealed in Event 4 whichever you choose, and is on the postcard', () => {
        for (let i = 0; i < 3; i++) expect(shown('event4_night_visitor', i, {})).toMatch(/raccoon/);
        expect(ENDINGS.brokenPartnership.steps.map((s) => s.narrate ?? s.text).join(' ')).toMatch(/raccoon holding a bagel/);
    });

    it("Dale's river cameo, Hazel's line and Sunshine's appearances are in place", () => {
        expect(shown('event7_river', 0, {})).toContain("Should've packed a packraft.");
        expect(shown('event5_pine_gap', 0, {})).toContain("Everybody thinks the trail is about the walking. It's about the quitting you don't do.");
        expect(shown('sunshine_morning', 0, {})).toContain('Morning!');
        expect(ENDINGS.finishedTrail.steps.map((s) => s.narrate).join(' ')).toMatch(/Sunshine is already there, cheering/);
    });

    it("Hazel's line is echoed in Early Departure and Finished Trail", () => {
        for (const id of ['earlyDeparture', 'finishedTrail']) {
            expect(JSON.stringify(ENDINGS[id].steps), id).toMatch(/Hazel/);
        }
    });

    it('the side trail in the Smokies is remembered in Pine Gap', () => {
        expect(shown('event5_pine_gap', 0, { choices: { event3_whiteout: 'town' } })).toMatch(/plan can bend/);
        expect(shown('event5_pine_gap', 0, {})).not.toMatch(/side trail in the Smokies/);
    });

    it('Final Crossroads: roadside version, the truck joke, Katz remembering the slope', () => {
        expect(shown('final_crossroads', 0, {})).toMatch(/The last campfire/);
        expect(shown('final_crossroads', 0, { leftWilderness: true })).toMatch(/roadside campground/);
        expect(shown('final_crossroads', 0, { leftWilderness: true })).not.toMatch(/The last campfire/);
        expect(shown('final_crossroads', 0, { skippedAhead: true })).toMatch(/truck/);
        expect(shown('final_crossroads', 0, {})).not.toMatch(/truck/);
        expect(shown('final_crossroads', 0, { choices: { event8_fall: 'alone' } })).toMatch(/Sitting there alone/);
        expect(shown('final_crossroads', 0, {})).toMatch(/So what now\?/);
    });

    it('Final Crossroads narration hints at exactly what the summit needs', () => {
        const ready = shown('final_crossroads', 0, { stamina: 5, supplies: 3, bond: 5 });
        const spent = shown('final_crossroads', 0, { stamina: 4, supplies: 2, bond: 4 });
        expect(ready).toMatch(/trail legs/);
        expect(ready).toMatch(/food for a few more days/);
        expect(spent).toMatch(/bodies are spent/);
        expect(spent).toMatch(/nearly empty/);
        expect(spent).toMatch(/far side of the fire/);
    });
});

describe('Scene 1: the opening', () => {
    it('plays before Act I, with the suitcase line, and has no choices', () => {
        expect(JOURNEY[0]).toEqual({ type: 'opening' });
        expect(sceneForStep(JOURNEY[0])).toEqual(['Opening', {}]);
        const steps = play(OPENING, 0, state());
        expect(steps.some((s) => s.type === 'choose')).toBe(false);
        expect(texts(steps)).toContain('What? It has wheels. Wheels are efficient.');
        expect(texts(steps).join(' ')).toMatch(/2,190 miles/);
        for (const s of steps.filter((x) => x.text)) expect(s.text.length).toBeLessThanOrEqual(MAX[s.type]);
    });
});

describe('Scenes 13-16: the endings', () => {
    const endingTexts = (id, over = {}, final = null) => texts(play(endingEvent(id), 0, { ...state(over), final }));

    it.each(Object.keys(ENDINGS))('%s has 3-6 boxes, a lesson and a final Katz line for each band it can reach', (id) => {
        for (const st of allStates()) {
            for (const final of [null, 'summit', 'home', 'ourWay']) {
                const steps = play(endingEvent(id), 0, { ...st, final });
                const boxes = steps.filter((s) => s.text);
                expect(boxes.length).toBeGreaterThanOrEqual(3);
                expect(boxes.length).toBeLessThanOrEqual(6);
                boxes.forEach((b) => expect(b.text.length, b.text).toBeLessThanOrEqual(MAX[b.type]));
            }
        }
        expect(ENDINGS[id].lesson).toBeTruthy();
        for (const band of ['warm', 'neutral', 'sarcastic']) expect(katzFinalLine(id, band)).toBeTruthy();
    }, 60000);

    it('the lessons are the docs\' lessons, word for word', () => {
        expect(ENDINGS.brokenPartnership.lesson).toBe('No goal is worth more than the people you take with you.');
        expect(ENDINGS.earlyDeparture.lesson).toBe("Stopping isn't the same as failing; the trail was harder than your plans.");
        expect(ENDINGS.finishedTrail.lesson).toBe('Preparation, care for each other and stubbornness can carry you through.');
        expect(ENDINGS.changedRoute.lesson).toBe('Growth comes from changing your goals when reality changes, not from forcing the original plan.');
    });

    it("the docs' key ending lines are there", () => {
        expect(endingTexts('earlyDeparture')).toContain('We walked from there to here. On purpose. Who does that?');
        expect(endingTexts('changedRoute')).toContain("So we didn't hike the whole thing. We hiked our thing.");
    });

    it('Early Departure: with high Bond, Katz does the comforting', () => {
        expect(endingTexts('earlyDeparture', { bond: 7 }).join(' ')).toMatch(/he's the one doing the comforting/);
        expect(endingTexts('earlyDeparture', { bond: 6 }).join(' ')).not.toMatch(/comforting/);
    });

    it('Changed Route remembers how you got there', () => {
        expect(endingTexts('changedRoute', {}, 'summit').join(' ')).toMatch(/turn around without a word/);
        expect(endingTexts('changedRoute', {}, 'ourWay').join(' ')).not.toMatch(/turn around/);
        expect(endingTexts('changedRoute', { skippedAhead: true }).join(' ')).toMatch(/Virginia you skipped/);
        expect(endingTexts('changedRoute', { leftWilderness: true }).join(' ')).toMatch(/ankle takes two weeks/);
    });

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
                expect(sign.text).not.toMatch(/placeholder/i);
            }
            if (map.overlook) {
                expect(map.overlook.text.length, key).toBeLessThanOrEqual(MAX.result);
            }
        }
    });
});
