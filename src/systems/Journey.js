import { JOURNEY, DETOURS } from '../data/journey.js';
import { gameState } from '../state/GameState.js';
import { fadeTo } from './Transitions.js';

// Moves the run through src/data/journey.js. Pure decisions (no Phaser) plus
// one `go` helper that fades out and starts the right scene.

// Index of the step that shows `mapKey` (for debug starts).
export function stepIndexForMap(mapKey, journey = JOURNEY) {
    return journey.findIndex((s) => s.type === 'map' && s.map === mapKey);
}

// Where a detour sends the run after `eventId` on `mapKey`, or null.
export function detourFor(mapKey, eventId, flags, detours = DETOURS) {
    const d = detours.find((x) => x.map === mapKey && x.afterEvent === eventId && flags[x.flag]);
    return d ? d.goTo : null;
}

// Scene key and data for a journey step.
export function sceneForStep(step) {
    switch (step.type) {
        case 'map': return ['Trail', { map: step.map }];
        case 'opening': return ['Opening', {}];
        case 'act': return ['ActCard', { title: step.title, subtitle: step.subtitle }];
        case 'travel': return ['Travel', { label: step.label, miles: step.miles, line: step.line, truckLine: step.truckLine, truckIfSkipped: Boolean(step.truckIfSkipped) }];
        default: throw new Error(`Unknown journey step type "${step.type}".`);
    }
}

// Start the run at the beginning, or at a map (debug starts).
export function startJourney(scene, mapKey = null) {
    const index = mapKey ? stepIndexForMap(mapKey) : 0;
    if (mapKey && index < 0) {
        // A map outside the main order (e.g. 'roadside'): go straight there.
        gameState.journeyIndex = JOURNEY.length;
        go(scene, 'Trail', { map: mapKey }, false);
        return;
    }
    gameState.journeyIndex = index;
    go(scene, ...sceneForStep(JOURNEY[index]), false);
}

// The current step is done: go to the next one.
export function nextStep(scene) {
    gameState.journeyIndex += 1;
    const step = JOURNEY[gameState.journeyIndex];
    if (!step) throw new Error('The journey ran out of steps: the last map should end in an ending.');
    go(scene, ...sceneForStep(step));
}

// Leave the main order for a detour map (the roadside campground).
export function goToMap(scene, mapKey) {
    go(scene, 'Trail', { map: mapKey });
}

// Fade the current scene out, then start the next (src/systems/Transitions.js).
export function go(scene, key, data, fade = true) {
    fadeTo(scene, key, data, { fade });
}
