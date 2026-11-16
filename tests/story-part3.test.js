import { describe, it, expect } from 'vitest';
import { EVENTS } from '../src/data/events/index.js';
import { EventRunner } from '../src/systems/EventRunner.js';
import { ENDINGS, endingEvent } from '../src/data/endings.js';
import { MAPS } from '../src/data/maps/index.js';
import { JOURNAL } from '../src/data/journal.js';
import { SPEAKERS } from '../src/data/speakers.js';
import { OPENING } from '../src/data/opening.js';
import { checkEnding } from '../src/state/endings.js';

// Milestone 13: Act IV, Maine (Scenes 16-19) and the four endings (Scenes
// 20-23 of docs/scene-outline.md), checked against the outline.

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
const ending = (id, over = {}) => play(endingEvent(id), 0, { ...state(), final: null, at: null, ...over }).filter((s) => s.text).map((s) => s.text).join(' | ');
const effectsOf = (o, st = state()) => (typeof o.effects === 'function' ? o.effects(st) : o.effects);

describe('every choice, stat change and flag matches the scene outline', () => {
    it('the Reunion: no choice, plays as Maine starts; Katz is honest about a hard few months', () => {
        expect(EVENTS.reunion.steps.some((s) => s.choose)).toBe(false);
        expect(MAPS.maine.autoEvent).toBe('reunion');
        expect(shown('reunion')).toMatch(/rough few months/);
        expect(shown('reunion')).toMatch(/glad he came/);
    });

    it('E12, The River (fording with Stamina 3 or less also loses Supplies)', () => {
        const [ford, wait, upstream] = options('e12_river');
        expect(effectsOf(ford, state({ stamina: 4 }))).toEqual({ bond: 1, stamina: -1 });
        expect(effectsOf(ford, state({ stamina: 3 }))).toEqual({ bond: 1, stamina: -1, supplies: -1 });
        expect(wait.effects).toEqual({ supplies: -2, morale: -1 });
        expect(upstream.effects).toEqual({ stamina: -1, miles: 'minus' });
        expect(EVENTS.e12_river.endingCheck).toBeFalsy();
    });

    it('E13, Katz Is Lost: only hiking out leaves the wilderness; ending check after', () => {
        expect(options('e13_katz_is_lost').map((o) => ({ id: o.id, effects: o.effects, flags: o.flags ?? {} }))).toEqual([
            { id: 'search', effects: { stamina: -2, bond: 2 }, flags: {} },
            { id: 'wait', effects: { morale: -2, supplies: -1 }, flags: {} },
            { id: 'hikeOut', effects: { bond: -1, morale: -1 }, flags: { leftWilderness: true } }
        ]);
        expect(EVENTS.e13_katz_is_lost.endingCheck).toBe(true);
        expect(EVENTS.e13_katz_is_lost.night).toBe(true);
    });

    it('the Final Crossroads: the three choices from the docs, no stat changes', () => {
        expect(options('final_crossroads').map((o) => [o.text, o.final, o.effects])).toEqual([
            ['"Summit or nothing."', 'summit', undefined],
            ['"Let\'s go home."', 'home', undefined],
            ['"Let\'s finish it our way."', 'ourWay', undefined]
        ]);
    });
});

describe('callbacks and continuity', () => {
    it('E13: whatever you pick, Katz turns up the next day having thrown away his water', () => {
        for (let i = 0; i < 3; i++) {
            expect(shown('e13_katz_is_lost', i)).toMatch(/sitting on a rock by a logging road/);
            expect(shown('e13_katz_is_lost', i)).toMatch(/threw my water bottle away/);
        }
        expect(shown('e13_katz_is_lost', 0)).toMatch(/Yelling like a moose/);
        expect(shown('e13_katz_is_lost', 1)).not.toMatch(/moose/);
    });

    it("Bryson's fear has moved from bears (Act I) to Katz (E13)", () => {
        expect(OPENING.steps.map((s) => s.narrate ?? '').join(' ')).toMatch(/bear attacks/);
        expect(shown('e13_katz_is_lost')).toMatch(/I would take a bear now, gladly/);
    });

    it("Katz's lines at the Reunion and the river follow his Bond band", () => {
        for (const id of ['reunion', 'e12_river']) {
            const first = (bond) => play(EVENTS[id], 0, state({ bond })).find((s) => s.speaker === 'katz').text;
            expect(new Set([first(8), first(6), first(3)]).size, id).toBe(3);
        }
    });

    it('Final Crossroads: the logging road or the roadside, the driver, the rental-car joke, the night alone', () => {
        expect(shown('final_crossroads')).toMatch(/A logging road cuts across the trail/);
        expect(shown('final_crossroads', 0, { leftWilderness: true })).toMatch(/the morning after/);
        expect(shown('final_crossroads', 0, { leftWilderness: true })).not.toMatch(/cuts across the trail/);
        expect(shown('final_crossroads')).toMatch(/run you into town/);
        expect(shown('final_crossroads', 0, { skippedAhead: true })).toMatch(/rent a car/);
        expect(shown('final_crossroads')).not.toMatch(/rent a car/);
        expect(shown('final_crossroads', 0, { choices: { e13_katz_is_lost: 'hikeOut' } })).toMatch(/Out there on my own/);
        expect(shown('final_crossroads')).toMatch(/So what now\?/);
        expect(MAPS.roadside.autoEvent).toBe('final_crossroads');
    });

    it('Final Crossroads narration hints at exactly what the summit needs', () => {
        const ready = shown('final_crossroads', 0, { stamina: 5, supplies: 3, bond: 5 });
        const spent = shown('final_crossroads', 0, { stamina: 4, supplies: 2, bond: 4 });
        expect(ready).toMatch(/trail legs/);
        expect(ready).toMatch(/food for a few more days/);
        expect(spent).toMatch(/We are spent/);
        expect(spent).toMatch(/nearly empty/);
        expect(spent).toMatch(/far side of the road/);
    });

    it('the made-up characters are gone from the whole game', () => {
        expect(Object.keys(SPEAKERS).sort()).toEqual(['clerk', 'daytripper', 'driver', 'hiker', 'katz', 'maryEllen', 'salesman']);
        const everything = JSON.stringify([Object.values(EVENTS).map((e) => e.steps), ENDINGS, MAPS]);
        expect(everything).not.toMatch(/\bDale\b|Sunshine|Hazel|Pine Gap|raccoon/);
    });

    it('all narration in Act IV and the endings is first person, never "you"', () => {
        const lines = [];
        const walk = (steps = []) => steps.forEach((s) => {
            if (s.narrate) lines.push(s.narrate);
            (s.choose ?? []).forEach((o) => {
                for (const st of [state(), state({ stamina: 2 })]) if (o.result) lines.push(typeof o.result === 'function' ? o.result(st) : o.result);
                walk(o.after);
            });
        });
        ['reunion', 'e12_river', 'e13_katz_is_lost', 'final_crossroads'].forEach((id) => walk(EVENTS[id].steps));
        Object.values(ENDINGS).forEach((e) => walk(e.steps));
        for (const sign of [...MAPS.maine.signs, MAPS.maine.overlook]) lines.push(sign.text);
        for (const line of lines) expect(line, line).not.toMatch(/\b(you|your)\b/i);
    });
});

describe('the four endings (Scenes 20-23)', () => {
    it("the lessons are the docs' lessons, word for word", () => {
        expect(ENDINGS.brokenPartnership.lesson).toBe('No goal is worth more than the person you take with you.');
        expect(ENDINGS.earlyDeparture.lesson).toBe('Stopping is not the same as failing.');
        expect(ENDINGS.finishedTrail.lesson).toBe('Preparation, care and stubbornness can carry you all the way.');
        expect(ENDINGS.changedRoute.lesson).toBe('The trail humbles the plan; the honest attempt is the success.');
    });

    it("Changed Route is the book's ending: they walk out, and they did hike the Appalachian Trail", () => {
        const text = ending('changedRoute', { final: 'ourWay' });
        expect(text).toMatch(/walk out of the woods on the logging road/);
        expect(text).toMatch(/"We hiked the Appalachian Trail,"/);
        expect(text).toMatch(/did it together/);
        expect(ending('changedRoute', { final: 'summit' })).toMatch(/turn round without a word/);
        expect(text).not.toMatch(/turn round/);
        expect(ending('changedRoute', { skippedAhead: true })).toMatch(/counting the ones we drove/);
    });

    it('Finished Trail is the "what if": Katahdin, and the narration says the book has no such ending', () => {
        expect(ENDINGS.finishedTrail.tag).toBe('What if');
        expect(ending('finishedTrail', { final: 'summit' })).toMatch(/Katahdin, at sunrise/);
        expect(ending('finishedTrail', { final: 'summit' })).toMatch(/the version the book does not have/);
    });

    it('Broken Partnership: how Katz goes depends on where it broke; the Little Debbie always arrives', () => {
        expect(ending('brokenPartnership', { at: 'e11_phone_call' })).toMatch(/Katz does not come to Maine/);
        expect(ending('brokenPartnership', { at: 'e8_katz_goes_home', katzAway: true })).toMatch(/does not answer when I call/);
        expect(ending('brokenPartnership', { at: 'e13_katz_is_lost' })).toMatch(/gets a ride out/);
        for (const at of ['e6_rental_car', 'e8_katz_goes_home', 'e11_phone_call', 'e13_katz_is_lost']) {
            expect(ending('brokenPartnership', { at })).toMatch(/one Little Debbie snack cake/);
            expect(ending('brokenPartnership', { at })).toMatch(/No note/);
        }
    });

    it('Early Departure: together at the motel, or alone on the phone in Act III; Katz comforts with high Bond', () => {
        const together = ending('earlyDeparture', { at: 'e6_rental_car' });
        const alone = ending('earlyDeparture', { at: 'e8_katz_goes_home', katzAway: true });
        const atPhone = ending('earlyDeparture', { at: 'e11_phone_call' });
        expect(together).toMatch(/Katz puts his finger on Georgia/);
        for (const text of [alone, atPhone]) {
            expect(text).toMatch(/I pick up the phone/);
            expect(text).not.toMatch(/puts his finger/);
        }
        for (const text of [together, alone, atPhone]) expect(text).toContain('We walked from there to here. On purpose.');
        expect(ending('earlyDeparture', { bond: 7 })).toMatch(/doing the comforting/);
        expect(ending('earlyDeparture', { bond: 6 })).not.toMatch(/comforting/);
    });

    it('the ending rules are unchanged', () => {
        expect(checkEnding(state({ bond: 2 }), 'summit')).toBe('brokenPartnership');
        expect(checkEnding(state(), 'home')).toBe('earlyDeparture');
        expect(checkEnding(state(), 'summit')).toBe('finishedTrail');
        expect(checkEnding(state(), 'ourWay')).toBe('changedRoute');
        expect(checkEnding(state({ skippedAhead: true }), 'summit')).toBe('changedRoute');
        expect(checkEnding(state({ leftWilderness: true }), 'summit')).toBe('changedRoute');
    });
});

describe('the Trail Journal is complete', () => {
    it('all 13 entries are written, and the last is found on the sign into the Wilderness', () => {
        for (const e of JOURNAL) expect(e.text, e.id).not.toMatch(/not written yet/i);
        expect(MAPS.maine.signs.some((s) => s.journal === 'wilderness')).toBe(true);
    });
});
