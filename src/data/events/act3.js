// Act III events: Alone (Pennsylvania and New England; book chapters 12-19).
// Source of truth: docs/scene-outline.md (Scenes 12-15), then docs/story.md.
// Choices and stat effects are exactly the outline's. Lines marked // DOC are
// quoted from the docs word for word; every other line is new writing for
// Milestone 12 that paraphrases the book (the owner reviews it).
// (verify) marks a book fact to check. Format: see the top of act1.js.
//
// Katz is home in Iowa for the whole act: no follower, and Bond is frozen
// until E11, the phone call (bondWhileAway).
// Narrator voice in Act III: alone, and asking what the walk is for.

const picked = (s, eventId, optionId) => s.choices?.[eventId] === optionId;

// Scene 12: Home in Hanover (Chapter 12). No choice: one fixed result card.
// Plays as the Pennsylvania map starts (the map's autoEvent).
export const homeInHanover = {
    id: 'home_in_hanover',
    scene: 12,
    map: 'pennsylvania',
    steps: [
        { narrate: 'Home in Hanover for a few weeks. I sleep in a bed, eat at a table, and stand under hot water for longer than is decent.' },
        { narrate: 'But I keep drifting to the edge of town, where the white blazes go into the trees. The trail is not finished with me.' },
        { result: 'Rested and restocked. I load the car and drive south to pick up the trail again, alone.', effects: { stamina: +1, supplies: +2 } }
    ]
};

// Scene 13: E9, Car Hiking (Chapters 12-14).
export const e9CarHiking = {
    id: 'e9_car_hiking',
    scene: 13,
    map: 'pennsylvania',
    steps: [
        { narrate: 'Pennsylvania. The trail here is famous for one thing: rocks. Mile after mile of them, tilted and loose, like walking over a dropped tray of crockery.' },
        { narrate: 'My new system is simple. I park the car, walk a piece of trail, turn round and walk back to the car. Then I drive to a motel.' },
        { narrate: 'It is easier. It is also a little hollow, and there is nobody to complain to. I had not expected to miss the complaining.' },
        {
            choose: [
                {
                    id: 'dayHike',
                    text: 'Keep day-hiking from the car.', // DOC
                    effects: { supplies: +1, morale: -2 },
                    result: 'Clean socks and a hot dinner every night. And the feeling that I am visiting the trail, not walking it.'
                },
                {
                    id: 'overnight',
                    text: 'Commit to a solo overnight section.', // DOC
                    effects: { stamina: -1, morale: +2, supplies: -1 },
                    result: 'A night alone in the woods with everything on my back. Harder, lonelier, and the first day that feels real.'
                },
                {
                    id: 'centralia',
                    text: 'Drive over to see Centralia.', // DOC
                    effects: { morale: -1 },
                    result: 'A town with almost nobody left in it, and smoke coming up through the ground. I stay longer than I meant to.',
                    after: [{ journal: 'centralia' }]
                }
            ]
        }
    ]
};

// Scene 14: E10, Mount Washington (Chapters 16-17; verify).
export const e10MountWashington = {
    id: 'e10_mount_washington',
    scene: 14,
    map: 'newengland',
    steps: [
        { narrate: 'New Hampshire: the White Mountains. Above the treeline there is only rock, cairns and sky, and I can see for sixty miles.' },
        { narrate: 'Mount Washington is not especially high. It is especially deadly. The weather here can go from sunshine to killing cold in an hour.' },
        { narrate: 'This afternoon it turns. Cloud pours over the ridge like milk, and the wind starts to push at me with both hands.' },
        {
            choose: [
                {
                    id: 'summit',
                    text: 'Go for the summit anyway.', // DOC
                    effects: { morale: +2, stamina: -2 },
                    // (verify) the summit has a road, a railway and a cafeteria.
                    result: 'I reach the top soaked, shaking and thrilled, and find a cafeteria full of people who came up by car.'
                },
                {
                    id: 'turnBack',
                    text: 'Turn back.', // DOC
                    effects: { stamina: +1, morale: -1 },
                    result: 'I go down while I still can. It is the right decision. It does not feel like one.'
                },
                {
                    id: 'hut',
                    text: 'Stay the night in a mountain hut.', // DOC
                    effects: { supplies: -1, stamina: +1 },
                    result: 'A bunk, a hot meal and a room full of strangers swapping weather stories. It costs plenty. It is worth it.'
                }
            ]
        }
    ]
};

// Scene 15: E11, The Phone Call (Chapters 18-19; verify how the Maine trip is
// arranged). Read the payphone to start it. Bond can change here although
// Katz is away; every option brings him back (katzAway cleared); third ending
// check: Bond 2 or less after the choice means Katz says no (Broken Partnership).
//
// The steps after a choice see the state from BEFORE it, so each option says
// how much Bond it adds and Katz's answer is worked out from the new Bond.
const newBond = (s, delta) => Math.max(0, Math.min(10, s.bond + delta));
const katzAnswers = (delta) => {
    const refuses = (s) => newBond(s, delta) <= 2;
    const warm = (s) => newBond(s, delta) >= 7;
    const sharp = (s) => !refuses(s) && newBond(s, delta) <= 4;
    const neutral = (s) => !refuses(s) && !warm(s) && !sharp(s);
    return [
        { say: 'katz', text: "I don't think so, Bryson. I think we said what we had to say in Virginia. Look after yourself out there.", when: refuses },
        { narrate: 'The line goes quiet. Then it is only a dial tone, and the wind in the trees.', when: refuses },
        { say: 'katz', text: "A hundred miles of nothing. You really know how to sell a vacation. I'm in.", when: warm },
        { say: 'katz', text: "Okay. Yeah. I'll come. Somebody has to carry the snack cakes.", when: neutral },
        { say: 'katz', text: "Fine. I'll come. But I'm not sharing a tent this time.", when: sharp },
        { narrate: 'Katz will fly to Maine in two weeks. I hang up and find I am grinning at a payphone.', when: (s) => !refuses(s) }
    ];
};

export const e11PhoneCall = {
    id: 'e11_phone_call',
    scene: 15,
    map: 'newengland',
    endingCheck: true,
    bondWhileAway: true,
    steps: [
        { narrate: 'A payphone at a trailhead in New Hampshire. Maine is next: the Hundred-Mile Wilderness, the hardest and loneliest stretch of the whole trail.' },
        { narrate: 'I do not want to walk it alone. I dial a number in Des Moines.' },
        // How we parted at the airport (E8) decides his first line.
        { say: 'katz', text: "Bryson! I've been walking to work. Well, part of the way. I've been in training. Sort of.", when: (s) => s.invited },
        { say: 'katz', text: "Bryson. Hey. I was hoping you'd call. Don't let that go to your head.", when: (s) => !s.invited && picked(s, 'e8_katz_goes_home', 'glad') },
        { say: 'katz', text: "Oh. It's you. I figured you'd lost the number.", when: (s) => !s.invited && picked(s, 'e8_katz_goes_home', 'sayLittle') },
        { say: 'katz', text: 'Bryson? Where are you calling from, a tree?', when: (s) => !s.invited && !picked(s, 'e8_katz_goes_home', 'glad') && !picked(s, 'e8_katz_goes_home', 'sayLittle') },
        { narrate: 'I tell him about Maine: a hundred miles with no towns, no roads and no shops. There is a long pause on the line.' },
        {
            choose: [
                {
                    id: 'missYou',
                    text: '"I miss having you out there."', // DOC
                    effects: { bond: +2, morale: -1 },
                    flags: { katzAway: false },
                    result: 'It costs me something to say it. It also happens to be true.',
                    after: katzAnswers(+2)
                },
                {
                    id: 'practical',
                    text: '"I\'ll sort out the gear and the flights."', // DOC
                    effects: { bond: +1, supplies: -1 },
                    flags: { katzAway: false },
                    result: 'I promise to book the flights and buy the gear. My wallet winces.',
                    after: katzAnswers(+1)
                },
                {
                    id: 'ifYouLike',
                    text: '"Only if you feel like it."', // DOC
                    effects: { morale: +1, bond: -1 },
                    flags: { katzAway: false },
                    result: 'I keep it light, as if it hardly matters either way. He hears that.',
                    after: katzAnswers(-1)
                }
            ]
        }
    ]
};

export default [homeInHanover, e9CarHiking, e10MountWashington, e11PhoneCall];
