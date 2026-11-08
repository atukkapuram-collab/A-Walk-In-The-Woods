// Numbers that set how the game feels. Change them here, not in code.
// Later milestones add miles values, text speeds and so on.
export const TUNING = {
    // Milliseconds to walk one tile. The trail is meant to feel unhurried,
    // and there is no running (design blueprint, Exploration).
    stepMs: 200,

    // Typewriter speed in characters per second: "normal". Settings offer
    // the three speeds below (Infinity = the whole line appears at once).
    textCps: 45,
    textSpeeds: { slow: 25, normal: 45, instant: Infinity },

    // Fade to black and back, used for every scene change (design blueprint, Transitions).
    fadeMs: 350,
    // Act title cards stay up this long (blueprint: about 2 seconds).
    actCardMs: 2200,
    // The travel screen strip (blueprint: 4-5 seconds).
    travelMs: 4500,

    // Tutorial hints on Map 1: the walk hint hides after this many steps,
    // then the talk hint shows until the first conversation.
    hintSteps: 3,

    // What the docs' "Miles +", "Miles −", "slower pace" and "Miles + (big)"
    // mean in miles. The docs leave the numbers open (plan, section 8) and
    // miles never decide an ending, so these are free to change.
    // 'big' is Pine Gap's truck, which goes 100 miles north in the story.
    // 'slow' (a slower pace) is a small loss, so the result card shows it as a cost.
    miles: { plus: 20, minus: -10, slow: -5, big: 100 }
};
