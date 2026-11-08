import { MIX, SFX, VOICES, MUSIC } from '../data/audio.js';
import { getSettings } from '../state/settings.js';

// All the game's sound, generated with the Web Audio API (audio-design skill):
//
//   effects ──► sfx bus ───┐
//   music loop ► music bus ┴► master ► speakers
//
// The two bus volumes follow Settings (0-100%, on a perceptual curve), and
// the music ducks a little while a dialogue box is open. Browsers block
// sound until the player presses a key or clicks, so nothing plays (and no
// AudioContext exists) until then; the music the current scene asked for
// starts at that moment. Music loops are rendered once, offline, from the
// note data in src/data/audio.js, then looped.

// ---- Pure helpers (tested) ------------------------------------------------

export const midiToHz = (midi) => 440 * 2 ** ((midi - 69) / 12);
export const dbToGain = (db) => 10 ** (db / 20);
// Settings slider (0-1) to gain: squared, so 50% sounds about half as loud.
export const volumeToGain = (v) => Math.max(0, Math.min(1, v)) ** 2;

export function trackSeconds(track) {
    return (track.bars.length * 4 * 60) / track.bpm;
}

// Every note of a music loop: { voice: 'pad' | 'bass' | 'pluck', time, dur, midi }.
export function scoreEvents(track) {
    const beat = 60 / track.bpm;
    const bar = beat * 4;
    const events = [];
    track.bars.forEach(({ chord, melody }, i) => {
        const t0 = i * bar;
        chord.slice(1).forEach((midi) => events.push({ voice: 'pad', time: t0, dur: bar, midi }));
        for (const b of [0, 2]) events.push({ voice: 'bass', time: t0 + b * beat, dur: beat * 1.8, midi: chord[0] });
        melody.forEach((midi, k) => {
            if (midi !== null) events.push({ voice: 'pluck', time: t0 + k * beat, dur: beat * 0.95, midi });
        });
    });
    return events;
}

// ---- Rendering a loop (offline, once per track) -----------------------------

const VOICE_SOUND = {
    pad: { wave: 'sine', level: 0.07, attack: 0.5, release: 0.4 },
    bass: { wave: 'triangle', level: 0.2, attack: 0.01, release: null },
    pluck: { wave: 'triangle', level: 0.16, attack: 0.005, release: null }
};

async function renderTrack(track) {
    const rate = 22050;
    const length = trackSeconds(track);
    const ctx = new OfflineAudioContext(1, Math.ceil(length * rate), rate);
    const out = ctx.createGain();
    out.connect(ctx.destination);
    for (const e of scoreEvents(track)) {
        const v = VOICE_SOUND[e.voice];
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = v.wave;
        osc.frequency.value = midiToHz(e.midi);
        const end = Math.min(length, e.time + e.dur);
        g.gain.setValueAtTime(0, e.time);
        g.gain.linearRampToValueAtTime(v.level, e.time + v.attack);
        if (v.release) {
            // Pads swell and fade inside their bar, so the loop seam is silent.
            g.gain.setValueAtTime(v.level, Math.max(e.time + v.attack, end - v.release));
            g.gain.linearRampToValueAtTime(0, end);
        } else {
            g.gain.exponentialRampToValueAtTime(0.0005, end);
        }
        osc.connect(g).connect(out);
        osc.start(e.time);
        osc.stop(end);
    }
    return ctx.startRendering();
}

// ---- The audio system ------------------------------------------------------

export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.settings = null;
        this.wanted = null;   // the loop the current scene asked for
        this.playing = null;  // { name, src, gain }
        this.buffers = {};
        this.ducked = false;
        this.lastBlip = 0;
    }

    // Called once at startup: the first key press or click unlocks sound.
    init() {
        if (typeof window === 'undefined') return;
        const unlock = () => this.unlock();
        window.addEventListener('keydown', unlock);
        window.addEventListener('pointerdown', unlock);
    }

    unlock() {
        if (!this.ctx) {
            const AC = window.AudioContext ?? window.webkitAudioContext;
            if (!AC) return;
            this.ctx = new AC();
            this.master = this.ctx.createGain();
            this.musicBus = this.ctx.createGain();
            this.sfxBus = this.ctx.createGain();
            this.musicBus.connect(this.master);
            this.sfxBus.connect(this.master);
            this.master.connect(this.ctx.destination);
            this.applySettings(this.settings ?? getSettings(), true);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
        if (this.wanted && !this.playing) this.playMusic(this.wanted);
    }

    musicLevel() {
        const s = this.settings ?? getSettings();
        return volumeToGain(s.music) * dbToGain(MIX.musicDb) * (this.ducked ? dbToGain(MIX.duckDb) : 1);
    }

    // New settings from the Settings screen (or at startup).
    applySettings(settings, now = false) {
        this.settings = settings;
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const ramp = now ? 0.01 : 0.08;
        this.musicBus.gain.setTargetAtTime(this.musicLevel(), t, ramp);
        this.sfxBus.gain.setTargetAtTime(volumeToGain(settings.sfx) * dbToGain(MIX.sfxDb), t, ramp);
    }

    // Lower the music while a dialogue box is open.
    duck(on) {
        this.ducked = on;
        if (this.ctx) this.musicBus.gain.setTargetAtTime(this.musicLevel(), this.ctx.currentTime, 0.25);
    }

    buffer(name) {
        this.buffers[name] ??= renderTrack(MUSIC[name]);
        return this.buffers[name];
    }

    // Cross-fades to another loop; asking for the one already playing does nothing.
    playMusic(name) {
        if (!name || !MUSIC[name]) return;
        this.wanted = name;
        if (!this.ctx || this.playing?.name === name) return;
        const t = this.ctx.currentTime;
        if (this.playing?.src) {
            const { src, gain } = this.playing;
            gain.gain.setTargetAtTime(0, t, 0.35);
            src.stop(t + 2);
        }
        const token = (this.playing = { name });
        this.buffer(name).then((buf) => {
            if (this.playing !== token || !this.ctx) return;
            const src = this.ctx.createBufferSource();
            src.buffer = buf;
            src.loop = true;
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 1.5);
            src.connect(gain).connect(this.musicBus);
            src.start();
            Object.assign(token, { src, gain });
        });
    }

    // A sound effect from SFX. `shift` moves it up or down in semitones.
    sfx(name, { shift = 0 } = {}) {
        const r = SFX[name];
        if (!r || !this.ctx || this.ctx.state !== 'running') return;
        const now = this.ctx.currentTime;
        const vary = (Math.random() * 2 - 1) * r.vary;
        r.notes.forEach((note, i) => {
            const start = now + i * r.step;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = r.wave;
            osc.frequency.value = midiToHz(note + shift + vary);
            g.gain.setValueAtTime(dbToGain(r.gainDb), start);
            g.gain.exponentialRampToValueAtTime(0.0001, start + r.length);
            osc.connect(g).connect(this.sfxBus);
            osc.start(start);
            osc.stop(start + r.length + 0.02);
        });
    }

    // One typewriter blip in a speaker's voice, at most every 45 ms.
    blip(voice = 'narrator') {
        const t = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (t - this.lastBlip < 45) return;
        this.lastBlip = t;
        this.sfx('blip', { shift: VOICES[voice] ?? 0 });
    }
}

export const audio = new AudioSystem();
