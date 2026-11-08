// Shared constants. Values here are setup decisions from docs/implementation-plan.md
// (section 2); later milestones add their own constants as they need them.

// Canvas size in screen pixels. Scale.FIT stretches it to the window.
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

// Tiles are 16x16 pixels. The world camera (Milestone 1) zooms 3x,
// so about 20x11 tiles are visible. UI scenes stay at zoom 1 for sharp text.
export const TILE_SIZE = 16;
export const WORLD_ZOOM = 3;

export const BACKGROUND_COLOR = '#1b1f1a';
