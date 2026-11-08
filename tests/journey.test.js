import { describe, it, expect } from 'vitest';
import { JOURNEY, DETOURS } from '../src/data/journey.js';
import { MAPS } from '../src/data/maps/index.js';
import { EVENTS } from '../src/data/events/index.js';
import { stepIndexForMap, detourFor, sceneForStep } from '../src/systems/Journey.js';

describe('the journey', () => {
    const maps = JOURNEY.filter((s) => s.type === 'map').map((s) => s.map);

    it('visits the four maps in the blueprint order', () => {
        expect(maps).toEqual(['georgia', 'smokies', 'virginia', 'maine']);
    });

    it('has one travel screen with miles between each pair of maps', () => {
        for (let i = 0; i < maps.length - 1; i++) {
            const between = JOURNEY.slice(stepIndexForMap(maps[i]) + 1, stepIndexForMap(maps[i + 1]));
            const travel = between.filter((s) => s.type === 'travel');
            expect(travel.length, `${maps[i]} -> ${maps[i + 1]}`).toBe(1);
            expect(travel[0].miles).toBeGreaterThan(0);
        }
    });

    it('has the three act cards, in order', () => {
        expect(JOURNEY.filter((s) => s.type === 'act').map((s) => s.title))
            .toEqual(['Act I: The Beginning', 'Act II: The Middle', 'Act III: The Climax']);
    });

    it('gives every map but the last an exit, and ends Maine with the Final Crossroads', () => {
        for (const key of maps.slice(0, -1)) expect(MAPS[key].exit, key).toBeDefined();
        expect(MAPS.maine.exit).toBeUndefined();
        expect(MAPS.maine.triggers.some((t) => t.event === 'final_crossroads')).toBe(true);
    });

    it('turns every step into a scene', () => {
        for (const step of JOURNEY) expect(sceneForStep(step)[0]).toBeTruthy();
    });

    it('takes the roadside detour only after Event 8 with "left the wilderness" set', () => {
        expect(detourFor('maine', 'event8_fall', { leftWilderness: true })).toBe('roadside');
        expect(detourFor('maine', 'event8_fall', { leftWilderness: false })).toBe(null);
        expect(detourFor('maine', 'event7_river', { leftWilderness: true })).toBe(null);
        for (const d of DETOURS) {
            expect(MAPS[d.goTo]).toBeDefined();
            expect(EVENTS[d.afterEvent]).toBeDefined();
        }
        expect(MAPS.roadside.autoEvent).toBe('final_crossroads');
    });

    it('places every event on a map exactly once (the Final Crossroads twice: Maine and the roadside)', () => {
        const counts = {};
        const add = (id) => { counts[id] = (counts[id] ?? 0) + 1; };
        for (const m of Object.values(MAPS)) {
            new Set((m.npcs ?? []).filter((n) => n.talk).map((n) => n.talk)).forEach(add);
            (m.triggers ?? []).forEach((t) => add(t.event));
            if (m.autoEvent) add(m.autoEvent);
        }
        for (const id of Object.keys(EVENTS)) {
            expect(counts[id] ?? 0, id).toBe(id === 'final_crossroads' ? 2 : 1);
        }
    });
});
