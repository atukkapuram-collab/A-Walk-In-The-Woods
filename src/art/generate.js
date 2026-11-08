import { TILE_SIZE } from '../config.js';
import { SEASONS, HIKER, KATZ, SALESMAN, DALE, SUNSHINE, HAZEL } from './palettes.js';
import { TILE_DEFS } from './tiles.js';
import { buildCharacterFrames, KATZ_SHAPE, SPRITE_SIZE } from './sprites.js';
import { ICONS, ICON_SIZE } from './icons.js';

// Draws every placeholder texture into Phaser's texture manager.
// Called once from BootScene. Real art can later replace a texture under the same key.
export function generateArt(scene) {
    // One tileset per season: 'tiles-spring', 'tiles-smokies', 'tiles-summer', 'tiles-autumn'.
    for (const [name, palette] of Object.entries(SEASONS)) makeTileset(scene, `tiles-${name}`, palette);
    makeCharacter(scene, 'hiker', HIKER, buildCharacterFrames());
    makeCharacter(scene, 'katz', KATZ, buildCharacterFrames(KATZ_SHAPE));
    makeCharacter(scene, 'salesman', SALESMAN, buildCharacterFrames(KATZ_SHAPE));
    makeCharacter(scene, 'dale', DALE, buildCharacterFrames());
    makeCharacter(scene, 'sunshine', SUNSHINE, buildCharacterFrames());
    makeCharacter(scene, 'hazel', HAZEL, buildCharacterFrames(KATZ_SHAPE));
    makeIcons(scene, 'icons');
    makeEffects(scene);
}

// Small textures for weather particles and the campfire glow.
function makeEffects(scene) {
    const dot = (key, w, h, color) => {
        const t = scene.textures.createCanvas(key, w, h);
        const ctx = t.getContext();
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        t.refresh();
    };
    dot('fx-rain', 1, 4, '#b9d3ef');
    dot('fx-snow', 2, 2, '#ffffff');
    dot('fx-leaf', 2, 2, '#e08a35');
    dot('fx-dust', 2, 2, '#d8c8a4');

    // A soft round glow (the one smooth texture: light, not pixel art).
    const size = 128;
    const glow = scene.textures.createCanvas('fx-glow', size, size);
    const ctx = glow.getContext();
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255, 190, 110, 0.85)');
    g.addColorStop(0.4, 'rgba(255, 150, 70, 0.35)');
    g.addColorStop(1, 'rgba(255, 120, 40, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    glow.refresh();
}

// One texture with a frame per stat icon (frame names = stat keys).
function makeIcons(scene, key) {
    const names = Object.keys(ICONS);
    const texture = scene.textures.createCanvas(key, ICON_SIZE * names.length, ICON_SIZE);
    const ctx = texture.getContext();
    names.forEach((name, i) => {
        const { palette, rows } = ICONS[name];
        rows.forEach((row, y) => [...row].forEach((ch, x) => {
            if (ch !== '.') {
                ctx.fillStyle = palette[ch];
                ctx.fillRect(i * ICON_SIZE + x, y, 1, 1);
            }
        }));
        texture.add(name, 0, i * ICON_SIZE, 0, ICON_SIZE, ICON_SIZE);
    });
    texture.refresh();
}

// Small drawing helper with whole-pixel shapes only (no anti-aliasing).
function painter(ctx, ox, oy) {
    const rect = (x, y, w, h, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(ox + x, oy + y, w, h);
    };
    return {
        rect,
        px: (x, y, color) => rect(x, y, 1, 1, color),
        disc: (cx, cy, r, color) => {
            for (let y = -r; y <= r; y++) {
                for (let x = -r; x <= r; x++) {
                    const px = cx + x;
                    const py = cy + y;
                    if (x * x + y * y <= r * r + r * 0.8 && px >= 0 && px < 16 && py >= 0 && py < 16) {
                        rect(px, py, 1, 1, color);
                    }
                }
            }
        }
    };
}

function makeTileset(scene, key, palette) {
    const texture = scene.textures.createCanvas(key, TILE_SIZE * TILE_DEFS.length, TILE_SIZE);
    const ctx = texture.getContext();
    TILE_DEFS.forEach((def, i) => def.draw(painter(ctx, i * TILE_SIZE, 0), palette));
    texture.refresh();
}

// The dark outline drawn around every character.
export const OUTLINE = '#1d1712';

// Transparent pixels that touch a filled one (up, down, left or right) get the
// outline. Pure, so it can be tested: returns the frame rows with 'o' added.
export function outlined(rows) {
    const filled = (x, y) => rows[y]?.[x] !== undefined && rows[y][x] !== '.' && rows[y][x] !== 'o';
    return rows.map((row, y) => [...row].map((ch, x) => {
        if (ch !== '.') return ch;
        return filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1) ? 'o' : '.';
    }).join(''));
}

function makeCharacter(scene, key, basePalette, frames) {
    const names = Object.keys(frames);
    const texture = scene.textures.createCanvas(key, SPRITE_SIZE * names.length, SPRITE_SIZE);
    const ctx = texture.getContext();
    const palette = { ...basePalette, o: OUTLINE };

    names.forEach((name, i) => {
        const ox = i * SPRITE_SIZE;
        outlined(frames[name]).forEach((row, y) => {
            [...row].forEach((ch, x) => {
                if (ch !== '.') {
                    ctx.fillStyle = palette[ch];
                    ctx.fillRect(ox + x, y, 1, 1);
                }
            });
        });
        texture.add(name, 0, ox, 0, SPRITE_SIZE, SPRITE_SIZE);
    });

    texture.refresh();
}
