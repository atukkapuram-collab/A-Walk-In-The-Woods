import { Scene } from 'phaser';
import { generateArt } from '../art/generate.js';
import { generateIllustrations } from '../art/illustrations.js';
import { audio } from '../systems/Audio.js';
import { SCENE_MUSIC } from '../data/audio.js';

// Runs first: draws all placeholder textures and illustrations (src/art/), then shows the title.
export class BootScene extends Scene {
    constructor() {
        super('Boot');
    }

    create() {
        generateArt(this);
        generateIllustrations(this); // needs the character sprites
        // Each scene asks for its music loop when it starts (src/data/audio.js).
        for (const [key, track] of Object.entries(SCENE_MUSIC)) {
            this.scene.get(key).events.on('create', () => audio.playMusic(track));
        }
        this.scene.start('Title');
    }
}
