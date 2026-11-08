// Character sprites as 16x16 pixel matrices. Each letter is a color key from
// palettes.js; '.' is transparent. Frames are named `${facing}-${pose}`, with
// facing up/down/left/right and pose stand/stepA/stepB (a two-step walk cycle).
// Right-facing frames are the left-facing ones mirrored.
// 'd' is the shirt's shade. A dark outline is added around every sprite when
// it is drawn (src/art/generate.js), so characters read clearly on grass.

export const SPRITE_SIZE = 16;
const EMPTY = '................';

// Rows 0-11: head and body. Rows 12-14: legs (they change while walking). Row 15: empty.
const FRONT_BODY = [
    EMPTY,
    '......hhhh......',
    '.....hhhhhh.....',
    '....bbbbbbbb....',
    '.....rssssr.....',
    '.....sesses.....',
    '.....ssssss.....',
    '....dccccccd....',
    '...sdpccccpds...',
    '...sdccccccds...',
    '....dccccccd....',
    '....nnnnnnnn....'
];

const BACK_BODY = [
    EMPTY,
    '......hhhh......',
    '.....hhhhhh.....',
    '....bbbbbbbb....',
    '.....rrrrrr.....',
    '.....rrrrrr.....',
    '.....ssssss.....',
    '....dppppppd....',
    '...sdppppppds...',
    '...sdppppppds...',
    '....dppppppd....',
    '....nnnnnnnn....'
];

// Facing left. The backpack is on the right, behind the walker.
const SIDE_BODY = [
    EMPTY,
    '......hhhh......',
    '.....hhhhhh.....',
    '...bbbbbbbb.....',
    '.....ssssr......',
    '.....essss......',
    '.....ssss.......',
    '.....cccppp.....',
    '.....ccdppp.....',
    '.....scdppp.....',
    '.....cddppp.....',
    '.....nnnn.......'
];

const FRONT_LEGS = {
    stand: ['....nnn..nnn....', '....nnn..nnn....', '....kkk..kkk....'],
    stepA: ['....nnn..nnn....', '....kkk..nnn....', '.........kkk....'],
    stepB: ['....nnn..nnn....', '....nnn..kkk....', '....kkk.........']
};

const SIDE_LEGS = {
    stand: ['.....nnnn.......', '.....nnnn.......', '....kkkkk.......'],
    stepA: ['....nn..nn......', '...nn....nn.....', '..kk......kk....'],
    stepB: ['.....nnnn.......', '......nnn.......', '.....kkkk.......']
};

// Katz: no hat (hair instead) and a wider body, so the two read differently
// even without color. Keys are row numbers that replace the base rows.
export const KATZ_SHAPE = {
    front: {
        1: EMPTY,
        2: '......rrrr......',
        3: '.....rrrrrr.....',
        4: '.....rssssr.....',
        6: '.....srrrrs.....',
        7: '...dccccccccd...',
        8: '..sdpccccccpds..',
        9: '..sdccccccccds..',
        10: '...dccccccccd...'
    },
    back: {
        1: EMPTY,
        2: '......rrrr......',
        3: '.....rrrrrr.....',
        7: '...dppppppppd...',
        8: '..sdppppppppds..',
        9: '..sdppppppppds..',
        10: '...dppppppppd...'
    },
    side: {
        1: EMPTY,
        2: '.....rrrr.......',
        3: '....rrrrr.......',
        4: '.....rrrr.......',
        6: '.....rrrs.......',
        7: '....ccccppp.....',
        8: '....cccdppp.....',
        9: '....sccdppp.....',
        10: '....cdddppp.....'
    }
};

export const FACINGS = ['down', 'up', 'left', 'right'];
export const POSES = ['stand', 'stepA', 'stepB'];

const mirror = (rows) => rows.map((row) => [...row].reverse().join(''));

function withShape(body, shape = {}) {
    return body.map((row, i) => shape[i] ?? row);
}

// Returns { 'down-stand': [16 rows], ... } for all 12 frames.
export function buildCharacterFrames(shape = {}) {
    const front = withShape(FRONT_BODY, shape.front);
    const back = withShape(BACK_BODY, shape.back);
    const side = withShape(SIDE_BODY, shape.side);
    const frames = {};

    // On step poses the body drops one pixel (a small walking bob).
    const bob = (body, pose) => (pose === 'stand' ? body : [EMPTY, ...body.slice(0, -1)]);
    for (const pose of POSES) {
        frames[`down-${pose}`] = [...bob(front, pose), ...FRONT_LEGS[pose], EMPTY];
        frames[`up-${pose}`] = [...bob(back, pose), ...FRONT_LEGS[pose], EMPTY];
        frames[`left-${pose}`] = [...bob(side, pose), ...SIDE_LEGS[pose], EMPTY];
        frames[`right-${pose}`] = mirror(frames[`left-${pose}`]);
    }

    return frames;
}
