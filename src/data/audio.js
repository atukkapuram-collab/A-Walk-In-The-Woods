// Every sound in the game is generated in code (src/systems/Audio.js): no
// audio files, so nothing to license or credit beyond the README note.
// This file is the data: sound-effect recipes, speaker voices and the two
// original music loops. Pitches are MIDI note numbers (60 = middle C).

// Mix levels in decibels (audio-design: balance buses in dB, not raw gain).
export const MIX = {
    musicDb: -14, // music sits well under the text blips
    sfxDb: -6,
    duckDb: -6    // music drops this much while a dialogue box is open
};

// Sound effects. `notes` play one after another, `step` seconds apart.
// `vary` is the random pitch spread (± semitones) so repeats don't sound identical.
export const SFX = {
    blip: { wave: 'square', notes: [76], step: 0.03, length: 0.03, gainDb: -18, vary: 0.6 },
    move: { wave: 'triangle', notes: [81], step: 0.05, length: 0.05, gainDb: -10, vary: 0.2 },
    confirm: { wave: 'triangle', notes: [79, 86], step: 0.06, length: 0.08, gainDb: -8, vary: 0 },
    statUp: { wave: 'triangle', notes: [72, 76, 79], step: 0.07, length: 0.12, gainDb: -8, vary: 0 },
    statDown: { wave: 'triangle', notes: [67, 63], step: 0.1, length: 0.16, gainDb: -8, vary: 0 },
    honk: { wave: 'square', notes: [62, 62], step: 0.16, length: 0.12, gainDb: -14, vary: 0 }
};

// Text blips per speaker: a pitch shift in semitones, so voices are told apart.
export const VOICES = {
    narrator: -5,
    katz: -9,
    salesman: -2,
    maryEllen: 9,
    hiker: 0,
    clerk: -3,
    daytripper: 5,
    driver: -6
};

// The music loops (original, written for this game). Each bar is one
// chord (MIDI notes) and four beats of melody (null = rest). Bass plays the
// chord's lowest note on beats 1 and 3.
export const MUSIC = {
    // On the trail: an easy walking tune in G major.
    trail: {
        bpm: 84,
        bars: [
            { chord: [43, 59, 62, 67], melody: [71, 74, 76, 74] },   // G
            { chord: [40, 59, 64, 67], melody: [71, null, 67, 69] }, // Em
            { chord: [36, 60, 64, 67], melody: [76, 74, 72, 71] },   // C
            { chord: [38, 62, 66, 69], melody: [69, null, 74, null] }, // D
            { chord: [43, 59, 62, 67], melody: [71, 74, 79, 76] },   // G
            { chord: [36, 60, 64, 67], melody: [76, 74, 72, 71] },   // C
            { chord: [38, 62, 66, 69], melody: [69, 71, 69, 66] },   // D
            { chord: [43, 59, 62, 67], melody: [67, null, null, null] } // G
        ]
    },
    // Act III, alone: the walking tune's slower, emptier cousin in A minor.
    alone: {
        bpm: 72,
        bars: [
            { chord: [45, 60, 64, 69], melody: [76, null, 72, null] },  // Am
            { chord: [41, 60, 65, 69], melody: [74, null, 72, 69] },    // F
            { chord: [36, 60, 64, 67], melody: [67, null, null, 72] },  // C
            { chord: [43, 59, 62, 67], melody: [71, null, 67, null] },  // G
            { chord: [45, 60, 64, 69], melody: [76, null, 79, 76] },    // Am
            { chord: [41, 60, 65, 69], melody: [77, 76, 74, null] },    // F
            { chord: [40, 59, 64, 68], melody: [71, null, 68, null] },  // E
            { chord: [45, 60, 64, 69], melody: [69, null, null, null] } // Am
        ]
    },
    // Maine, the Hundred-Mile Wilderness: wide and slow, in E minor.
    wilderness: {
        bpm: 60,
        bars: [
            { chord: [40, 59, 64, 67], melody: [71, null, null, 74] },  // Em
            { chord: [36, 60, 64, 67], melody: [76, null, 74, null] },  // C
            { chord: [43, 59, 62, 67], melody: [71, null, 67, null] },  // G
            { chord: [38, 62, 66, 69], melody: [69, null, null, null] }, // D
            { chord: [40, 59, 64, 67], melody: [79, null, 78, 76] },    // Em
            { chord: [36, 60, 64, 67], melody: [76, null, 74, 72] },    // C
            { chord: [38, 62, 66, 69], melody: [74, null, 69, null] },  // D
            { chord: [40, 59, 64, 67], melody: [71, null, null, null] } // Em
        ]
    },
    // Title, opening and endings: a slower campfire tune in D major.
    home: {
        bpm: 66,
        bars: [
            { chord: [38, 62, 66, 69], melody: [74, null, 78, null] },  // D
            { chord: [35, 62, 66, 71], melody: [76, null, 74, null] },  // Bm
            { chord: [43, 62, 67, 71], melody: [71, null, 74, 76] },    // G
            { chord: [45, 61, 64, 69], melody: [73, null, null, null] }, // A
            { chord: [38, 62, 66, 69], melody: [78, null, 81, null] },  // D
            { chord: [43, 62, 67, 71], melody: [79, 78, 76, null] },    // G
            { chord: [45, 61, 64, 69], melody: [76, null, 73, null] },  // A
            { chord: [38, 62, 66, 69], melody: [74, null, null, null] } // D
        ]
    }
};

// Trail maps can choose their own loop with `music` in the map data
// (Milestone 14: 'alone' in Act III, 'wilderness' in Maine); others play 'trail'.
// Which loop each scene plays (scenes not listed keep whatever is playing).
export const SCENE_MUSIC = {
    Title: 'home',
    Opening: 'home',
    Ending: 'home',
    ActCard: 'trail',
    Travel: 'trail',
    Trail: 'trail'
};
