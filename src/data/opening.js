// Scene 1: the opening (kitchen table and airport). docs/scene-outline.md,
// Scene 1, and docs/story.md, Opening. No choices.
// Lines marked // DOC are quoted from the docs; the rest is new writing.
//
// Same step format as the events (src/data/events/act1.js), split into the
// blueprint's still panels: each panel names its picture (src/art/illustrations.js)
// and the lines read over it. OpeningScene shows the panels and asks for the
// player's name first (design blueprint: "Name entry happens here").
export const OPENING_PANELS = [
    {
        art: 'kitchen',
        steps: [
            { narrate: 'A gray winter night. Your kitchen table has vanished under maps, guidebooks and a spreadsheet called HIKE (FINAL) (2).' },
            { narrate: 'The plan: walk the entire Appalachian Trail, 2,190 miles from Georgia to Maine. You have twenty years of desk work behind you and an excellent pair of new boots.' }
        ]
    },
    {
        art: 'phone',
        steps: [
            { narrate: "You invite everyone you know. Everyone you know is busy, injured or laughing. Then an old school friend you haven't spoken to in years calls back." },
            { say: 'katz', text: "The whole trail? Yeah. Yes. I'm in. When do we leave?" },
            { narrate: 'Stephen Katz says yes before you finish the question, like a man grabbing a rope. You decide that is enthusiasm.' }
        ]
    },
    {
        art: 'airport',
        steps: [
            { narrate: 'Two weeks later, at the Atlanta airport, Katz steps off the plane wheeling a suitcase.' },
            { say: 'katz', text: 'What? It has wheels. Wheels are efficient.' }, // DOC
            { narrate: 'You have planned for blisters, bears and snow. You have not planned for Katz. Somehow he never came up in the spreadsheet.' }
        ]
    }
];

// All the opening's lines as one event (for tests and the story review).
export const OPENING = {
    id: 'opening',
    scene: 1,
    steps: OPENING_PANELS.flatMap((panel) => panel.steps)
};
