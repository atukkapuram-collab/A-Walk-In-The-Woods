import { describe, it, expect, vi } from 'vitest';
import { sanitizeSettings, getSettings, saveSettings, textCps, DEFAULT_SETTINGS } from '../src/state/settings.js';
import { loadSave, recordEnding } from '../src/state/persistence.js';
import { endingsFoundList, ENDINGS, EARLY_ENDING_LINE, earlyEndingLine, endsAlone, milesLine } from '../src/data/endings.js';
import { OPENING_PANELS, OPENING } from '../src/data/opening.js';
import { ILLUSTRATIONS } from '../src/art/illustrations.js';
import { pointAt, pointForMiles, TRAIL_RIBBON, PLACES } from '../src/systems/TravelPath.js';
import { JOURNEY } from '../src/data/journey.js';
import { sceneForStep } from '../src/systems/Journey.js';
import { EVENTS } from '../src/data/events/index.js';
import { fadeTo, closeOverlay, openOverlay } from '../src/systems/Transitions.js';
import { GameState } from '../src/state/GameState.js';

// Milestone 6: menus, settings, opening, travel, endings. The Phaser scenes
// are checked in the browser; these cover the logic behind them.

function memoryStore() {
    const data = {};
    return { getItem: (k) => data[k] ?? null, setItem: (k, v) => { data[k] = String(v); } };
}

describe('settings', () => {
    it('defaults: music 70%, effects 80%, normal text', () => {
        expect(getSettings(memoryStore())).toEqual(DEFAULT_SETTINGS);
    });

    it('cleans bad values: volumes 0-1 in steps of 0.1, unknown speeds fall back', () => {
        expect(sanitizeSettings({ music: 1.7, sfx: -2, textSpeed: 'warp' })).toEqual({ music: 1, sfx: 0, textSpeed: 'normal' });
        expect(sanitizeSettings({ music: 0.33, sfx: 'loud', textSpeed: 'slow' })).toEqual({ music: 0.3, sfx: 0.8, textSpeed: 'slow' });
    });

    it('survive a reload, alongside the endings found', () => {
        const store = memoryStore();
        recordEnding('finishedTrail', store);
        saveSettings({ music: 0.2, sfx: 0, textSpeed: 'instant' }, store);
        expect(getSettings(store)).toEqual({ music: 0.2, sfx: 0, textSpeed: 'instant' });
        expect(loadSave(store).endingsFound).toEqual(['finishedTrail']);
    });

    it('text speed "instant" really is instant (the whole line at once)', () => {
        expect(textCps('instant')).toBe(Infinity);
        expect(textCps('slow')).toBeLessThan(textCps('normal'));
    });
});

describe('the opening panels', () => {
    it('four panels, each with a picture that exists; the second plays E1 (the Outfitter)', () => {
        expect(OPENING_PANELS.map((p) => p.art)).toEqual(['kitchen', 'kitchen', 'phone', 'airport']);
        for (const p of OPENING_PANELS) expect(ILLUSTRATIONS[p.art], p.art).toBeTypeOf('function');
        expect(OPENING_PANELS.map((p) => p.event ?? null)).toEqual([null, 'e1_outfitter', null, null]);
        expect(EVENTS.e1_outfitter).toBeDefined();
        expect(OPENING.steps).toEqual(OPENING_PANELS.flatMap((p) => p.steps ?? []));
    });
});

describe('the travel screen', () => {
    it('the ribbon runs from Georgia (start) to Maine (end), north-east all the way', () => {
        expect(pointAt(0)).toEqual(TRAIL_RIBBON[0]);
        expect(pointAt(1)).toEqual(TRAIL_RIBBON.at(-1));
        let prev = pointAt(0);
        for (let m = 100; m <= 2190; m += 100) {
            const p = pointForMiles(m);
            expect(p[0]).toBeGreaterThan(prev[0]);
            expect(p[1]).toBeLessThan(prev[1]);
            prev = p;
        }
        expect(pointForMiles(-50)).toEqual(TRAIL_RIBBON[0]);
        expect(pointForMiles(5000)).toEqual(TRAIL_RIBBON.at(-1));
    });

    it('marks the six places in trail order', () => {
        expect(PLACES.map((p) => p.name)).toEqual(['Georgia', 'Smokies', 'Shenandoah', 'Pennsylvania', 'White Mountains', 'Maine']);
        PLACES.slice(1).forEach((p, i) => expect(p.miles).toBeGreaterThan(PLACES[i].miles));
    });

    it('every travel step has a label, miles and a narrator line; the rental car follows the Smokies', () => {
        const travel = JOURNEY.filter((s) => s.type === 'travel');
        expect(travel).toHaveLength(5);
        for (const t of travel) {
            expect(t.label).toBeTruthy();
            expect(t.miles).toBeGreaterThan(0);
            expect(t.line.length).toBeLessThanOrEqual(130);
        }
        const car = travel.filter((t) => t.carIfSkipped);
        expect(car).toHaveLength(1);
        // The car screen is the one after the Smokies (where E6 sets "skipped ahead", Chapters 7-8).
        const i = JOURNEY.indexOf(car[0]);
        expect(JOURNEY[i - 1]).toEqual({ type: 'map', map: 'smokies' });
        expect(car[0].carLine.length).toBeLessThanOrEqual(130);
        expect(sceneForStep(car[0])).toEqual(['Travel', expect.objectContaining({ carIfSkipped: true, carLine: car[0].carLine })]);
    });

    it('every journey step type has its own scene', () => {
        const scenes = new Set(JOURNEY.map((s) => sceneForStep(s)[0]));
        expect([...scenes].sort()).toEqual(['ActCard', 'Opening', 'Trail', 'Travel']);
    });
});

describe('ending screens', () => {
    it('every ending names an illustration that exists', () => {
        for (const [id, e] of Object.entries(ENDINGS)) expect(ILLUSTRATIONS[e.art], id).toBeTypeOf('function');
    });

    it("the early-ending line is the blueprint's, word for word", () => {
        expect(EARLY_ENDING_LINE).toBe("And that's where the trail ended for us.");
        expect(earlyEndingLine(false)).toBe(EARLY_ENDING_LINE);
    });

    it('in Act III the early-ending line says "for me": Katz away, or refused or stopped at the phone call', () => {
        expect(earlyEndingLine(true)).toBe("And that's where the trail ended for me.");
        expect(endsAlone({ katzAway: true })).toBe(true);
        expect(endsAlone({ katzAway: false, at: 'e11_phone_call' })).toBe(true);
        expect(endsAlone({ katzAway: false, at: 'e13_katz_is_lost' })).toBe(false);
    });

    it("the ending card compares the player's miles with Bryson and Katz's", () => {
        expect(milesLine(1234)).toBe('You: 1,234 miles · Bryson & Katz: about 870 of 2,190');
    });

    it('only Changed Route is tagged as the book\'s ending, on the card and in Endings Found once found', () => {
        expect(ENDINGS.changedRoute.tag).toBe("The book's ending");
        expect(Object.values(ENDINGS).filter((e) => e.tag === "The book's ending")).toHaveLength(1);
        expect(endingsFoundList(['changedRoute']).map((e) => e.tag)).toEqual([null, null, null, "The book's ending"]);
        expect(endingsFoundList([]).every((e) => e.tag === null)).toBe(true);
    });

    it('Endings Found shows exactly the endings reached, in order, others as "???"', () => {
        const list = endingsFoundList(['changedRoute', 'brokenPartnership']);
        expect(list.map((e) => e.name)).toEqual(['Broken Partnership', '???', '???', 'Changed Route']);
        expect(list.filter((e) => e.found).every((e) => e.lesson)).toBe(true);
        expect(list.filter((e) => !e.found).every((e) => e.lesson === '')).toBe(true);
        expect(endingsFoundList().every((e) => e.name === '???')).toBe(true);
    });
});

// A stand-in for Phaser's scene plugin, enough for the transition helpers.
function fakeScene(key, { active = [], paused = [] } = {}) {
    const state = { active: new Set(active), paused: new Set(paused), log: [] };
    const others = {};
    const manager = {
        key,
        isActive: (k) => state.active.has(k),
        isPaused: (k) => state.paused.has(k),
        stop: (k = key) => { state.active.delete(k); state.paused.delete(k); state.log.push(`stop ${k}`); },
        start: (k) => state.log.push(`start ${k}`),
        pause: (k) => { state.active.delete(k); state.paused.add(k); state.log.push(`pause ${k}`); },
        resume: (k) => { state.paused.delete(k); state.active.add(k); state.log.push(`resume ${k}`); },
        launch: (k) => { state.active.add(k); state.log.push(`launch ${k}`); },
        bringToTop: () => {},
        get: (k) => (others[k] ??= { controls: { flush: vi.fn() } })
    };
    return { scene: manager, cameras: { main: { fadeOut: vi.fn(), once: (_, fn) => fn() } }, state, others };
}

describe('transitions and the menu stack', () => {
    it('fadeTo fades, stops every overlay and paused scene, then starts the next scene once', () => {
        const s = fakeScene('Pause', { active: ['HUD', 'Dialogue', 'Pause'], paused: ['Trail'] });
        fadeTo(s, 'Title');
        expect(s.cameras.main.fadeOut).toHaveBeenCalled();
        expect(s.state.log).toEqual(expect.arrayContaining(['stop HUD', 'stop Dialogue', 'stop Trail', 'start Title']));
        expect(s.state.log.filter((l) => l === 'start Title')).toHaveLength(1);
    });

    it('a second fadeTo while the first is still fading is ignored', () => {
        const s = fakeScene('Ending');
        s.cameras.main.once = () => {}; // the fade hasn't finished yet
        fadeTo(s, 'Title');
        fadeTo(s, 'Title');
        expect(s.cameras.main.fadeOut).toHaveBeenCalledTimes(1);
    });

    it('pause opens over the trail and dialogue; closing resumes both and drops stale key presses', () => {
        const trail = fakeScene('Trail', { active: ['Trail', 'Dialogue', 'HUD'] });
        openOverlay(trail, 'Pause', ['Trail', 'Dialogue']);
        expect(trail.state.paused).toEqual(new Set(['Trail', 'Dialogue']));
        expect(trail.state.active.has('HUD')).toBe(true);

        closeOverlay({ scene: trail.scene, pausedUnder: ['Trail', 'Dialogue'] });
        expect(trail.state.paused.size).toBe(0);
        expect(trail.others.Trail.controls.flush).toHaveBeenCalled();
        expect(trail.others.Dialogue.controls.flush).toHaveBeenCalled();
    });
});
