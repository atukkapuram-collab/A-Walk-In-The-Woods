import { Scene } from 'phaser';
import { generateArt } from '../art/generate.js';
import { generateIllustrations } from '../art/illustrations.js';
import { audio } from '../systems/Audio.js';
import { SCENE_MUSIC } from '../data/audio.js';
import { MAPS } from '../data/maps/index.js';

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
            const scene = this.scene.get(key);
            // A trail map can ask for its own loop (`music` in the map data).
            scene.events.on('create', () => audio.playMusic(key === 'Trail' ? MAPS[scene.mapKey]?.music ?? track : track));
        }
        this.scene.start('Title');
    }
}
