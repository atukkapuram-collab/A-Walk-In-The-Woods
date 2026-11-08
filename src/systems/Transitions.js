import { TUNING } from '../data/tuning.js';

// The one transition used everywhere (design blueprint, Transitions): a quick
// fade to black, then the next scene fades in from black.

// Scenes that run on top of others. They are stopped on every scene change,
// so nothing (HUD, a dialogue box, a menu) leaks into the next screen.
export const OVERLAYS = ['HUD', 'Dialogue', 'Pause', 'Settings', 'EndingsFound'];
// Scenes that can be left paused under a menu (Pause > Quit to Title).
const UNDERLAYS = ['Trail', 'Ending', 'Title', 'Opening'];

export function fadeIn(scene, ms = TUNING.fadeMs) {
    scene.cameras.main.fadeIn(ms, 0, 0, 0);
}

// Fade `scene` out, stop every overlay (and anything paused underneath), then
// start `key`. Safe to call twice: the second call is ignored.
export function fadeTo(scene, key, data, { fade = true, ms = TUNING.fadeMs } = {}) {
    if (scene.leavingTo) return;
    scene.leavingTo = key;
    const start = () => {
        const manager = scene.scene;
        for (const other of [...OVERLAYS, ...UNDERLAYS]) {
            if (other !== manager.key && other !== key && (manager.isActive(other) || manager.isPaused(other))) {
                manager.stop(other);
            }
        }
        scene.leavingTo = null;
        manager.start(key, data);
    };
    if (!fade) return start();
    scene.cameras.main.fadeOut(ms, 0, 0, 0);
    scene.cameras.main.once('camerafadeoutcomplete', start);
}

// Opens a menu scene (Pause, Settings, Endings Found) over `scene`, pausing
// the scenes beneath it. The menu calls closeOverlay() to go back.
export function openOverlay(scene, key, pauseKeys = [scene.scene.key], data = {}) {
    const manager = scene.scene;
    const paused = pauseKeys.filter((k) => manager.isActive(k));
    paused.forEach((k) => manager.pause(k));
    manager.launch(key, { ...data, paused });
    manager.bringToTop(key);
}

// Closes a menu scene and resumes what it paused. Pending key presses are
// thrown away, so the Enter that closed the menu doesn't also act underneath.
export function closeOverlay(menuScene) {
    const manager = menuScene.scene;
    for (const k of menuScene.pausedUnder ?? []) {
        if (!manager.isPaused(k)) continue;
        manager.resume(k);
        manager.get(k).controls?.flush?.();
    }
    manager.stop();
}
