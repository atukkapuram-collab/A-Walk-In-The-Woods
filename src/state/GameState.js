import { TUNING } from '../data/tuning.js';

// Everything about the current run: the four stats, miles, the two flags,
// the player's name and which events have happened. Plain JavaScript (no
// Phaser), so it is easy to test. One shared instance, `gameState`, lives
// for the whole page and is reset at the start of each run.
//
// Rules (design blueprint, Resources and Stats; scene outline):
// - Stats run 0-10 and start at Stamina 6, Supplies 6, Bond 5, Morale 6.
// - Stats only change at the result card (DialogueScene calls apply then).
// - Miles is a counter (never below 0) and never decides an ending.

export const STATS = ['stamina', 'supplies', 'bond', 'morale'];
export const FLAGS = ['skippedAhead', 'leftWilderness'];
export const START = { stamina: 6, supplies: 6, bond: 5, morale: 6 };

// Danger zones: the bar blinks red and Katz worries (design blueprint).
export const DANGER = { stamina: 2, supplies: 2, bond: 3, morale: 3 };

const clamp = (v) => Math.max(0, Math.min(10, v));

// Turns event effects into numbers: miles words ('plus', 'slow', ...) use TUNING.miles.
export function resolveEffects(effects = {}, miles = TUNING.miles) {
    const out = {};
    for (const [key, value] of Object.entries(effects)) {
        if (typeof value === 'string') {
            if (miles[value] === undefined) throw new Error(`Unknown miles change "${value}".`);
            out[key] = miles[value];
        } else {
            out[key] = value;
        }
    }
    return out;
}

export function isInDanger(stat, value) {
    return value <= DANGER[stat];
}

export class GameState {
    constructor() {
        this.listeners = {};
        this.reset();
    }

    reset() {
        this.stats = { ...START };
        this.miles = 0;
        this.flags = Object.fromEntries(FLAGS.map((f) => [f, false]));
        this.playerName = 'Hiker';      // set by name entry in the opening
        this.eventsDone = new Set();
        this.choices = {};              // eventId -> id of the option picked, for callbacks
        this.overlooksSeen = new Set(); // map keys whose overlook already gave Morale +1
        this.journeyIndex = 0;          // position in src/data/journey.js
        this.emit('reset', this);
    }

    // A plain snapshot, the shape event `when` conditions and ending checks read.
    get snapshot() {
        return { ...this.stats, miles: this.miles, ...this.flags, choices: { ...this.choices } };
    }

    // Applies an event's effects (and flags). Returns the real changes after
    // clamping: [{ key, from, to }]. Emits 'stat-changed' for each.
    apply(effects = {}, flags = {}) {
        const changes = [];
        for (const [key, delta] of Object.entries(resolveEffects(effects))) {
            if (!delta) continue;
            if (key === 'miles') {
                const from = this.miles;
                this.miles = Math.max(0, this.miles + delta);
                if (this.miles !== from) changes.push({ key, from, to: this.miles });
            } else if (STATS.includes(key)) {
                const from = this.stats[key];
                this.stats[key] = clamp(from + delta);
                if (this.stats[key] !== from) changes.push({ key, from, to: this.stats[key] });
            } else {
                throw new Error(`Unknown stat "${key}".`);
            }
        }
        changes.forEach((c) => this.emit('stat-changed', c));
        for (const [flag, value] of Object.entries(flags)) this.setFlag(flag, value);
        return changes;
    }

    // Direct set, for debug starts and later the map-completion miles.
    set(key, value) {
        if (key === 'miles') this.miles = Math.max(0, value);
        else if (STATS.includes(key)) this.stats[key] = clamp(value);
        else throw new Error(`Unknown stat "${key}".`);
        this.emit('stat-changed', { key, from: null, to: key === 'miles' ? this.miles : this.stats[key] });
    }

    setFlag(flag, value = true) {
        if (!FLAGS.includes(flag)) throw new Error(`Unknown flag "${flag}".`);
        this.flags[flag] = Boolean(value);
        this.emit('flag-changed', { flag, value: this.flags[flag] });
    }

    markDone(eventId) {
        this.eventsDone.add(eventId);
    }

    // Remembers which option was picked, so later scenes can refer back to it
    // (e.g. the snack cakes, or Katz remembering being left alone).
    recordChoice(eventId, optionId) {
        if (optionId) this.choices[eventId] = optionId;
    }

    // Stats that just moved into their danger zone, from apply()'s changes.
    newDangers(changes) {
        return changes
            .filter((c) => STATS.includes(c.key) && isInDanger(c.key, c.to) && !isInDanger(c.key, c.from))
            .map((c) => c.key);
    }

    // A tiny event emitter, so the HUD can listen without polling.
    on(name, fn) {
        (this.listeners[name] ??= new Set()).add(fn);
        return () => this.off(name, fn);
    }

    off(name, fn) {
        this.listeners[name]?.delete(fn);
    }

    emit(name, payload) {
        this.listeners?.[name]?.forEach((fn) => fn(payload));
    }
}

export const gameState = new GameState();
