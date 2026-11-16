import { LEGEND } from './legend.js';

// Map 4: Pennsylvania and the Mid-Atlantic (Act III, Alone; book chapters
// 12-14). Hot summer, endless rocks. Katz is home in Iowa: no follower here.
// Order: the car park (bottom; Home in Hanover plays as the map starts) ->
// E9 Car Hiking -> the boulder field (west: the closed highway to Centralia;
// east: the overlook) -> the northern clearing -> exit (top).
// Rows were carved with a helper script; edit them by hand freely. `npm test` checks them.
export default {
    key: 'pennsylvania',
    title: 'Pennsylvania',
    season: 'Summer',
    palette: 'summer',
    weather: null,
    legend: LEGEND,
    markerTile: 'path',
    music: 'alone',
    // Scene 12, Home in Hanover: one result card as the map starts.
    autoEvent: 'home_in_hanover',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', //  1
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', //  2
        'TTTTTTTTTTTTTT..BTTTTTTTTTTTTT', //  3
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', //  4
        'TTTTTTTTT,,,,,..,,,,,TTTTTTTTT', //  5
        'TTTTTTTTT,,,,,..,,,,,TTTTTTTTT', //  6
        'TTTTTTTTB,,R,,..,,,,,TTTTTTTTT', //  7
        'TTTTTTTTT,,,,,..N,,,,TTTTTTTTT', //  8
        'TTTTTTTTT,,,,,..,,R,,BTTTTTTTT', //  9
        'TTTTTTTTT,,,,,..,,,,,TTTTTTTTT', // 10
        'TTTTTTTTT,,,,,..,,,,,TTTTTTTTT', // 11
        'TTTTTTTTTTTTTB..TTTTTTTTTTTTTT', // 12
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', // 13
        'TTTTTB,,,,,,,,..,,,,,,,,TTTTTT', // 14
        'TTTTTT,,,,,O,,..,,,,,O,,,LTTTT', // 15
        'TT,V,,,,O,,,,,..,O,,,,,,TTTTTT', // 16
        'TT~~~~,,,,,,,,..,,,,,,,,BTTTTT', // 17
        'TT~~~~,,,,,,,,..,,O,,,,,TTTTTT', // 18
        'TTN,V,,,,,O,,,..,,,O,,,,TTTTTT', // 19
        'TTTTTT,,O,,,O,..,,,,,O,,TTTTTT', // 20
        'TTTTTT,,,,,,,,..,,,,,,,,TTTTTT', // 21
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', // 22
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', // 23
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', // 24
        'TTTTTTTB,,,,,,..,,,,,,TTTTTTTT', // 25
        'TTTTTTTT,,,,,,..,,,,,,BTTTTTTT', // 26
        'TTTTTTTT,,,,,N..,,,,,,TTTTTTTT', // 27
        'TTTTTTTT,,,,,,.P,,,,,,TTTTTTTT', // 28
        'TTTTTTTT,,,,,,.K,U,,,,TTTTTTTT', // 29
        'TTT========================TTT', // 30
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'  // 31
    ],

    triggers: [
        { event: 'e9_car_hiking', x: 14, y: 23, w: 2, h: 1 }
    ],

    signs: [
        { x: 13, y: 27, text: 'Pennsylvania, says the sign. Hikers call it Rocksylvania. Underneath, someone has scratched: "where boots come to die."' },
        { x: 2, y: 19, text: 'ROAD CLOSED. Past the sign the old highway to Centralia is cracked and buckled, and thin smoke leaks out of the ground.' },
        { x: 16, y: 8, text: 'Delaware Water Gap, 40 miles. Then New Jersey, which turns out to be far wilder and prettier than its turnpike suggests.' }
    ],
    overlook: { x: 25, y: 15, text: 'From the ridge, farms and small towns spread out like a quilt. I wish, briefly, that there were someone here to point at it with.' },

    exit: { x: 14, y: 1, w: 2, h: 1 }
};
