import { LEGEND } from './legend.js';

// Map 3: Shenandoah National Park, Virginia (book chapters 8-11). Gentle,
// green and tamed: Skyline Drive runs along the bottom with a wayside.
// Order: Skyline Drive and the wayside (bottom) -> the day-tripper: E7 ->
// log gate -> the ridge (signs, overlook) -> campfire: midpoint (night) ->
// E8 Katz Goes Home (second ending check) -> exit (top) to Act III.
export default {
    key: 'shenandoah',
    title: 'Shenandoah',
    season: 'Spring',
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
        'TTTTTTTTTNTTTTTTNTTTTT,,..,RTTTT', // 19
        'TTT,,,R,,,,,,,,,,,,,,,,,..,,TTTT', // 20
        'TTT,,,,,,,,,,,,,,,,,,,,,..,,TTTT', // 21
        'TTT,,.....................,,BTTT', // 22
        'TTT,,....................,,,TTTT', // 23
        'TTB,,..,,,,,,,,,,,,,,,,,,,,,TTTT', // 24
        'TTT,,..,R,,,,,,,,,,,,,,,,,,TTTTT', // 25
        'TTTTT..TTTTTTTTTTTTTTTTTTTTTTTTT', // 26
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
        // A day-tripper at the wayside door. Talk to her for E7.
        { id: 'daytripper', x: 6, y: 36, facing: 'down', sprite: 'daytripper', talk: 'e7_skyline' }
    ],

    triggers: [
        { event: 'midpoint_campfire', x: 10, y: 6, w: 2, h: 1 },
        // The road out, a few days later: Katz goes home (E8).
        { event: 'e8_katz_goes_home', x: 8, y: 3, w: 6, h: 1 }
    ],

    gates: [
        { id: 'wayside-log', opensAfter: 'e7_skyline', tiles: [[14, 33], [15, 33]] }
    ],

    signs: [
        { x: 17, y: 36, text: "Skyline Drive. A plaque says the park opened in the 1930s. It says very little about the mountain families who lived here first.", journal: 'shenandoah' },
        { x: 9, y: 19, text: 'A trail register on a post. Someone has copied out a note about Earl Shaffer, who in 1948 walked the whole trail in one go.', journal: 'shaffer' },
        { x: 16, y: 19, text: "A faded sign shows Asher Durand's painting of an old American forest: huge trees, deep shade. Almost none of it is left.", journal: 'durand' }
    ],
    overlook: { x: 28, y: 9, text: 'Green ridges to the horizon. Once, a quarter of these trees were chestnuts. A blight killed nearly every one.', journal: 'chestnut' },

    exit: { x: 8, y: 1, w: 6, h: 1 }
};
