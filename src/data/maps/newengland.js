import { LEGEND } from './legend.js';

// Map 5: New England and the White Mountains (Act III, Alone; book chapters
// 15-18). Late summer, above the treeline: bare rock, cairns and wind.
// Order: the forest (bottom) -> thinning trees -> the alpine zone: E10 Mount
// Washington (the trigger crosses the whole ridge) -> memorial sign and the
// overlook -> down to the trailhead: the payphone, E11 The Phone Call (third
// ending check) -> the road barrier opens -> exit (top) to Maine.
// Rows were carved with a helper script; edit them by hand freely. `npm test` checks them.
export default {
    key: 'newengland',
    title: 'The White Mountains',
    season: 'Late summer',
    palette: 'alpine',
    weather: null,
    legend: LEGEND,
    markerTile: 'path',
    music: 'alone',
    rows: [
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', //  0
        'TTTTTTTTTTTTTT==TTTTTTTTTTTTTT', //  1
        'TTTTTTTTTTTTTTJJTTTTTTTTTTTTTT', //  2
        'TTTTTTTT==============TTTTTTTT', //  3
        'TTTTTTTT,,,,,,..,,,,,,BTTTTTTT', //  4
        'TTTTTTTB,,,,,,..,Z,,,,TTTTTTTT', //  5
        'TTTTTTTT,,,,,,..,,,,,,TTTTTTTT', //  6
        'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT', //  7
        'TOOOOOOOOOOOOO..OOOOOOOOOOOOOT', //  8
        'TOOOOAAAAAAAAA..AAAAAAAAAOOOOT', //  9
        'TOOOOAAAAAAAAC..A%AACAAAAOOOOT', // 10
        'TOOOOAAACAAAAA..AAAAAAAAA&OOOT', // 11
        'TOOOOAAAAAAAAA..CAAAAAAAAOOOOT', // 12
        'TOOOOAAAAAAAAA..AAAAAAAAAOOOOT', // 13
        'TOOOOAAAAAAAAC..AAAAAAAAAOOOOT', // 14
        'TOOOOAAAAACAAA..AAAAACAAAOOOOT', // 15
        'TOOOOAAAAAAAAA..CAAAAAAAAOOOOT', // 16
        'TOOOOAAAAAAAAA..AAAAAAAAAOOOOT', // 17
        'TOOOOOOOOOOOOO..OOOOOOOOOOOOOT', // 18
        'TOOOOOOOOOOOOO..OOOOOOOOOOOOOT', // 19
        'TTTTTTT,,,,,,,..,,,,,,,TTTTTTT', // 20
        'TTTTTTB,,,,,,,..,,,,,,,TTTTTTT', // 21
        'TTTTTTT,,R,,,,..,,,,,,,TTTTTTT', // 22
        'TTTTTTT,,,,,,,..,,,,R,,TTTTTTT', // 23
        'TTTTTTT,,,,,,,..,,,,,,,BTTTTTT', // 24
        'TTTTTTT,,,,,,,..,,,,,,,TTTTTTT', // 25
        'TTTTTTTTTTTTTB..TTTTTTTTTTTTTT', // 26
        'TTTTTTTTTTTTTT..BTTTTTTTTTTTTT', // 27
        'TTTTTTTTTB,,,,..,,,,TTTTTTTTTT', // 28
        'TTTTTTTTTT,,,,..,,,,BTTTTTTTTT', // 29
        'TTTTTTTTTT,,,N..,,,,TTTTTTTTTT', // 30
        'TTTTTTTTTT,,,,.P,,,,TTTTTTTTTT', // 31
        'TTTTTTTTTT,,,,.K,,,,TTTTTTTTTT', // 32
        'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'  // 33
    ],

    triggers: [
        { event: 'e10_mount_washington', x: 5, y: 13, w: 20, h: 1 }
    ],

    gates: [
        { id: 'road-barrier', opensAfter: 'e11_phone_call', opensTo: 'road', tiles: [[14, 2], [15, 2]] }
    ],

    // A sign with an `event` starts it when read (the payphone), then shows its text.
    signs: [
        { x: 13, y: 30, text: 'A sign for the mountain huts ahead: bunks and hot dinners, high in the Whites, for those who book ahead and can pay.' },
        { x: 17, y: 10, text: 'A sign lists the people who have died on this mountain, with dates. It is a long list, and a surprising number of the dates are in summer.', journal: 'washington' },
        { x: 17, y: 5, event: 'e11_phone_call', text: 'The payphone. I have made my call.' }
    ],
    overlook: { x: 25, y: 11, text: 'The Presidential Range marches off into cloud, bare and enormous. I feel very small, and oddly glad of it.' },

    exit: { x: 14, y: 1, w: 2, h: 1 }
};
