// Act I events (North Georgia). Source of truth: docs/scene-outline.md
// (Scenes 2-4), then docs/story.md. Choices and stat effects are exactly the
// outline's. Lines marked // DOC are quoted from the docs word for word; every
// other line is new writing for Milestone 5 (the owner reviews it).
//
// EVENT FORMAT (docs/implementation-plan.md, section 3).
//   id:     unique id; map files point at it (npcs[].talk, triggers[].event)
//   scene:  scene number in the outline
//   steps:  played in order. Each step is one of:
//     { narrate: 'text' }                    narrator box: italic, no portrait
//     { say: 'katz', text: 'text' }          dialogue box; speakers are in src/data/speakers.js
//     { choose: [option, ...] }              2-4 options, then that option's result card
//   Any step or option may have `when: (state) => boolean` to show it only sometimes.
//   `state` is gameState.snapshot from when the event started: the four stats,
//   miles, the two flags, and `choices` (eventId -> option id picked earlier).
//   option: { id, text, effects, result, after?, flags? }
//     id:      stable name of the option; remembered in state.choices for callbacks.
//     effects: { stamina, supplies, bond, morale, miles } (numbers; miles uses
//              'plus' | 'minus' | 'slow' | 'big', turned into numbers by TUNING.miles),
//              or a function (state) => effects for conditional rules.
//     result:  1-2 sentences shown on the result card (or a function (state) => text).
//     after:   optional steps played right after the result card (a short reaction).
//     flags:   e.g. { skippedAhead: true }.
//     final:   only on the Final Crossroads options: 'summit' | 'home' | 'ourWay'.
//              The ending check then runs with that choice.
//     chance:  instead of effects/result, a coin flip:
//              [{ id, p: 0.5, effects, result }, { id, p: 0.5, effects, result }]
//   endingCheck: true runs the mid-trip ending check after the event (Events 5 and 8).
//   night: true  darkens the map (blue tint, campfire glow) while the event plays.
//
// Writing rules (blueprint, Text style): 2-3 sentences per box at most. Katz
// carries the jokes, the narrator carries the reflection. Narrator voice in
// Act I: plans, gear lists and mileage math, confident and a little smug.

const picked = (s, eventId, optionId) => s.choices?.[eventId] === optionId;

export const event1Outfitter = {
    id: 'event1_outfitter',
    scene: 2,
    map: 'georgia',
    steps: [
        { narrate: 'The outfitter at the trailhead. Your gear list has 61 items, color-coded by weight. A very enthusiastic salesman and Dale the Gear Guy both have opinions about your pack.' },
        { say: 'salesman', text: "You'll want the deluxe stove, the backup stove and the emergency stove. The mountains punish the unprepared, friend." },
        { say: 'dale', text: 'I cut the handle off my toothbrush. Four grams. Every gram you carry, you carry two thousand miles.' },
        { say: 'katz', text: 'They sell snack cakes here. Just putting that out there.' },
        {
            choose: [
                {
                    id: 'buyAll',
                    text: 'Buy everything the salesman suggests.', // DOC
                    effects: { supplies: +2, stamina: -1 },
                    result: "You're ready for anything, including a back injury.", // DOC
                    after: [{ say: 'katz', text: 'You look like a vending machine that learned to walk.' }]
                },
                {
                    id: 'ultralight',
                    text: 'Pack ultralight like Dale.', // DOC
                    effects: { stamina: +1, supplies: -1 },
                    result: 'You saw off your toothbrush handle and feel ridiculous.', // DOC
                    after: [{ say: 'katz', text: "If you start cutting the handles off forks, I'm going home." }]
                },
                {
                    id: 'katz',
                    text: 'Let Katz choose.', // DOC
                    effects: { morale: +1, bond: +1, supplies: -1 },
                    result: 'He buys 14 snack cakes and a hammock neither of you can set up.', // DOC
                    after: [{ say: 'katz', text: 'Fourteen. One for every day before we give up. Kidding. Mostly.' }]
                }
            ]
        }
    ]
};

// Sunshine jogging past on the first steps (story.md, "First steps"). Talk trigger on the map.
export const sunshineMorning = {
    id: 'sunshine_morning',
    scene: 3,
    map: 'georgia',
    steps: [
        { narrate: 'Under the trailhead sign you felt like an explorer. Ten minutes later you are bent over, gasping, when a young hiker jogs past.' },
        { say: 'sunshine', text: 'Morning!' }, // DOC
        { narrate: "Her trail name is Sunshine, Katz wheezes. By the time he's said it, she's out of sight. You still haven't moved." }
    ]
};

export const event2GoingHome = {
    id: 'event2_going_home',
    scene: 3,
    map: 'georgia',
    steps: [
        { narrate: 'Day two. On a muddy climb, Katz drops onto a log and announces the trip is over.' },
        { narrate: 'Sunshine has just jogged past, which makes it worse.' }, // DOC
        // What you bought at the outfitter (Event 1) is still on your back.
        { narrate: "Your pack weighs as much as a fourth-grader. You'd sit down too, but you might never get up again.", when: (s) => picked(s, 'event1_outfitter', 'buyAll') },
        { narrate: "You're carrying almost nothing and still can't breathe. Dale did not mention this part.", when: (s) => picked(s, 'event1_outfitter', 'ultralight') },
        { narrate: 'He has eaten thirteen of the fourteen snack cakes since breakfast. The hammock remains unopened.', when: (s) => picked(s, 'event1_outfitter', 'katz') },
        { say: 'katz', text: "I'm going home." }, // DOC
        { say: 'katz', text: 'Did you see her? She was jogging. Uphill. Like it was a choice.' },
        // Snack cakes continuity: if Katz didn't choose the gear, he packed some anyway.
        { say: 'katz', text: 'I even packed snack cakes. For emergencies. This is the emergency.', when: (s) => !picked(s, 'event1_outfitter', 'katz') },
        {
            choose: [
                {
                    id: 'push',
                    text: 'Push him. "We said the whole trail."', // DOC
                    effects: { miles: 'plus', bond: -1 },
                    result: 'He follows in silence, which is worse than complaining.' // DOC
                },
                {
                    id: 'sit',
                    text: 'Sit with him.', // DOC
                    effects: { bond: +2, supplies: -1, miles: 'slow' },
                    result: 'You share his last snack cake and slow the pace.', // DOC
                    after: [{ say: 'katz', text: "It's the last one. You can have half. Don't get used to it." }]
                },
                {
                    id: 'joke',
                    text: 'Make a joke. "Fine, but home is back over all those hills."', // DOC
                    effects: { morale: +1 },
                    result: 'Katz laughs despite himself and stands up.' // DOC
                }
            ]
        }
    ]
};

// Scene 4: the Act I close. No choice; the narration changes with Bond.
export const act1Close = {
    id: 'act1_close',
    scene: 4,
    map: 'georgia',
    night: true,
    steps: [
        { narrate: 'That night the shelter is crowded with wet hikers and wetter socks. By your math you covered eight miles today. The plan said fourteen.' },
        { narrate: "You step outside and look up. There are more stars than you've seen in years, so many the sky looks crowded too." },
        { narrate: 'Inside, Katz snores like a chainsaw. Before he fell asleep he mumbled, "Same time tomorrow?" You realize you were hoping he would.', when: (s) => s.bond >= 5 },
        { narrate: 'Inside, Katz snores like a chainsaw, his back to your spot. Neither of you said good night.', when: (s) => !(s.bond >= 5) },
        { narrate: 'Your spreadsheet has no column for this. Am I hiking the trail, you wonder, or is it hiking me?' }
    ]
};

export default [event1Outfitter, sunshineMorning, event2GoingHome, act1Close];
