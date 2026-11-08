import { Input } from 'phaser';

// Action map: game code asks for actions ('up', 'confirm'), never for keys.
// Bindings are data, so rebinding later only changes this table.
export const DEFAULT_BINDINGS = {
    up: ['UP', 'W'],
    down: ['DOWN', 'S'],
    left: ['LEFT', 'A'],
    right: ['RIGHT', 'D'],
    confirm: ['SPACE', 'ENTER'],
    pause: ['ESC'], // used from Milestone 6
    choice1: ['ONE', 'NUMPAD_ONE'],
    choice2: ['TWO', 'NUMPAD_TWO'],
    choice3: ['THREE', 'NUMPAD_THREE'],
    choice4: ['FOUR', 'NUMPAD_FOUR']
};

const DIRECTIONS = ['up', 'down', 'left', 'right'];

export class Controls {
    constructor(scene, bindings = DEFAULT_BINDINGS) {
        this.keys = {};
        this.order = []; // held directions, most recently pressed last

        for (const [action, names] of Object.entries(bindings)) {
            this.keys[action] = names.map((name) => {
                const key = scene.input.keyboard.addKey(name); // also stops arrows/space scrolling the page
                if (DIRECTIONS.includes(action)) {
                    key.on('down', () => this.press(action));
                }
                return key;
            });
        }
    }

    press(dir) {
        this.order = this.order.filter((d) => d !== dir);
        this.order.push(dir);
    }

    isDown(action) {
        return this.keys[action].some((key) => key.isDown);
    }

    // True once per key press (for confirm/pause). Call at most once per frame per action.
    justPressed(action) {
        return this.keys[action].some((key) => Input.Keyboard.JustDown(key));
    }

    // Throw away pending presses, e.g. the Space press that closed a dialogue box,
    // so it doesn't also count in the scene that takes over.
    flush() {
        for (const keys of Object.values(this.keys)) {
            keys.forEach((key) => Input.Keyboard.JustDown(key));
        }
    }

    // The direction to walk: the most recently pressed one that is still held.
    // Released keys drop out, so holding Up then tapping Left walks left once,
    // then carries on up. No diagonals: only one direction is ever returned.
    get direction() {
        this.order = this.order.filter((d) => this.isDown(d));
        for (const d of DIRECTIONS) {
            if (this.isDown(d) && !this.order.includes(d)) this.order.unshift(d);
        }
        return this.order.at(-1) ?? null;
    }
}
