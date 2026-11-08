// Act II events (Great Smoky Mountains and Virginia). Source of truth:
// docs/scene-outline.md (Scenes 5-9), then docs/story.md. Choices and stat
// effects are exactly the outline's. Lines marked // DOC are quoted from the
// docs word for word; every other line is new writing for Milestone 5.
// Format: see the top of act1.js.
//
// Narrator voice in Act II: still the planner, but starting to notice the
// scenery, the people and Katz, and more willing to bend.
// Katz's tone follows Bond (warm 7+, neutral 5-6, sharper 4 or less); only the
// line changes, never the branch.

const picked = (s, eventId, optionId) => s.choices?.[eventId] === optionId;
const warm = (s) => s.bond >= 7;
const sharp = (s) => s.bond <= 4;
const neutral = (s) => !warm(s) && !sharp(s);

// Scene 5: Event 3, Whiteout.
export const event3Whiteout = {
    id: 'event3_whiteout',
    scene: 5,
    map: 'smokies',
    steps: [
        { narrate: 'The Smokies. One minute the ridges are green; the next the sky goes white and it is snowing sideways. In May. Your guidebook calls this "unusual."' },
        { narrate: 'The shelter ahead is packed, and Dale is inside giving a lecture on sock layering.' },
        // Dale remembers what you bought at the outfitter (Event 1).
        { say: 'dale', text: 'That pack has its own weather system. Anyway: liner sock, wool sock, bread bag. Trust the system.', when: (s) => picked(s, 'event1_outfitter', 'buyAll') },
        { say: 'dale', text: 'Toothbrush buddy! Liner sock, wool sock, bread bag. Trust the system.', when: (s) => picked(s, 'event1_outfitter', 'ultralight') },
        { say: 'dale', text: 'Liner sock, wool sock, bread bag. And no, a hammock is not a shelter.', when: (s) => !picked(s, 'event1_outfitter', 'buyAll') && !picked(s, 'event1_outfitter', 'ultralight') },
        { say: 'katz', text: "There's a side trail down to a road. Roads have towns. Towns have pancakes. I'm just saying the word \"pancakes.\"" },
        {
            choose: [
                {
                    id: 'wait',
                    text: 'Wait it out in the shelter.', // DOC
                    effects: { stamina: +1, morale: -1 },
                    result: 'You survive the storm and the sock lecture, barely.', // DOC
                    after: [{ say: 'katz', text: 'I now know more about socks than about my own family.' }]
                },
                {
                    id: 'push',
                    text: 'Push on to the next shelter.', // DOC
                    effects: { miles: 'plus', stamina: -2 },
                    result: 'Brutal, but you feel tougher.', // DOC
                    after: [{ narrate: 'Somewhere in the white you notice the rhododendrons, pink under the snow. You almost stop to look. Almost.' }]
                },
                {
                    id: 'town',
                    text: 'Take a side trail down to a road and town.', // DOC
                    effects: { supplies: +1, miles: 'minus' },
                    result: 'Warm, dry, and the first hint that the plan can bend.', // DOC
                    after: [{ say: 'katz', text: 'Pancakes. I would like it noted that I was right.' }]
                }
            ]
        }
    ]
};

// Scene 6: Event 4, Night Visitor. The raccoon is revealed whichever you pick.
export const event4NightVisitor = {
    id: 'event4_night_visitor',
    scene: 6,
    map: 'smokies',
    night: true,
    steps: [
        { narrate: 'Night. Something is snuffling outside the tent. Something with claws, judging by the scratching.' },
        { say: 'katz', text: "That's a bear. I'm going to be famous. \"Local Man Eaten. Friend Fine.\"" },
        { say: 'katz', text: 'If I die out here, tell people it was a bear. Not the hill. The bear.' }, // DOC (story.md sample line)
        {
            choose: [
                {
                    id: 'hang',
                    text: 'Get up and hang the food bag properly.', // DOC
                    effects: { stamina: -1 },
                    result: 'Safe, sensible, freezing.', // DOC
                    after: [{ narrate: 'Your flashlight finds the bear: a raccoon on a log, watching you tie knots like a judge at a competition. It waddles off, unimpressed.' }]
                },
                {
                    id: 'pots',
                    text: "Try Katz's plan: bang pots and yell.", // DOC
                    effects: { bond: +1, morale: +1, supplies: -1 },
                    result: 'It was a raccoon. It took a bagel anyway.', // DOC
                    after: [{ say: 'katz', text: "We fought off a bear. I'm counting it. It was a bear-shaped raccoon." }]
                },
                {
                    id: 'ignore',
                    text: 'Ignore it and sleep.', // DOC
                    effects: { supplies: -2 },
                    result: 'You wake to a crime scene of torn wrappers.', // DOC
                    after: [{ narrate: 'In the mud are tiny handprints. In the bushes a raccoon is finishing your bagel. It does not look sorry.' }]
                }
            ]
        }
    ]
};

// Scene 7: Event 5, Pine Gap. The biggest temptation; first ending check.
export const event5PineGap = {
    id: 'event5_pine_gap',
    scene: 7,
    map: 'virginia',
    endingCheck: true,
    steps: [
        { narrate: "Virginia. Weeks of the same hot green ridge, over and over, until Pine Gap: a diner, a hostel with real beds, and pie." },
        { narrate: "Since that side trail in the Smokies, you've known the plan can bend. Pine Gap is about to find out how far.", when: (s) => picked(s, 'event3_whiteout', 'town') },
        { narrate: 'Outside, a pickup truck is heading 100 miles north. Katz has ideas.' },
        { say: 'katz', text: 'A hundred miles north, in a truck, together. Nobody has to know. I would even let you pick the radio.', when: warm },
        { say: 'katz', text: 'That truck is going a hundred miles north. Nobody gives out medals for the boring parts.', when: neutral },
        { say: 'katz', text: "That truck's going north. You can walk if you want. You usually do what you want.", when: sharp },
        { say: 'hazel', text: "I've fed a thousand hikers who quit at this counter, and a thousand who didn't. Same pie." },
        { narrate: 'Hazel wipes the counter without looking up.' },
        { say: 'hazel', text: "Everybody thinks the trail is about the walking. It's about the quitting you don't do." }, // DOC
        {
            choose: [
                {
                    id: 'zero',
                    text: 'Take a zero day (a rest day with no miles).', // DOC
                    effects: { stamina: +2, morale: +1, miles: 'minus' },
                    result: 'Twelve hours in a real bed and pie for two meals. Your legs forgive you, slightly.'
                },
                {
                    id: 'resupply',
                    text: 'Resupply and keep going.', // DOC
                    effects: { supplies: +2, morale: -1 },
                    result: 'Pack full, spirits empty. By noon the green tunnel has swallowed you again.'
                },
                {
                    id: 'rideTogether',
                    text: 'Ride ahead with Katz to skip the "boring" part.', // DOC
                    effects: { miles: 'big', morale: +1 },
                    flags: { skippedAhead: true },
                    result: 'A hundred miles of Virginia blur past the window. Katz sings the whole way. It feels great, and a little like cheating.'
                },
                {
                    id: 'katzAlone',
                    text: 'Let Katz ride ahead alone and meet up later.', // DOC
                    effects: { bond: -2 },
                    result: 'Your miles stay honest. The trail is very quiet for three days.',
                    after: [{ say: 'katz', text: 'Truck was great. Thanks for asking.' }]
                }
            ]
        }
    ]
};

// Scene 8: Event 6, The Last Bottle. Survival against friendship.
export const event6LastBottle = {
    id: 'event6_last_bottle',
    scene: 8,
    map: 'virginia',
    steps: [
        { narrate: 'A heatwave. The ridge shimmers. The spring marked on your map is a dry hole full of dead leaves.' },
        { narrate: 'You have one liter left between you, and Katz is slowing.' }, // DOC
        { say: 'katz', text: "I'm fine. I'm walking slower to enjoy the... heat." },
        {
            choose: [
                {
                    id: 'split',
                    text: 'Split it evenly.', // DOC
                    effects: { bond: +2, stamina: -1 },
                    result: "Half a liter each. It's warm and tastes like plastic, and it's the best thing either of you has ever drunk.",
                    after: [{ say: 'katz', text: "You could've kept it. I would've kept it. Probably." }]
                },
                {
                    id: 'ration',
                    text: 'Ration it by the plan.', // DOC
                    effects: { bond: -1 },
                    result: 'The plan says one sip a mile. You hold the bottle. The supplies hold too.',
                    after: [{ say: 'katz', text: 'You sound like a gym teacher.' }] // DOC
                },
                {
                    id: 'gamble',
                    text: 'Gamble on a spring off-trail.', // DOC
                    chance: [
                        {
                            id: 'gambleWon',
                            p: 0.5,
                            effects: { morale: +2 },
                            result: 'Down a side ravine, a cold spring trickles out of the rocks. Katz puts his whole head in it.'
                        },
                        {
                            id: 'gambleLost',
                            p: 0.5,
                            effects: { stamina: -1, miles: 'minus' },
                            result: 'The side trail finds nothing but more ravine. You lose half a day climbing back out.'
                        }
                    ]
                }
            ]
        }
    ]
};

// Scene 9: the midpoint campfire. No choice; it shows what Bond has built.
export const midpointCampfire = {
    id: 'midpoint_campfire',
    scene: 9,
    map: 'virginia',
    night: true,
    steps: [
        { narrate: "A campfire on a Virginia ridge. Halfway, more or less. You notice you've stopped checking the mileage every hour." },
        // Bond 5 or more: Katz opens up.
        { say: 'katz', text: "Can I tell you something? Before you called, I hadn't finished anything in years. Jobs. Plans. Anything.", when: (s) => s.bond >= 5 },
        { say: 'katz', text: "This is the first thing I've said yes to in a long time. So. Why did you come?", when: (s) => s.bond >= 5 },
        { narrate: 'You start to give the spreadsheet answer. Then you stop, and for once you tell him the real one. It takes a while.', when: (s) => s.bond >= 5 },
        // Bond 4 or less: bus schedules.
        { narrate: 'Since Pine Gap, Katz has walked a few steps behind you. Tonight he stares at the fire for a long time.', when: (s) => s.bond <= 4 && picked(s, 'event5_pine_gap', 'katzAlone') },
        { narrate: 'Katz stares at the fire for a long time.', when: (s) => s.bond <= 4 && !picked(s, 'event5_pine_gap', 'katzAlone') },
        { say: 'katz', text: "I've been checking bus schedules. There's one from the next town on Thursdays.", when: (s) => s.bond <= 4 },
        { narrate: 'Neither of you says anything else. The silence says the rest.', when: (s) => s.bond <= 4 },
        // Both versions: Sunshine passes.
        { narrate: 'A headlamp bobs out of the dark. Sunshine, passing your camp, stops for a moment by the fire.' },
        { say: 'sunshine', text: 'Nobody walks the trail they planned. You walk the one that shows up.' } // DOC
    ]
};

export default [event3Whiteout, event4NightVisitor, event5PineGap, event6LastBottle, midpointCampfire];
