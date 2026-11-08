import { describe, it, expect } from 'vitest';
import { MIX, SFX, VOICES, MUSIC, SCENE_MUSIC } from '../src/data/audio.js';
import { midiToHz, dbToGain, volumeToGain, trackSeconds, scoreEvents, AudioSystem } from '../src/systems/Audio.js';
import { SPEAKERS } from '../src/data/speakers.js';
import { buildCharacterFrames, KATZ_SHAPE } from '../src/art/sprites.js';
import { outlined } from '../src/art/generate.js';

// Milestone 7: sound (generated in code), light game feel, better sprites.
// The Web Audio graph itself is checked in the browser; this covers the data
// and the math behind it.

describe('audio math', () => {
    it('turns MIDI notes into frequencies (A4 = 440 Hz, middle C ≈ 261.6 Hz)', () => {
        expect(midiToHz(69)).toBe(440);
        expect(midiToHz(60)).toBeCloseTo(261.63, 1);
        expect(midiToHz(81)).toBeCloseTo(880, 5);
    });

    it('decibels to gain: 0 dB = 1, -6 dB ≈ half', () => {
        expect(dbToGain(0)).toBe(1);
        expect(dbToGain(-6)).toBeCloseTo(0.501, 3);
    });

    it('the volume setting mutes at 0, is full at 100%, and curves in between', () => {
        expect(volumeToGain(0)).toBe(0);
        expect(volumeToGain(1)).toBe(1);
        expect(volumeToGain(0.5)).toBe(0.25);
        expect(volumeToGain(2)).toBe(1);
        expect(volumeToGain(-1)).toBe(0);
    });

    it('music sits under the effects, and ducks under dialogue', () => {
        expect(MIX.musicDb).toBeLessThan(MIX.sfxDb);
        expect(MIX.duckDb).toBeLessThan(0);
    });
});

describe('music loops', () => {
    it.each(Object.entries(MUSIC))('%s: 8 bars of a 4-note chord and 4 beats of melody', (name, track) => {
        expect(track.bars).toHaveLength(8);
        for (const bar of track.bars) {
            expect(bar.chord).toHaveLength(4);
            expect(bar.melody).toHaveLength(4);
            bar.melody.forEach((m) => m !== null && expect(m).toBeGreaterThan(bar.chord[0]));
        }
        expect(track.bpm).toBeGreaterThan(50);
        expect(track.bpm).toBeLessThan(100); // calm, as the plan asks
    });

    it.each(Object.entries(MUSIC))('%s: every note starts inside the loop', (name, track) => {
        const length = trackSeconds(track);
        const events = scoreEvents(track);
        expect(events.length).toBeGreaterThan(40);
        for (const e of events) {
            expect(e.time).toBeGreaterThanOrEqual(0);
            expect(e.time).toBeLessThan(length);
            expect(['pad', 'bass', 'pluck']).toContain(e.voice);
        }
        // The pads fill each bar exactly, so the loop seam lines up.
        const pads = events.filter((e) => e.voice === 'pad');
        expect(Math.max(...pads.map((e) => e.time + e.dur))).toBeCloseTo(length, 6);
    });

    it('each scene that asks for music asks for a loop that exists', () => {
        for (const [scene, track] of Object.entries(SCENE_MUSIC)) expect(MUSIC[track], scene).toBeDefined();
        expect(SCENE_MUSIC.Trail).toBe('trail');
        expect(SCENE_MUSIC.Title).toBe('home');
    });
});

describe('sound effects', () => {
    it('has the plan\'s effects (text blip, menu move, confirm, stat up, stat down), all short and quiet enough', () => {
        expect(Object.keys(SFX)).toEqual(expect.arrayContaining(['blip', 'move', 'confirm', 'statUp', 'statDown']));
        for (const [name, r] of Object.entries(SFX)) {
            expect(['sine', 'square', 'triangle', 'sawtooth'], name).toContain(r.wave);
            expect(r.notes.length * r.step + r.length, name).toBeLessThan(0.5);
            expect(r.gainDb, name).toBeLessThanOrEqual(0);
        }
    });

    it('every speaker (and the narrator) has a voice for the text blips', () => {
        for (const key of [...Object.keys(SPEAKERS), 'narrator']) expect(VOICES[key], key).toBeTypeOf('number');
    });

    it('before the first key press nothing plays, but the wanted music is remembered', () => {
        const a = new AudioSystem();
        expect(() => { a.sfx('confirm'); a.blip('katz'); a.duck(true); a.playMusic('trail'); }).not.toThrow();
        expect(a.ctx).toBe(null);
        expect(a.wanted).toBe('trail');
        a.playMusic('nope');
        expect(a.wanted).toBe('trail');
    });
});

describe('sprites', () => {
    it('outlines a sprite: every empty pixel touching a filled one becomes the outline', () => {
        expect(outlined(['...', '.c.', '...'])).toEqual(['.o.', 'oco', '.o.']);
    });

    it('every character frame keeps a gap at the edge for its outline', () => {
        for (const frames of [buildCharacterFrames(), buildCharacterFrames(KATZ_SHAPE)]) {
            for (const [name, rows] of Object.entries(frames)) {
                expect(rows[0], name).toBe('.'.repeat(16));
                for (const row of rows) expect(row[0] + row[15], name).toBe('..');
            }
        }
    });

    it('walking bobs the body down one pixel; standing does not', () => {
        const f = buildCharacterFrames();
        expect(f['down-stepA'][2]).toBe(f['down-stand'][1]);
        expect(f['down-stepB'][2]).toBe(f['down-stand'][1]);
    });

    it('Katz reads differently from the Hiker: no hat, stubble, a wider shirt', () => {
        const hiker = buildCharacterFrames()['down-stand'];
        const katz = buildCharacterFrames(KATZ_SHAPE)['down-stand'];
        expect(hiker[1]).toContain('h');
        expect(katz[1]).not.toContain('h');
        expect(katz[6]).toContain('r');
        expect(katz[9].replace(/\./g, '').length).toBeGreaterThan(hiker[9].replace(/\./g, '').length);
    });
});
