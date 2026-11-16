import { describe, it, expect } from 'vitest';
import { EVENTS } from '../src/data/events/index.js';
import { EventRunner } from '../src/systems/EventRunner.js';
import { MAPS } from '../src/data/maps/index.js';
import { JOURNAL_BY_ID } from '../src/data/journal.js';
import { JOURNEY } from '../src/data/journey.js';
import { isSoloMap, sceneForStep } from '../src/systems/Journey.js';
import { talkTarget } from '../src/systems/Interactions.js';
import { GameState } from '../src/state/GameState.js';
import { checkEnding } from '../src/state/endings.js';

// Milestone 12: Act III, Alone (Scenes 12-15 of docs/scene-outline.md),
// checked against the outline.

const PART2 = ['home_in_hanover', 'e9_car_hiking', 'e10_mount_washington', 'e11_phone_call'];
const options = (id) => EVENTS[id].steps.find((s) => s.choose).choose;
const state = (over = {}) => ({
    stamina: 6, supplies: 6, bond: 5, morale: 6, miles: 0,
    skippedAhead: false, invited: false, katzAway: true, leftWilderness: false, choices: {}, ...over
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
const table = (id) => options(id).map((o) => ({ id: o.id, effects: o.effects, flags: o.flags ?? {} }));

describe('every choice, stat change and flag matches the scene outline', () => {
    it('Home in Hanover: no choice, one result card with Stamina +1 and Supplies +2', () => {
        const steps = play(EVENTS.home_in_hanover, 0);
        expect(steps.some((s) => s.type === 'choose')).toBe(false);
        const cards = steps.filter((s) => s.type === 'result');
        expect(cards).toHaveLength(1);
        expect(cards[0].effects).toEqual({ stamina: 1, supplies: 2 });
        expect(MAPS.pennsylvania.autoEvent).toBe('home_in_hanover');
    });

    it('E9, Car Hiking (the Centralia option unlocks its Journal entry)', () => {
        expect(table('e9_car_hiking')).toEqual([
            { id: 'dayHike', effects: { supplies: 1, morale: -2 }, flags: {} },
            { id: 'overnight', effects: { stamina: -1, morale: 2, supplies: -1 }, flags: {} },
            { id: 'centralia', effects: { morale: -1 }, flags: {} }
        ]);
        const journal = (pick) => play(EVENTS.e9_car_hiking, pick).filter((s) => s.type === 'journal').map((s) => s.id);
        expect(journal(2)).toEqual(['centralia']);
        expect(journal(0)).toEqual([]);
        expect(journal(1)).toEqual([]);
    });

    it('E10, Mount Washington', () => {
        expect(table('e10_mount_washington')).toEqual([
            { id: 'summit', effects: { morale: 2, stamina: -2 }, flags: {} },
            { id: 'turnBack', effects: { stamina: 1, morale: -1 }, flags: {} },
            { id: 'hut', effects: { supplies: -1, stamina: 1 }, flags: {} }
        ]);
    });

    it('E11, The Phone Call: Bond can change, every option brings Katz back, ending check after', () => {
        expect(table('e11_phone_call')).toEqual([
            { id: 'missYou', effects: { bond: 2, morale: -1 }, flags: { katzAway: false } },
            { id: 'practical', effects: { bond: 1, supplies: -1 }, flags: { katzAway: false } },
            { id: 'ifYouLike', effects: { morale: 1, bond: -1 }, flags: { katzAway: false } }
        ]);
        expect(EVENTS.e11_phone_call.endingCheck).toBe(true);
        expect(EVENTS.e11_phone_call.bondWhileAway).toBe(true);
    });

    it('only E11 runs an ending check or changes Bond in Act III', () => {
        for (const id of PART2) {
            expect(Boolean(EVENTS[id].endingCheck), id).toBe(id === 'e11_phone_call');
            expect(Boolean(EVENTS[id].bondWhileAway), id).toBe(id === 'e11_phone_call');
        }
        for (const id of ['e9_car_hiking', 'e10_mount_washington']) {
            for (const o of options(id)) expect(o.effects.bond, `${id} ${o.id}`).toBeUndefined();
        }
    });
});

describe('the phone call (E11)', () => {
    it("Katz's first line follows the airport goodbye (E8)", () => {
        expect(shown('e11_phone_call', 0, { invited: true, choices: { e8_katz_goes_home: 'invite' } })).toMatch(/in training/);
        expect(shown('e11_phone_call', 0, { choices: { e8_katz_goes_home: 'glad' } })).toMatch(/hoping you'd call/);
        expect(shown('e11_phone_call', 0, { choices: { e8_katz_goes_home: 'sayLittle' } })).toMatch(/lost the number/);
        // A debug start with no E8 choice still gets exactly one first line.
        for (const over of [{}, { invited: true }, { choices: { e8_katz_goes_home: 'glad' } }, { choices: { e8_katz_goes_home: 'sayLittle' } }]) {
            const katz = play(EVENTS.e11_phone_call, 0, state(over)).filter((s) => s.speaker === 'katz');
            expect(katz).toHaveLength(2); // the first line, then his answer
        }
    });

    it('Katz says no exactly when Bond ends at 2 or less, which is Broken Partnership', () => {
        for (let bond = 0; bond <= 10; bond++) {
            options('e11_phone_call').forEach((o, i) => {
                const text = shown('e11_phone_call', i, { bond });
                const s = new GameState();
                s.set('bond', bond);
                s.setFlag('katzAway');
                s.apply(o.effects, o.flags, { bondWhileAway: true });
                const refused = /I don't think so, Bryson/.test(text);
                expect(refused, `bond ${bond}, ${o.id}`).toBe(s.stats.bond <= 2);
                expect(/fly to Maine/.test(text), `bond ${bond}, ${o.id}`).toBe(!refused);
                expect(checkEnding(s.snapshot) === 'brokenPartnership').toBe(refused);
                expect(s.flags.katzAway).toBe(false);
            });
        }
    });

    it("his yes follows the new Bond: warm at 7+, sharper at 4 or less", () => {
        expect(shown('e11_phone_call', 0, { bond: 5 })).toMatch(/I'm in\./);        // 5 + 2 = 7
        expect(shown('e11_phone_call', 1, { bond: 5 })).toMatch(/snack cakes/);     // 5 + 1 = 6
        expect(shown('e11_phone_call', 2, { bond: 5 })).toMatch(/not sharing a tent/); // 5 - 1 = 4
    });

    it('starts from the payphone (a sign with an event), which then just shows its text', () => {
        const phone = MAPS.newengland.signs.find((s) => s.event === 'e11_phone_call');
        const facing = { tile: { x: phone.x, y: phone.y + 1 }, facing: 'up' };
        expect(talkTarget(MAPS.newengland, facing, new Set())).toEqual({ kind: 'event', event: 'e11_phone_call' });
        expect(talkTarget(MAPS.newengland, facing, new Set(['e11_phone_call']))).toMatchObject({ kind: 'sign', text: phone.text });
        expect(MAPS.newengland.gates.map((g) => g.opensAfter)).toEqual(['e11_phone_call']);
    });
});

describe('walking alone', () => {
    it('Pennsylvania and New England are solo maps: no Katz, even after the phone call', () => {
        expect(isSoloMap('pennsylvania')).toBe(true);
        expect(isSoloMap('newengland')).toBe(true);
        for (const m of ['georgia', 'smokies', 'shenandoah', 'maine', 'roadside']) expect(isSoloMap(m), m).toBe(false);
    });

    it('the three travel screens around Act III show Bryson alone', () => {
        const travel = JOURNEY.filter((s) => s.type === 'travel');
        expect(travel.map((t) => Boolean(t.solo))).toEqual([false, false, true, true, true]);
        expect(sceneForStep(travel[4])[1].solo).toBe(true);
    });

    it('Act III narration is first person and never has Katz or anyone else speak, except on the phone', () => {
        for (const id of PART2) {
            const ev = EVENTS[id];
            const all = [...ev.steps, ...ev.steps.flatMap((s) => (s.choose ?? []).flatMap((o) => [{ result: o.result }, ...(o.after ?? [])]))];
            for (const s of all) {
                const line = s.narrate ?? s.result;
                if (line) expect(line, line).not.toMatch(/\b(you|your)\b/i);
                if (s.say) expect(id).toBe('e11_phone_call');
            }
        }
    });

    it('the maps are real now: no placeholder, with an overlook each and the events in order', () => {
        for (const key of ['pennsylvania', 'newengland']) {
            expect(MAPS[key].placeholder, key).toBeUndefined();
            expect(MAPS[key].overlook, key).toBeDefined();
            expect(JSON.stringify(MAPS[key])).not.toMatch(/placeholder/i);
        }
        expect(MAPS.pennsylvania.triggers.map((t) => t.event)).toEqual(['e9_car_hiking']);
        expect(MAPS.newengland.triggers.map((t) => t.event)).toEqual(['e10_mount_washington']);
        expect(MAPS.newengland.palette).toBe('alpine');
    });
});

describe('Trail Journal entries 11-12', () => {
    it('are written, 2 sentences each, and can be found in Act III', () => {
        for (const id of ['centralia', 'washington']) {
            const e = JOURNAL_BY_ID[id];
            expect(e.text, id).not.toMatch(/not written yet/i);
            expect(e.text.length, id).toBeLessThanOrEqual(260);
        }
        expect(MAPS.newengland.signs.some((s) => s.journal === 'washington')).toBe(true);
    });
});
