import { TUNING } from '../data/tuning.js';

// Everything about the current run: the four stats, miles, the flags, the
// Journal entries found and which events have happened. The player is always
// Bill Bryson (no name entry since Milestone 10). Plain JavaScript (no
// Phaser), so it is easy to test. One shared instance, `gameState`, lives
// for the whole page and is reset at the start of each run.
//
// Rules (design blueprint, Resources and Stats; scene outline):
// - Stats run 0-10 and start at Stamina 6, Supplies 6, Bond 5, Morale 6.
// - Stats only change at the result card (DialogueScene calls apply then).
// - Miles is a counter (never below 0) and never decides an ending. It counts
//   miles WALKED; miles driven past (the rental car) go in skippedMiles.
// - While Katz is away (flag katzAway, E8 to E11) Bond is frozen: Bond
//   effects do nothing unless the event says bondWhileAway (E11, the phone call).

export const STATS = ['stamina', 'supplies', 'bond', 'morale'];
export const FLAGS = ['skippedAhead', 'invited', 'katzAway', 'leftWilderness'];
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
        this.skippedMiles = 0;          // trail miles passed by car (travel screen)
        this.trailPos = 0;              // where on the 2,190-mile trail the walk has got to
        this.skippedRanges = [];        // [from, to] trail stretches passed by car (dashed on the travel map)
        this.journal = new Set();       // Journal entry ids found on this walk
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
    // Effects apply before flags, so the Bond change on the choice that sends
    // Katz home (E8) still counts. `bondWhileAway` lets E11 change Bond.
    apply(effects = {}, flags = {}, { bondWhileAway = false } = {}) {
        const changes = [];
        for (const [key, delta] of Object.entries(resolveEffects(effects))) {
            if (!delta) continue;
            if (key === 'bond' && this.flags.katzAway && !bondWhileAway) continue;
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

    // Unlocks a Journal entry for this walk. Returns true the first time.
    unlockJournal(id) {
        if (this.journal.has(id)) return false;
        this.journal.add(id);
        this.emit('journal-unlocked', id);
        return true;
    }

    // Miles the rental car carried them past (not walked).
    skipMiles(miles) {
        this.skippedMiles += Math.max(0, miles);
    }

    // Moves the travel-map marker to `pos` (trail miles). With `skipped`, the
    // stretch was driven past: it counts as skipped and is drawn dashed.
    travelTo(pos, { skipped = false } = {}) {
        const from = this.trailPos;
        this.trailPos = Math.max(from, pos);
        if (skipped && this.trailPos > from) {
            this.skippedRanges.push([from, this.trailPos]);
            this.skipMiles(this.trailPos - from);
        }
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
