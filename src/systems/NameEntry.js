// Name entry in the opening (design blueprint: "Name entry happens here").
// Pure rules, so they can be tested without Phaser.
export const NAME_MAX = 12;
export const DEFAULT_NAME = 'Hiker';

// Applies one key press to the name being typed: letters, digits, spaces,
// hyphens, apostrophes and periods, up to NAME_MAX; Backspace deletes.
export function editName(name, key) {
    if (key === 'Backspace') return name.slice(0, -1);
    if (key.length === 1 && /[A-Za-z0-9 '\-.]/.test(key) && name.length < NAME_MAX) {
        return name.length === 0 && key === ' ' ? name : name + key;
    }
    return name;
}
