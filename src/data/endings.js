// The four endings (Scenes 13-16). Source of truth: docs/scene-outline.md,
// "The Four Endings", then docs/story.md, "Endings". Ending conditions live in
// src/state/endings.js and are unchanged.
// Lines marked // DOC are quoted from the docs; the rest is new writing for
// Milestone 5.
//
// Each ending has:
//   name      shown on the ending card
//   steps     3-4 boxes of narration and Katz dialogue (same step format as the
//             events; `when` gets gameState.snapshot plus `final`, the Final
//             Crossroads choice or null)
//   katzLine  the final Katz line on the Journey card, by Bond band
//             (warm 7+, neutral 5-6, sarcastic 4 or less; scene outline:
//             Bond-based variation covers Katz's final line)
//   lesson    the theme, in italics on the card (DOC)
//
// No ending is "the right one". Each is written as its own honest version of
// success (or of its cost), so players finish with different readings.
// EndingScene shows this data in the full template (illustration `art`, Journey card,
// Walk Again, See Endings Found) around this data.

// Design blueprint, Transitions: an early ending (from the checks after Events
// 5 and 8) first shows a slow fade and this line.
export const EARLY_ENDING_LINE = "And that's where the trail ended for us."; // DOC

export const ENDINGS = {
    // Scene 13. Bond 2 or less at any check.
    brokenPartnership: {
        name: 'Broken Partnership',
        art: 'busStop', // blueprint: a bus stop
        steps: [
            { narrate: "After one argument too many, Katz buys a bus ticket at the next road crossing. He doesn't make a speech. He just gets on." },
            { say: 'katz', text: "It's not the trail. It's... okay, it's a little the trail. Look after yourself." },
            { narrate: 'You walk on alone for a day. The trail is very quiet without someone complaining about it. You go home too.' },
            { narrate: 'Weeks later a postcard arrives from Katz. No message, just a drawing of a raccoon holding a bagel. Maybe there is something left to fix.' }
        ],
        katzLine: 'Tell the raccoon I said hi.', // Bond is always low here: one line
        lesson: 'No goal is worth more than the people you take with you.' // DOC
    },

    // Scene 14. Stamina or Supplies 0, Morale 2 or less at a check, or "Let's go home".
    earlyDeparture: {
        name: 'Early Departure',
        art: 'motel', // a motel bed covered in maps
        steps: [
            { narrate: "A motel near a trailhead. The map is spread across the bed, and you're staring at how much of it is left." },
            { narrate: 'Katz puts his finger on Georgia instead, and drags it north, slowly, over every mile behind you.' },
            { say: 'katz', text: 'We walked from there to here. On purpose. Who does that?' }, // DOC
            // Outline: if Bond is high, Katz is the one comforting the Hiker.
            { narrate: "Tonight he's the one doing the comforting. You can't remember when that started, only that it did.", when: (s) => s.bond >= 7 },
            // Hazel's line, echoed (continuity rules).
            { narrate: "You think of Hazel and the quitting you don't do. You didn't quit on each other. That part, you finished.", when: (s) => s.bond >= 5 },
            { narrate: "You think of Hazel and the quitting you don't do. You still aren't sure which kind of stopping this is. Maybe it's allowed to be both.", when: (s) => s.bond < 5 }
        ],
        katzLine: {
            warm: "Same time next year? I'll bring the suitcase.",
            neutral: 'Two thousand miles was always a ridiculous number.',
            sarcastic: "Well. At least we're not walking."
        },
        lesson: "Stopping isn't the same as failing; the trail was harder than your plans." // DOC
    },

    // Scene 15. "Summit or nothing" with Stamina 5+, Supplies 3+, Bond 5+ and neither flag.
    finishedTrail: {
        name: 'Finished Trail',
        art: 'summit', // a summit at sunrise
        steps: [
            { narrate: 'You reach the summit at sunrise, legs shaking, above a sea of clouds. Katz complains the whole way up.' }, // close to story.md
            { narrate: 'At the top he falls completely silent. You take one photo, and neither of you can say anything for a while.' },
            { narrate: "Sunshine is already there, cheering. For once you don't wonder how long ago she got here." },
            { narrate: "Back in Georgia you'd have counted the miles. Now you think of Hazel: it was never about the walking. It was the quitting you didn't do, mostly on each other." }
        ],
        katzLine: { // Bond is always 5+ here
            warm: "Two thousand miles. I'd complain, but I'm busy being amazed.",
            neutral: 'Great. Now how do we get down?'
        },
        lesson: 'Preparation, care for each other and stubbornness can carry you through.' // DOC
    },

    // Scene 16. "Our way", the summit without the stats, or either flag.
    changedRoute: {
        name: 'Changed Route',
        art: 'lakeshore', // a lakeshore
        steps: [
            // Tried for the summit without what it takes: the turn-around is shown, not skipped.
            { narrate: 'You try for the summit. Halfway up you both stop, look at each other, and turn around without a word. It is the first plan you have changed together.', when: (s) => s.final === 'summit' },
            { narrate: "You don't finish the trail as planned. Instead you go back for the stretches that meant something, and walk them at your own pace.", when: (s) => !s.leftWilderness },
            { narrate: "Katz's ankle takes two weeks to heal. Then you go back for the stretches that meant something, and walk them at your own pace.", when: (s) => s.leftWilderness },
            { narrate: "You even go back for the hundred miles of Virginia you skipped. They're boring. You love them anyway.", when: (s) => s.skippedAhead },
            { narrate: "It ends on a quiet lakeshore, watching the leaves fall. It isn't the trip you planned. It's better." }, // close to story.md
            { say: 'katz', text: "So we didn't hike the whole thing. We hiked our thing." }, // DOC
            { narrate: 'Somewhere in your pack is the old spreadsheet, soft as cloth from the rain. You never did fill in the last column.' }
        ],
        katzLine: {
            warm: 'Best walk I ever didn\'t finish.',
            neutral: 'Our thing. I still think we deserve a trophy.',
            sarcastic: "Fine. It was good. Don't tell anyone I said that."
        },
        lesson: 'Growth comes from changing your goals when reality changes, not from forcing the original plan.' // DOC
    }
};

// Turns an ending into an event the dialogue overlay can play.
export function endingEvent(id) {
    return { id: `ending_${id}`, steps: ENDINGS[id].steps };
}

// The final Katz line for an ending and Bond band ('warm' | 'neutral' | 'sarcastic').
export function katzFinalLine(id, band) {
    const line = ENDINGS[id].katzLine;
    return typeof line === 'string' ? line : line[band] ?? line.neutral;
}

// The Endings Found list: every ending in order, unfound ones as "???".
export function endingsFoundList(foundIds = []) {
    return Object.entries(ENDINGS).map(([id, e]) => {
        const found = foundIds.includes(id);
        return { id, found, name: found ? e.name : '???', lesson: found ? e.lesson : '' };
    });
}
