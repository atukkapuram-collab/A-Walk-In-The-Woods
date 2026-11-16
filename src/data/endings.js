// The four endings (Scenes 20-23). Source of truth: docs/scene-outline.md,
// "The Four Endings", then docs/story.md, "Endings". Ending conditions live in
// src/state/endings.js and are unchanged.
// Lines marked // DOC are quoted from the docs; the rest is new writing for
// Milestone 13 that paraphrases the book (the owner reviews it).
//
// Each ending has:
//   name      shown on the ending card
//   tag       (Changed Route only) "The book's ending"; (Finished Trail) "What if"
//   art       the full-screen illustration (src/art/illustrations.js)
//   steps     3-5 boxes of narration and Katz dialogue (same step format as the
//             events). `when` gets gameState.snapshot plus:
//               final  the Final Crossroads choice, or null for a mid-trip check
//               at     the event whose check ended the walk (e.g. 'e11_phone_call')
//   katzLine  the final Katz line on the Journey card, by Bond band
//             (warm 7+, neutral 5-6, sarcastic 4 or less)
//   lesson    the theme, in italics on the card (DOC)
//
// Changed Route is the book's own ending; the others are "what ifs". No ending
// is "the right one": each is written as its own honest version of success
// (or of its cost).

// Design blueprint, Transitions: an early ending (from a mid-trip check) first
// shows a slow fade and this line; "for me" while Katz is away (Act III).
export const EARLY_ENDING_LINE = "And that's where the trail ended for us."; // DOC
export const EARLY_ENDING_LINE_ALONE = "And that's where the trail ended for me."; // DOC ("for me" in Act III)
export const earlyEndingLine = (alone) => (alone ? EARLY_ENDING_LINE_ALONE : EARLY_ENDING_LINE);

// The ending card compares the player's miles with the book's (docs/story.md).
export const BOOK_MILES = 870;
export const TRAIL_MILES_TOTAL = 2190;
export const milesLine = (miles) => `You: ${miles.toLocaleString('en-US')} miles · Bryson & Katz: about ${BOOK_MILES} of ${TRAIL_MILES_TOTAL.toLocaleString('en-US')}`;

const atPhone = (s) => s.at === 'e11_phone_call';
// Is Bryson on his own when the walk ends? Katz is home in Iowa from E8 until
// the Reunion; the phone call (E11) clears katzAway, but he is still in Iowa.
export const endsAlone = (s) => Boolean(s.katzAway) || atPhone(s);
const atAirport = (s) => s.at === 'e8_katz_goes_home';

export const ENDINGS = {
    // Scene 20. Bond 2 or less at any check.
    brokenPartnership: {
        name: 'Broken Partnership',
        art: 'parcel', // blueprint: an empty trail with a parcel
        steps: [
            // Where it broke: on the phone (E11), at the airport (E8), or on the trail.
            { narrate: 'Katz does not come to Maine. I go to the Hundred-Mile Wilderness without him, and last three days.', when: atPhone },
            { narrate: 'Katz flies home, and this time he does not answer when I call. I go back to the trail without him.', when: atAirport },
            { narrate: 'At the next road Katz gets a ride out. He does not make a speech. He just lifts a hand, and goes.', when: (s) => !atPhone(s) && !atAirport(s) },
            { narrate: 'I walk on alone for a day. The woods are very quiet without someone complaining about them. Then I go home too.' },
            { narrate: 'Weeks later a package arrives from Des Moines. Inside is one Little Debbie snack cake, slightly squashed. No note.' },
            { narrate: 'I put it on the shelf above my desk. Maybe there is something left to fix.' }
        ],
        katzLine: 'Look after yourself out there.', // Bond is always low here: one line
        lesson: 'No goal is worth more than the person you take with you.' // DOC
    },

    // Scene 21. Stamina or Supplies 0, Morale 2 or less at a check, or "Let's go home".
    earlyDeparture: {
        name: 'Early Departure',
        art: 'motel', // a motel bed covered in maps
        steps: [
            // Together.
            { narrate: 'A motel near the trail. The map is spread across the bed, and I am staring at how much of it is left.', when: (s) => !endsAlone(s) },
            { narrate: 'Katz puts his finger on Georgia instead, and drags it slowly north, over every mile behind us.', when: (s) => !endsAlone(s) },
            // Katz is home in Iowa (Act III): Bryson makes the call himself.
            { narrate: 'A motel near the trail, alone. The map is spread across the bed, and I am staring at how much of it is left. I pick up the phone.', when: endsAlone },
            { narrate: 'Katz listens to all of it. Then he asks where we started, and where I am standing now.', when: endsAlone },
            { say: 'katz', text: 'We walked from there to here. On purpose.' }, // DOC
            // Outline: if Bond is high, Katz is the one comforting Bryson.
            { narrate: 'He is the one doing the comforting. I cannot remember when that started, only that it did.', when: (s) => s.bond >= 7 },
            { narrate: 'Stopping, I decide, is not the same as failing. The trail was simply bigger than my plans for it.' }
        ],
        katzLine: {
            warm: "Same time next year? I'll bring the snack cakes.",
            neutral: 'Two thousand miles was always a ridiculous number.',
            sarcastic: "Well. At least we're not walking."
        },
        lesson: 'Stopping is not the same as failing.' // DOC
    },

    // Scene 22. "Summit or nothing" with Stamina 5+, Supplies 3+, Bond 5+ and neither flag.
    finishedTrail: {
        name: 'Finished Trail',
        tag: 'What if',
        art: 'summit', // Katahdin's summit sign at sunrise
        steps: [
            { narrate: 'Katahdin, at sunrise. We climb the last mile on shaking legs, above a sea of cloud. Katz complains the whole way up.' },
            { narrate: 'At the summit sign he goes completely silent. We take one photograph, and for a while neither of us can say anything.' },
            { narrate: 'This is the version the book does not have. In the real one, two tired men walked out of these woods a long way short of here.' },
            { narrate: 'And still it is not the sign I will remember. It is the walk, and the man I walked it with.' }
        ],
        katzLine: { // Bond is always 5+ here
            warm: "All of it. I'd complain, but I'm busy being amazed.",
            neutral: 'Great. Now how do we get down?'
        },
        lesson: 'Preparation, care and stubbornness can carry you all the way.' // DOC
    },

    // Scene 23. "Our way", the summit without the stats, or any flag. The book's ending.
    changedRoute: {
        name: 'Changed Route',
        tag: "The book's ending", // DOC
        art: 'loggingRoad', // the logging road out of the woods
        steps: [
            // Tried for the summit without what it takes: the turn-around is shown, not skipped.
            { narrate: 'We set off for Katahdin anyway. A few miles on we both stop, look at each other, and turn round without a word.', when: (s) => s.final === 'summit' },
            { narrate: 'We walk out of the woods on the logging road, and the man in the pickup runs us into town. And that, it turns out, is that.' },
            { narrate: 'Later I add up the miles. It is a long way short of 2,190, even counting the ones we drove. I find I do not mind.', when: (s) => s.skippedAhead },
            { narrate: 'Later I add up the miles. It is a long way short of 2,190. I find, to my surprise, that I do not mind.', when: (s) => !s.skippedAhead },
            { narrate: 'We learned the woods. We learned what we could do, and what we could not. And we did it together.' },
            { narrate: '"We hiked the Appalachian Trail," I tell Katz. He looks at me for a moment. "Yeah," he says. "We did."' } // DOC (the quoted line)
        ],
        katzLine: {
            warm: 'Best walk I never finished.',
            neutral: 'We hiked it. I still think we deserve a trophy.',
            sarcastic: "Fine. It was good. Don't tell anyone I said that."
        },
        lesson: 'The trail humbles the plan; the honest attempt is the success.' // DOC
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
// A found ending also shows its tag ("The book's ending").
export function endingsFoundList(foundIds = []) {
    return Object.entries(ENDINGS).map(([id, e]) => {
        const found = foundIds.includes(id);
        return { id, found, name: found ? e.name : '???', lesson: found ? e.lesson : '', tag: found ? e.tag ?? null : null };
    });
}
