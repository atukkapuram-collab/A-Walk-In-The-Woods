// Scene 1 (the Prologue, Hanover; book chapters 1-2) and Scene 2 (E1, the
// Outfitter). docs/scene-outline.md, Scenes 1-2, and docs/story.md, Prologue.
// New writing for Milestone 11 that paraphrases the book; the owner reviews it.
// (verify) marks a book fact to check.
//
// Same step format as the events (src/data/events/act1.js), split into the
// blueprint's still panels: each panel names its picture
// (src/art/illustrations.js) and either the lines read over it (`steps`) or
// an event played over it (`event`: E1, with its choice and result card).
// OpeningScene shows the panels. There is no name entry: the player is Bill Bryson.
export const OPENING_PANELS = [
    {
        art: 'kitchen',
        steps: [
            { narrate: 'After twenty years in England, I have moved my family to Hanover, New Hampshire. At the edge of town, a path slips into the woods.' },
            { narrate: 'It is the Appalachian Trail: more than 2,100 miles from Georgia to Maine. I decide, on no evidence at all, to walk the whole thing.' },
            { narrate: 'Then I make a mistake. I read books about bear attacks. Detailed ones. Late at night.' }
        ]
    },
    {
        // E1, The Outfitter (tutorial): a choice, a result card and stat changes.
        art: 'kitchen',
        event: 'e1_outfitter'
    },
    {
        art: 'phone',
        steps: [
            { narrate: 'I invite everyone I know. Everyone I know has a reason: work, children, knees, sense.' },
            { narrate: 'Then the phone rings. Stephen Katz, an old school friend from Des Moines I have not seen in years, has heard about the trip.' },
            { say: 'katz', text: "I hear you're walking the Appalachian Trail. I was thinking. Maybe I could come?" },
            { narrate: 'Katz, as I remember him, was not built for the outdoors. I say yes before I can think about it.' }
        ]
    },
    {
        art: 'airport',
        steps: [
            // (verify) where they meet; the book has Katz fly in to start the walk in Georgia.
            { narrate: 'Atlanta, in March. Katz comes off the plane heavier than I remember, and out of breath from the walk to the gate.' },
            { say: 'katz', text: "I don't drink anymore, by the way. A few years now. Thought you should know before we share a tent." },
            { narrate: 'His bag is mostly Little Debbie snack cakes. I decide not to ask about the rest.' }
        ]
    }
];

// All the opening's narration and dialogue as one event (for tests and the
// story review). E1's lines are in its own event.
export const OPENING = {
    id: 'opening',
    scene: 1,
    steps: OPENING_PANELS.flatMap((panel) => panel.steps ?? [])
};
