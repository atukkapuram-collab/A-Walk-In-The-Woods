import { LEGEND } from './legend.js';

// Map 6: Maine, the Hundred-Mile Wilderness (Act IV; book chapters 19-21).
// Lakes, roots and rivers, late summer turning to autumn.
// Order: the Reunion plays as the map starts (bottom) -> E12 The River (the
// river gate opens to stepping stones) -> E13 Katz Is Lost (night; fourth
// ending check) -> log gate -> the logging road and the driver: the Final
// Crossroads (top). With "left the wilderness" set, E13 leads to the roadside map.
export default {
    key: 'maine',
    title: 'The Hundred-Mile Wilderness',
    season: 'Autumn',
    palette: 'autumn',
    weather: 'leaves',
    legend: LEGEND,
    markerTile: 'path',
    music: 'wilderness',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTT======TTTTTTTTTTTTTTTTTTTT', //  1
        'TTTTTT======TTTTTTTTTTTTTTTTTTTT', //  2
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

    // Scene 16, the Reunion: plays as the map starts.
    autoEvent: 'reunion',

    npcs: [
        // The driver on the logging road. His line is part of the Final Crossroads.
        { id: 'driver', x: 11, y: 2, facing: 'left', sprite: 'driver' }
    ],

    triggers: [
        { event: 'e12_river', x: 20, y: 35, w: 6, h: 1 },
        { event: 'e13_katz_is_lost', x: 6, y: 26, w: 2, h: 1 },
        // Where the trail meets the logging road.
        { event: 'final_crossroads', x: 8, y: 7, w: 2, h: 1 }
    ],

    gates: [
        { id: 'river', opensAfter: 'e12_river', opensTo: 'ford', tiles: [[22, 34], [23, 34]] },
        { id: 'slope-log', opensAfter: 'e13_katz_is_lost', tiles: [[6, 24], [7, 24]] }
    ],

    signs: [{ x: 20, y: 37, text: 'A warning sign: no supplies and no help for the next hundred miles. Do not attempt it without ten days of food. I count ours. Then I count it again.', journal: 'wilderness' }],
    overlook: { x: 24, y: 8, text: 'A lake lies perfectly still below, ringed with dark spruce. Somewhere a loon calls. I have stopped measuring the days in miles.' }
};
