import { describe, it, expect, vi } from 'vitest';
import { sanitizeSettings, getSettings, saveSettings, textCps, DEFAULT_SETTINGS } from '../src/state/settings.js';
import { loadSave, recordEnding } from '../src/state/persistence.js';
import { endingsFoundList, ENDINGS, EARLY_ENDING_LINE } from '../src/data/endings.js';
import { OPENING_PANELS, OPENING } from '../src/data/opening.js';
import { ILLUSTRATIONS } from '../src/art/illustrations.js';
import { pointAt, pointForMiles, TRAIL_RIBBON, PLACES } from '../src/systems/TravelPath.js';
import { JOURNEY } from '../src/data/journey.js';
import { sceneForStep } from '../src/systems/Journey.js';
import { fadeTo, closeOverlay, openOverlay } from '../src/systems/Transitions.js';
import { GameState } from '../src/state/GameState.js';
import { editName, NAME_MAX } from '../src/systems/NameEntry.js';

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

describe('name entry', () => {
    const type = (keys) => keys.reduce(editName, '');

    it('takes letters, spaces, hyphens and apostrophes; Backspace deletes', () => {
        expect(type(['A', 'n', 'n', ' ', 'O', "'", 'B', '-', 'x', 'Backspace'])).toBe("Ann O'B-");
    });

    it(`ignores other keys, a leading space, and anything past ${NAME_MAX} characters`, () => {
        expect(type([' ', 'Shift', 'ArrowUp', '!', 'J'])).toBe('J');
        expect(type(Array(20).fill('a')).length).toBe(NAME_MAX);
    });

    it('a new run starts as "Hiker" until named', () => {
        const s = new GameState();
        s.playerName = 'Pat';
        s.reset();
        expect(s.playerName).toBe('Hiker');
    });
});

describe('the opening panels', () => {
    it('three panels, each with a picture that exists, holding the whole opening', () => {
        expect(OPENING_PANELS.map((p) => p.art)).toEqual(['kitchen', 'phone', 'airport']);
        for (const p of OPENING_PANELS) expect(ILLUSTRATIONS[p.art], p.art).toBeTypeOf('function');
        expect(OPENING.steps).toEqual(OPENING_PANELS.flatMap((p) => p.steps));
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

    it('marks the four places in trail order', () => {
        expect(PLACES.map((p) => p.name)).toEqual(['Georgia', 'Smokies', 'Virginia', 'Maine']);
    });

    it('every travel step has a label, miles and a narrator line; the truck version follows Pine Gap', () => {
        const travel = JOURNEY.filter((s) => s.type === 'travel');
        expect(travel).toHaveLength(3);
        for (const t of travel) {
            expect(t.label).toBeTruthy();
            expect(t.miles).toBeGreaterThan(0);
            expect(t.line.length).toBeLessThanOrEqual(130);
        }
        const truck = travel.filter((t) => t.truckIfSkipped);
        expect(truck).toHaveLength(1);
        // The truck screen is the one after Virginia (where Event 5 sets "skipped ahead").
        const i = JOURNEY.indexOf(truck[0]);
        expect(JOURNEY[i - 1]).toEqual({ type: 'map', map: 'virginia' });
        expect(truck[0].truckLine.length).toBeLessThanOrEqual(130);
        expect(sceneForStep(truck[0])).toEqual(['Travel', expect.objectContaining({ truckIfSkipped: true, truckLine: truck[0].truckLine })]);
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
