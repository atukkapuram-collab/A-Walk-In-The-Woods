// Act IV events: Maine, the Hundred-Mile Wilderness (book chapters 19-21).
// Source of truth: docs/scene-outline.md (Scenes 16-19), then docs/story.md.
// Choices and stat effects are exactly the outline's. Lines marked // DOC are
// quoted from the docs word for word; every other line is new writing for
// Milestone 13 that paraphrases the book (the owner reviews it).
// (verify) marks a book fact to check. Format: see the top of act1.js.
//
// Narrator voice in Act IV: honest and reflective. Bryson's fear has moved
// from fear of the woods (Act I) to fear for Katz (E13). Katz's tone follows
// Bond; his drinking is part of his story and is never a joke.

const picked = (s, eventId, optionId) => s.choices?.[eventId] === optionId;
const warm = (s) => s.bond >= 7;
const sharp = (s) => s.bond <= 4;
const neutral = (s) => !warm(s) && !sharp(s);

// Scene 16: the Reunion (Chapter 19). No choice. Plays as the Maine map starts.
export const reunion = {
    id: 'reunion',
    scene: 16,
    map: 'maine',
    steps: [
        // (verify) how and where they meet up in Maine.
        { narrate: 'Maine. Katz arrives with a pack on his back and a doubtful expression, looking around as if someone had promised him a hotel.' },
        { say: 'katz', text: 'Bryson! Look at this. Trees. I missed trees. I never thought I would say that sentence.', when: warm },
        { say: 'katz', text: 'So. More woods. You really know how to show a guy a good time.', when: neutral },
        { say: 'katz', text: "Well. I'm here. Let's not make a thing of it.", when: sharp },
        // (verify) what the book says about his drinking between the two trips.
        { say: 'katz', text: "I should tell you. It's been a rough few months. I had a drink. More than one. I'm back off it now." },
        { narrate: 'He says it to the trees, not to me. I tell him I am glad he came. It is all I can think of, and it is true.' },
        { narrate: 'Ahead lies the Hundred-Mile Wilderness: no towns, no shops, no way out but the way through. We set off.' }
    ]
};

// Scene 17: E12, The River (Chapter 20).
export const e12River = {
    id: 'e12_river',
    scene: 17,
    map: 'maine',
    steps: [
        { narrate: 'Dark lakes, wet roots and silence. It is the most beautiful place I have ever been uneasy in.' },
        { narrate: 'Then a river: wide, fast and very cold, with no bridge. The far bank is close enough to see and far enough to worry about.' },
        { say: 'katz', text: "Okay. Arms locked, eyes front, nobody drowns. I've been practicing that speech.", when: warm },
        { say: 'katz', text: "So we're swimming now. Great. Nobody mentioned swimming.", when: neutral },
        { say: 'katz', text: 'Go on. Tell me what the guidebook says about rivers.', when: sharp },
        {
            choose: [
                {
                    id: 'ford',
                    text: 'Ford it together, arms locked.', // DOC
                    // Outline: if Stamina is 3 or less before the choice, also Supplies -1.
                    effects: (s) => (s.stamina <= 3 ? { bond: +1, stamina: -1, supplies: -1 } : { bond: +1, stamina: -1 }),
                    result: (s) => (s.stamina <= 3
                        ? 'Halfway across my tired legs give way. Katz hangs on to me, but the current takes a food bag.'
                        : 'Cold to the bone, arm in arm, one step at a time. On the far bank Katz is laughing like an idiot, and so am I.')
                },
                {
                    id: 'wait',
                    text: 'Camp and wait for the water to drop.', // DOC
                    effects: { supplies: -2, morale: -1 },
                    result: 'Two days of noodles, watching the water. It drops in the end. So does the mood.'
                },
                {
                    id: 'upstream',
                    text: 'Take the long way upstream.', // DOC
                    effects: { stamina: -1, miles: 'minus' },
                    result: 'Miles of bog and fallen trees to find a place to cross. My feet will be bringing this up later.'
                }
            ]
        }
    ]
};

// Scene 18: E13, Katz Is Lost (Chapters 20-21). Fourth ending check.
// Whatever you pick, Katz turns up the next day on a logging road. (These
// steps follow each option's result card; `searched` adds his thank-you.)
// (verify) how he got lost and what he threw away.
const found = (searched = false) => [
    { narrate: 'The next day he is there: sitting on a rock by a logging road, scratched, filthy and alive. He left the trail to find water and could not find it again.' },
    { say: 'katz', text: 'I threw my water bottle away. Before I got lost. It was heavy. I know. I know.' },
    ...(searched ? [{ say: 'katz', text: "I heard you out there, half the night. Yelling like a moose. Don't ever stop doing that." }] : []),
    { narrate: 'I am so relieved I cannot speak. Then I can, and I use most of the words I know.' }
];

export const e13KatzIsLost = {
    id: 'e13_katz_is_lost',
    scene: 18,
    map: 'maine',
    night: true,
    endingCheck: true,
    steps: [
        { narrate: 'Late in a long, hot day, I stop to wait for Katz. He has fallen behind, as usual. Ten minutes pass. Then thirty. Then an hour.' },
        { narrate: 'I walk back along the trail, calling his name. Nothing. Just trees, and the light going.' },
        { narrate: 'In Georgia I was afraid of bears. I would take a bear now, gladly, in exchange for one complaint from Katz.' },
        {
            choose: [
                {
                    id: 'search',
                    text: 'Search off-trail at dusk.', // DOC
                    effects: { stamina: -2, bond: +2 },
                    result: 'I crash through the woods till long after dark, shouting myself hoarse. I do not find him. I do not stop.',
                    after: found(true)
                },
                {
                    id: 'wait',
                    text: 'Wait at the agreed spot overnight.', // DOC
                    effects: { morale: -2, supplies: -1 },
                    result: 'I sit by the trail all night with the stove lit, listening. It is the longest night of the whole walk.',
                    after: found()
                },
                {
                    id: 'hikeOut',
                    text: 'Hike out to a road for help.', // DOC
                    effects: { bond: -1, morale: -1 },
                    flags: { leftWilderness: true },
                    result: 'I walk out to a logging road in the dark to find someone, anyone. It means leaving him in there.',
                    after: found()
                }
            ]
        }
    ]
};

// Scene 19: the Final Crossroads (Chapter 21), on the logging road, or at
// the roadside if E13 left the wilderness. The narration sums up the journey
// from the stats; the thresholds match the "Summit or nothing" rule (Stamina
// 5+, Supplies 3+, Bond 5+) so the words hint at what the summit will need.
export const finalCrossroads = {
    id: 'final_crossroads',
    scene: 19,
    map: 'maine',
    steps: [
        // Where.
        { narrate: 'A logging road cuts across the trail. Katahdin, the end of it all, is still a long way north, blue and enormous on the horizon.', when: (s) => !s.leftWilderness },
        { narrate: 'The logging road, the morning after. Somewhere far to the north, beyond all those trees, is Katahdin and the end of the trail.', when: (s) => s.leftWilderness },
        { say: 'driver', text: 'You boys look about done. I can run you into town, if you want. No charge for the pitiful.' },
        // Bodies.
        { narrate: 'My legs are trail legs now. The hills that flattened me in Georgia are only hills.', when: (s) => s.stamina >= 5 },
        { narrate: 'We are spent. Every step today was a negotiation, and I lost most of them.', when: (s) => !(s.stamina >= 5) },
        // Food.
        { narrate: 'There is food for a few more days, if nobody looks too hard at the snack cakes.', when: (s) => s.supplies >= 3 },
        { narrate: 'The food bags are nearly empty. Breakfast was half a candy bar and a long look at the sky.', when: (s) => !(s.supplies >= 3) },
        // Trust.
        { narrate: 'Katz stands beside me, shoulder to shoulder, looking where I am looking.', when: warm },
        { narrate: 'Katz stands a few feet off, close enough to talk, if either of us wanted to.', when: neutral },
        { narrate: 'Katz stands on the far side of the road. We have both become good at silence.', when: sharp },
        // Callbacks: Katz remembers.
        { say: 'katz', text: 'For the record, I am still thinking about last night. Out there on my own. Just so you know.', when: (s) => picked(s, 'e13_katz_is_lost', 'hikeOut') },
        { say: 'katz', text: 'Or we rent a car. Worked great in Tennessee.', when: (s) => s.skippedAhead },
        { say: 'katz', text: 'So what now?' }, // DOC
        {
            choose: [
                { id: 'summit', text: '"Summit or nothing."', final: 'summit' }, // DOC
                { id: 'home', text: '"Let\'s go home."', final: 'home' }, // DOC
                { id: 'ourWay', text: '"Let\'s finish it our way."', final: 'ourWay' } // DOC
            ]
        }
    ]
};

export default [reunion, e12River, e13KatzIsLost, finalCrossroads];
