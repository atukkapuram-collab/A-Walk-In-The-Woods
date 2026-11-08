import { LEGEND } from './legend.js';

// Map 2: Great Smoky Mountains, late spring. Fog, snow patches, bear signs.
// Design blueprint, Location Progression: snowed-in shelter (Event 3), night
// campsite (Event 4, dark tint), ends at the trail exit.
// Order on the trail: start (bottom-left) -> shelter and Dale -> Event 3 ->
// snowdrift gate -> campfire -> Event 4 (night) -> fallen-tree gate -> exit (top).
// Rows were carved with a helper script; edit them by hand freely. `npm test` checks them.
export default {
    key: 'smokies',
    title: 'Great Smoky Mountains',
    season: 'Late spring',
    palette: 'smokies',
    weather: 'snow',
    legend: LEGEND,
    markerTile: 'path',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTTTTTTTTTTTTTTTT,,..,,TTTTTT', //  1
        'TTTTTTTTTTTTTTTTTTTT,,..,,TTTTTT', //  2
        'TTTTTTTTTTTTTTTTTTTT,,..,,,,,,TT', //  3
        'TTTTTTTTTTTTTTTTTTTT,,..,,,,XLTT', //  4
        'TTTTTTTTTTTTTTTTTTTB,,..,,X,,,TT', //  5
        'TTTTTTTTTTTTTBTTTTTTX,..,,,,,,TT', //  6
        'TTTTTTR,,X,,,,,,,,,,,,..,,TTTTTT', //  7
        'TTTTTT,,,,,,,,,,,,,,,,..,RTTTTTT', //  8
        'TTTTTTX,................,XTTTTTT', //  9
        'TTTTTB,,...............,,,TTTTTT', // 10
        'TTTTTTX,..,,,,,,,,,,,,,,X,TTTTTT', // 11
        'TTTTTTTTGGTTTTT,,,,,X,,,,TTTTTTT', // 12
        'TTTTTT,,..,,TTTTTTTTBTTTTTTTTTTT', // 13
        'TTTTTT,,..,,TTTTTTTTTTTTTTTTTTTT', // 14
        'TTTTTTTT..TTTTTTTTTTTTTTTTTTTTTT', // 15
        'TTTTTT,,..,FBTTTTTTBTTTTTTTTTTTT', // 16
        'TTTTTB,,..,,,,,,,,,,,X,,,,,,TTTT', // 17
        'TTTTTT,,..,,,,,,,,,,,,,,,,,,TTTT', // 18
        'TTTTTT,,..................,,TTTT', // 19
        'TTTTTT,,..................,RBTTT', // 20
        'TTTTTT,,,,,,,,,,,,,,,,,,..,,TTTT', // 21
        'TTTTTT,,X,,,,,X,R,,TTTTTDDTTTTTT', // 22
        'TTTTTTTTTTTTTTTTTTTTTTR,..,,TTTT', // 23
        'TTTTTTTTTTTTTTTTTTTTTT,,..,,TTTT', // 24
        'TTTTTTTTTTTTBTTTTTTBTTTT..TTTTTT', // 25
        'TTT,,,,X,,X,,,R,,,X,,,X,..,STTTT', // 26
        'TTT,,,,,,,,,,,,,,,,,,,,,..,,BTTT', // 27
        'TTBR,.....................,,TTTT', // 28
        'TTT,,....................,,,TTTT', // 29
        'T,,,,..,,,,,,,,,,,,,,,,,,,,,TTTT', // 30
        'TX,,,..,X,,X,X,,,,,,,,,,,,,TTTTT', // 31
        'T,,,,..,,TTTTTTTTTTTTTTTTTTTTTTT', // 32
        'T,,,,..,,TTTTTTTTTTTTTTTTTTTTTTT', // 33
        'TTB,,..,,TTTTTTTTTTTTTTTTTTTTTTT', // 34
        'TTT,,..,,TTTTTTTTTTTTTTTTTTTTTTT', // 35
        'TTTN,..,,TTTTTTTTTTTTTTTTTTTTTTT', // 36
        'TTT,,P.,,TTTTTTTTTTTTTTTTTTTTTTT', // 37
        'TTT,,K,,XTTTTTTTTTTTTTTTTTTTTTTT', // 38
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'  // 39
    ],

    npcs: [
        // Dale is inside the packed shelter during the Whiteout (Event 3). His lines are part of the event.
        { id: 'dale', x: 26, y: 27, facing: 'left', sprite: 'dale' }
    ],

    triggers: [
        { event: 'event3_whiteout', x: 24, y: 25, w: 2, h: 1 },
        { event: 'event4_night_visitor', x: 8, y: 15, w: 2, h: 1 }
    ],

    gates: [
        { id: 'snowdrift', opensAfter: 'event3_whiteout', tiles: [[24, 22], [25, 22]] },
        { id: 'fallen-tree', opensAfter: 'event4_night_visitor', tiles: [[8, 12], [9, 12]] }
    ],

    // Sign and overlook lines: the narrator's voice for this act (Milestone 5).
    signs: [{ x: 3, y: 36, text: 'Bears live here, says the sign, and lists what to do if you meet one. Katz reads it twice and walks a little closer to you.' }],
    overlook: { x: 29, y: 4, text: 'Fog fills the valleys below, and the ridges float above it like islands. You forget to check your watch.' },

    exit: { x: 20, y: 1, w: 6, h: 1 }
};
