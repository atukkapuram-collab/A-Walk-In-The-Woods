// What Katz says when you press Space next to him (design blueprint, Exploration).
// His tone follows Bond (scene outline): warm at 7+, sarcastic at 4 or less,
// neutral in between. Only the line changes, never the story.
//
// New writing (Milestones 5 and 11); the owner reviews it.
export const KATZ_LINES = {
    warm: [
        "Admit it. You'd be bored out here without me.",
        "I'm not saying this is fun. I'm saying I'd do it again. Don't quote me.",
        "The trail's alright, you know? Don't tell the trail I said that."
    ],
    neutral: [
        'Nature is just outside with extra steps.',
        "I'm not quitting. I'm resting aggressively.",
        'If I die out here, tell people it was a bear. Not the hill. The bear.'
    ],
    sarcastic: [
        "Oh good, you're talking to me. Is that on the schedule?",
        "Keep walking. You're good at that.",
        "I'm still here. Don't read into it."
    ]
};

// One line per map, mixed into every band. The blueprint asks Katz's lines to
// point toward the next goal, so these nudge the player up the trail.
export const KATZ_MAP_LINES = {
    georgia: ['Every tree has a white stripe on it. Either that is the trail, or someone really loves paint.'],
    smokies: ['The sign says bears live here. I would like to speak to whoever approved that.'],
    shenandoah: ['They built a road right next to the trail. Somebody here has my priorities. Keep following the white paint.'],
    maine: ['A hundred miles of woods and no bears so far. I checked. You checked twice. Keep the blazes in sight.'],
    roadside: ['A road. An actual road. I could kiss it, but I have seen what drives on it.']
};

export function katzLinesFor(band, mapKey = null) {
    const base = KATZ_LINES[band]?.length ? KATZ_LINES[band] : KATZ_LINES.neutral;
    return [...base, ...(KATZ_MAP_LINES[mapKey] ?? [])];
}

// While Katz is home in Iowa (Act III, flag katzAway), pressing Space on the
// trail gives one of these narrator lines instead (design blueprint,
// Exploration). New writing for Milestone 10; the owner reviews it.
export const ALONE_LINES = [
    'I turn to say something to Katz. There is nobody there, just the trail and a chipmunk with no opinions.',
    'Walking alone, I notice I have started commenting on the scenery out loud. The trees are a poor audience.',
    'It is very quiet without someone complaining about it.'
];

// Said once when a stat enters its danger zone (design blueprint, Danger warning).
export const KATZ_WORRIED = {
    stamina: 'My legs have stopped speaking to me. Maybe we take it easy for a bit.',
    supplies: "Tell me there's more food in that pack. Please. Lie if you have to.",
    bond: "Go on ahead. I'll catch up. Or I won't. We'll see.",
    morale: 'Do you ever feel like the trail is winning?'
};

// The same warnings in the narrator's voice while Katz is away (Act III).
export const ALONE_WORRIED = {
    stamina: 'My legs have filed a complaint, and there is nobody here to forward it to.',
    supplies: 'I check the pack twice. There is less food in it than I would like.',
    bond: 'I think about the airport, and what I did or did not say.',
    morale: 'Some days the trail feels very long, and very empty.'
};
