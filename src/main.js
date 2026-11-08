import { AUTO, Game, Scale } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BACKGROUND_COLOR } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { TrailScene } from './scenes/TrailScene.js';
import { DialogueScene } from './scenes/DialogueScene.js';
import { HUDScene } from './scenes/HUDScene.js';
import { EndingScene } from './scenes/EndingScene.js';
import { OpeningScene } from './scenes/OpeningScene.js';
import { ActCardScene } from './scenes/ActCardScene.js';
import { TravelScene } from './scenes/TravelScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { EndingsFoundScene } from './scenes/EndingsFoundScene.js';
import { gameState } from './state/GameState.js';
import { audio } from './systems/Audio.js';

// Game config: https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: BACKGROUND_COLOR,
    // Crisp pixel art: no smoothing, and positions rounded to whole pixels.
    pixelArt: true,
    // All sound is our own Web Audio graph (src/systems/Audio.js), so Phaser's is off.
    audio: { noAudio: true },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    // Order is draw order: the HUD and then the Dialogue overlay draw above the
    // trail map; the menus (Pause, Settings, Endings Found) draw above everything.
    scene: [BootScene, TitleScene, OpeningScene, ActCardScene, TravelScene, TrailScene, EndingScene,
        HUDScene, DialogueScene, PauseScene, SettingsScene, EndingsFoundScene]
};

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(config);
    audio.init(); // sound unlocks on the first key press or click (browser rule)

    // Handy for checking the game from the browser console during development.
    if (import.meta.env.DEV) {
        window.__game = game;
        window.__state = gameState;
        window.__audio = audio;
    }
});
