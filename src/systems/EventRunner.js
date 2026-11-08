// Plays one event script (src/data/events/) one step at a time.
// Pure logic, no Phaser: DialogueScene asks for the next step, shows it, and
// reports the player's choice back. Format: see the comment at the top of
// src/data/events/act1.js.
//
// next() returns one of:
//   { type: 'narrate', text }
//   { type: 'say', speaker, text }
//   { type: 'choose', options: [text, ...] }   then call choose(index)
//   { type: 'result', text, effects, flags, fromChoice }
//   { type: 'end', outcome }
export class EventRunner {
    constructor(event, { state = {}, random = Math.random } = {}) {
        this.event = event;
        this.state = state;
        this.random = random;
        this.queue = [...event.steps];
        this.pending = null;
        this.outcome = { eventId: event.id, choice: null, choiceText: null, optionId: null, effects: {}, flags: {}, final: null };
    }

    next() {
        if (this.pending) {
            throw new Error(`Event "${this.event.id}": call choose() before next().`);
        }
        while (this.queue.length) {
            const step = this.queue.shift();
            if (step.when && !step.when(this.state)) continue;

            if (step.result !== undefined) {
                // Either the card after a choice (internal) or an authored card,
                // e.g. the overlook: { result: 'text', effects: { morale: +1 } }.
                return {
                    type: 'result',
                    text: step.result,
                    effects: step.effects ?? {},
                    flags: step.flags ?? {},
                    fromChoice: Boolean(step.internal)
                };
            }
            if (step.narrate !== undefined) {
                return { type: 'narrate', text: step.narrate };
            }
            if (step.say !== undefined) {
                return { type: 'say', speaker: step.say, text: step.text };
            }
            if (step.choose !== undefined) {
                this.pending = step.choose.filter((option) => !option.when || option.when(this.state));
                return { type: 'choose', options: this.pending.map((option) => option.text) };
            }
            throw new Error(`Event "${this.event.id}": unknown step ${JSON.stringify(step)}.`);
        }
        return { type: 'end', outcome: this.outcome };
    }

    choose(index) {
        const option = this.pending?.[index];
        if (!option) {
            throw new Error(`Event "${this.event.id}": no option ${index}.`);
        }

        let picked = option;
        if (option.chance) {
            const roll = this.random();
            let total = 0;
            picked = option.chance.find((c) => roll < (total += c.p)) ?? option.chance.at(-1);
        }

        const effects = typeof picked.effects === 'function' ? picked.effects(this.state) : { ...(picked.effects ?? {}) };
        this.outcome = {
            eventId: this.event.id,
            choice: index,
            choiceText: option.text,
            // Stable id of the option (or of the coin-flip side that came up),
            // remembered in GameState.choices for later callbacks.
            optionId: picked.id ?? option.id ?? null,
            effects,
            flags: { ...(option.flags ?? {}), ...(picked.flags ?? {}) },
            // The Final Crossroads options carry final: 'summit' | 'home' | 'ourWay'.
            final: option.final ?? null
        };
        this.pending = null;

        // A short reaction after the result card (option.after: steps), then the rest of the event.
        const after = picked.after ?? option.after ?? [];
        this.queue.unshift(...after);
        const result = typeof picked.result === 'function' ? picked.result(this.state) : picked.result;
        if (result) {
            this.queue.unshift({ internal: true, result, effects, flags: this.outcome.flags });
        }
    }
}
