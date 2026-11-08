// What Katz says when you press Space next to him (design blueprint, Exploration).
// His tone follows Bond (scene outline): warm at 7+, sarcastic at 4 or less,
// neutral in between. Only the line changes, never the story.
//
// The neutral lines are the sample lines from docs/story.md (DOC). The warm,
// sarcastic, per-map and worried lines are new writing for Milestone 5.
export const KATZ_LINES = {
    warm: [
        "Admit it. You'd be bored out here without me.",
        "I'm not saying this is fun. I'm saying I'd do it again. Don't quote me.",
        "The trail's alright, you know? Don't tell the trail I said that."
    ],
    neutral: [
        'Nature is just outside with extra steps.', // DOC
        "I'm not quitting. I'm resting aggressively.", // DOC
        'If I die out here, tell people it was a bear. Not the hill. The bear.' // DOC
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
    virginia: ["It's the same hill. I swear we've done this hill. Keep following the white paint, I guess."],
    maine: ['No roads for a hundred miles. Even the trees look nervous. Keep the blazes in sight.'],
    roadside: ['An ice machine. Civilization. I could weep.']
};

export function katzLinesFor(band, mapKey = null) {
    const base = KATZ_LINES[band]?.length ? KATZ_LINES[band] : KATZ_LINES.neutral;
    return [...base, ...(KATZ_MAP_LINES[mapKey] ?? [])];
}

// Said once when a stat enters its danger zone (design blueprint, Danger warning).
export const KATZ_WORRIED = {
    stamina: 'My legs have stopped speaking to me. Maybe we take it easy for a bit.',
    supplies: "Tell me there's more food in that pack. Please. Lie if you have to.",
    bond: "Go on ahead. I'll catch up. Or I won't. We'll see.",
    morale: 'Do you ever feel like the trail is winning?'
};
