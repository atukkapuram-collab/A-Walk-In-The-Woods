// Placeholder 16x16 terrain tiles, drawn in code. The order of TILE_DEFS is
// the order of tiles in the generated 'tiles' tileset texture, so the index of
// a definition is its tile index in the tilemap.
//
// Each draw function gets a painter `p` (see generate.js) and a palette
// (see palettes.js). It never touches Phaser, so tests can import this file.

function grass(p, c) {
    p.rect(0, 0, 16, 16, c.grass);
    for (const [x, y] of [[2, 3], [9, 1], [13, 6], [5, 10], [11, 12], [1, 14], [7, 6]]) {
        p.rect(x, y, 1, 2, c.grassLight);
    }
    for (const [x, y] of [[4, 6], [12, 2], [14, 13], [8, 14]]) {
        p.px(x, y, c.grassDark);
    }
}

function path(p, c) {
    p.rect(0, 0, 16, 16, c.dirt);
    for (const [x, y] of [[3, 2], [10, 5], [6, 11], [13, 13], [1, 8]]) {
        p.px(x, y, c.dirtDark);
    }
    for (const [x, y] of [[7, 3], [12, 9], [3, 13], [14, 1]]) {
        p.px(x, y, c.dirtLight);
    }
}

function tree(p, c) {
    grass(p, c);
    p.rect(7, 12, 3, 4, c.trunk);
    p.disc(8, 7, 7, c.canopyDark);
    p.disc(8, 6, 6, c.canopy);
    p.disc(6, 4, 3, c.canopyLight);
}

function blazeTree(p, c) {
    grass(p, c);
    p.rect(6, 9, 5, 7, c.trunk);
    p.rect(7, 11, 3, 4, c.blaze); // the white paint blaze that marks the trail
    p.disc(8, 5, 6, c.canopyDark);
    p.disc(8, 4, 5, c.canopy);
    p.disc(6, 3, 2, c.canopyLight);
}

function rock(p, c) {
    grass(p, c);
    p.disc(8, 9, 6, c.rockDark);
    p.disc(8, 8, 5, c.rock);
    p.disc(6, 6, 2, c.rockLight);
}

function water(p, c) {
    p.rect(0, 0, 16, 16, c.water);
    for (const [x, y, w] of [[2, 3, 4], [9, 6, 5], [4, 10, 3], [11, 13, 4]]) {
        p.rect(x, y, w, 1, c.waterLight);
    }
    for (const [x, y, w] of [[1, 8, 3], [8, 1, 3], [7, 14, 2]]) {
        p.rect(x, y, w, 1, c.waterDark);
    }
}

// A fallen log across the trail. Milestone 2 uses it to block the path until an event is done.
function gate(p, c) {
    path(p, c);
    p.rect(0, 6, 16, 6, c.log);
    p.rect(0, 7, 16, 1, c.logLight);
    p.rect(13, 6, 3, 6, c.logEnd);
    p.px(14, 8, c.log);
}

function sign(p, c) {
    grass(p, c);
    p.rect(7, 9, 2, 7, c.trunk);
    p.rect(2, 3, 12, 7, c.trunk);
    p.rect(3, 4, 10, 5, c.signBoard);
    p.rect(4, 5, 7, 1, c.trunk);
    p.rect(4, 7, 5, 1, c.trunk);
}

// A three-sided wooden trail shelter (lean-to), seen from the front.
function shelter(p, c) {
    path(p, c);
    p.rect(1, 1, 14, 3, c.roof);
    p.rect(0, 3, 16, 2, c.roofLight);
    p.rect(1, 5, 2, 11, c.log);
    p.rect(13, 5, 2, 11, c.log);
    p.rect(3, 5, 10, 8, c.dirtDark);
    p.rect(3, 12, 10, 2, c.logLight);
}

function campfire(p, c) {
    path(p, c);
    for (const [x, y] of [[3, 10], [5, 12], [8, 13], [11, 12], [13, 10], [4, 8], [12, 8]]) {
        p.rect(x, y, 2, 2, c.rockDark);
    }
    p.rect(5, 10, 6, 2, c.log);
    p.disc(8, 8, 3, c.fire);
    p.rect(7, 4, 2, 3, c.fire);
    p.disc(8, 8, 1, c.fireCore);
}

// The scenic overlook: a rocky ledge with a view. Face it and press Space.
function ledge(p, c) {
    grass(p, c);
    p.rect(0, 6, 16, 10, c.rockDark);
    p.rect(1, 5, 14, 9, c.rock);
    p.rect(2, 5, 12, 2, c.rockLight);
    p.rect(5, 9, 3, 1, c.rockDark);
    p.rect(10, 11, 3, 1, c.rockDark);
}

function snow(p, c) {
    p.rect(0, 0, 16, 16, c.snow);
    for (const [x, y] of [[3, 4], [10, 2], [6, 11], [13, 9], [1, 13]]) {
        p.rect(x, y, 2, 1, c.snowShade);
    }
}

// A snowdrift across the trail (a gate).
function drift(p, c) {
    snow(p, c);
    p.disc(8, 10, 7, c.snowShade);
    p.disc(7, 9, 6, c.snow);
    p.rect(3, 6, 4, 1, '#ffffff');
}

// High, rushing water across the trail (the river gate).
function riverGate(p, c) {
    water(p, c);
    for (const [x, y] of [[1, 2], [6, 5], [11, 1], [3, 9], [9, 12], [13, 7]]) {
        p.rect(x, y, 3, 1, '#ffffff');
    }
}

// Stepping stones across the river once it can be forded.
function ford(p, c) {
    water(p, c);
    for (const [x, y] of [[2, 2], [9, 4], [4, 9], [11, 11]]) {
        p.disc(x + 1, y + 1, 2, c.rock);
        p.px(x, y, c.rockLight);
    }
}

function roof(p, c) {
    p.rect(0, 0, 16, 16, c.roof);
    for (let y = 2; y < 16; y += 4) p.rect(0, y, 16, 1, c.roofLight);
}

function wall(p, c) {
    p.rect(0, 0, 16, 16, c.wall);
    p.rect(0, 0, 16, 2, c.wallDark);
    p.rect(4, 5, 8, 6, c.wallDark);
    p.rect(5, 6, 6, 4, c.window);
}

function door(p, c) {
    p.rect(0, 0, 16, 16, c.wall);
    p.rect(0, 0, 16, 2, c.wallDark);
    p.rect(4, 4, 8, 12, c.door);
    p.px(10, 10, c.window);
}

// A gravel logging road or town street.
function road(p, c) {
    p.rect(0, 0, 16, 16, c.road);
    for (const [x, y] of [[2, 3], [9, 6], [5, 12], [13, 10], [11, 1]]) {
        p.px(x, y, c.roadLight);
    }
}

export const TILE_DEFS = [
    { name: 'grass', solid: false, draw: grass },
    { name: 'path', solid: false, draw: path },
    { name: 'tree', solid: true, draw: tree },
    { name: 'blazeTree', solid: true, draw: blazeTree },
    { name: 'rock', solid: true, draw: rock },
    { name: 'water', solid: true, draw: water },
    { name: 'gate', solid: true, draw: gate },
    { name: 'sign', solid: true, draw: sign },
    { name: 'shelter', solid: true, draw: shelter },
    { name: 'campfire', solid: true, draw: campfire },
    { name: 'ledge', solid: true, draw: ledge },
    { name: 'snow', solid: false, draw: snow },
    { name: 'drift', solid: true, draw: drift },
    { name: 'riverGate', solid: true, draw: riverGate },
    { name: 'ford', solid: false, draw: ford },
    { name: 'roof', solid: true, draw: roof },
    { name: 'wall', solid: true, draw: wall },
    { name: 'door', solid: true, draw: door },
    { name: 'road', solid: false, draw: road }
];
