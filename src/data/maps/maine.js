import { LEGEND } from './legend.js';

// Map 4: Maine, the Hundred-Mile Wilderness, autumn. Red and gold leaves, lakes.
// Design blueprint, Location Progression: river gate (Event 7), root-covered
// slope (Event 8), ends at the last campfire (Final Crossroads). No exit: the
// Final Crossroads always leads to an ending. If Event 8 sets "left the
// wilderness", the Journey skips the rest of this map (src/data/journey.js).
// Order: start (bottom) -> Dale -> Event 7 -> river (opens to stepping stones)
// -> Event 8 -> gate -> last campfire -> Final Crossroads.
export default {
    key: 'maine',
    title: 'The Hundred-Mile Wilderness',
    season: 'Autumn',
    palette: 'autumn',
    weather: 'leaves',
    legend: LEGEND,
    markerTile: 'path',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTT,,,,,,TTTTTTTTTTTTTTTTTTTT', //  1
        'TTTTTT,,,,,,TTTTTTTTTTTTTTTTTTTT', //  2
        'TTTTTT,,..,,TTTTTTTTTTTTTTTTTTTT', //  3
        'TTTTTT,,..,,TTTTTTTTTTT,,,,,,TTT', //  4
        'TTTTTT,,..,,TTTTTTTTTTT,WWWW,TTT', //  5
        'TTTTTB,,..,,TTTTTTTTTTT,WWWW,TTT', //  6
        'TTTTTTTT..TTTTTTTTTTTTT,WWWW,TTT', //  7
        'TTTTTT,,..,RTTTTBTTTTTT,LR,,,TTT', //  8
        'TTTTTT,,..,F,,,,,,,,,R,,TTTTTTTT', //  9
        'TTTTTT,,..,,,,,,,,,,,,,,TTTTTTTT', // 10
        'TTTTTB,,..............,,TTTTTTTT', // 11
        'TTTTTT,,..............,RTTTTTTTT', // 12
        'TTTTTT,,,,,,,,,,,,,,..,,BTTTTTTT', // 13
        'TTTTTT,,,,,,,,,,,,,,..,,TTTTTTTT', // 14
        'TTTTTTTTTTTTTTTTTT,,..,,TTTTTTTT', // 15
        'TTTTTTTTTTTTTTTTTT,,..,RTTTTTTTT', // 16
        'TTTTTTTBTTTTTTBTTT,,..,,TTTTTTTT', // 17
        'TTTT,,,,,,,,,,,,,,,,..,,TTTTTTTT', // 18
        'TTTT,,,,,,,,,,,,,,,,..,,TTTTTTTT', // 19
        'TTTT,,................,,BTTTTTTT', // 20
        'TTTT,,...............,,,TTTTTTTT', // 21
        'TWWWW,..,,,,,,,,,,,,,,,,TTTTTTTT', // 22
        'TWWWW,..,,,,,,,,,,,,,,,TTTTTTTTT', // 23
        'TTTTTTGGTTTTTTTTTTTTTTTTTTTTTTTT', // 24
        'TWWWW,..,,BTTTTTTTTTTTTTTTTTTTTT', // 25
        'TTTTTT..TTTTTTTTTTTTTTTTTTTTTTTT', // 26
        'TWWWW,..,,TTTTBTTTTTTBTTTTTTTTTT', // 27
        'TTTT,,..,,,,,,,,,,,,R,,,,,TTTTTT', // 28
        'TTTT,,..,,,,,,,,,,,,,,,,,,TTTTTT', // 29
        'TTTB,,..................,,TTTTTT', // 30
        'TTTT,,..................,,TTTTTT', // 31
        'TTTT,,,,,,,,,,,,,,,,,,..,,TTTTTT', // 32
        'TTTT,,,,,,,,,,,,,,,,,,..,,TTTTTT', // 33
        'TTTTTTTTTT,WWWW,WWWWWWHHWWWWWWTT', // 34
        'TTTTTTTTTT,WWWW,TTTB,,..,,TTTTTT', // 35
        'TTTTTTTTTT,WWWW,TTTT,,..,,TTTTTT', // 36
        'TTTTTTTTTT,,,,,,TTTTN,..,,TTTTTT', // 37
        'TTTTTTTTTTTTTTTTTTTT,,P.,,TTTTTT', // 38
        'TTTTTTTTTTTTTTTTTTTT,,K,,,TTTTTT', // 39
        'TTTTTTTTTTTTTTTTTTTT,,,,,,TTTTTT', // 40
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'  // 41
    ],

    npcs: [
        // Dale's cameo at the river (Event 7). His line is part of the event.
        { id: 'dale', x: 25, y: 36, facing: 'left', sprite: 'dale' }
    ],

    triggers: [
        { event: 'event7_river', x: 20, y: 35, w: 6, h: 1 },
        { event: 'event8_fall', x: 6, y: 26, w: 2, h: 1 },
        { event: 'final_crossroads', x: 8, y: 7, w: 2, h: 1 }
    ],

    gates: [
        { id: 'river', opensAfter: 'event7_river', opensTo: 'ford', tiles: [[22, 34], [23, 34]] },
        { id: 'slope-log', opensAfter: 'event8_fall', tiles: [[6, 24], [7, 24]] }
    ],

    // Sign and overlook lines: the narrator's voice for this act (Milestone 5).
    signs: [{ x: 20, y: 37, text: 'A warning sign: no supplies and no help for the next hundred miles, so carry enough food. You count yours. Then you count it again.' }],
    overlook: { x: 24, y: 8, text: "An icy lake lies perfectly still below, ringed with red and gold. Somewhere a loon calls. You've stopped measuring days in miles." }
};
