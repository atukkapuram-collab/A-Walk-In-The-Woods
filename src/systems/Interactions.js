import { DIRS } from './GridMover.js';

// Finding what the player is interacting with. Pure logic, no Phaser.
// Map data (src/data/maps/*.js):
//   npcs:     [{ id, x, y, facing, sprite, talk: eventId }]   talk triggers
//   triggers: [{ event: eventId, x, y, w, h }]                  step triggers (a rectangle of tiles)
//   gates:    [{ id, opensAfter: eventId, tiles: [[x, y], ...] }]
//   exit:     { x, y, w, h }   stepping in leaves the map
//   signs:    [{ x, y, text }]  face and press Space
//   overlook: { x, y, text }    face and press Space: Morale +1, once per map

// The tile in front of a character.
export function facedTile(mover) {
    const d = DIRS[mover.facing];
    return { x: mover.tile.x + d.x, y: mover.tile.y + d.y };
}

export function npcAt(map, tile) {
    return (map.npcs ?? []).find((npc) => npc.x === tile.x && npc.y === tile.y) ?? null;
}

// True if `tile` is inside a rectangle { x, y, w = 1, h = 1 } (triggers, exits).
export function inRect(rect, tile) {
    return tile.x >= rect.x && tile.x < rect.x + (rect.w ?? 1) &&
        tile.y >= rect.y && tile.y < rect.y + (rect.h ?? 1);
}

// The step-trigger event at this tile that hasn't happened yet, or null.
export function stepTriggerAt(map, tile, done) {
    const hit = (map.triggers ?? []).find((t) => inRect(t, tile) && !done.has(t.event));
    return hit ? hit.event : null;
}

// What pressing confirm does: talk to the NPC in front (if its event is still
// to come), otherwise talk to Katz, who is always next to the player
// ("press Space next to him for a random line", design blueprint).
export function talkTarget(map, player, done) {
    const tile = facedTile(player);
    const npc = npcAt(map, tile);
    if (npc) {
        return npc.talk && !done.has(npc.talk) ? { kind: 'event', event: npc.talk, npc } : { kind: 'none', npc };
    }
    const sign = (map.signs ?? []).find((s) => s.x === tile.x && s.y === tile.y);
    if (sign) return { kind: 'sign', text: sign.text };
    const o = map.overlook;
    if (o && o.x === tile.x && o.y === tile.y) return { kind: 'overlook', text: o.text };
    return { kind: 'katz' };
}

// Gates whose event has just finished.
export function gatesOpenedBy(map, eventId) {
    return (map.gates ?? []).filter((gate) => gate.opensAfter === eventId);
}
