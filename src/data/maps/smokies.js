import { LEGEND } from './legend.js';

// Map 2: the Great Smoky Mountains, then Gatlinburg (book chapters 6-8).
// Snow, fog, dying firs and bear signs.
// Order on the trail: start (bottom-left) -> snowbound shelter and hikers ->
// E4 Snowstorm -> snowdrift gate -> campfire -> E5 Night Noises (night) ->
// fallen-tree gate -> the road down to Gatlinburg: E6 The Rental Car -> exit (top).
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
        'TTTTTTTTTTTTTTTTTTTT======TTTTTT', //  1
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
        // Hikers in the packed shelter during the snowstorm (E4). Their line is part of the event.
        { id: 'hiker', x: 26, y: 27, facing: 'left', sprite: 'hiker1' },
        // The rental clerk by the road into Gatlinburg (E6).
        { id: 'clerk', x: 26, y: 3, facing: 'left', sprite: 'clerk' }
    ],

    triggers: [
        { event: 'e4_snowstorm', x: 24, y: 25, w: 2, h: 1 },
        { event: 'e5_night_noises', x: 8, y: 15, w: 2, h: 1 },
        // Gatlinburg, where the road comes in: E6 (first ending check).
        { event: 'e6_rental_car', x: 20, y: 2, w: 6, h: 1 }
    ],

    gates: [
        { id: 'snowdrift', opensAfter: 'e4_snowstorm', tiles: [[24, 22], [25, 22]] },
        { id: 'fallen-tree', opensAfter: 'e5_night_noises', tiles: [[8, 12], [9, 12]] }
    ],

    signs: [{ x: 3, y: 36, text: 'Bears live here, says the sign, and lists what to do if you meet one. Katz reads it twice and walks a little closer to me.', journal: 'bears' }],
    overlook: { x: 29, y: 4, text: 'Below, whole ridges of Fraser firs stand grey and dead. From up here the forest looks like a ghost of itself.', journal: 'firs' },

    exit: { x: 20, y: 1, w: 6, h: 1 }
};
