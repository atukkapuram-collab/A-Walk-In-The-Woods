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
    signBoard: '#a77a46'
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

export const SEASONS = { spring: SPRING, smokies: SMOKIES, summer: SUMMER, autumn: AUTUMN };

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

export const DALE = {
    h: '#2fa39a', // bright synthetic hat
    b: '#227a73',
    r: '#5a3b22',
    s: '#e0b48c',
    e: '#2b2118',
    c: '#b6d43c', // neon ultralight shirt
    d: '#8aa52a',
    p: '#9aa0a6', // tiny grey pack
    n: '#5b6470',
    k: '#2b2b30'
};

export const SUNSHINE = {
    h: '#f2b134', // sun-yellow cap
    b: '#d08f1c',
    r: '#c9792e',
    s: '#e0b48c',
    e: '#2b2118',
    c: '#f5d34a', // bright running shirt
    d: '#c9a830',
    p: '#e86f5a', // small pack
    n: '#3f6f9f',
    k: '#f4f1e8'
};

export const HAZEL = {
    h: '#c8c4bc',
    b: '#c8c4bc',
    r: '#c8c4bc', // grey hair, no hat (uses Katz's shape)
    s: '#d9a982',
    e: '#2b2118',
    c: '#6f8fae', // diner dress
    d: '#526d8a',
    p: '#efe8d8', // apron
    n: '#4c5560',
    k: '#2b2b30'
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
