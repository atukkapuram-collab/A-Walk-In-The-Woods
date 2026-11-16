// Prologue and Act I events (Hanover, then Georgia; book chapters 1-5).
// Source of truth: docs/scene-outline.md (Scenes 2-5), then docs/story.md.
// Choices and stat effects are exactly the outline's. Lines marked // DOC are
// quoted from the docs word for word; every other line is new writing for
// Milestone 11 that paraphrases the book (the owner reviews it). Nothing here
// quotes the book itself at length. (verify) marks a book fact to check.
//
// EVENT FORMAT (docs/implementation-plan.md, section 3).
//   id:     unique id; map files point at it (npcs[].talk, triggers[].event);
//           the opening points at E1 (src/data/opening.js)
//   scene:  scene number in the outline
//   steps:  played in order. Each step is one of:
//     { narrate: 'text' }                    narrator box: italic, no portrait
//     { say: 'katz', text: 'text' }          dialogue box; speakers are in src/data/speakers.js
//     { choose: [option, ...] }              2-4 options, then that option's result card
//     { result: 'text', effects }            a result card with set effects and no choice
//     { journal: 'id' }                      unlocks a Trail Journal entry (src/data/journal.js)
//   Any step or option may have `when: (state) => boolean` to show it only sometimes.
//   `state` is gameState.snapshot from when the event started: the four stats,
//   miles, the flags, and `choices` (eventId -> option id picked earlier).
//   option: { id, text, effects, result, after?, flags? }
//     id:      stable name of the option; remembered in state.choices for callbacks.
//     effects: { stamina, supplies, bond, morale, miles } (numbers; miles uses
//              'plus' | 'minus' | 'slow' | 'big', turned into numbers by TUNING.miles),
//              or a function (state) => effects for conditional rules.
//     result:  1-2 sentences shown on the result card (or a function (state) => text).
//     after:   optional steps played right after the result card (a short reaction).
//     flags:   e.g. { skippedAhead: true }.
//     final:   only on the Final Crossroads options: 'summit' | 'home' | 'ourWay'.
//     chance:  instead of effects/result, a coin flip:
//              [{ id, p: 0.5, effects, result }, { id, p: 0.5, effects, result }]
//   endingCheck: true runs the mid-trip ending check after the event (E6, E8, E11, E13).
//   bondWhileAway: true lets Bond change although Katz is away (E11 only).
//   night: true  darkens the map (blue tint, campfire glow) while the event plays.
//
// Writing rules (blueprint, Text style): 2-3 sentences per box at most.
// First person: the player is Bill Bryson. Katz carries most of the jokes.
// Narrator voice in the Prologue and Act I: gear lists, mileage maths and bears.

const picked = (s, eventId, optionId) => s.choices?.[eventId] === optionId;

// Scene 2: E1, The Outfitter (tutorial). Played inside the opening (src/data/opening.js).
export const e1Outfitter = {
    id: 'e1_outfitter',
    scene: 2,
    map: 'opening',
    steps: [
        { narrate: 'The outfitter in Hanover. A cheerful salesman walks me round the shop, and the pile on the counter grows: tent, stove, water filter, a knife with eleven blades.' },
        { say: 'salesman', text: "You'll want a backup stove. And a backup for the backup. The mountains don't forgive, my friend." },
        { narrate: 'Every choice on the trail costs something. Four things will decide how far I get: Stamina, Supplies, my Bond with Katz, and Morale.' },
        {
            choose: [
                {
                    id: 'buyAll',
                    text: 'Buy the whole list.', // DOC
                    effects: { supplies: +2, stamina: -1 },
                    result: 'I am ready for anything, including a hernia.', // DOC
                    after: [{ narrate: 'Fully loaded, the pack weighs about as much as a ten-year-old. I tell myself I will get stronger.' }]
                },
                {
                    id: 'guidebook',
                    text: 'Buy only what the guidebook says you need.', // DOC
                    effects: { stamina: +1, supplies: -1 },
                    result: "Lighter, cheaper, and nagged by a feeling I've forgotten something." // DOC
                },
                {
                    id: 'katzRoom',
                    text: 'Leave room for whatever Katz brings.', // DOC
                    effects: { bond: +1, morale: +1, supplies: -1 },
                    result: 'Katz will bring snack cakes. Katz will always bring snack cakes.' // DOC
                }
            ]
        }
    ]
};

// Scene 3: E2, Katz Lightens His Load (Chapter 2). Step trigger on the climb.
export const e2LightensLoad = {
    id: 'e2_lightens_load',
    scene: 3,
    map: 'georgia',
    steps: [
        { narrate: 'Day one: Amicalola Falls, then the approach trail up to Springer Mountain, where the trail begins. It is uphill. All of it is uphill.' },
        // What I bought at the outfitter (E1) is still on my back.
        { narrate: 'My pack, stuffed with everything the salesman sold me, tries to pull me back down the mountain on every step.', when: (s) => picked(s, 'e1_outfitter', 'buyAll') },
        { narrate: 'My light pack is the one thing going well. I make a note to thank the guidebook, if I live.', when: (s) => picked(s, 'e1_outfitter', 'guidebook') },
        { narrate: 'Katz brought exactly what I expected: a great many Little Debbie snack cakes, and very little else of use.', when: (s) => picked(s, 'e1_outfitter', 'katzRoom') },
        { narrate: 'Day two. Katz is far behind. When he finally appears, red-faced and wheezing, his pack looks a good deal lighter.' },
        { say: 'katz', text: 'I threw some stuff away. The coffee. The sugar. A lot of the food. It was heavy.' },
        { say: 'katz', text: "It's down the hill somewhere. Don't look at me like that." },
        {
            choose: [
                {
                    id: 'fetch',
                    text: 'Climb down and fetch it.', // DOC
                    effects: { supplies: +1, stamina: -2 },
                    result: 'An hour of scrambling through brambles, collecting food like an angry squirrel.',
                    after: [{ say: 'katz', text: 'You went back for the pepperoni? Okay. That I respect.' }]
                },
                {
                    id: 'share',
                    text: 'Share your food with him.', // DOC
                    effects: { bond: +2, supplies: -2 },
                    result: 'We will run short sooner. But he is still here, and so am I.',
                    after: [{ say: 'katz', text: "Thanks. Really. Don't tell anyone I said that." }]
                },
                {
                    id: 'laugh',
                    text: 'Laugh it off and keep walking.', // DOC
                    effects: { morale: +1, bond: -1 },
                    result: 'It is funny, in its way. Katz does not find it funny at all.',
                    after: [{ say: 'katz', text: "Glad I'm entertaining somebody." }]
                }
            ]
        }
    ]
};

// Scene 4: E3, Mary Ellen (Chapter 5). Talk to her on the map.
export const e3MaryEllen = {
    id: 'e3_mary_ellen',
    scene: 4,
    map: 'georgia',
    steps: [
        { narrate: 'On a long climb we meet Mary Ellen, from Florida. She talks without pausing for breath, mostly about everything we are doing wrong.' },
        { say: 'maryEllen', text: 'You guys are really slow. Like, really slow. What are you carrying in there, bricks?' },
        { say: 'maryEllen', text: "I'm walking with you tomorrow. You need somebody who knows what they're doing." },
        { say: 'katz', text: "If she comes with us, I'm walking into a lake. I'll find a lake." },
        {
            choose: [
                {
                    id: 'tagAlong',
                    text: 'Let her tag along.', // DOC
                    effects: { supplies: +1, morale: -2 },
                    result: 'She shares her food generously, and her opinions more generously still.',
                    after: [{ narrate: 'By evening I know her views on tents, Florida, Katz and me. None of them are favorable.' }]
                },
                {
                    id: 'slipAway',
                    text: 'Slip away at dawn with Katz.', // DOC
                    effects: { bond: +1, stamina: -1 },
                    result: 'Packed and gone before sunrise, at a punishing pace. A conspiracy of two.',
                    after: [{ say: 'katz', text: "Best hike of my life. Keep going. Don't look back." }]
                },
                {
                    id: 'tellHer',
                    text: "Tell her you'd rather hike alone.", // DOC
                    effects: { morale: +1, bond: -1 },
                    result: 'She takes it badly. Katz thinks I was harsh, and is secretly relieved.'
                }
            ]
        }
    ]
};

// Scene 5: the Act I close, the woods at night (Chapter 4). No choice; the
// narration changes with Bond.
export const act1Close = {
    id: 'act1_close',
    scene: 5,
    map: 'georgia',
    night: true,
    steps: [
        { narrate: 'Night in the woods. No streetlights, no traffic, nothing. The dark is so complete I cannot see my own hand.' },
        { narrate: 'Then the stars come out, more than I have seen in my life. The woods, I begin to understand, are not like anywhere else.' },
        { narrate: 'From his tent Katz mumbles, "Same time tomorrow?" and is asleep before I can answer. I find I was hoping he would ask.', when: (s) => s.bond >= 5 },
        { narrate: 'From his tent Katz snores, loud and steady. Neither of us said good night.', when: (s) => s.bond < 5 },
        { narrate: 'I planned this walk down to the last ounce. Somehow I never planned for how it would feel.' }
    ]
};

export default [e1Outfitter, e2LightensLoad, e3MaryEllen, act1Close];
