# Trail Mix: Implementation Plan

Status: **draft for review** (11/7/2026). No code has been written yet. Work goes one milestone at a time with a review stop after each (section 4). Current progress is in [handoff.md](handoff.md).

This plan turns the four design docs into a build order. It adds no story events or mechanics. Where it needs a number the docs leave open (for example how many miles "Miles +" means), it marks it as a **tuning value** that lives in a data file and can change without touching code.

- Source of truth for story: [scene-outline.md](scene-outline.md), then [story.md](story.md).
- Source of truth for gameplay: [design-blueprint.md](design-blueprint.md).
- Scope and themes: [planning.md](planning.md).

## 1. Ground rules

1. **Story first, small and finished.** We build one complete slice (Map 1, both events, HUD, a placeholder ending) before adding anything else, as the blueprint's build order says.
2. **One template, reused.** One trail scene runs all four maps. One event runner plays all 8 events, the 2 quiet beats and the Final Crossroads. One ending scene shows all 4 endings.
3. **Content is data.** Map layouts, event text, choices, stat effects and ending text live in `src/data/`. Scenes and systems never contain story text. Content can be written and reviewed without reading engine code, and a new developer can find it quickly after a handoff.
4. **Placeholder art from code.** Sprites and tiles are generated at boot from small pixel matrices (the `game-assets` approach), so there are no image files to wait for. Real art can replace a texture later under the same key.
5. **No Arcade Physics for movement.** Movement is tile by tile, and collision is a lookup in the map grid. That is simpler and more reliable than physics bodies for Pokémon-style walking.
6. **Easy to hand off.** Each system is its own file, each map is its own file, and each act's events are their own file, so either developer can pick up the next milestone. See section 4.
7. **The creative docs are authoritative.** Implementation follows [story.md](story.md), [scene-outline.md](scene-outline.md) and [design-blueprint.md](design-blueprint.md) as written. Claude does not rewrite story content, character decisions, choices, stat effects or ending conditions while implementing. If something in the docs seems wrong or unbuildable, Claude raises it and waits for explicit approval before changing anything.
8. **Each milestone stays inside its own scope.** Nothing from a later milestone is built early. In particular, Milestone 0 is setup only: no gameplay features and no story content.

## 2. Tech stack

| Piece | Choice | Why |
| --- | --- | --- |
| Engine | Phaser 4 (pin the exact version) | `phaser-core` targets Phaser 4.2 for new projects. If the official template installs Phaser 3.90 instead, keep that and pin it. |
| Build tool | Vite, from the official Phaser template | Fast dev server, one command (`npm run dev`), and the scaffolder `make-game` recommends. |
| Language | Plain JavaScript (ES modules) | Decided. Least setup for a 10-hour build. |
| Tests | Vitest, for pure logic only | Stats, ending checks and data validation can be tested without a browser. |
| Saving | `localStorage`, small and versioned | Only settings and "Endings Found" persist. The docs have no mid-run save, and a run is 20–30 minutes. |
| Node | One shared LTS version in `.nvmrc` | Both machines install the same dependencies. |

**Screen size:** the canvas is 960×540 and scales to fit the window (`Scale.FIT`, `pixelArt: true`). Tiles are 16×16 pixels. The world camera zooms ×3, so about 20×11 tiles are visible, close to a Game Boy Advance view. UI scenes run without zoom, so text stays sharp.

## 3. Architecture

### Scenes

```
BootScene ─► TitleScene ─► OpeningScene ─► (Journey director) ─► EndingScene ─► TitleScene
                 │                              │
           SettingsScene               TrailScene (one scene, 4 maps)
           EndingsFoundScene             ├─ HUDScene        (runs on top, launched once)
                                         ├─ DialogueScene   (overlay: narration, dialogue, choices, result card)
                                         └─ PauseScene      (Esc)
                                        TravelScene, ActCardScene (between maps)
```

- **Journey** (`src/systems/Journey.js`) reads an ordered list from `src/data/journey.js` (act card, map, travel, map, …) and starts the next step when the current one finishes. Scenes never hard-code what comes next.
- **GameState** (`src/state/GameState.js`) is a plain module: the four stats, miles, the two flags, the player's name and the events done. It clamps stats to 0–10 and emits `stat-changed` and `flag-changed` events. The HUD listens to those events instead of polling (`game-ui-ux`).
- **EventRunner** (`src/systems/EventRunner.js`) plays one event script from data, step by step, in the DialogueScene.
- **Endings** (`src/state/endings.js`) is a pure function: `checkEnding(state, finalChoice?)` returns an ending id or `null`.

### Folder layout

```
index.html
package.json, package-lock.json, .nvmrc, .gitignore
src/
  main.js                 game config and scene list
  config.js               tile size, zoom, colors, text speeds, depth layers
  scenes/                 one file per scene (Boot, Title, Opening, Trail, HUD, Dialogue,
                          Pause, Settings, Travel, ActCard, Ending, EndingsFound)
  systems/                GridMover, Follower, MapBuilder, Interactions, EventRunner,
                          Journey, Input (action map), Transitions, Audio
  state/                  GameState, endings, persistence (localStorage)
  art/                    pixel matrices and palettes; textures generated at boot
  data/
    journey.js            the order of acts, maps and travel screens
    maps/                 georgia.js, smokies.js, virginia.js, maine.js
    events/               act1.js, act2.js, act3.js (events, quiet beats, crossroads)
    endings.js            ending narration, Katz lines, lessons
    katz-lines.js         talk-to-Katz lines by Bond band, danger-warning lines
    tuning.js             miles values, typewriter speeds, step time
tests/                    Vitest tests for state, endings and data validation
```

### Data formats (fixed in Milestones 1 and 2, then reused by every later milestone)

**Map** (an ASCII grid, easy to read and to merge):

```js
export default {
  key: 'georgia', title: 'North Georgia', season: 'Early spring', palette: 'spring',
  rows: [
    'TTTTTTTTTTTTTTTT',
    'T....,,,.....RTT',
    'T.P..B...G....TT',   // P = player start, B = blaze tree, G = gate
    // ...
  ],
  legend: { T: 'tree', '.': 'path', ',': 'grass', R: 'rock', W: 'water', B: 'blazeTree', G: 'gate' },
  npcs:     [{ id: 'salesman', x: 6, y: 4, sprite: 'salesman', talk: 'event1_outfitter' }],
  triggers: [{ x: 4, y: 14, w: 12, h: 1, event: 'event2_going_home' }], // step triggers (a rectangle; w/h default 1)
  gates:    [{ id: 'mud', tiles: [[9, 2]], opensAfter: 'event1_outfitter' }],
  signs:    [{ x: 4, y: 2, text: '...' }],
  overlook: { x: 14, y: 6, text: '...' },                            // Morale +1, once per map
  exit:     { x: 30, y: 12 },
};
```

**Event** (one template for every event, as the blueprint and outline require). The full, current format is documented at the top of `src/data/events/act1.js`:

```js
{
  id: 'event2_going_home', scene: 3, map: 'georgia',
  steps: [
    { narrate: 'On a muddy climb...' },
    { say: 'katz', text: "I'm going home." },
    { say: 'katz', text: '...', when: s => s.bond >= 7 },             // optional variant line
    { choose: [
      { text: 'Push him.',     effects: { miles: 'plus', bond: -1 }, result: 'He follows in silence...' },
      { text: 'Sit with him.', effects: { bond: +2, supplies: -1, miles: 'slow' }, result: '...' },
      { text: 'Make a joke.',  effects: { morale: +1 }, result: '...' },
    ]},
  ],
  endingCheck: false,
}
```

- `effects` can also be a function of the state for the outline's conditional rules (the River: if Stamina is 3 or less **before** the crossing, also Supplies −1).
- A choice can set a flag: `flags: { skippedAhead: true }`.
- A choice can be a coin flip: `chance: [{ p: 0.5, effects, result }, { p: 0.5, effects, result }]` (Event 6).
- `miles: 'plus' | 'minus' | 'slow' | 'big'` map to numbers in `tuning.js` (tuning values, for example +20, −10, +5 and +100; Pine Gap's truck goes 100 miles north in the story).

## 4. Development workflow

### One milestone at a time

1. Milestones are built **in order, one at a time**, starting with Milestone 0. Order and contents are in section 5.
2. A milestone is finished only when everything in its "Build" list is done and its "Test" list passes.
3. When a milestone is finished, Claude reports:
   - what was implemented,
   - which files were created or changed,
   - how to test it (the steps from the milestone's "Test" list),
   - any remaining issues or anything left undone.
4. Claude updates the handoff record ([handoff.md](handoff.md)) as part of finishing the milestone.
5. Then Claude **stops** and asks whether to go on to the next milestone. It never starts the next milestone on its own, even when it looks like a natural continuation. Only explicit approval from the developer continues the work.
6. Fixes and changes the developer asks for during review stay part of the current milestone until they approve moving on.

### Handoff between developers

- For now, one developer (the project owner) works through the milestones.
- Either developer can take over at any point. The new developer continues from the **next unfinished milestone**, starting from [handoff.md](handoff.md), so nobody has to reconstruct earlier work.
- No milestone is permanently owned by either person.
- The handoff record is updated at **every** milestone completion and stays short. It always contains:
  1. completed features,
  2. files created or modified,
  3. the current project structure and the technical decisions that matter,
  4. how to run and test the project,
  5. known bugs and incomplete features,
  6. the next milestone and what it depends on.

### Git

- **Branches:** one branch per milestone (`m0-setup`, `m1-walking`, …). Small commits, made when the developer asks for them.
- **Pushing:** Claude Code never pushes, opens pull requests or merges unless the developer explicitly asks in that conversation (also recorded in `CLAUDE.md`).
- **Same setup on every machine:** commit `package-lock.json` and `.nvmrc`; `node_modules/` and `dist/` go in `.gitignore`. Anyone can run the game with `npm install` then `npm run dev`.
- **Separate files keep a later handoff easy:** systems, maps, and each act's events live in their own files, so two people could work at once without conflicts if you ever choose to.
- **Debug shortcuts** (Milestone 3) let anyone jump straight to any map with any stats, so nobody has to replay 20 minutes to test Event 8.

## 5. Milestones

Hours follow the blueprint's 10-hour build plan. The first six milestones are the playable prototype the request asked for (setup, map, movement, collision, camera, Katz) and then the remaining systems in dependency order.

### Milestone 0: Project setup (≈0.5 h, part of blueprint block 1)

**Strictly setup.** No movement, maps, events, stats, story text or art beyond a single boot check belongs here.

1. **Build:** scaffold with the official Phaser template (check the current Phaser docs first, as `make-game` requires; choose Vite and JavaScript). Pin the Phaser version. Game config: 960×540, `Scale.FIT`, `pixelArt: true`. A BootScene that generates one test texture and a TitleScene stub that says "Trail Mix". Add `.gitignore`, `.nvmrc`, Vitest and the `src/` folders above.
2. **Files:** `package.json`, `package-lock.json`, `index.html`, `vite.config.js` (from the template), `.gitignore`, `.nvmrc`, `src/main.js`, `src/config.js`, `src/scenes/BootScene.js`, `src/scenes/TitleScene.js`, `README.md` (how to run). Update `CLAUDE.md` project state.
3. **Depends on:** nothing.
4. **Skills:** `phaser-core` (config, scenes, Phaser 4 pitfalls such as `pixelArt`), `make-game` (scaffold step only, official template), `game-jam` (keep it tiny).
5. **Test:** a clean `npm install` then `npm run dev` (later, the same on your partner's machine when they take over). The page shows "Trail Mix" with crisp pixels and no console errors. `npm test` runs (zero tests is fine).

### Milestone 1: Walking prototype (≈1 h, blueprint block 1)

The playable prototype: one trail map, four-direction grid movement, grid collision, a following camera and Katz following.

1. **Build:**
   - **Placeholder art:** code-generated 16×16 tiles (path, grass, tree, rock, water, blaze tree, gate) and two characters (the Hiker and Katz) with 2-frame walk cycles in four directions.
   - **MapBuilder:** turns a map data file into a Phaser tilemap layer and a `solid[y][x]` grid.
   - **Input:** an action map (`up/down/left/right` = arrows and WASD, `confirm` = Space and Enter, `pause` = Esc), so code asks for actions, not keys (`input-systems`).
   - **GridMover:** holding a direction turns the player to face it. If the next tile is free, the player tweens one tile (tuning value, about 180 ms per step) and emits `step-start` and `step-end`. No diagonals, no running. Holding a key keeps walking smoothly.
   - **Collision:** before each step, check the solid grid, closed gates and NPC tiles. Blocked means turn in place only.
   - **Camera:** `startFollow` on the player with bounds set to the map size, so it stops at map edges. Add a small deadzone and rounded pixels to avoid jitter (`camera-systems`).
   - **Katz follower:** when the player starts a step, Katz walks into the tile the player just left, in the same time, facing the same way. If the player walks back into Katz's tile they swap, so Katz never blocks the path. Sprites are depth-sorted by y.
   - A first blockout of the North Georgia map (`level-design`: grey placeholder tiles, a winding path about 3–4 screens long, walls of trees and rocks, a couple of side nooks).
2. **Files:** `src/art/palettes.js`, `src/art/sprites.js`, `src/art/tiles.js`, `src/systems/Input.js`, `src/systems/MapBuilder.js`, `src/systems/GridMover.js`, `src/systems/Follower.js`, `src/scenes/TrailScene.js`, `src/data/maps/georgia.js`, `src/data/tuning.js`; modify `BootScene.js` (generate textures) and `main.js`.
3. **Depends on:** Milestone 0.
4. **Skills:** `phaser-core` (tilemaps, tweens, cameras), `input-systems`, `camera-systems`, `level-design`, `game-assets` and `pixel-art-sprites` (code-only pixel matrices, readable silhouettes). `phaser-arcade-physics` is **not** used: tile lookup is enough.
5. **Test:**
   - Walk the whole map with arrows and with WASD. Movement is one tile at a time, never diagonal, and the player always ends exactly on a tile.
   - Walk into every kind of wall: the player turns but does not move.
   - Walk to all four map edges: the camera stops at the edge and never shows outside the map.
   - Katz always stands on the tile the player just left, including around corners and after turning back.
   - Tap a key quickly and hold it: no skipped tiles, no stuck keys. Test in Chrome and one other browser.

### Milestone 2: Events, dialogue, choices and result cards (≈2 h, blueprint block 2)

1. **Build:**
   - **Interactions:** step triggers fire when the player finishes a step onto a marked tile. Talk triggers fire when the player faces an NPC, sign, overlook or Katz and presses `confirm`. Each event fires once.
   - **DialogueScene** overlay, launched by the TrailScene, which freezes movement while it runs:
     - slight screen dim,
     - narration box (italic, no portrait),
     - dialogue box at the bottom with speaker name and a small portrait, typewriter text; `confirm` shows the whole line or moves on,
     - choice menu above the dialogue box: 2–4 options, arrow keys or 1–4 to pick, `confirm` to choose,
     - result card: 1–2 sentences plus each stat change with an up or down arrow.
   - **EventRunner:** plays the steps of one event script (`narrate`, `say`, `choose`, `when` conditions), then reports the chosen option back to the TrailScene. In this milestone the result card only *shows* the effects; Milestone 3 applies them.
   - **Gates** open when their event finishes (`opensAfter`).
   - Write the **event format** down (section 3) and put Events 1 and 2 in `src/data/events/act1.js` with the real text from the outline, as the pattern Milestone 5 copies.
   - Tutorial hints from the blueprint ("Arrow keys to walk", "Space to talk") on the first steps of Map 1.
2. **Files:** `src/systems/Interactions.js`, `src/systems/EventRunner.js`, `src/scenes/DialogueScene.js`, `src/ui/TextBox.js`, `src/ui/ChoiceMenu.js`, `src/ui/ResultCard.js`, `src/data/events/act1.js`, `src/data/katz-lines.js`; modify `TrailScene.js`, `georgia.js` (place the salesman, the Event 2 trigger and the gate), `main.js`.
3. **Depends on:** Milestone 1 (map, input, facing direction, grid positions).
4. **Skills:** `dialogue-systems` (a custom data-driven runner, not Ink or Yarn: the node contract of line, choices, command and end), `game-ui-ux` (keyboard focus in the menu, text boxes anchored to screen edges), `narrative-design` (each option costs something; Katz carries the jokes and the narrator carries reflection), `phaser-core` (overlay scene with `launch` and `pause`).
5. **Test:**
   - Talk to the salesman: narration, dialogue with typewriter text, a 3-option menu, a result card, then the gate opens and walking resumes.
   - Step on the Event 2 tile: it starts automatically and never fires twice.
   - Choose with arrows and with number keys. Space during typing shows the full line; it never skips a whole box by accident.
   - The player cannot move while any box is open.
   - Talk to Katz: a random line.

### Milestone 3: Stats, HUD, flags and endings logic: the vertical slice (≈1.5 h, blueprint block 3)

1. **Build:**
   - **GameState:** Stamina 6, Supplies 6, Bond 5, Morale 6, Miles 0, flags `skippedAhead` and `leftWilderness`, the player name, events done. `apply(effects)` clamps to 0–10 and emits events. `reset()` for a new run.
   - **Apply effects** at the result card only, as the blueprint requires.
   - **HUDScene:** top-left panel with the four icons (boot, backpack, heart, sun) and 10-segment pixel bars, Miles in the top-right. It updates on `stat-changed` and flashes the changed bar. Danger warning: a bar blinks red in its danger zone (Bond or Morale 3 or less, Stamina or Supplies 2 or less) and Katz says a worried line once.
   - **Endings:** `checkEnding(state, finalChoice)` checks in the outline's order: Broken Partnership (Bond 2 or less) → Early Departure (Stamina or Supplies 0, Morale 2 or less, or "Let's go home") → Finished Trail ("Summit or nothing" with Stamina 5+, Supplies 3+, Bond 5+ and neither flag) → Changed Route (everything else). Events with `endingCheck: true` (5 and 8) call it after the result card. The bond rating helper: Strangers 0–3, Hiking Buddies 4–6, Trail Family 7–10.
   - **Placeholder EndingScene:** ending name, miles, bond rating. The full template comes in Milestone 6.
   - **Persistence:** a versioned `localStorage` record `{ version: 1, endingsFound: [], settings: {} }` with safe loading (`save-systems`).
   - **Debug mode** (`?debug=1`): start on any map with set stats and flags, for example `?debug=1&map=maine&stats=3,3,5,6&flags=skippedAhead`, plus a key that prints the state.
   - **Talk to Katz** now picks lines by Bond band (warm, neutral, sarcastic).
2. **Files:** `src/state/GameState.js`, `src/state/endings.js`, `src/state/persistence.js`, `src/scenes/HUDScene.js`, `src/scenes/EndingScene.js` (placeholder), `src/systems/Debug.js`, `tests/gameState.test.js`, `tests/endings.test.js`, `tests/data.test.js`; modify `EventRunner.js`, `TrailScene.js`, `main.js`.
3. **Depends on:** Milestone 2 (the result card is where effects apply; events trigger the checks).
4. **Skills:** `game-ui-ux` (event-driven HUD, anchored corners), `save-systems` (versioned schema, defensive load), `phaser-core` (registry and scene events, launching the HUD only once), `narrative-design` (every choice helps one stat and costs another).
5. **Test:**
   - `npm test`: stat clamping at 0 and 10; each ending rule with boundary values (Bond 2 vs 3, Stamina 4 vs 5, Supplies 2 vs 3, each flag blocking Finished Trail); the check order (Bond 2 **and** Stamina 0 gives Broken Partnership). The **data test** checks every event file: 2–4 choices, only known stat names, every `talk` and `event` id in the maps exists.
   - In the browser: play Map 1 start to finish. The HUD bars change only at result cards and match the card. A debug start with Bond 3 plus a Bond −1 choice blinks the bar red.
   - **Exit condition:** a friend can play Map 1 with both events and the HUD and reach a placeholder ending. This is the slice that must exist before anything else is added.

### Milestone 4: Remaining maps and environments (≈2 h, blueprint block 4)

1. **Build:**
   - Finish North Georgia and add the Great Smoky Mountains, Virginia and Maine maps, each a winding path about 3–4 screens long with gates, triggers, NPCs, signs, one scenic overlook and an exit, placed exactly where the blueprint's location table puts them.
   - **One tileset, four season palettes** (spring rain, late-spring fog and snow, midsummer green, autumn red and gold), swapped by the map's `palette` value.
   - **Night tint** for Event 4 and the campfires: a dark blue overlay plus a warm glow texture around the fire.
   - **Simple weather** reusing one particle emitter: rain in Georgia, snow at Whiteout, falling leaves in Maine. Optional within this milestone; cut first if behind.
   - **Map exits** hand control to the Journey (travel screen next). For the "left the wilderness" flag, the Journey skips the rest of Maine and goes to the roadside campground backdrop for the Final Crossroads.
   - Pine Gap at the start of the Virginia map, with Hazel's diner (Hazel as a talk trigger for Event 5).
   - Side characters where the outline places them: Dale (Event 1, Event 3, the Event 7 cameo), Sunshine (Act I pass-by, midpoint, Finished Trail).
2. **Files:** `src/data/maps/georgia.js`, `smokies.js`, `virginia.js`, `maine.js`, `src/art/palettes.js`, `src/art/tiles.js`, `src/art/sprites.js` (Dale, Sunshine, Hazel, salesman), `src/systems/Lighting.js` (night tint and glow), `src/systems/Weather.js`, `src/systems/Journey.js`, `src/data/journey.js`; modify `TrailScene.js` (load a map by key).
3. **Depends on:** Milestones 1–3 (map format from Milestone 1, events from Milestone 2, state and ending checks from Milestone 3).
4. **Skills:** `level-design` (critical path, gates in story order, 1–2 minutes of walking between events, tension and rest), `pixel-art-sprites` and `game-assets` (season palettes, NPC silhouettes), `camera-systems` (bounds per map), `phaser-core`.
5. **Test:**
   - With debug starts, load each map and walk from start to exit. No dead ends, no way around a gate, no softlocks.
   - Each map's events fire in the order of the location table, and the gate after each one opens only after it.
   - Time the walk between events: about 1–2 minutes.
   - Night scenes are readable. Weather does not hide the player or text.
   - The data test still passes with all four maps.

### Milestone 5: Story content for all 16 scenes (≈1 h, blueprint block 5)

1. **Build:** enter every scene from the outline as data, word for word where the outline and story give text:
   - Act I: Events 1–2, the Act I close (with its Bond variant).
   - Act II: Events 3–6 (Event 6's coin flip), the midpoint campfire (Bond 5+ and Bond 4-or-less versions, Sunshine's line).
   - Act III: Events 7–8, the Final Crossroads (narration that reflects the stats, Katz's joke if `skippedAhead` is set, the roadside version if `leftWilderness` is set).
   - The four endings: narration, Katz dialogue, lesson.
   - Continuity callbacks from the outline: snack cakes, the raccoon (always revealed in Event 4, back on the postcard), Dale's cameos, Sunshine's appearances, Hazel's line echoed in Early Departure or Finished Trail.
   - Narrator voice by act (plans and mileage in Act I, noticing in Act II, reflective in Act III). Katz's tone by Bond (7+ warm, 3–4 sharper).
   - Sign and overlook lines for each map.
2. **Files:** `src/data/events/act1.js`, `act2.js`, `act3.js`, `src/data/endings.js`, `src/data/katz-lines.js`, sign and overlook text in the four map files.
3. **Depends on:** Milestone 2 (event format), Milestone 3 (conditions on stats and flags), Milestone 4 (the maps the events are placed on).
4. **Skills:** `narrative-design` (validations: every choice costs something, the themes carry through, Katz carries the humor), `dialogue-systems` (walk every branch).
5. **Test:**
   - The data test passes.
   - A checklist in the PR: every choice and stat change matches the outline line by line (the outline wins if story.md differs).
   - Play each act with debug starts and read every box: each fits the text box in 2–3 sentences, with no overflow.
   - Every cut-list item from the outline is still possible to cut (each lives in its own step or option).

### Milestone 6: Opening, travel screens, act cards, endings and menus (≈1 h, blueprint block 6)

1. **Build:**
   - **TitleScene:** a pixel trail scene with "Trail Mix", Start, Settings and Quit. In a browser tab Quit can't close the window, so it shows a short goodbye card and returns to the title.
   - **OpeningScene:** 3–4 still panels (the kitchen table of maps, the phone calls, Katz at the Atlanta airport with his suitcase) with narration, and name entry.
   - **ActCardScene:** "Act I: The Beginning", "Act II: The Middle", "Act III: The Climax", about 2 seconds each.
   - **TravelScene:** a 4–5 second strip with two tiny sprites walking a ribbon of trail across a simple East Coast map, miles ticking up, a season and place label, an optional narrator line. When `skippedAhead` is set, the pickup truck version.
   - **EndingScene**, full template: illustration, 3–4 boxes of narration and Katz dialogue, the Journey card (ending name, miles, bond rating, final Katz line, lesson in italics), then Walk Again and See Endings Found. Early endings from Events 5 and 8 first show a slow fade and *"And that's where the trail ended for us."*
   - **EndingsFoundScene:** the four endings, with unfound ones shown as "???".
   - **SettingsScene:** music volume, sound effects volume, text speed (slow, normal, instant), saved to `localStorage`.
   - **PauseScene** (Esc): Resume, Settings, Quit to Title.
   - **Transitions:** one fade to black and back, used everywhere.
2. **Files:** `src/scenes/TitleScene.js`, `OpeningScene.js`, `ActCardScene.js`, `TravelScene.js`, `EndingScene.js`, `EndingsFoundScene.js`, `SettingsScene.js`, `PauseScene.js`, `src/systems/Transitions.js`, `src/art/illustrations.js` (simple code-drawn ending and opening pictures); modify `src/data/journey.js`, `main.js`.
3. **Depends on:** Milestones 3–5 (state, endings, maps, ending text).
4. **Skills:** `game-ui-ux` (a screen stack for pause and settings over the game, keyboard focus on every menu), `save-systems` (settings and endings found), `phaser-core` (scene transitions, camera fades).
5. **Test:**
   - A full run from the title to an ending and back to the title, using only the keyboard.
   - Settings changes survive a page reload. Text speed "instant" really is instant.
   - Esc during walking pauses; Esc during a dialogue box does not break the event.
   - Endings Found shows exactly the endings reached, and survives a reload.
   - A run after "Walk Again" starts with fresh stats and flags (no state leaks between runs, a `phaser-core` pitfall).

### Milestone 7: Audio, transitions and optional polish (only after the game works)

1. **Build, in this order, stopping when time runs out:**
   - A small set of sound effects (text blip, menu move, confirm, stat up, stat down) and one or two calm music loops, from a source you are licensed to use (credit it in the README). Two volume buses, music and effects, tied to the settings.
   - Light game feel: the HUD bar flash, a small bounce on the result card, footstep dust. No screen shake on story beats.
   - Better pixel art for the Hiker and Katz, swapped in under the same texture keys.
2. **Files:** `src/systems/Audio.js`, `public/audio/` (sound files), modify `BootScene.js`, `DialogueScene.js`, `HUDScene.js`, `src/art/sprites.js`.
3. **Depends on:** Milestone 6.
4. **Skills:** `audio-design` (music and effects buses), `game-feel` (light touches only), `pixel-art-sprites`.
5. **Test:** volumes follow the settings and mute at 0. Audio starts only after the first key press (browsers block autoplay). Nothing new appears in the console.

### Milestone 8: Playtest, balance and hand-in (≈1 h, blueprint block 7)

1. **Build:** play every ending at least once, start to finish, without debug mode. Fix wording, overflows and balance (only the tuning values and the outline's own numbers). Run `npm run build` and test the built version from `dist/`. How the game is handed in (a zip, itch.io, GitHub Pages) is still to be decided, and nothing is published without your go-ahead.
2. **Files:** `src/data/tuning.js` and wording in `src/data/`, `README.md` (how to play and run).
3. **Depends on:** everything above.
4. **Skills:** `game-jam` (bug-fix freeze, ship buffer), `narrative-design` (validation pass on themes).
5. **Test:** a playtest checklist: reach each of the four endings; check that each early ending can trigger after Event 5 and after Event 8; a full run takes about 20–30 minutes; someone who hasn't seen the game finishes it without help.

## 6. Time budget (due 11/17/2026)

The plan is not divided into days. The hour estimates on each milestone add up to the blueprint's 10 hours. Following `game-jam`, keep the last ~20% of the remaining time before the deadline for Milestone 8 (playtest and hand-in), and use the cut list below if a milestone runs long.

| Milestone | Estimate |
| --- | --- |
| M0 Setup | 0.5 h |
| M1 Walking prototype | 1 h |
| M2 Events | 2 h |
| M3 Stats, HUD, endings (complete slice) | 1.5 h |
| M4 Remaining maps | 2 h |
| M5 Story content | 1 h |
| M6 Screens | 1 h |
| M7 Polish | optional, only if time remains |
| M8 Playtest and hand-in | 1 h |

## 7. If we fall behind

Cut in the blueprint's order: scenic overlooks → the Endings Found screen → the travel-screen animation (use a plain text card) → the outline's story cut list (Dale's river cameo, the Event 6 coin flip, the Bond narration variants, merging Events 3 and 4). Weather and Milestone 7 go before any of those.

**Never cut:** the event template, the stats and ending checks, the four endings, Event 2, Event 5, Event 8, the midpoint and the Final Crossroads.

## 8. Open questions

Decided on 11/7/2026: **JavaScript** (not TypeScript), and **the Phaser version the official template installs, locked to that exact version**.

1. Tuning values for "Miles +", "Miles −", "slower pace" and "big", and the miles each map adds. Proposed starting values are in section 3; the docs leave them open and say miles never decide an ending.
2. How will the game be handed in (a zip of the built files, itch.io or GitHub Pages)? This only matters for Milestone 8.
3. **Walking time between events (found in Milestone 4).** The blueprint asks for maps "about 3–4 screens long" and "about 1–2 minutes of walking between events". At the 200 ms step, the four maps (3–4 screens each) give 0.4–10 seconds of direct walking between events and 8–18 seconds per map; 1 minute would need about 300 tiles of path. Options: keep the maps as they are (reading, side nooks, signs and overlooks add time), make the maps longer, or slow the step. Needs the owner's decision; nothing was changed.
4. **Run length (found in Milestone 8).** A full run takes about 11-12 minutes for a person (78 boxes and about 1,260 words of reading, 9 choices, 1.5 minutes of walking, cards and screens, plus about a minute of optional signs, overlooks and Katz chats), against the docs' 20-30 minutes. Walking is only 1.5 minutes, so slowing the step can't close the gap. Options: count replays toward the 20-30 minutes (four endings to find), lengthen the maps toward the blueprint's 1-2 minutes between events (question 3), or accept a shorter game. Needs the owner's decision; nothing was changed.
5. **Early Departure after Event 5 (found in Milestone 8).** With the outline's numbers, the ending check after Event 5 can never give Early Departure: the worst case by then is Stamina 2, Supplies 2, Morale 4 (it needs a 0, or Morale 2 or less). Broken Partnership can trigger there, and both early endings can trigger after Event 8. `tests/balance.test.js` checks every choice path. Changing it would mean changing the outline's numbers (for example, lower starting stats or a bigger cost in Events 3-5), so it needs the owner's decision; nothing was changed.
