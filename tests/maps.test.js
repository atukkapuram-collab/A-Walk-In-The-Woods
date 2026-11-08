import { describe, it, expect } from 'vitest';
import { MAPS } from '../src/data/maps/index.js';
import { EVENTS } from '../src/data/events/index.js';
import { GATE_CHARS } from '../src/data/maps/legend.js';
import { parseMap, isBlocked, openGate } from '../src/systems/MapBuilder.js';
import { dirBetween, DIRS } from '../src/systems/GridMover.js';

const rectTiles = ({ x, y, w = 1, h = 1 }) => {
    const out = [];
    for (let ty = y; ty < y + h; ty++) for (let tx = x; tx < x + w; tx++) out.push(`${tx},${ty}`);
    return out;
};

// Every tile reachable from `start`, with NPCs blocking their tiles.
function reachable(grid, start, npcs = []) {
    const seen = new Set([`${start.x},${start.y}`]);
    const queue = [start];
    while (queue.length) {
        const { x, y } = queue.shift();
        for (const d of Object.values(DIRS)) {
            const k = `${x + d.x},${y + d.y}`;
            if (!seen.has(k) && !isBlocked(grid, x + d.x, y + d.y, npcs)) {
                seen.add(k);
                queue.push({ x: x + d.x, y: y + d.y });
            }
        }
    }
    return seen;
}

// Checks every map file, so a typo in a layout fails `npm test` instead of the game.
describe.each(Object.entries(MAPS))('map %s', (key, map) => {
    const grid = parseMap(map);

    it('parses (equal-width rows, known characters, one P and one K)', () => {
        expect(grid.key).toBe(key);
    });

    it('is at least one screen (20x12 tiles), so the camera can stay inside it', () => {
        expect(grid.width).toBeGreaterThanOrEqual(20);
        expect(grid.height).toBeGreaterThanOrEqual(12);
    });

    it('has a solid border, so nobody can walk off the map', () => {
        for (let x = 0; x < grid.width; x++) {
            expect(grid.solid[0][x]).toBe(true);
            expect(grid.solid[grid.height - 1][x]).toBe(true);
        }
        for (let y = 0; y < grid.height; y++) {
            expect(grid.solid[y][0]).toBe(true);
            expect(grid.solid[y][grid.width - 1]).toBe(true);
        }
    });

    it('starts the player and Katz on walkable neighboring tiles', () => {
        const { player, katz } = grid.spawns;
        expect(isBlocked(grid, player.x, player.y)).toBe(false);
        expect(isBlocked(grid, katz.x, katz.y)).toBe(false);
        expect(dirBetween(player, katz)).not.toBe(null);
    });

    it('can reach every walkable tile once all gates are open (no sealed-off pockets)', () => {
        const open = parseMap(map);
        (map.gates ?? []).forEach((gate) => openGate(open, gate));
        const npcs = map.npcs ?? [];
        const seen = reachable(open, open.spawns.player, npcs);
        const unreachable = [];
        open.solid.forEach((row, y) => row.forEach((solid, x) => {
            const npcHere = npcs.some((n) => n.x === x && n.y === y);
            if (!solid && !npcHere && !seen.has(`${x},${y}`)) unreachable.push(`${x},${y}`);
        }));
        expect(unreachable).toEqual([]);
    });

    it('points npcs and triggers only at events that exist', () => {
        for (const npc of map.npcs ?? []) if (npc.talk) expect(EVENTS[npc.talk], npc.id).toBeDefined();
        for (const t of map.triggers ?? []) expect(EVENTS[t.event], t.event).toBeDefined();
        for (const g of map.gates ?? []) expect(EVENTS[g.opensAfter], g.id).toBeDefined();
    });

    it('has gates exactly where the gate tiles (G, D, H) are', () => {
        const fromRows = [];
        map.rows.forEach((row, y) => [...row].forEach((ch, x) => { if (GATE_CHARS.includes(ch)) fromRows.push(`${x},${y}`); }));
        const fromGates = (map.gates ?? []).flatMap((g) => g.tiles.map(([x, y]) => `${x},${y}`));
        expect(fromGates.sort()).toEqual(fromRows.sort());
    });

    it('puts npcs and triggers on walkable ground, and every trigger can be reached', () => {
        const open = parseMap(map);
        (map.gates ?? []).forEach((gate) => openGate(open, gate));
        const seen = reachable(open, open.spawns.player, map.npcs ?? []);
        for (const npc of map.npcs ?? []) expect(open.solid[npc.y][npc.x], npc.id).toBe(false);
        for (const t of map.triggers ?? []) {
            for (let y = t.y; y < t.y + (t.h ?? 1); y++) {
                for (let x = t.x; x < t.x + (t.w ?? 1); x++) {
                    expect(seen.has(`${x},${y}`), `${t.event} at ${x},${y}`).toBe(true);
                }
            }
        }
    });

    it('has an exit on walkable ground that can be reached once the gates are open', () => {
        if (!map.exit) return;
        const open = parseMap(map);
        (map.gates ?? []).forEach((gate) => openGate(open, gate));
        const seen = reachable(open, open.spawns.player, map.npcs ?? []);
        const { x, y, w = 1, h = 1 } = map.exit;
        let any = false;
        for (let ty = y; ty < y + h; ty++) for (let tx = x; tx < x + w; tx++) any ||= seen.has(`${tx},${ty}`);
        expect(any).toBe(true);
    });

    it('lets the player reach the event that opens each gate, with only the earlier gates open', () => {
        // Gates are listed in trail order, so gate i's event must be reachable
        // once gates 0..i-1 are open (story order; design blueprint, Gates).
        const gates = map.gates ?? [];
        gates.forEach((gate, i) => {
            const grid = parseMap(map);
            gates.slice(0, i).forEach((g) => openGate(grid, g));
            const seen = reachable(grid, grid.spawns.player, map.npcs ?? []);
            const npc = (map.npcs ?? []).find((n) => n.talk === gate.opensAfter);
            const trigger = (map.triggers ?? []).find((t) => t.event === gate.opensAfter);
            const spots = npc
                ? Object.values(DIRS).map((d) => `${npc.x + d.x},${npc.y + d.y}`) // stand next to the NPC
                : [`${trigger.x},${trigger.y}`];
            expect(spots.some((k) => seen.has(k)), gate.id).toBe(true);
        });
    });

    // The end of the map: its exit, or (Maine) the Final Crossroads trigger.
    const goal = map.exit ?? (map.triggers ?? []).find((t) => t.event === 'final_crossroads');
    const goalTiles = goal ? rectTiles(goal) : [];

    it('has no way around any gate: with it closed, the end of the map is out of reach', () => {
        for (const gate of map.gates ?? []) {
            const grid = parseMap(map);
            (map.gates ?? []).filter((g) => g !== gate).forEach((g) => openGate(grid, g));
            const seen = reachable(grid, grid.spawns.player, map.npcs ?? []);
            expect(goalTiles.some((k) => seen.has(k)), gate.id).toBe(false);
        }
    });

    it('has no way around any step trigger: every event on the way must happen', () => {
        for (const t of map.triggers ?? []) {
            if (t === goal) continue;
            const grid = parseMap(map);
            (map.gates ?? []).forEach((g) => openGate(grid, g));
            const triggerTiles = rectTiles(t).map((k) => { const [x, y] = k.split(',').map(Number); return { x, y }; });
            const seen = reachable(grid, grid.spawns.player, [...(map.npcs ?? []), ...triggerTiles]);
            expect(goalTiles.some((k) => seen.has(k)), t.event).toBe(false);
        }
    });
});

describe('parseMap errors', () => {
    const legend = { T: 'tree', ',': 'grass' };

    it('rejects rows of different widths', () => {
        expect(() => parseMap({ key: 'bad', legend, rows: ['TTT', 'TP', 'TKT'] })).toThrow(/row 1/);
    });

    it('rejects unknown characters', () => {
        expect(() => parseMap({ key: 'bad', legend, rows: ['TTT', 'PXK'] })).toThrow(/unknown character "X"/);
    });

    it('requires both start markers', () => {
        expect(() => parseMap({ key: 'bad', legend, rows: ['TTT', 'TPT'] })).toThrow(/katz/);
    });
});
