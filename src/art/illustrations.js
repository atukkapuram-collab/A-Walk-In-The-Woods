import { TRAIL_RIBBON, PLACES, pointForMiles } from '../systems/TravelPath.js';

// Simple code-drawn pictures for the title, the opening panels, the travel
// map and the four endings (design blueprint, Transitions, Screens and
// Endings). Each is painted at 240x135 with whole-pixel shapes only, then
// shown at 4x (960x540), so it matches the 16px sprites drawn at the same
// scale. The characters are the map sprites themselves.
//
// Texture keys: 'ill-<name>' for each picture in ILLUSTRATIONS, plus 'fx-truck'.
// Placeholder art: real pictures can later replace a texture under the same key.

export const ILL_W = 240;
export const ILL_H = 135;
export const ILL_SCALE = 4;

// A small seeded random, so pictures are the same every time.
function seeded(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// oy shifts the whole picture up (negative) so its subject sits above the
// dialogue box, which covers the bottom ~40 rows while the story is read.
function painter(ctx, scene, seed = 1, oy = 0) {
    ctx.imageSmoothingEnabled = false;
    const rand = seeded(seed);
    const rect = (x, y, w, h, c) => {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x), Math.round(y + oy), Math.round(w), Math.round(h));
    };
    // Filled polygon by scanlines: hard pixel edges, no anti-aliasing.
    const poly = (points, c) => {
        const pts = points.map(([x, y]) => [x, y + oy]);
        const ys = pts.map((p) => p[1]);
        ctx.fillStyle = c;
        for (let y = Math.floor(Math.min(...ys)); y < Math.ceil(Math.max(...ys)); y++) {
            const yc = y + 0.5;
            const xs = [];
            pts.forEach(([ax, ay], i) => {
                const [bx, by] = pts[(i + 1) % pts.length];
                if ((ay <= yc && by > yc) || (by <= yc && ay > yc)) xs.push(ax + ((yc - ay) * (bx - ax)) / (by - ay));
            });
            xs.sort((a, b) => a - b);
            for (let k = 0; k + 1 < xs.length; k += 2) {
                const xa = Math.round(xs[k]);
                const xb = Math.round(xs[k + 1]);
                if (xb > xa) ctx.fillRect(xa, y, xb - xa, 1);
            }
        }
    };
    const disc = (cx, cyIn, r, c) => {
        const cy = cyIn + oy;
        ctx.fillStyle = c;
        for (let y = -r; y <= r; y++) {
            const w = Math.round(Math.sqrt(r * r - y * y));
            ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1);
        }
    };
    const bands = (y, h, colors) => {
        const bh = h / colors.length;
        colors.forEach((c, i) => rect(0, y + i * bh, ILL_W, Math.ceil(bh) + 1, c));
    };
    const sprite = (key, frame, x, y) => {
        const tex = scene.textures.get(key);
        const f = tex.get(frame);
        ctx.drawImage(tex.getSourceImage(), f.cutX, f.cutY, f.cutWidth, f.cutHeight, Math.round(x), Math.round(y + oy), f.cutWidth, f.cutHeight);
    };
    const pine = (x, base, h, c, trunk = '#3b2a1e') => {
        poly([[x, base - h], [x + h * 0.38, base], [x - h * 0.38, base]], c);
        rect(x - 1, base, 2, 2, trunk);
    };
    const stars = (n, y0, y1, c = '#f4f1e8') => {
        for (let i = 0; i < n; i++) rect(rand() * ILL_W, y0 + rand() * (y1 - y0), 1, 1, c);
    };
    return { rect, poly, disc, bands, sprite, pine, stars, rand };
}

// ---- The pictures --------------------------------------------------------

// Title: dusk over the ridges, the trail winding away, the two hikers on it.
function title(p) {
    p.bands(0, 92, ['#1f2a48', '#2b3a5c', '#3d4f75', '#5a6a8c', '#8a7f8f', '#c9967a', '#e8b07a']);
    p.stars(40, 0, 40);
    p.disc(178, 76, 11, '#f6d28b');
    p.poly([[0, 80], [30, 58], [60, 72], [96, 48], [130, 70], [168, 52], [204, 68], [240, 56], [240, 96], [0, 96]], '#55627f');
    p.poly([[0, 92], [40, 70], [78, 86], [118, 66], [158, 88], [200, 72], [240, 84], [240, 104], [0, 104]], '#3c5458');
    p.rect(0, 100, 240, 35, '#3f6a33');
    p.poly([[0, 100], [60, 94], [130, 98], [190, 92], [240, 98], [240, 108], [0, 108]], '#4c7a32');
    // The trail, winding from the bottom toward the ridges.
    p.poly([[96, 135], [132, 135], [126, 124], [140, 114], [146, 104], [152, 98], [148, 98], [140, 104], [126, 113], [110, 124]], '#b08a5a');
    for (const [x, b, h] of [[14, 118, 26], [30, 124, 32], [52, 112, 20], [70, 126, 28], [196, 120, 30], [214, 126, 34], [182, 110, 18], [228, 108, 20]]) p.pine(x, b, h, '#244a21');
    // A white blaze on a tree by the trail.
    p.rect(160, 98, 3, 16, '#5a3b22');
    p.disc(161, 92, 7, '#2f5a2a');
    p.rect(160, 104, 2, 4, '#f4f1e8');
    p.sprite('hiker', 'up-stand', 120, 104);
    p.sprite('katz', 'up-stand', 104, 114);
}

// Opening panel 1: the kitchen table buried in maps, a winter night outside.
function kitchen(p) {
    p.rect(0, 0, 240, 135, '#3b3550');
    p.rect(0, 0, 240, 8, '#2e2940');
    // Window with snow and stars.
    p.rect(18, 14, 64, 48, '#5a3b22');
    p.rect(22, 18, 56, 40, '#1b2340');
    p.stars(14, 18, 50);
    p.disc(64, 28, 5, '#e8e6d8');
    p.rect(22, 50, 56, 8, '#c9d6df');
    p.rect(48, 18, 3, 40, '#5a3b22');
    // Lamp glow.
    p.poly([[176, 10], [196, 10], [210, 40], [162, 40]], '#5d5470');
    p.rect(182, 4, 8, 8, '#e8b07a');
    // The Hiker behind the table.
    p.sprite('hiker', 'down-stand', 112, 58);
    // Table top and front.
    p.poly([[20, 80], [220, 80], [236, 104], [4, 104]], '#7a5230');
    p.rect(4, 104, 232, 10, '#5a3b22');
    p.rect(14, 114, 8, 21, '#4a3322');
    p.rect(218, 114, 8, 21, '#4a3322');
    // Maps, guidebooks and the laptop spreadsheet.
    p.poly([[30, 84], [76, 82], [80, 100], [26, 102]], '#e8dcb0');
    p.poly([[40, 88], [52, 92], [60, 89], [72, 95]], '#c0392b');
    p.rect(40, 88, 32, 1, '#c0392b');
    p.poly([[84, 86], [124, 84], [122, 100], [86, 101]], '#d9c48e');
    p.rect(92, 90, 26, 1, '#4f7d4a');
    p.rect(96, 94, 20, 1, '#4f7d4a');
    p.rect(132, 82, 18, 14, '#b3423a');
    p.rect(134, 84, 18, 14, '#3f5f8f');
    p.rect(160, 76, 44, 4, '#555a60');
    p.rect(162, 60, 40, 17, '#555a60');
    p.rect(164, 62, 36, 13, '#d8e8d0');
    for (let y = 64; y < 75; y += 3) p.rect(164, y, 36, 1, '#7fbf6a');
    for (let x = 172; x < 200; x += 8) p.rect(x, 62, 1, 13, '#7fbf6a');
    p.rect(210, 86, 8, 9, '#f4f1e8');
    p.rect(218, 88, 2, 4, '#f4f1e8');
}

// Opening panel 2: the phone calls. You on one side, Katz on the other.
function phone(p) {
    p.rect(0, 0, 240, 135, '#3b3550');
    p.poly([[124, 0], [240, 0], [240, 135], [108, 135], [122, 90], [110, 70], [126, 40], [114, 20]], '#26363a');
    p.rect(0, 104, 240, 31, '#2a2438');
    p.poly([[124, 104], [240, 104], [240, 135], [108, 135]], '#1d2a2c');
    // Your side: table, phone, maps.
    p.rect(14, 92, 90, 6, '#7a5230');
    p.rect(20, 98, 6, 30, '#5a3b22');
    p.rect(92, 98, 6, 30, '#5a3b22');
    p.rect(26, 86, 30, 6, '#e8dcb0');
    p.sprite('hiker', 'right-stand', 58, 72);
    p.rect(69, 76, 3, 6, '#2b2118');
    // Katz's side: couch, TV glow, a pizza box.
    p.rect(150, 86, 76, 22, '#7a4a3a');
    p.rect(150, 80, 76, 10, '#8f5a48');
    p.rect(146, 84, 8, 26, '#6a3f32');
    p.rect(222, 84, 8, 26, '#6a3f32');
    p.sprite('katz', 'left-stand', 176, 70);
    p.rect(178, 74, 3, 6, '#2b2118');
    p.rect(198, 98, 18, 4, '#d9b46a');
    p.rect(138, 30, 30, 22, '#1b1b22');
    p.rect(140, 32, 26, 18, '#6fa0c0');
    // Speech bubbles: you asking, Katz answering.
    for (const [bx, by, tail] of [[74, 56, 74], [152, 54, 170]]) {
        p.rect(bx, by, 18, 10, '#f4f1e8');
        p.rect(tail, by + 10, 2, 3, '#f4f1e8');
        for (let d = 0; d < 3; d++) p.rect(bx + 4 + d * 4, by + 4, 2, 2, '#2b2118');
    }
}

// Opening panel 3: Atlanta airport. Katz arrives with a wheeled suitcase.
function airport(p) {
    p.rect(0, 0, 240, 90, '#cfcfc6');
    p.rect(0, 0, 240, 6, '#9a9a92');
    p.rect(16, 12, 208, 54, '#6f7a86');
    p.rect(20, 16, 200, 46, '#8fb7d8');
    p.rect(20, 50, 200, 12, '#9aa6ae');
    // A plane outside.
    p.poly([[60, 40], [170, 36], [184, 40], [170, 46], [60, 46]], '#f4f1e8');
    p.poly([[110, 42], [130, 42], [116, 56], [104, 56]], '#e0e0da');
    p.poly([[64, 40], [72, 26], [80, 26], [76, 40]], '#c0392b');
    for (let x = 70; x < 168; x += 8) p.rect(x, 39, 3, 2, '#3b6ea8');
    for (let x = 20; x < 220; x += 40) p.rect(x, 16, 3, 46, '#6f7a86');
    // Gate sign.
    p.rect(176, 68, 44, 12, '#2f3a4a');
    p.rect(180, 72, 12, 4, '#f2c46d');
    p.rect(196, 72, 20, 4, '#f4f1e8');
    // Floor.
    p.rect(0, 90, 240, 45, '#a8a59a');
    for (let x = 0; x < 240; x += 24) p.rect(x, 90, 1, 45, '#97948a');
    p.rect(0, 112, 240, 1, '#97948a');
    // The Hiker with a giant pack, Katz with his suitcase.
    p.sprite('hiker', 'right-stand', 70, 92);
    p.rect(66, 90, 8, 14, '#b5652d');
    p.sprite('katz', 'left-stand', 140, 92);
    p.rect(130, 98, 10, 12, '#3a3a44');
    p.rect(134, 92, 2, 6, '#2b2b30');
    p.rect(131, 110, 2, 2, '#111');
    p.rect(137, 110, 2, 2, '#111');
}

// Broken Partnership: a bus stop at a road crossing, one hiker left.
function busStop(p) {
    p.bands(0, 70, ['#7d8590', '#8f97a0', '#a3a9b0', '#b7bcc0']);
    p.poly([[0, 70], [40, 50], [80, 64], [130, 46], [180, 62], [240, 50], [240, 80], [0, 80]], '#4c6a52');
    for (let x = 6; x < 240; x += 14) p.pine(x, 82, 16 + p.rand() * 10, '#2f4a35');
    p.rect(0, 82, 240, 16, '#4c7a32');
    p.rect(0, 98, 240, 22, '#5a5a5a');
    for (let x = 4; x < 240; x += 20) p.rect(x, 108, 10, 2, '#e8dcb0');
    p.rect(0, 120, 240, 15, '#4c7a32');
    // The bus, leaving.
    p.rect(176, 78, 60, 24, '#e8e2d0');
    p.rect(176, 90, 60, 4, '#3f5f8f');
    for (let x = 180; x < 232; x += 10) p.rect(x, 81, 7, 6, '#6f8fae');
    p.disc(188, 103, 3, '#222');
    p.disc(226, 103, 3, '#222');
    // Stop sign and bench.
    p.rect(52, 70, 2, 30, '#6f7a86');
    p.rect(46, 64, 14, 8, '#3f5f8f');
    p.rect(70, 92, 30, 3, '#7a5230');
    p.rect(72, 95, 2, 4, '#5a3b22');
    p.rect(96, 95, 2, 4, '#5a3b22');
    p.sprite('hiker', 'right-stand', 30, 106);
}

// Early Departure: a motel room, the map spread across the bed.
function motel(p) {
    p.rect(0, 0, 240, 135, '#5f526e');
    for (let x = 0; x < 240; x += 12) p.rect(x, 0, 4, 84, '#6a5c7a');
    p.rect(0, 84, 240, 51, '#4a4038');
    p.rect(170, 14, 50, 36, '#4a3a2a');
    p.rect(174, 18, 42, 28, '#1b2340');
    p.stars(8, 18, 40);
    p.rect(20, 44, 6, 20, '#3a3028');
    p.poly([[14, 36], [32, 36], [28, 46], [18, 46]], '#e8c07a');
    // Bed with the map.
    p.rect(52, 50, 128, 14, '#5a3b22');
    p.rect(52, 64, 128, 46, '#7a2f3a');
    p.rect(52, 106, 128, 6, '#5a2430');
    p.poly([[70, 70], [160, 66], [164, 100], [66, 104]], '#e8dcb0');
    p.poly([[76, 98], [96, 90], [118, 84], [140, 76], [156, 70], [157, 72], [141, 78], [119, 86], [97, 92], [77, 100]], '#c0392b');
    p.rect(96, 72, 1, 30, '#c9b88a');
    p.rect(130, 70, 1, 30, '#c9b88a');
    p.sprite('hiker', 'down-stand', 190, 92);
    p.sprite('katz', 'left-stand', 30, 92);
}

// Finished Trail: sunrise on the summit above a sea of clouds.
function summit(p) {
    p.bands(0, 90, ['#2f3560', '#4a4a7a', '#7a5a8a', '#b06a8a', '#e08a7a', '#f0aa70', '#f8d090']);
    p.disc(150, 82, 14, '#fff0b8');
    for (let i = 0; i < 26; i++) p.disc(p.rand() * 240, 84 + p.rand() * 16, 6 + Math.floor(p.rand() * 8), i % 3 ? '#f4e6e0' : '#e8c8c8');
    p.rect(0, 96, 240, 10, '#f4e6e0');
    p.poly([[40, 135], [70, 106], [96, 100], [120, 96], [150, 102], [182, 110], [210, 135]], '#6d6a6e');
    p.poly([[70, 106], [96, 100], [120, 96], [150, 102], [140, 108], [100, 106]], '#8a8790');
    // Summit sign post.
    p.rect(150, 82, 3, 22, '#6b4a2b');
    p.rect(142, 80, 20, 8, '#a77a46');
    p.sprite('hiker', 'up-stand', 104, 88);
    p.sprite('katz', 'up-stand', 120, 90);
    p.sprite('sunshine', 'down-stand', 168, 96);
}

// Changed Route: a quiet lakeshore in autumn, leaves falling.
function lakeshore(p) {
    p.bands(0, 60, ['#8fb7d8', '#a8c8e0', '#c8dceb', '#e6ece8']);
    p.poly([[0, 60], [40, 40], [90, 54], [140, 38], [200, 52], [240, 44], [240, 66], [0, 66]], '#8a6a5a');
    for (let x = 0; x < 240; x += 9) p.disc(x + p.rand() * 6, 64 + p.rand() * 4, 5 + Math.floor(p.rand() * 3), ['#c0392b', '#e08a35', '#d9a33a', '#a0522d'][Math.floor(p.rand() * 4)]);
    p.rect(0, 70, 240, 40, '#3b6ea8');
    for (let i = 0; i < 18; i++) p.rect(p.rand() * 220, 74 + p.rand() * 32, 10 + p.rand() * 14, 1, '#6f9fd1');
    for (let i = 0; i < 10; i++) p.rect(p.rand() * 220, 72 + p.rand() * 10, 6, 1, '#c0703a');
    p.poly([[0, 108], [80, 104], [160, 110], [240, 104], [240, 135], [0, 135]], '#b08a5a');
    p.rect(0, 120, 240, 15, '#8f6e45');
    for (const x of [16, 210]) {
        p.rect(x, 74, 4, 40, '#5a3b22');
        p.disc(x + 2, 70, 14, x < 100 ? '#c0392b' : '#e08a35');
        p.disc(x - 6, 78, 8, x < 100 ? '#e05a3a' : '#d9a33a');
    }
    p.sprite('hiker', 'up-stand', 102, 100);
    p.sprite('katz', 'up-stand', 120, 100);
    for (let i = 0; i < 16; i++) p.rect(p.rand() * 240, p.rand() * 100, 2, 1, ['#e08a35', '#c0392b', '#d9a33a'][i % 3]);
}

// The travel screen map: a simple East Coast with the trail's ribbon.
function travelMap(p) {
    p.rect(0, 0, 240, 135, '#2d5786');
    for (let i = 0; i < 30; i++) p.rect(140 + p.rand() * 100, 60 + p.rand() * 75, 6, 1, '#3b6ea8');
    p.poly([[0, 0], [200, 0], [214, 4], [230, 12], [222, 22], [208, 28], [198, 40], [186, 48], [176, 60], [164, 66],
        [156, 78], [140, 88], [128, 96], [114, 104], [100, 112], [88, 122], [80, 135], [0, 135]], '#6a8f4a');
    // The Appalachian ridges along the trail.
    TRAIL_RIBBON.forEach(([x, y]) => p.disc(x - 6, y + 2, 5, '#55743e'));
    p.poly([[0, 0], [40, 0], [30, 30], [20, 60], [0, 80]], '#7a9a56');
    // The ribbon itself, as a dotted line.
    for (let m = 0; m <= 2190; m += 34) {
        const [x, y] = pointForMiles(m);
        p.rect(x, y, 2, 2, '#f4f1e8');
    }
    for (const place of PLACES) {
        const [x, y] = pointForMiles(place.miles);
        p.rect(x - 2, y - 2, 6, 6, '#2b2118');
        p.rect(x - 1, y - 1, 4, 4, '#f2c46d');
    }
    const [kx, ky] = pointForMiles(2190);
    p.poly([[kx - 6, ky + 4], [kx + 1, ky - 6], [kx + 8, ky + 4]], '#8a8d8f');
}

export const ILLUSTRATIONS = { title, kitchen, phone, airport, busStop, motel, summit, lakeshore, travelMap };

// Pictures shown behind the dialogue box are raised (rows) so the people stay
// visible, with the floor colour filling the bottom.
const RAISE = {
    kitchen: [-18, '#2a2438'],
    phone: [-30, '#2a2438'],
    airport: [-24, '#a8a59a'],
    busStop: [-30, '#4c7a32'],
    motel: [-24, '#4a4038'],
    summit: [-24, '#6d6a6e'],
    lakeshore: [-26, '#8f6e45']
};

// The small pickup truck for the "skipped ahead" travel screen (24x14, faces right).
function truck(scene) {
    const t = scene.textures.createCanvas('fx-truck', 24, 14);
    const p = painter(t.getContext(), scene);
    p.rect(0, 5, 15, 6, '#b3423a');
    p.rect(14, 2, 8, 9, '#c9534a');
    p.rect(16, 3, 5, 4, '#a8d0e6');
    p.rect(22, 7, 2, 3, '#f4d77a');
    p.rect(1, 3, 3, 2, '#3b2a1e'); // Katz's hair in the back
    p.rect(6, 3, 3, 2, '#9a6b3f'); // the Hiker's hat
    p.disc(5, 11, 2, '#222');
    p.disc(18, 11, 2, '#222');
    t.refresh();
}

// Called once from BootScene, after the character sprites exist.
export function generateIllustrations(scene) {
    Object.entries(ILLUSTRATIONS).forEach(([name, draw], i) => {
        const t = scene.textures.createCanvas(`ill-${name}`, ILL_W, ILL_H);
        const [oy, floor] = RAISE[name] ?? [0, null];
        if (floor) painter(t.getContext(), scene).rect(0, 0, ILL_W, ILL_H, floor);
        draw(painter(t.getContext(), scene, i + 7, oy));
        t.refresh();
    });
    truck(scene);
}

// Adds an illustration to a scene, filling the screen (960x540).
export function addIllustration(scene, name) {
    return scene.add.image(0, 0, `ill-${name}`).setOrigin(0).setScale(ILL_SCALE);
}
