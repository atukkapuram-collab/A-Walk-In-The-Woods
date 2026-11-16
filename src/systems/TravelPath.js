// The ribbon of trail on the travel screen's East Coast map (pure math, no
// Phaser). Points are in the illustration's 240x135 pixel grid, from Springer
// Mountain, Georgia (bottom left) to Katahdin, Maine (top right).
export const TRAIL_MILES = 2190;

// (Kept above row ~100: the narrator line box covers the bottom of the screen.)
export const TRAIL_RIBBON = [
    [38, 98], [52, 91], [64, 85], [78, 79], [92, 73], [104, 66],
    [118, 60], [130, 54], [142, 49], [154, 43], [166, 37], [178, 31], [192, 24], [204, 18]
];

// Where the six maps sit on the ribbon, as trail miles (labels on the map).
// Roughly the real trail's positions (Springer Mountain = 0, Katahdin = 2,190).
export const PLACES = [
    { name: 'Georgia', map: 'georgia', miles: 0 },
    { name: 'Smokies', map: 'smokies', miles: 165 },
    { name: 'Shenandoah', map: 'shenandoah', miles: 860 },
    { name: 'Pennsylvania', map: 'pennsylvania', miles: 1150 },
    { name: 'White Mountains', map: 'newengland', miles: 1860 },
    { name: 'Maine', map: 'maine', miles: 2060 }
];

// The trail position (miles) of a map, for debug starts.
export function placeOfMap(mapKey) {
    return PLACES.find((p) => p.map === mapKey)?.miles ?? (mapKey === 'roadside' ? 2120 : 0);
}

// The stretches of trail behind the marker, split into walked and skipped
// pieces: [{ from, to, skipped }], in order. Used to draw the travel map.
export function travelledPieces(pos, skippedRanges = []) {
    const pieces = [];
    let at = 0;
    for (const [a, b] of [...skippedRanges].sort((x, y) => x[0] - y[0])) {
        if (a >= pos) break;
        if (a > at) pieces.push({ from: at, to: a, skipped: false });
        pieces.push({ from: Math.max(a, at), to: Math.min(b, pos), skipped: true });
        at = Math.min(b, pos);
    }
    if (pos > at) pieces.push({ from: at, to: pos, skipped: false });
    return pieces.filter((p) => p.to > p.from);
}

const segLength = ([ax, ay], [bx, by]) => Math.hypot(bx - ax, by - ay);

// The point a fraction (0-1) of the way along the ribbon, by length.
export function pointAt(frac, ribbon = TRAIL_RIBBON) {
    const f = Math.max(0, Math.min(1, frac));
    if (f === 1) return [...ribbon.at(-1)];
    const lengths = ribbon.slice(1).map((p, i) => segLength(ribbon[i], p));
    let target = f * lengths.reduce((a, b) => a + b, 0);
    for (let i = 0; i < lengths.length; i++) {
        if (target <= lengths[i] || i === lengths.length - 1) {
            const t = lengths[i] ? Math.min(1, target / lengths[i]) : 0;
            const [ax, ay] = ribbon[i];
            const [bx, by] = ribbon[i + 1];
            return [ax + (bx - ax) * t, ay + (by - ay) * t];
        }
        target -= lengths[i];
    }
    return [...ribbon.at(-1)];
}

// Miles to a ribbon point.
export function pointForMiles(miles) {
    return pointAt(miles / TRAIL_MILES);
}
