import { STATS, FLAGS } from '../state/GameState.js';
import { JOURNEY } from '../data/journey.js';
import { placeOfMap } from './TravelPath.js';

// Debug starts for testing without replaying the game, e.g.
//   ?debug=1&map=georgia&stats=3,3,5,6&flags=skippedAhead&done=event1_outfitter&miles=40
// Any map in src/data/maps/ works. Starting on an Act III map (Pennsylvania,
// New England) also sets katzAway, since the start skips E8 (journey `katzAway`).
// flags: skippedAhead, invited, katzAway, leftWilderness.
// stats are in the order stamina, supplies, bond, morale.
// done marks events as already played (their gates start open).
// choices sets earlier picks for callbacks: choices=event1_outfitter:katz,event5_pine_gap:katzAlone
// In debug mode, F2 on the trail opens a debug menu (state and ending checks).
export function parseDebugParams(search) {
    const p = new URLSearchParams(search);
    if (p.get('debug') !== '1') return { enabled: false };

    const debug = { enabled: true, map: p.get('map'), stats: {}, flags: {}, done: [], miles: null };

    const stats = p.get('stats');
    if (stats) {
        stats.split(',').forEach((v, i) => {
            const n = Number(v);
            if (STATS[i] && v.trim() !== '' && Number.isFinite(n)) debug.stats[STATS[i]] = n;
        });
    }
    for (const f of (p.get('flags') ?? '').split(',').filter(Boolean)) {
        if (FLAGS.includes(f)) debug.flags[f] = true;
    }
    debug.done = (p.get('done') ?? '').split(',').filter(Boolean);
    debug.choices = {};
    for (const pair of (p.get('choices') ?? '').split(',').filter(Boolean)) {
        const [eventId, optionId] = pair.split(':');
        if (eventId && optionId) debug.choices[eventId] = optionId;
    }
    if (p.has('miles') && Number.isFinite(Number(p.get('miles')))) debug.miles = Number(p.get('miles'));
    return debug;
}

// Flags a debug start at `mapKey` implies: Katz is away on the Act III maps.
export function impliedFlagsForMap(mapKey, journey = JOURNEY) {
    const step = journey.find((s) => s.type === 'map' && s.map === mapKey);
    return step?.katzAway ? { katzAway: true } : {};
}

// Applies a parsed debug start to a fresh GameState.
export function applyDebugStart(state, debug) {
    for (const f of Object.keys(impliedFlagsForMap(debug.map))) state.setFlag(f, true);
    if (debug.map) state.trailPos = placeOfMap(debug.map); // the travel map starts from here
    for (const [k, v] of Object.entries(debug.stats)) state.set(k, v);
    for (const f of Object.keys(debug.flags)) state.setFlag(f, true);
    debug.done.forEach((id) => state.markDone(id));
    for (const [id, optionId] of Object.entries(debug.choices ?? {})) state.recordChoice(id, optionId);
    if (debug.miles !== null) state.set('miles', debug.miles);
}

export const DEBUG = typeof location !== 'undefined' ? parseDebugParams(location.search) : { enabled: false };
