import { LEGEND } from './legend.js';

// The roadside (design blueprint, special cases): if E13 sets "left the
// wilderness", the rest of Maine is skipped and the Final Crossroads happens
// here, on the logging road where Katz turned up. A one-screen backdrop: the Final Crossroads
// starts as soon as the map loads (`autoEvent`).
export default {
    key: 'roadside',
    title: 'The logging road',
    season: 'Autumn',
    palette: 'autumn',
    weather: 'leaves',
    legend: LEGEND,
    markerTile: 'path',
    music: 'wilderness',
    autoEvent: 'final_crossroads',
    npcs: [{ id: 'driver', x: 18, y: 7, facing: 'left', sprite: 'driver' }],
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTBTTTTTTTTTTTTTTTBTTTT', //  1
        'TT,,,,,,,,,,,,,,,,,,,,TT', //  2
        'TT,,,,,,,,,,,,,,,,R,,,TT', //  3
        'TT,,,,,,,..F..,,,,,,,,TT', //  4
        'TT,,,,,,,.PK..,,,,,,,,TT', //  5
        'TT,,,,,,,,,,,,,,,,,,,,TT', //  6
        'TT,,R,,,,,,,,,,,,,,,,,TT', //  7
        'T======================T', //  8
        'T======================T', //  9
        'TT,,,,,,,,,,,,,,,,,,,,TT', // 10
        'TT,,,,,,,,,,,,,,,,,,,,TT', // 11
        'TTTTTTTTTTTTTTTTTTTTTTTT', // 12
        'TTTTTTTTTTTTTTTTTTTTTTTT'  // 13
    ]
};
