// Map 1: North Georgia in March (book chapters 2-5). Cold rain, bare trees,
// steep switchbacks: Amicalola Falls and Springer Mountain.
// Design blueprint, Location Progression. Order: trailhead (bottom) ->
// E2 Katz Lightens His Load (the first climb) -> log gate -> E3 Mary Ellen
// (she meets you on the trail) -> shelter and campfire -> Act I close (night)
// -> exit (top). Legend: src/data/maps/legend.js. `npm test` checks this map.
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
        'TTT,R,,,,..,,,NTTTTTTTTTTTTTTT', // 12
        'TTT,,,,,,..,,,,TTTTTTTTTTTTTTT', // 13
        'TTTT,,,,,..,,,,,TTTTTTTTTTTTTT', // 14  muddy climb: Event 2 across this row
        'TTTTT,,,,..,,,,,,,,TTTTTTTTTTT', // 15
        'TTTTT,,,,.......,,,,TTTTTTTTTT', // 16
        'TTTTTT,,,,,,,,,..,,,,,TTTTTTTT', // 17
        'TTTTTTTRR,,,,,,..,,,WW,TTTTTTT', // 18
        'TTTTTTTT,,,,,,,..,WWWW,TTTTTTT', // 19  stream to the east
        'TTTTTTTTT,,,,,,..,,WW,,TTTTTTT', // 20
        'TTTTTTTTTT,,,,,..,,,,,,TTTTTTT', // 21
        'TTTTTTTTTT,,N,,..,,,,,TTTTTTTT', // 22
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

    // Mary Ellen stands by the trail; stepping onto the row in front of her starts E3.
    npcs: [
        { id: 'maryEllen', x: 12, y: 13, facing: 'down', sprite: 'maryEllen' }
    ],

    // Step triggers: a rectangle of tiles; the event starts when a step ends inside it.
    triggers: [
        // Day one and two: the approach trail and the first climb (E2).
        { event: 'e2_lightens_load', x: 9, y: 24, w: 14, h: 1 },
        // Mary Ellen (E3).
        { event: 'e3_mary_ellen', x: 4, y: 14, w: 12, h: 1 },
        // At the crowded shelter: the woods at night (Act I close).
        { event: 'act1_close', x: 19, y: 3, w: 6, h: 1 }
    ],

    // Signs and the overlook. Signs can unlock Trail Journal entries (src/data/journal.js).
    signs: [
        { x: 17, y: 27, text: "The sign says Katahdin, Maine: 2,190 miles. At fourteen miles a day I'll be done by August. I have checked this math eleven times.", journal: 'blazes' },
        { x: 12, y: 22, text: "A bronze plaque on the way up Springer Mountain. The whole trail, it says, was Benton MacKaye's idea, back in 1921.", journal: 'mackaye' },
        { x: 14, y: 12, text: 'Another plaque, for Myron Avery, who mapped and measured nearly every mile of the trail and bullied it into being.', journal: 'avery' }
    ],
    overlook: { x: 4, y: 11, text: "Through the bare trees, ridge after ridge fades into the rain. Every one is a mile I have to walk, and for a moment I don't mind." },

    // Exit: the trail's north end leads to the travel screen and the Smokies.
    exit: { x: 20, y: 1, w: 4, h: 1 },

    // Gates: solid until their event is finished, then they become path.
    gates: [
        { id: 'trailhead-log', opensAfter: 'e2_lightens_load', tiles: [[15, 23], [16, 23]] }
    ]
};
