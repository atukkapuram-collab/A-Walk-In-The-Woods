import { describe, it, expect } from 'vitest';
import { GridMover } from '../src/systems/GridMover.js';
import { facedTile, stepTriggerAt, talkTarget, gatesOpenedBy } from '../src/systems/Interactions.js';
import { parseMap, isBlocked, openGate } from '../src/systems/MapBuilder.js';

const map = {
    key: 'test',
    legend: { T: 'tree', ',': 'grass', G: 'gate' },
    rows: ['TTTTTT', 'T,PK,T', 'T,,,,T', 'TGGTTT'],
    npcs: [{ id: 'bob', x: 2, y: 2, talk: 'ev_talk' }],
    triggers: [{ event: 'ev_step', x: 1, y: 1, w: 2, h: 1 }],
    gates: [{ id: 'g', opensAfter: 'ev_talk', tiles: [[1, 3], [2, 3]] }]
};

describe('interactions', () => {
    it('finds the tile in front of the player', () => {
        expect(facedTile(new GridMover({ x: 2, y: 1, facing: 'down', stepMs: 1 }))).toEqual({ x: 2, y: 2 });
    });

    it('step triggers cover their whole rectangle and fire once', () => {
        expect(stepTriggerAt(map, { x: 1, y: 1 }, new Set())).toBe('ev_step');
        expect(stepTriggerAt(map, { x: 2, y: 1 }, new Set())).toBe('ev_step');
        expect(stepTriggerAt(map, { x: 3, y: 1 }, new Set())).toBe(null);
        expect(stepTriggerAt(map, { x: 1, y: 1 }, new Set(['ev_step']))).toBe(null);
    });

    it('confirm talks to the NPC in front, otherwise to Katz', () => {
        const facingBob = new GridMover({ x: 2, y: 1, facing: 'down', stepMs: 1 });
        const facingWall = new GridMover({ x: 2, y: 1, facing: 'up', stepMs: 1 });
        expect(talkTarget(map, facingBob, new Set())).toMatchObject({ kind: 'event', event: 'ev_talk' });
        expect(talkTarget(map, facingBob, new Set(['ev_talk'])).kind).toBe('none');
        expect(talkTarget(map, facingWall, new Set())).toEqual({ kind: 'katz' });
    });

    it('NPCs block their tile; gates open after their event', () => {
        const grid = parseMap(map);
        expect(isBlocked(grid, 2, 2, map.npcs)).toBe(true);
        expect(isBlocked(grid, 1, 3)).toBe(true);
        for (const gate of gatesOpenedBy(map, 'ev_talk')) openGate(grid, gate);
        expect(isBlocked(grid, 1, 3)).toBe(false);
        expect(isBlocked(grid, 2, 3)).toBe(false);
        expect(gatesOpenedBy(map, 'ev_step')).toEqual([]);
    });
});
