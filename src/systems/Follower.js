import { DIRS } from './GridMover.js';

// Moves the player and Katz together for one frame. Pure logic, no Phaser.
//
// Rules (design blueprint, Exploration; implementation plan, Milestone 1):
// - Holding a direction turns the player to face it. If the next tile is free,
//   the player walks one tile; if not, the player only turns.
// - Whenever the player starts a step, Katz walks into the tile the player just
//   left, in the same time. So Katz is always one tile behind, and if the player
//   walks back into Katz's tile the two swap places. Katz never blocks the path.
// - Holding the key keeps walking with no pause between steps.
//
// Returns { started, finished } step records so the scene can emit
// 'step-start' and 'step-end'. `onArrive(tile)` runs when a step ends; if it
// returns true (a step trigger started an event), no new step starts.
export function updateParty({ player, katz, dir, delta, isBlocked, onArrive }) {
    const result = { started: null, finished: null };

    const wasMoving = player.moving;
    const leftover = player.advance(delta);
    katz.advance(delta);
    if (wasMoving && !player.moving) {
        result.finished = { tile: { ...player.tile } };
        if (onArrive?.(player.tile)) return result;
    }

    if (player.moving || !dir) return result;

    player.face(dir);
    const target = { x: player.tile.x + DIRS[dir].x, y: player.tile.y + DIRS[dir].y };
    if (isBlocked(target.x, target.y)) return result;

    const from = { ...player.tile };
    player.stepTo(target.x, target.y);
    katz.stepTo(from.x, from.y);
    result.started = { from, to: target };

    if (leftover > 0) {
        player.advance(leftover);
        katz.advance(leftover);
    }
    return result;
}
