// Act II events (the Smokies, Gatlinburg and Shenandoah; book chapters 6-11).
// Source of truth: docs/scene-outline.md (Scenes 6-11), then docs/story.md.
// Choices and stat effects are exactly the outline's. Lines marked // DOC are
// quoted from the docs word for word; every other line is new writing for
// Milestone 11 that paraphrases the book (the owner reviews it).
// (verify) marks a book fact to check. Format: see the top of act1.js.
//
// Narrator voice in Act II: still the planner, but starting to notice the
// woods and Katz. Katz's tone follows Bond (warm 7+, neutral 5-6, sharper 4
// or less); only the line changes, never the branch. His drinking is part of
// his story and is never a joke.

const warm = (s) => s.bond >= 7;
const sharp = (s) => s.bond <= 4;
const neutral = (s) => !warm(s) && !sharp(s);

// Scene 6: E4, Snowstorm (Chapter 6; verify exactly where the snow hits).
export const e4Snowstorm = {
    id: 'e4_snowstorm',
    scene: 6,
    map: 'smokies',
    steps: [
        { narrate: 'The Smokies. High ridges and old, dark forest, and then, in the space of an hour, the sky turns white.' },
        { narrate: 'By evening a foot of snow has fallen. The shelter is jammed with hikers, all of them steaming gently like laundry.' },
        { say: 'hiker', text: "Radio says more tonight. Trail's buried from here to the road." },
        // Continuity: Katz mentions Mary Ellen once if she tagged along (E3).
        { say: 'katz', text: 'Look on the bright side. Mary Ellen is not in this shelter.', when: (s) => s.choices?.e3_mary_ellen === 'tagAlong' },
        { say: 'katz', text: "We've been through worse. I can't think of when, but I'm sure we have.", when: warm },
        { say: 'katz', text: 'Snow. In spring. Who signed off on this?', when: neutral },
        { say: 'katz', text: 'Does your spreadsheet have a column for this?', when: sharp },
        {
            choose: [
                {
                    id: 'wait',
                    text: 'Wait it out in the shelter.', // DOC
                    effects: { stamina: +1, morale: -1 },
                    result: 'Two cold, damp days of waiting. My body rests. My mind does not.'
                },
                {
                    id: 'push',
                    text: 'Push on through the snow.', // DOC
                    effects: { miles: 'plus', stamina: -2 },
                    result: 'Brutal, but we make the next shelter. I have never been so cold, or so pleased with myself.',
                    after: [{ narrate: 'Somewhere in the white I notice rhododendrons, bent low under the snow. I almost stop to look.' }]
                },
                {
                    id: 'down',
                    text: 'Get down to Gatlinburg early.', // DOC
                    effects: { supplies: +1, miles: 'minus' },
                    result: 'A long, slushy walk down to the road, then a motel room with a heater.',
                    after: [{ say: 'katz', text: 'Pancakes. I would like it noted that pancakes exist.' }]
                }
            ]
        }
    ]
};

// Scene 7: E5, Night Noises (Chapters 1 and 6). Never identified, whatever you pick.
export const e5NightNoises = {
    id: 'e5_night_noises',
    scene: 7,
    map: 'smokies',
    night: true,
    steps: [
        { narrate: 'Night. I am lying in my tent thinking about bears, when something outside starts thinking about me.' },
        { narrate: 'Heavy footsteps. Breathing. A branch snaps. Every bear book I ever read comes back to me at once, in detail.' },
        { say: 'katz', text: 'Bryson. Bryson. You hear that?' },
        {
            choose: [
                {
                    id: 'hangFood',
                    text: 'Get up and hang the food bag.', // DOC
                    effects: { stamina: -1, morale: +1 },
                    result: 'I creep out with a flashlight, string the food up a tree, and creep back in, alive.'
                },
                {
                    id: 'wakeKatz',
                    text: 'Wake Katz.', // DOC
                    effects: { bond: +1, stamina: -1 },
                    result: 'We sit up together in the dark, whispering, until whatever it is moves off.',
                    after: [{ say: 'katz', text: "If it comes back, you're the one who reads the bear books. You go talk to it." }]
                },
                {
                    id: 'lieStill',
                    text: 'Lie still and listen.', // DOC
                    effects: { morale: -2 },
                    result: 'I lie rigid until dawn, composing my own obituary.'
                }
            ]
        },
        { narrate: 'In the morning there are marks in the leaves that tell me nothing. Whatever it was, we never find out.' }
    ]
};

// Scene 8: E6, The Rental Car (Chapters 7-8). Step trigger at Gatlinburg; first ending check.
export const e6RentalCar = {
    id: 'e6_rental_car',
    scene: 8,
    map: 'smokies',
    endingCheck: true,
    steps: [
        { narrate: 'Gatlinburg: pancake houses, wax museums and fudge shops. After the woods it is like landing on another planet.' },
        { journal: 'gatlinburg' },
        // Chapter 7 opens with two days of silence between them; with a warm Bond it softens.
        { narrate: 'The high trail is closed by snow. And for two days now, Katz has barely said a word to me.', when: (s) => !warm(s) },
        { narrate: 'The high trail is closed by snow. Two days of waiting, and even Katz is running out of jokes.', when: warm },
        { say: 'katz', text: "The rental place has cars. Virginia's warm, I hear. I'm just saying.", when: warm },
        { say: 'katz', text: "The trail's closed. There's a car rental right there. I'm not saying. I'm just saying.", when: neutral },
        { say: 'katz', text: "You can wait for the snow. I'm getting in a car.", when: sharp },
        { say: 'clerk', text: 'Going north? We do one-way rentals. You trail folks do it all the time.' },
        {
            choose: [
                {
                    id: 'rentCar',
                    text: 'Rent a car and drive north to Virginia.', // DOC
                    effects: { morale: +1, supplies: -1 },
                    flags: { skippedAhead: true },
                    result: 'We drive north with the windows down. It feels wonderful, and a little like cheating.'
                },
                {
                    id: 'walkOn',
                    text: 'Walk on through, whatever it takes.', // DOC
                    effects: { stamina: -2, bond: -1 },
                    result: 'We wait for the road to open and walk on through drifts to our knees. Katz says nothing for a day.'
                },
                {
                    id: 'zeroDays',
                    text: 'Take zero days in Gatlinburg.', // DOC
                    effects: { stamina: +2, supplies: -1, morale: -1 },
                    result: 'Three days of motel beds and pancakes. My legs recover. My resolve goes soft.'
                }
            ]
        }
    ]
};

// Scene 9: E7, Skyline Drive (Chapters 8 and 10). Talk to the day-tripper at the wayside.
export const e7Skyline = {
    id: 'e7_skyline',
    scene: 9,
    map: 'shenandoah',
    steps: [
        { narrate: 'Shenandoah National Park. The trail and Skyline Drive cross and recross all day, like two strangers who keep meeting in a corridor.' },
        { narrate: 'Every crossing has a wayside: burgers, milkshakes, and families who drove up to see the view we walked to.' },
        { say: 'daytripper', text: 'You boys walked here? From where? Georgia? Honey, come look. These men walked from Georgia.' },
        { say: 'katz', text: "They've got milkshakes. I'm not saying we deserve one. I'm saying we deserve two.", when: warm },
        { say: 'katz', text: 'Burgers. Right there. I can smell them from here.', when: neutral },
        { say: 'katz', text: "Go on. Tell me milkshakes aren't in the plan.", when: sharp },
        {
            choose: [
                {
                    id: 'everyMile',
                    text: 'Hike every mile.', // DOC
                    effects: { stamina: -1, morale: +1 },
                    result: 'The woods between the roads are quiet and green, and we earn every one of them.'
                },
                {
                    id: 'waysides',
                    text: 'Stop at every wayside.', // DOC
                    effects: { bond: +1, morale: +1, supplies: -1 },
                    result: 'The budget goes on milkshakes.', // DOC
                    after: [{ say: 'katz', text: 'This is the best national park. I have been to one national park.' }]
                },
                {
                    id: 'hitch',
                    text: 'Hitch between waysides.', // DOC
                    effects: { stamina: +1, morale: -1 },
                    result: 'It feels like cheating, because it is.' // DOC
                }
            ]
        }
    ]
};

// Scene 10: the midpoint campfire (Chapter 11). No choice; it shows what Bond has built.
export const midpointCampfire = {
    id: 'midpoint_campfire',
    scene: 10,
    map: 'shenandoah',
    night: true,
    steps: [
        { narrate: 'A campfire on a ridge in Shenandoah. I notice I have stopped checking the mileage every hour.' },
        // Bond 5 or more: Katz talks honestly.
        { say: 'katz', text: "You know I used to drink. A lot. I've been sober a few years now. Some days it's still all I think about.", when: (s) => s.bond >= 5 },
        { say: 'katz', text: "When you said Appalachian Trail, I thought: here's something I could finish. So. Why did you come?", when: (s) => s.bond >= 5 },
        { narrate: 'I start to give the clever answer. Then I stop and give him the true one, which is longer and less clever. He listens to all of it.', when: (s) => s.bond >= 5 },
        { narrate: 'I tell him I am glad he came. I am surprised by how much I mean it.', when: (s) => s.bond >= 5 },
        // Bond 4 or less: he has looked up flights home.
        { narrate: 'Katz stares into the fire for a long time.', when: (s) => s.bond <= 4 },
        { say: 'katz', text: "I looked up flights home. Just so you know.", when: (s) => s.bond <= 4 },
        { narrate: 'Neither of us says anything else. The fire says it for us.', when: (s) => s.bond <= 4 }
    ]
};

// Scene 11: E8, Katz Goes Home (Chapter 11; verify why he leaves). End of
// Part 1; second ending check. Every option sends Katz home (katzAway).
export const e8KatzGoesHome = {
    id: 'e8_katz_goes_home',
    scene: 11,
    map: 'shenandoah',
    endingCheck: true,
    steps: [
        { narrate: 'A few days later we come down to a road, and the end of our first stretch together. Katz has to get back to Des Moines.' },
        { say: 'katz', text: "I'm going to miss this. Don't tell anyone. Especially not the blisters.", when: warm },
        { say: 'katz', text: 'So that is that. Some of it was even fun.', when: neutral },
        { say: 'katz', text: "Well. That's me done.", when: sharp },
        {
            choose: [
                {
                    id: 'invite',
                    text: 'Ask him to come back for the end.', // DOC
                    effects: { bond: +1, morale: -1 },
                    flags: { invited: true, katzAway: true },
                    result: 'He says he will think about it. He means yes. I can tell.',
                    after: [{ say: 'katz', text: "Maine, huh? Okay. I'll start training. Probably." }]
                },
                {
                    id: 'glad',
                    text: "Tell him you're glad he came.", // DOC
                    effects: { bond: +2, morale: -2 },
                    flags: { katzAway: true },
                    result: 'It is harder to say than it should be. Watching his plane go, I feel suddenly very alone.'
                },
                {
                    id: 'sayLittle',
                    text: 'Drop him at the airport and say little.', // DOC
                    effects: { morale: +1, bond: -2 },
                    flags: { katzAway: true },
                    result: 'A handshake, a nod, and he is gone. It is easier this way, I tell myself.'
                }
            ]
        }
    ]
};

export default [e4Snowstorm, e5NightNoises, e6RentalCar, e7Skyline, midpointCampfire, e8KatzGoesHome];
