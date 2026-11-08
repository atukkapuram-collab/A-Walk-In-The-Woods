// Act III events (Maine, the Hundred-Mile Wilderness). Source of truth:
// docs/scene-outline.md (Scenes 10-12), then docs/story.md. Choices and stat
// effects are exactly the outline's. Lines marked // DOC are quoted from the
// docs word for word; every other line is new writing for Milestone 5.
// Format: see the top of act1.js.
//
// Narrator voice in Act III: reflective and honest. The same narrator, now
// changed, and still funny.

const picked = (s, eventId, optionId) => s.choices?.[eventId] === optionId;
const warm = (s) => s.bond >= 7;
const sharp = (s) => s.bond <= 4;
const neutral = (s) => !warm(s) && !sharp(s);

// Scene 10: Event 7, The River.
export const event7River = {
    id: 'event7_river',
    scene: 10,
    map: 'maine',
    steps: [
        { narrate: 'Maine. Red and gold leaves, icy lakes, and no town or road for days. It is the most beautiful place you have ever been afraid in.' },
        { narrate: 'Then the river, swollen brown and loud with rain. The far bank is close enough to see and far enough to scare you.' }, // close to story.md
        // Cut-list item 1: Dale's cameo lives in these two steps only.
        { narrate: 'Dale is sitting on a rock by the bank, eating cold oatmeal and studying the water.' },
        { say: 'dale', text: "Should've packed a packraft." }, // DOC
        { say: 'katz', text: "Okay. Arms locked, eyes forward, nobody drowns. I've been practicing that speech.", when: warm },
        { say: 'katz', text: "So we're swimming now. Great. Love that for us.", when: neutral },
        { say: 'katz', text: 'Go on. Tell me what the plan says about rivers.', when: sharp },
        {
            choose: [
                {
                    id: 'ford',
                    text: 'Ford it together, locking arms with Katz.', // DOC
                    // Outline: if Stamina is 3 or less, you also lose Supplies -1 to the current.
                    effects: (s) => (s.stamina <= 3 ? { bond: +1, stamina: -1, supplies: -1 } : { bond: +1, stamina: -1 }),
                    result: (s) => (s.stamina <= 3
                        ? "Halfway across, your tired legs buckle. Katz holds on, but the current takes a food bag."
                        : 'Cold to the bone, arm in arm, one step at a time. On the far bank Katz is laughing like an idiot, and so are you.')
                },
                {
                    id: 'wait',
                    text: 'Camp and wait for the water to drop.', // DOC
                    effects: { supplies: -2, morale: -1 },
                    result: "Two days of cold oatmeal, watching the water. It drops eventually. So does everyone's mood."
                },
                {
                    id: 'upstream',
                    text: 'Take the long detour upstream.', // DOC
                    effects: { stamina: -1, miles: 'minus' },
                    result: 'Six extra miles of bog and fallen trees to find a log across. Your feet will be bringing this up later.'
                }
            ]
        }
    ]
};

// Scene 11: Event 8, The Fall. Second ending check.
export const event8Fall = {
    id: 'event8_fall',
    scene: 11,
    map: 'maine',
    endingCheck: true,
    steps: [
        { narrate: 'Wet roots on a steep slope. Katz goes down hard, and his ankle bends a way ankles do not.' },
        { say: 'katz', text: "I'm fine. Totally fine. Ankles are supposed to be this color." },
        { narrate: 'He is not fine. The nearest logging road is a long limp away. The end of the trail is farther.' },
        {
            choose: [
                {
                    id: 'carry',
                    text: 'Carry his pack as well as yours.', // DOC
                    effects: { stamina: -2, bond: +2 },
                    result: "You strap his pack on top of yours. It is unbelievably heavy, and you don't mention it once.",
                    after: [
                        { say: 'katz', text: "This is the nicest thing anyone's done for me. Don't make it weird." }, // DOC
                        // Outline: with high Bond the thank-you lands as the payoff of his arc.
                        { narrate: 'Back in Georgia he was the punchline. You are not sure when that stopped.', when: (s) => s.bond >= 5 }
                    ]
                },
                {
                    id: 'alone',
                    text: 'Go ahead alone to find help.', // DOC
                    effects: { miles: 'plus', bond: -1 },
                    result: 'You make good time and find a ranger by dark. Katz waits alone, and he remembers it.' // DOC (last sentence)
                },
                {
                    id: 'walkOut',
                    text: 'Walk him out to the nearest logging road.', // DOC
                    effects: { morale: -1 },
                    flags: { leftWilderness: true },
                    result: 'His arm over your shoulder, you leave the trail together. Safe, and the end of the original plan.' // DOC (last sentence)
                }
            ]
        }
    ]
};

// Scene 12: the Final Crossroads. The narration sums up the journey from the
// stats; the thresholds match the "Summit or nothing" rule (Stamina 5+,
// Supplies 3+, Bond 5+) so the words hint at what the summit will need.
export const finalCrossroads = {
    id: 'final_crossroads',
    scene: 12,
    map: 'maine',
    night: true,
    steps: [
        // Where: the last campfire, or the roadside campground (left the wilderness).
        { narrate: 'The last campfire. On the horizon the final mountain rises out of the dark: the end of the trail.', when: (s) => !s.leftWilderness },
        { narrate: 'A roadside campground: picnic tables, an ice machine, the hum of trucks. Far off, the final mountain catches the last of the light.', when: (s) => s.leftWilderness },
        // Bodies.
        { narrate: 'Your legs are trail legs now. The hills that flattened you in Georgia are just hills.', when: (s) => s.stamina >= 5 && !s.leftWilderness },
        { narrate: "Your legs could take that mountain now. Katz's ankle, propped up on a cooler, has other opinions.", when: (s) => s.stamina >= 5 && s.leftWilderness },
        { narrate: 'Your bodies are spent. Every step today was a negotiation, and you lost most of them.', when: (s) => !(s.stamina >= 5) },
        // Food.
        { narrate: 'There is food for a few more days, if nobody looks too hard at the snack cakes.', when: (s) => s.supplies >= 3 },
        { narrate: 'The food bag is nearly empty. Dinner was half a tortilla and a long look at the stars.', when: (s) => !(s.supplies >= 3) },
        // Trust.
        { narrate: 'Katz hands you the last of the hot chocolate without being asked.', when: warm },
        { narrate: 'Katz sits across the fire, close enough to talk, if either of you wanted to.', when: neutral },
        { narrate: "Katz sits on the far side of the fire. You've both gotten good at silence.", when: sharp },
        // Callbacks: Katz remembers.
        { say: 'katz', text: "For the record, I'm still thinking about that slope. Sitting there alone. Just so you know.", when: (s) => picked(s, 'event8_fall', 'alone') },
        { say: 'katz', text: 'We could always get a truck for the last bit. Worked great in Virginia.', when: (s) => s.skippedAhead },
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

export default [event7River, event8Fall, finalCrossroads];
