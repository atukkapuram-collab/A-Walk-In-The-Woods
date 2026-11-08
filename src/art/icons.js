// 10x10 stat icons for the HUD and result cards (design blueprint: boot,
// backpack, heart, sun, map). Same matrix style as sprites.js; '.' is transparent.
export const ICON_SIZE = 10;

export const ICONS = {
    stamina: {
        palette: { k: '#8a5a32', l: '#b07a48', s: '#3d2817' },
        rows: [
            '..........',
            '...kkk....',
            '...klk....',
            '...kkk....',
            '...kkk....',
            '...kkkkk..',
            '..kkkkkkk.',
            '..kkkkkkkk',
            '..ssssssss',
            '..........'
        ]
    },
    supplies: {
        palette: { p: '#d07a35', d: '#8a4a1c', l: '#f0a964' },
        rows: [
            '...dddd...',
            '..d....d..',
            '.pppppppp.',
            '.pddddddp.',
            '.pppppppp.',
            '.pplllppp.',
            '.pplllppp.',
            '.pppppppp.',
            '.dddddddd.',
            '..........'
        ]
    },
    bond: {
        palette: { r: '#e0524a', l: '#f59a8f' },
        rows: [
            '..........',
            '.rr...rr..',
            'rrrr.rrrr.',
            'rlrrrrrrr.',
            'rrrrrrrrr.',
            '.rrrrrrr..',
            '..rrrrr...',
            '...rrr....',
            '....r.....',
            '..........'
        ]
    },
    morale: {
        palette: { y: '#f5cf4a', o: '#e89a2c' },
        rows: [
            '....o.....',
            '.o..o..o..',
            '..yyyyy...',
            '.yyyyyyy..',
            'oyyyyyyyo.',
            '.yyyyyyy..',
            '..yyyyy...',
            '.o..o..o..',
            '....o.....',
            '..........'
        ]
    },
    miles: {
        palette: { m: '#efe3c2', g: '#5f8f3e', r: '#e0524a' },
        rows: [
            '..........',
            '.mmmmmmmm.',
            '.mggmmmmm.',
            '.mmgmmmrm.',
            '.mmmggmmm.',
            '.mmmmmgmm.',
            '.mrmmmmgm.',
            '.mmmmmmmm.',
            '..........',
            '..........'
        ]
    }
};
