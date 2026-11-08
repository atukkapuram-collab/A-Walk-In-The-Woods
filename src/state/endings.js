// Ending checks, exactly as the scene outline and story doc define them.
// Pure functions: `state` is a snapshot like gameState.snapshot
// ({ stamina, supplies, bond, morale, miles, skippedAhead, leftWilderness }).
//
// Checks run after Event 5, after Event 8 (no final choice) and at the Final
// Crossroads (with the final choice). First match wins:
//   1. Broken Partnership: Bond 2 or less.
//   2. Early Departure:    Stamina or Supplies 0, Morale 2 or less, or "Let's go home".
//   3. Finished Trail:     "Summit or nothing" with Stamina 5+, Supplies 3+, Bond 5+,
//                          and neither flag set.
//   4. Changed Route:      everything else at the Final Crossroads.
// A mid-trip check with nothing wrong returns null: the walk goes on.

export const ENDING_IDS = ['brokenPartnership', 'earlyDeparture', 'finishedTrail', 'changedRoute'];
export const FINAL_CHOICES = ['summit', 'home', 'ourWay'];

export function checkEnding(state, finalChoice = null) {
    if (finalChoice !== null && !FINAL_CHOICES.includes(finalChoice)) {
        throw new Error(`Unknown final choice "${finalChoice}".`);
    }
    if (state.bond <= 2) return 'brokenPartnership';
    if (state.stamina <= 0 || state.supplies <= 0 || state.morale <= 2) return 'earlyDeparture';
    if (finalChoice === null) return null;
    if (finalChoice === 'home') return 'earlyDeparture';
    if (
        finalChoice === 'summit' &&
        state.stamina >= 5 && state.supplies >= 3 && state.bond >= 5 &&
        !state.skippedAhead && !state.leftWilderness
    ) {
        return 'finishedTrail';
    }
    return 'changedRoute';
}

// Shown on the ending card: Strangers 0-3, Hiking Buddies 4-6, Trail Family 7-10.
export function bondRating(bond) {
    if (bond <= 3) return 'Strangers';
    if (bond <= 6) return 'Hiking Buddies';
    return 'Trail Family';
}

// Katz's tone follows Bond (scene outline, continuity rules): warm at 7+,
// sharper at 4 or less, neutral in between.
export function bondBand(bond) {
    if (bond >= 7) return 'warm';
    if (bond <= 4) return 'sarcastic';
    return 'neutral';
}
