import { LEGEND } from './legend.js';

// Map 3: Virginia, midsummer. Hot green ridges and the trail town of Pine Gap.
// Design blueprint, Location Progression: Pine Gap at the start with Hazel's
// diner (Event 5), the dry spring on the ridge (Event 6), ends at the campfire
// (midpoint scene). Order: Pine Gap (bottom) -> Hazel -> gate -> Event 6 ->
// gate -> campfire and Sunshine -> midpoint -> exit (top).
export default {
    key: 'virginia',
    title: 'Virginia',
    season: 'Midsummer',
    palette: 'summer',
    weather: null,
    legend: LEGEND,
    markerTile: 'path',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTTTT,,,,,,TTTTTTTTTTTTTTTTTT', //  1
        'TTTTTTTT,,..,,TTTTTTTTTTTTTTTTTT', //  2
        'TTTTTTTT,,..,,TTTTTTTTTTTTTTTTTT', //  3
        'TTTTTTTT,,..,,TTTTTTTTTTTTTTTTTT', //  4
        'TTTTTTTB,,..,,TTTTTTTTTTTTTTTTTT', //  5
        'TTTTTTTTTT..TTTTTTTTTTTTTTTTTTTT', //  6
        'TTTTTTTT,,..,,TTTTTTTTTTTTTTTTTT', //  7
        'TTTTTTTT,,..,,TTTTTTTTTTTTTTTTTT', //  8
        'TTTTTTTT,,..,FTTBTTTTTTBTT,,LTTT', //  9
        'TTTTTTTT,,..,,,,,,,,,,,,,,,,,TTT', // 10
        'TTTTTTTT,,..,,,,,,,,,,,,,,,,,TTT', // 11
        'TTTTTTTB,,................,,,TTT', // 12
        'TTTTTTTT,,................,,TTTT', // 13
        'TTTTTTTTR,,,,,,,,,,,,,,,..,,TTTT', // 14
        'TTTTTTTT,,,,,,,,,,,,,,,,..,,TTTT', // 15
        'TTTTTTTTTTTTTTTTTTTTTT,,..,,TTTT', // 16
        'TTTTTTTTTTTTTTTTTTTTTB,,..,,TTTT', // 17
        'TTTTTTTTTTTTTTTTTTTTTT,,..,,TTTT', // 18
        'TTTTTTTTTBTTTTTTBTTTTT,,..,RTTTT', // 19
        'TTT,,,R,,,,,,,,,,,,,,,,,..,,TTTT', // 20
        'TTT,,,,,,,,,,,,,,,,,,,,,..,,TTTT', // 21
        'TTT,,.....................,,BTTT', // 22
        'TTT,,....................,,,TTTT', // 23
        'TTB,,..,,,,,,,,,,,,,,,,,,,,,TTTT', // 24
        'TTT,,..,R,,,,,,,,,,,,,,,,,,TTTTT', // 25
        'TTTTTGGTTTTTTTTTTTTTTTTTTTTTTTTT', // 26
        'TTT,,..,,TTTTTTTTTTTTTTTTTTTTTTT', // 27
        'TTTTT..TTTTTTTTTTTTTTTTTTTTTTTTT', // 28
        'TTTR,..,R,,,,,,,,,TTTTTTTTTTTTTT', // 29
        'TTT,,..,,,,,,,,,,,TTTTTTTTTTTTTT', // 30
        'TTB,,...........,,TTTTTTTTTTTTTT', // 31
        'TTT,,...........,,TTTTTTTTTTTTTT', // 32
        'TTT,,,,,,TTBTTGGTTTTTTTTTTTTTTTT', // 33
        'TT,MMMMMMM,,,,..,,,MMMMM,,,,TTTT', // 34
        'TT,YYYQYYY,,,,..,,,YYQYY,,,,TTTT', // 35
        'TT,,,,,,,,,,,,..,N,,,,,,,,,,TTTT', // 36
        'TT,,,,,,,,R,,,P.,,,,,,,,,,,,TTTT', // 37
        'TT,,,,,,,,,,,,K,,,,,,,,,,,,,TTTT', // 38
        'TT==========================TTTT', // 39
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', // 40
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'  // 41
    ],

    npcs: [
        // Hazel runs the diner and hostel in Pine Gap. Talk to her for Event 5.
        { id: 'hazel', x: 6, y: 36, facing: 'down', sprite: 'hazel', talk: 'event5_pine_gap' },
        // Sunshine passes your camp at the midpoint. Her line is part of the midpoint scene.
        { id: 'sunshine', x: 12, y: 10, facing: 'left', sprite: 'sunshine' }
    ],

    triggers: [
        { event: 'event6_last_bottle', x: 5, y: 28, w: 2, h: 1 },
        { event: 'midpoint_campfire', x: 10, y: 6, w: 2, h: 1 }
    ],

    gates: [
        { id: 'pine-gap-log', opensAfter: 'event5_pine_gap', tiles: [[14, 33], [15, 33]] },
        { id: 'ridge-log', opensAfter: 'event6_last_bottle', tiles: [[5, 26], [6, 26]] }
    ],

    // Sign and overlook lines: the narrator's voice for this act (Milestone 5).
    signs: [{ x: 17, y: 36, text: 'Pine Gap, Virginia. Diner. Hostel. Showers. Underneath, someone has added in marker: PIE.' }],
    overlook: { x: 28, y: 9, text: 'Green ridges roll away to the horizon. Much of this was cut for timber once. The forest grew back, slowly, because people let it.' },

    exit: { x: 8, y: 1, w: 6, h: 1 }
};
