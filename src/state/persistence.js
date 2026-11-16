// What survives between visits: endings found, Journal entries ever found
// (Milestone 10) and settings.
// No mid-run saves: the docs have none and a run is 20-30 minutes.
//
// Stored as one versioned JSON record in localStorage. Loading never throws:
// a missing, corrupt or unknown record falls back to defaults (save-systems).

export const SAVE_KEY = 'trail-mix-save';
export const SAVE_VERSION = 2;

export function defaultSave() {
    return { version: SAVE_VERSION, endingsFound: [], journalFound: [], settings: {} };
}

// Upgrades older records. Add a step here whenever SAVE_VERSION goes up.
function migrate(data) {
    // 1 -> 2: the Journal arrived; endings and settings carry over.
    if (data?.version === 1) data = { ...data, version: 2, journalFound: [] };
    if (data?.version === SAVE_VERSION) return data;
    return null; // unknown version: start fresh rather than guess
}

function storage() {
    try {
        return globalThis.localStorage ?? null;
    } catch {
        return null; // e.g. blocked by browser privacy settings
    }
}

export function loadSave(store = storage()) {
    try {
        const raw = store?.getItem(SAVE_KEY);
        if (!raw) return defaultSave();
        const data = migrate(JSON.parse(raw));
        if (!data || !Array.isArray(data.endingsFound) || !Array.isArray(data.journalFound) || typeof data.settings !== 'object') return defaultSave();
        return { ...defaultSave(), ...data };
    } catch {
        return defaultSave();
    }
}

export function writeSave(data, store = storage()) {
    try {
        store?.setItem(SAVE_KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
        return true;
    } catch {
        return false; // storage full or blocked: the game still works, it just won't remember
    }
}

export function recordEnding(endingId, store = storage()) {
    const save = loadSave(store);
    if (!save.endingsFound.includes(endingId)) save.endingsFound.push(endingId);
    writeSave(save, store);
    return save;
}

// Journal entries survive between walks, so the Journal fills up over replays.
export function recordJournal(id, store = storage()) {
    const save = loadSave(store);
    if (!save.journalFound.includes(id)) save.journalFound.push(id);
    writeSave(save, store);
    return save;
}

// Which Journal entries count as found: every earlier walk's plus this walk's.
export function foundJournalIds(save, thisWalk = []) {
    return new Set([...save.journalFound, ...thisWalk]);
}
