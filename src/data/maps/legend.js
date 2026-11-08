// One legend for every map, so the same character means the same tile everywhere.
// Solid tiles block walking; the rest are walkable. P and K (player and Katz
// start) sit on the map's markerTile (path).
export const LEGEND = {
    T: 'tree',
    B: 'blazeTree', // a tree with the white paint blaze that marks the trail
    R: 'rock',
    W: 'water',
    ',': 'grass',
    '.': 'path',
    X: 'snow', // walkable snow patch
    '=': 'road', // town street or logging road
    N: 'sign', // trail sign: face it and press Space
    L: 'ledge', // scenic overlook: face it and press Space (Morale +1, once per map)
    S: 'shelter',
    F: 'campfire',
    M: 'roof',
    Y: 'wall',
    Q: 'door',
    // Gates (solid until their event is finished; listed in the map's `gates`):
    G: 'gate', // fallen log
    D: 'drift', // snowdrift
    H: 'riverGate' // rain-swollen river; opens to stepping stones ('ford')
};

export const GATE_CHARS = ['G', 'D', 'H'];
