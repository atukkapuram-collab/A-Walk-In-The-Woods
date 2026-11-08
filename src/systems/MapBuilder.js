import { TILE_DEFS } from '../art/tiles.js';
import { TILE_SIZE } from '../config.js';

// Special characters in a map's `rows` that mark where characters start.
// The tile underneath them is the map's `markerTile` (default: path).
const MARKERS = { P: 'player', K: 'katz' };

// Turns a map data file (src/data/maps/*.js) into plain grid data:
// { key, width, height, tiles: [y][x] tile indices, solid: [y][x] booleans, spawns }.
// Throws a clear error for malformed maps, so a typo in a map file fails loudly.
// No Phaser here, so tests can use it directly.
export function parseMap(map, tileDefs = TILE_DEFS) {
    const indexOf = Object.fromEntries(tileDefs.map((def, i) => [def.name, i]));
    const width = map.rows[0].length;
    const height = map.rows.length;
    const spawns = {};

    const tiles = map.rows.map((row, y) => {
        if (row.length !== width) {
            throw new Error(`Map "${map.key}": row ${y} is ${row.length} wide, expected ${width}.`);
        }
        return [...row].map((ch, x) => {
            let name = map.legend[ch];
            if (MARKERS[ch]) {
                if (spawns[MARKERS[ch]]) {
                    throw new Error(`Map "${map.key}": more than one "${ch}" marker.`);
                }
                spawns[MARKERS[ch]] = { x, y };
                name = map.markerTile ?? 'path';
            }
            if (name === undefined || indexOf[name] === undefined) {
                throw new Error(`Map "${map.key}": unknown character "${ch}" at x=${x}, y=${y}.`);
            }
            return indexOf[name];
        });
    });

    for (const who of Object.values(MARKERS)) {
        if (!spawns[who]) {
            throw new Error(`Map "${map.key}": no start marker for ${who}.`);
        }
    }

    const solid = tiles.map((row) => row.map((i) => tileDefs[i].solid));
    return { key: map.key, width, height, tiles, solid, spawns };
}

// True if nobody can walk onto (x, y): off the map, a solid tile, or an
// occupied tile (NPCs and closed gates are added here from Milestone 2).
export function isBlocked(grid, x, y, occupied = []) {
    if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return true;
    if (grid.solid[y][x]) return true;
    return occupied.some((t) => t.x === x && t.y === y);
}

// Opens a gate: its tiles become walkable (path, or the gate's `opensTo` tile,
// e.g. 'ford' for the river) in the grid and on screen, if a layer is given.
export function openGate(grid, gate, layer = null, tileDefs = TILE_DEFS) {
    const index = tileDefs.findIndex((def) => def.name === (gate.opensTo ?? 'path'));
    if (index < 0 || tileDefs[index].solid) {
        throw new Error(`Gate "${gate.id}" opens to "${gate.opensTo}", which is not a walkable tile.`);
    }
    for (const [x, y] of gate.tiles) {
        grid.tiles[y][x] = index;
        grid.solid[y][x] = false;
        layer?.putTileAt(index, x, y);
    }
}

// Creates the visible Phaser tilemap layer for a parsed grid.
export function buildTilemapLayer(scene, grid, textureKey) {
    const tilemap = scene.make.tilemap({ data: grid.tiles, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
    const tileset = tilemap.addTilesetImage(textureKey, textureKey, TILE_SIZE, TILE_SIZE, 0, 0);
    return tilemap.createLayer(0, tileset, 0, 0);
}
