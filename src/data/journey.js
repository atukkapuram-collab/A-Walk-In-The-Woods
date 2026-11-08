// The order of the whole walk (design blueprint, Location Progression and
// Transitions): the opening, act cards, the four maps, and the travel screens
// between them.
// The Journey director (src/systems/Journey.js) steps through this list.
//
// Step types:
//   { type: 'opening' }                   Scene 1: illustrated panels and name entry (OpeningScene)
//   { type: 'act', title, subtitle }      act title card, about 2 seconds (ActCardScene)
//   { type: 'map', map }                  a trail map; its exit moves to the next step (TrailScene)
//   { type: 'travel', label, miles, line, truckIfSkipped, truckLine }
//                                         travel screen to the next map; adds `miles`
//                                         (TravelScene). `line` is the optional narrator
//                                         line; with truckIfSkipped and the "skipped ahead"
//                                         flag set, the pickup-truck version and `truckLine`.
//
// Miles are TUNING values (the docs leave them open, plan section 8). They are
// roughly where each section sits on the real 2,190-mile trail, minus what
// event choices add. Miles never decide an ending.
// Travel lines are new writing for Milestone 6; the first adapts the
// blueprint's example ("my feet filed a formal complaint") to the game's
// second-person narration.
export const JOURNEY = [
    { type: 'opening' },
    { type: 'act', title: 'Act I: The Beginning', subtitle: 'Georgia, early spring' },
    { type: 'map', map: 'georgia' },
    {
        type: 'travel', label: 'Late Spring · Great Smoky Mountains', miles: 160,
        line: 'Somewhere around mile 100, your feet file a formal complaint.'
    },
    { type: 'act', title: 'Act II: The Middle', subtitle: 'The Smokies and Virginia' },
    { type: 'map', map: 'smokies' },
    {
        type: 'travel', label: 'Midsummer · Virginia', miles: 380,
        line: 'The snow melts into green. Katz starts naming the hills. All of them are called Gary.'
    },
    { type: 'map', map: 'virginia' },
    {
        type: 'travel', label: 'Autumn · The Hundred-Mile Wilderness, Maine', miles: 1420,
        line: 'A whole summer of rocks, mud and borrowed showers. You stop counting days and start counting lakes.',
        truckIfSkipped: true,
        truckLine: 'Thanks to a certain pickup truck, a hundred miles of it go by with the radio on. Then a whole summer of rocks and mud.'
    },
    { type: 'act', title: 'Act III: The Climax', subtitle: 'Maine, autumn' },
    { type: 'map', map: 'maine' }
    // Maine has no exit: the Final Crossroads always leads to an ending.
];

// Special case (design blueprint): "Left the wilderness (Event 8): the rest of
// Map 4 is skipped. Fade straight to a roadside campground backdrop for the
// Final Crossroads."
export const DETOURS = [
    { map: 'maine', afterEvent: 'event8_fall', flag: 'leftWilderness', goTo: 'roadside' }
];
