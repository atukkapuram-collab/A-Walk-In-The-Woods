import { LEGEND } from './legend.js';

// The roadside campground (design blueprint, special cases): if Event 8 sets
// "left the wilderness", the rest of Maine is skipped and the Final Crossroads
// happens here, by a logging road. A one-screen backdrop: the Final Crossroads
// starts as soon as the map loads (`autoEvent`).
export default {
    key: 'roadside',
    title: 'A roadside campground',
    season: 'Autumn',
    palette: 'autumn',
    weather: 'leaves',
    legend: LEGEND,
    markerTile: 'path',
    autoEvent: 'final_crossroads',
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
