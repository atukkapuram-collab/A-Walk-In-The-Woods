// Shared look for every text box and panel (UI scenes run at zoom 1, 960x540).
export const UI = {
    margin: 24,
    panelFill: 0x1f1a14,
    panelAlpha: 0.94,
    border: 0xe8dcc0,
    borderWidth: 3,
    accent: 0xf2c46d,
    dim: 0.3,
    font: 'monospace',
    text: '#f2efe6',
    muted: '#b8b3a5',
    name: '#f2c46d',
    up: '#8fd16a',
    down: '#ef7d6b',
    resolution: 2
};

export function textStyle(size, extra = {}) {
    return { fontFamily: UI.font, fontSize: `${size}px`, color: UI.text, resolution: UI.resolution, ...extra };
}

// Draws a bordered panel into a Graphics object.
export function drawPanel(g, x, y, w, h) {
    g.clear();
    g.fillStyle(UI.panelFill, UI.panelAlpha);
    g.fillRect(x, y, w, h);
    g.lineStyle(UI.borderWidth, UI.border, 1);
    g.strokeRect(x, y, w, h);
}
