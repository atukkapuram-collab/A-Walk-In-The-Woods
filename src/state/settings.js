import { TUNING } from '../data/tuning.js';
import { loadSave, writeSave } from './persistence.js';

// Player settings (design blueprint, All screens: music volume, sound effects
// volume, text speed), kept in the same versioned save record as the endings
// found. Volumes are 0-1 in steps of 0.1; the sounds themselves arrive in
// Milestone 7, which reads these values.

export const TEXT_SPEEDS = ['slow', 'normal', 'instant'];
export const DEFAULT_SETTINGS = { music: 0.7, sfx: 0.8, textSpeed: 'normal' };

const volume = (v, fallback) => (Number.isFinite(v) ? Math.round(Math.max(0, Math.min(1, v)) * 10) / 10 : fallback);

// Anything missing, out of range or unknown falls back to the default.
export function sanitizeSettings(raw = {}) {
    return {
        music: volume(raw.music, DEFAULT_SETTINGS.music),
        sfx: volume(raw.sfx, DEFAULT_SETTINGS.sfx),
        textSpeed: TEXT_SPEEDS.includes(raw.textSpeed) ? raw.textSpeed : DEFAULT_SETTINGS.textSpeed
    };
}

export function getSettings(store) {
    return sanitizeSettings(loadSave(store).settings);
}

export function saveSettings(settings, store) {
    const save = loadSave(store);
    save.settings = sanitizeSettings(settings);
    writeSave(save, store);
    return save.settings;
}

// Characters per second for the typewriter text.
export function textCps(speed = getSettings().textSpeed) {
    return TUNING.textSpeeds[speed] ?? TUNING.textCps;
}
