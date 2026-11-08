// Map 1: North Georgia, early spring. Cold rain, steep switchbacks.
// Design blueprint, Location Progression: the outfitter at the trailhead
// (Event 1), the muddy climb (Event 2), ends at the shelter (Act I close).
// Order: trailhead, salesman and Dale (bottom) -> Event 1 -> log gate ->
// Sunshine -> Event 2 (muddy climb) -> shelter and campfire -> Act I close ->
// exit (top). Legend: src/data/maps/legend.js. `npm test` checks this map.
import { LEGEND } from './legend.js';

export default {
    key: 'georgia',
    title: 'North Georgia',
    season: 'Early spring',
    palette: 'spring',
    weather: 'rain',
    legend: LEGEND,
    markerTile: 'path',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTTTTTTTTTTTTTTTT,..,TTTTTT', //  1  the trail continues north
        'TTTTTTTTTTTTTTTTTTT,,..,,TTTTT', //  2
        'TTTTTTTTTTTRRTTTTTT,,..,,RTTTT', //  3
        'TTTTTTTT,,,,,,TTTTB,,..,,STTTT', //  4
        'TTTTTTT,,,,,,,,TTT,,,..,F,TTTT', //  5
        'TTTTTTT,,WWW,,,,,,,,,,..,,TTTT', //  6  pond nook to the west
        'TTTTTTT,,WWW..............,TTT', //  7
        'TTTTTTTT,..,,,,,,,,,,,,,TTTTTT', //  8
        'TTTTTTTTT..,,,,RR,,,,TTTTTTTTT', //  9
        'TTTTTTTT,..,,,,,,,,TTTTTTTTTTT', // 10
        'TTTTL,,,,..,,,,,TTTTTTTTTTTTTT', // 11  side nook to the west
        'TTT,R,,,,..,,,BTTTTTTTTTTTTTTT', // 12
        'TTT,,,,,,..,,,,TTTTTTTTTTTTTTT', // 13
        'TTTT,,,,,..,,,,,TTTTTTTTTTTTTT', // 14  muddy climb: Event 2 across this row
        'TTTTT,,,,..,,,,,,,,TTTTTTTTTTT', // 15
        'TTTTT,,,,.......,,,,TTTTTTTTTT', // 16
        'TTTTTT,,,,,,,,,..,,,,,TTTTTTTT', // 17
        'TTTTTTTRR,,,,,,..,,,WW,TTTTTTT', // 18
        'TTTTTTTT,,,,,,,..,WWWW,TTTTTTT', // 19  stream to the east
        'TTTTTTTTT,,,,,,..,,WW,,TTTTTTT', // 20
        'TTTTTTTTTT,,,,,..,,,,,,TTTTTTT', // 21
        'TTTTTTTTTT,,B,,..,,,,,TTTTTTTT', // 22
        'TTTTTTTTTTTTTTTGGTTTTTTTTTTTTT', // 23  fallen log: opens after Event 1
        'TTTTTTTTT,,,,,,..,,,,,,TTTTTTT', // 24
        'TTTTTTTT,,R,,,,..,,,,,,,TTTTTT', // 25
        'TTTTTTTT,,,,,,,..,,,,,,,TTTTTT', // 26
        'TTTTTTTT,,,,,,,..N,,R,,,TTTTTT', // 27
        'TTTTTTTT,,,,,,,P.,,,,,,TTTTTTT', // 28  trailhead
        'TTTTTTTT,,,,,,,K.,,,,,,TTTTTTT', // 29
        'TTTTTTTTT,,,,,,..,,,,,TTTTTTTT', // 30
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'  // 31
    ],

    // Show the "walk" and "talk" hints on this map (tutorial, design blueprint).
    tutorialHints: true,

    // Talk triggers: face the character and press Space or Enter.
    // Both the salesman and Dale start the outfitter event.
    npcs: [
        { id: 'salesman', x: 13, y: 27, facing: 'right', sprite: 'salesman', talk: 'event1_outfitter' },
        { id: 'dale', x: 13, y: 26, facing: 'right', sprite: 'dale', talk: 'event1_outfitter' },
        // Sunshine jogs past on the first steps, before the muddy climb ("Morning!").
        { id: 'sunshine', x: 18, y: 21, facing: 'down', sprite: 'sunshine', talk: 'sunshine_morning' }
    ],

    // Step triggers: a rectangle of tiles; the event starts when a step ends inside it.
    triggers: [
        { event: 'event2_going_home', x: 4, y: 14, w: 12, h: 1 },
        // At the crowded shelter: the first night under the stars (Act I close).
        { event: 'act1_close', x: 19, y: 3, w: 6, h: 1 }
    ],

    // Sign and overlook lines: the narrator's voice for this act (Milestone 5).
    signs: [{ x: 17, y: 27, text: "The sign says Katahdin, Maine: 2,190 miles. At fourteen miles a day you'll be done by August. You have checked this math eleven times." }],
    overlook: { x: 4, y: 11, text: "Through the bare trees, ridge after ridge fades into the rain. Every one is a mile you have to walk, and for a moment you don't mind." },

    // Exit: the trail's north end leads to the travel screen and Map 2.
    exit: { x: 20, y: 1, w: 4, h: 1 },

    // Gates: solid until their event is finished, then they become path.
    gates: [
        { id: 'trailhead-log', opensAfter: 'event1_outfitter', tiles: [[15, 23], [16, 23]] }
    ]
};
