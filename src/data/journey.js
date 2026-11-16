// The order of the whole walk, following the book (design blueprint,
// Location Progression; docs/scene-outline.md): the Prologue, four acts, six
// trail maps and the travel screens between them.
// The Journey director (src/systems/Journey.js) steps through this list.
//
// Step types:
//   { type: 'opening' }                   Scene 1: illustrated panels (OpeningScene)
//   { type: 'act', title, subtitle }      act title card, about 2 seconds (ActCardScene);
//                                         the subtitle names the book chapters
//   { type: 'map', map, katzAway? }       a trail map; its exit moves to the next step (TrailScene).
//                                         katzAway: Katz is home in Iowa when this map
//                                         starts (used by debug starts, which skip E8)
//   { type: 'travel', label, to, miles, line, solo?, carIfSkipped, carLine }
//                                         travel screen to the next map. The marker moves to
//                                         trail mile `to` (where the next map is) and `miles`
//                                         are added as WALKED (TravelScene). With carIfSkipped
//                                         and the "skipped ahead" flag set, the rental car
//                                         carries them instead: no miles walked, and the
//                                         stretch is drawn dashed; `carLine` replaces `line`.
//                                         solo: Bryson travels alone (one walker), even
//                                         after the phone call has brought Katz back.
//
// Miles are TUNING values (Milestone 14): on the book's path (the car in
// Gatlinburg, Part 2 walked in pieces) the total comes to about Bryson and
// Katz's 870. They never decide an ending. Travel lines are new writing for
// the owner to review.
export const JOURNEY = [
    { type: 'act', title: 'Prologue: Hanover', subtitle: 'Chapter 1 · Winter' },
    { type: 'opening' },
    { type: 'act', title: 'Act I: Georgia', subtitle: 'Chapters 2–5 · March' },
    { type: 'map', map: 'georgia' },
    {
        type: 'travel', label: 'April · Great Smoky Mountains', to: 165, miles: 165,
        line: 'Somewhere around mile 100, my feet file a formal complaint.'
    },
    { type: 'act', title: 'Act II: The Smokies and Shenandoah', subtitle: 'Chapters 6–11 · Spring' },
    { type: 'map', map: 'smokies' },
    {
        type: 'travel', label: 'May · Shenandoah, Virginia', to: 860, miles: 650,
        line: 'Six hundred and fifty miles of Tennessee, North Carolina and Virginia, every one of them on foot.',
        carIfSkipped: true,
        carLine: 'We drive six hundred and fifty miles in a rented car. The trail watches us go by.'
    },
    { type: 'map', map: 'shenandoah' },
    {
        type: 'travel', label: 'Summer · Pennsylvania', to: 1150, miles: 190, solo: true,
        line: 'Katz flies home to Iowa. I go home to Hanover, then back to the trail, alone.'
    },
    { type: 'act', title: 'Act III: Alone', subtitle: 'Chapters 12–18 · Summer' },
    { type: 'map', map: 'pennsylvania', katzAway: true },
    {
        type: 'travel', label: 'Late Summer · The White Mountains', to: 1860, miles: 400, solo: true,
        line: 'New Jersey, New York, Connecticut, Massachusetts, Vermont. I walk them in pieces.'
    },
    { type: 'map', map: 'newengland', katzAway: true },
    {
        type: 'travel', label: 'Late Summer · The Hundred-Mile Wilderness, Maine', to: 2060, miles: 115, solo: true,
        line: 'North again, to Maine and the last real wilderness on the trail.'
    },
    { type: 'act', title: 'Act IV: Maine', subtitle: 'Chapters 19–21 · Late Summer' },
    { type: 'map', map: 'maine' }
    // Maine has no exit: the Final Crossroads always leads to an ending.
];

// Special case (design blueprint): "left the wilderness" (E13) skips the rest
// of Maine and the Final Crossroads happens at the roadside.
export const DETOURS = [
    { map: 'maine', afterEvent: 'e13_katz_is_lost', flag: 'leftWilderness', goTo: 'roadside' }
];
