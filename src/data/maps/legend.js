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
    // Milestone 12: Pennsylvania and the White Mountains.
    O: 'boulder', // solid heap of rocks
    A: 'alpine', // walkable bare ground above the treeline
    C: 'cairn', // stacked stones marking the trail
    '~': 'crackedRoad', // the abandoned highway near Centralia (walkable)
    V: 'vent', // a smoking crack
    Z: 'phone', // payphone: face it and press Space (a sign with an `event`)
    U: 'car',
    // Milestone 14: a sign and an overlook ledge on alpine ground.
    '%': 'signAlpine',
    '&': 'ledgeAlpine',
    // Gates (solid until their event is finished; listed in the map's `gates`):
    G: 'gate', // fallen log
    D: 'drift', // snowdrift
    H: 'riverGate', // rain-swollen river; opens to stepping stones ('ford')
    J: 'barrier' // road barrier; opens to 'road'
};

export const GATE_CHARS = ['G', 'D', 'H', 'J'];
