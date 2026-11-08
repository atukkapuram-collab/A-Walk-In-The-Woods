// The ribbon of trail on the travel screen's East Coast map (pure math, no
// Phaser). Points are in the illustration's 240x135 pixel grid, from Springer
// Mountain, Georgia (bottom left) to Katahdin, Maine (top right).
export const TRAIL_MILES = 2190;

// (Kept above row ~100: the narrator line box covers the bottom of the screen.)
export const TRAIL_RIBBON = [
    [38, 98], [52, 91], [64, 85], [78, 79], [92, 73], [104, 66],
    [118, 60], [130, 54], [142, 49], [154, 43], [166, 37], [178, 31], [192, 24], [204, 18]
];

// Where the four maps sit on the ribbon, as miles (labels on the map).
export const PLACES = [
    { name: 'Georgia', miles: 0 },
    { name: 'Smokies', miles: 165 },
    { name: 'Virginia', miles: 540 },
    { name: 'Maine', miles: 1960 }
];

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
