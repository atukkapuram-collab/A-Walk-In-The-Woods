// Placeholder color palettes. One tileset is drawn once per season palette
// (design blueprint: "one tileset with a different season palette").
// Every season palette has the same keys as SPRING.

// North Georgia, early spring: cold rain, bare-ish damp greens.
export const SPRING = {
    grass: '#5f8f3e',
    grassLight: '#79a84f',
    grassDark: '#4c7a32',
    dirt: '#b08a5a',
    dirtLight: '#c9a574',
    dirtDark: '#8f6e45',
    canopy: '#2f5a2a',
    canopyLight: '#3f7436',
    canopyDark: '#244a21',
    trunk: '#5a3b22',
    blaze: '#f4f1e8',
    rock: '#8a8d8f',
    rockLight: '#b5b8ba',
    rockDark: '#5d6062',
    water: '#3b6ea8',
    waterLight: '#6f9fd1',
    waterDark: '#2d5786',
    log: '#6b4a2b',
    logLight: '#8c6640',
    logEnd: '#c79b62',
    snow: '#eef3f6',
    snowShade: '#c9d6df',
    roof: '#8a3b2e',
    roofLight: '#a94f3c',
    wall: '#d8c39a',
    wallDark: '#a8936c',
    window: '#f4d77a',
    door: '#5a3b22',
    fire: '#f08a2c',
    fireCore: '#ffe37a',
    road: '#7f776c',
    roadLight: '#9a9184',
    signBoard: '#a77a46',
    scree: '#9d9f94',
    screeLight: '#b9bbb0',
    screeDark: '#7c7e74'
};

// Great Smoky Mountains, late spring: fog, cooler blue-greens, snow patches.
export const SMOKIES = {
    ...SPRING,
    grass: '#5b7c5a',
    grassLight: '#73957a',
    grassDark: '#486649',
    dirt: '#9c8b72',
    dirtLight: '#b3a389',
    dirtDark: '#7e6e58',
    canopy: '#2b4a3c',
    canopyLight: '#3a6150',
    canopyDark: '#1f3a2f',
    water: '#4a6f8f'
};

// Virginia, midsummer: hot, bright greens, dry dirt.
export const SUMMER = {
    ...SPRING,
    grass: '#6aa63f',
    grassLight: '#8cc455',
    grassDark: '#558a31',
    dirt: '#c49c62',
    dirtLight: '#dcb87e',
    dirtDark: '#a07d4a',
    canopy: '#2f6b2a',
    canopyLight: '#47883a',
    canopyDark: '#245520'
};

// Maine, the Hundred-Mile Wilderness, autumn: red and gold leaves, dark lakes.
export const AUTUMN = {
    ...SPRING,
    grass: '#86844a',
    grassLight: '#a39a58',
    grassDark: '#6b6a3a',
    dirt: '#a7835a',
    dirtLight: '#c09a6e',
    dirtDark: '#86683f',
    canopy: '#b9542a',
    canopyLight: '#e08a35',
    canopyDark: '#8a3a1f',
    water: '#2f5a85',
    waterLight: '#5c86b3',
    waterDark: '#24476b'
};

// The White Mountains, late summer: thin, wind-beaten greens and grey stone.
export const ALPINE = {
    ...SPRING,
    grass: '#6f8a5e',
    grassLight: '#89a475',
    grassDark: '#587049',
    dirt: '#a39680',
    dirtLight: '#bbae98',
    dirtDark: '#857963',
    canopy: '#2e5140',
    canopyLight: '#3f6852',
    canopyDark: '#213d30',
    rock: '#93969a',
    rockLight: '#bfc2c5',
    rockDark: '#63666a'
};

export const SEASONS = { spring: SPRING, smokies: SMOKIES, summer: SUMMER, autumn: AUTUMN, alpine: ALPINE };

// Character palettes. Each letter is used in the pixel matrices in sprites.js.
// '.' is always transparent.
export const HIKER = {
    h: '#9a6b3f', // hat
    b: '#7a5230', // hat brim
    r: '#5a3b22', // hair
    s: '#e0b48c', // skin
    e: '#2b2118', // eyes
    c: '#4f7d4a', // shirt
    d: '#3a6036', // shirt shade
    p: '#b5652d', // backpack
    n: '#8a7a55', // trousers
    k: '#4a3322'  // boots
};

// Placeholder NPCs, needed now for Event 1 (map sprite and dialogue portrait).
// Milestone 4 can give them their own shapes.
export const SALESMAN = {
    h: '#7d7d7d',
    b: '#7d7d7d',
    r: '#7d7d7d', // grey hair, no hat (uses Katz's shape)
    s: '#e0b48c',
    e: '#2b2118',
    c: '#d9a33a', // store vest
    d: '#a87c26',
    p: '#d9a33a',
    n: '#3d3d46',
    k: '#2b2b30'
};

// People from the book (Milestone 11). Placeholder looks on the shared
// shapes; Milestone 14 can give them their own.
export const MARY_ELLEN = {
    h: '#d2463c', // red bandana
    b: '#a8342c',
    r: '#e2c27a', // fair hair
    s: '#e0b48c',
    e: '#2b2118',
    c: '#4fb3c8', // turquoise shirt
    d: '#3a8a9c',
    p: '#f0b43c', // bright yellow pack
    n: '#6b5a8a',
    k: '#f4f1e8'  // white sneakers
};

export const HIKER_1 = {
    h: '#5b6f3a', // olive watch cap
    b: '#46562c',
    r: '#3b2a1e',
    s: '#d9a982',
    e: '#2b2118',
    c: '#7d4f8a', // purple fleece
    d: '#5f3a6a',
    p: '#4f5f6f',
    n: '#3d3d46',
    k: '#2b2b30'
};

export const CLERK = {
    h: '#2b2b30',
    b: '#2b2b30',
    r: '#2b2b30', // dark hair, no hat (uses Katz's shape)
    s: '#c98e66',
    e: '#2b2118',
    c: '#e8e2d2', // white uniform shirt
    d: '#b9b2a2',
    p: '#c0392b', // red name badge
    n: '#2f3b52',
    k: '#2b2b30'
};

export const DRIVER = {
    h: '#c0392b', // red cap
    b: '#96281b',
    r: '#5a5a5a',
    s: '#d9a982',
    e: '#2b2118',
    c: '#3d6b3a', // checked work shirt
    d: '#2c4f2a',
    p: '#3d6b3a', // no pack
    n: '#4a4f5a',
    k: '#3b2a1e'
};

export const DAYTRIPPER = {
    h: '#f4f1e8', // white sun visor
    b: '#d8d2c2',
    r: '#a86a3a',
    s: '#e0b48c',
    e: '#2b2118',
    c: '#e86fa0', // pink holiday shirt
    d: '#c0507e',
    p: '#e86fa0', // no pack
    n: '#f0e2b8', // shorts
    k: '#f4f1e8'
};

export const KATZ = {
    h: '#3b2a1e',
    b: '#3b2a1e',
    r: '#3b2a1e', // hair (Katz has no hat)
    s: '#e0b48c',
    e: '#2b2118',
    c: '#b3423a', // red shirt
    d: '#86302a',
    p: '#3f5f8f', // blue pack
    n: '#46618a', // jeans
    k: '#7a7f86'  // sneakers
};
