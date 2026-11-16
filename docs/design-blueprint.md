# Trail Mix: Game Design Blueprint

See also: docs/story.md (story and endings) and docs/scene-outline.md (scene-by-scene outline). Where they disagree, the outline wins on story and this blueprint wins on gameplay.

## Overview

**One-line pitch:** in *Trail Mix*, you are Bill Bryson walking the Appalachian Trail, mostly with Katz, through the real route of *A Walk in the Woods*. It's a cozy top-down pixel world where the trail keeps throwing problems at you, and your choices decide whether your walk ends the way the book's did.

**The blend:**
- **Pokémon-style exploration:** walk a tile map in four directions. The camera follows you, and Katz follows one tile behind, except while he's home in Iowa.
- **Oregon Trail-style events:** reach a moment, read the situation, pick from 2–4 options, see the consequences, and the stats change.

**Design pillars**
1. **Story first, and the book's story:** every system delivers the 23 scenes in the outline. No combat, no inventory, no puzzles.
2. **Every choice costs something,** and the book's own choice is always on the menu.
3. **Notice the woods:** signs, overlooks and the Journal reward attention, which is the book's second theme.
4. **Small and finished beats big and broken:** one event template, one ending template, one tileset with season palettes.

**Length:** about 20–25 minutes per playthrough, plus replays for four endings and 13 Journal entries.

**Controls:**

| Key | Action |
| --- | --- |
| Arrow keys or WASD | Move |
| Space or Enter | Talk, advance text, confirm |
| Arrow keys or 1–4 | Pick a choice |
| Esc | Pause menu: Resume, Journal, Settings, Quit to Title |

## Core Gameplay Loop

**Each event repeats the planning doc's loop:** explore, challenge, decide, consequence, progress.
1. **Explore:** walk the map, read signs, find overlooks (Journal entries), talk to Katz and the book's characters.
2. **Encounter:** step onto an event spot or talk to an event character. Movement freezes.
3. **Read:** first-person narration and dialogue set up the problem.
4. **Decide:** pick one of 2–4 choices.
5. **Consequence:** a result card shows what happened and the stat changes.
6. **Progress:** the gate opens, and you walk on to the next event or the map's exit.

**Larger loop:**
- Each map has 2–3 events and ends at a campsite or exit.
- A travel screen with a trail map leads to the next map.
- After Maine, the Final Crossroads chooses the ending.

**Pacing target:** about 30–60 seconds of walking between events, plus optional signs and overlooks.

## Exploration

**Movement:** grid-based, four directions, one tile per step, no running. Unchanged.

**Camera:** follows the player and stops at the map edges. Unchanged.

**Katz as a follower:** one tile behind. Press Space next to him for a line that changes with Bond.
- **Act III (Katz away):** there is no follower. Pressing Space on the empty trail gives a short narrator line about walking alone.

**Map shape:** a winding path about 3–4 screens long, with small side nooks. White blazes mark the way.

**Things to interact with on each map:**
- **Trail signs:** a narrator line. Some unlock a Journal entry.
- **One scenic overlook per map:** a short moment of wonder, Morale +1 (once per map), and usually a Journal entry.
- **Characters from the book:**
  - the outfitter salesman (opening);
  - Mary Ellen (Georgia);
  - hikers in the snowbound shelter (Smokies);
  - day-trippers at a wayside (Shenandoah);
  - a driver on the logging road (Maine).

  They take a few idle steps around their spot, so they don't stand frozen.

**Gates:** the next stretch is blocked (a log, snow, a river, a closed road) until that map's event is done.

## Events, Dialogue and Choices

**Two kinds of trigger:**
- **Step triggers:**
  - E2 Katz Lightens His Load
  - E3 Mary Ellen (she stands by the trail and starts talking as you reach her)
  - E4 Snowstorm
  - E5 Night Noises
  - E6 The Rental Car (at the road into Gatlinburg, by the rental clerk)
  - E9 Car Hiking
  - E10 Mount Washington
  - E12 The River
  - E13 Katz Is Lost
  - the quiet beats
- **Talk triggers:**
  - E7 Skyline Drive (the day-tripper at the wayside)
  - E11 (a payphone at the end of the New England map)
- **E1** plays inside the opening panels, over the shop picture.
- A talk trigger is optional unless a gate after it waits for that event, so every required event is a step trigger or has a gate (Milestone 11).
- **Event flow and text style:** unchanged from Milestone 2.
  1. Narration (now first person: "I").
  2. Dialogue with portraits.
  3. Choice menu.
  4. Result card with stat arrows.
  5. The gate opens.
- **Fixed result cards:** a scene with set effects and no choice (Home in Hanover) uses the same result card, so stats still change only on a card.

## Resources and Stats

| Stat | Icon | Start | Range | Changed by |
| --- | --- | --- | --- | --- |
| Stamina | 🥾 boot | 6 | 0–10 | events, Home in Hanover |
| Supplies | 🎒 backpack | 6 | 0–10 | events, Home in Hanover |
| Bond | ❤️ heart | 5 | 0–10 | events (frozen while Katz is away, except E11) |
| Morale | ☀️ sun | 6 | 0–10 | events, scenic overlooks (+1) |
| Miles | 🗺️ counter | 0 | — | travel screens, event bonuses |

**HUD:** as before (four bars top-left, Miles top-right).
- **While Katz is away:** the Bond bar is greyed out and labelled "Katz: home in Iowa".
- **A small book icon** with the Journal count (for example 📖 4/13) sits under the Miles counter.

**Rules**
- Stats only change at a result card. Values stay between 0 and 10.
- **Danger warning:** when a stat enters its danger zone (Bond 3 or less, Morale 3 or less, Stamina or Supplies 2 or less), its bar blinks red and Katz says a worried line. In Act III the narrator says it instead.
- **Miles are flavor:** they never decide an ending. The ending card compares them with Bryson & Katz's ~870.

**Flags** (invisible, referenced in dialogue):
- **skipped ahead** (E6)
- **invited** (E8)
- **Katz away** (E8 to E11)
- **left the wilderness** (E13)

**Ending checks:** after E6, E8, E11 and E13, and at the Final Crossroads. The order is unchanged: Broken Partnership, Early Departure, Finished Trail, Changed Route.

## Location Progression

**The Prologue (Hanover)** is illustrated panels with narration and no map. E1, the Outfitter, plays over the shop panel. Tutorial hints appear on the first steps in Georgia.

| Map | Book | Season and mood | Scenes on this map | Ends at |
| --- | --- | --- | --- | --- |
| **1. North Georgia** | Ch 2–5 | March, cold, bare trees | Amicalola approach: E2. Mary Ellen: E3. | Shelter: Act I close (night) |
| **2. Great Smoky Mountains → Gatlinburg** | Ch 6–8 | Snow, fog, dying firs | Snowbound shelter: E4. Night tent: E5. Gatlinburg rental counter: E6. | Car park exit |
| **3. Shenandoah** (was `virginia`) | Ch 8–11 | Spring green, road and waysides | Skyline Drive crossings: E7. Campfire: midpoint. Airport sign: E8. | Exit to Part 2 |
| **4. Pennsylvania & the Mid-Atlantic** (new) | Ch 12–14 | Hot summer, boulder fields | E9 at the car; Centralia's smoking road in a side nook (Journal) | Exit |
| **5. New England & the White Mountains** (new) | Ch 15–18 | Late summer, alpine, cairns, wind | Above the treeline: E10. Payphone at the trailhead: E11. | Exit to Maine |
| **6. Maine, Hundred-Mile Wilderness** | Ch 19–21 | Late summer into autumn, lakes | Reunion at the start. River gate: E12. Woods: E13. | Logging road: Final Crossroads |

**Roadside** (existing backdrop) is used when **left the wilderness** is set.

**Act cards:**
- "Prologue: Hanover"
- "Act I: Georgia"
- "Act II: The Smokies and Shenandoah"
- "Act III: Alone"
- "Act IV: Maine"

Each card has a subtitle naming the book chapters (for example "Chapters 2–5").

**Travel screen (the Oregon Trail moment):** a 4–5 second strip.
- **A simple Appalachian Trail map runs Georgia to Maine.** A "you are here" marker moves along it and the miles counter ticks up.
- **Walked sections** are solid and **skipped sections** are dashed.
- **The label** names the season and place, with an optional narrator line.
- **After E6 with skipped ahead:** a little rental car carries the sprites up the map instead of walking.
- **Between Shenandoah and Pennsylvania:** Bryson travels alone, with one sprite.

## Transitions, Screens and Endings

**Transitions:** one fade style everywhere (unchanged).
- **Night scenes** (Act I close, E5, the midpoint, E13) use the dark overlay with fire glow.
- **Early-ending fade** after any mid-trip check: *"And that's where the trail ended for us."* In Act III it becomes *"for me"*.

**Ending presentation (the same template for all four):**
1. A full-screen pixel illustration:
   - Broken Partnership: an empty trail with a parcel.
   - Early Departure: a motel bed covered in maps.
   - Finished Trail: Katahdin's summit sign at sunrise.
   - Changed Route: the logging road out of the woods.
2. 3–4 boxes of narration and Katz dialogue.
3. **Journey card:**
   - ending name, with **"The book's ending"** tag on Changed Route;
   - "You: N miles · Bryson & Katz: about 870 of 2,190";
   - Bond rating;
   - Journal entries x/13;
   - final Katz line;
   - the theme lesson in italics.
4. Buttons:
   - **Walk Again**
   - **See Endings Found** (which also marks which one is the book's)
   - **Credits**

**All screens**
- **Title:** the existing screen and book credit.
- **Settings:** unchanged.
- **Pause:** Resume, **Journal**, Settings, Quit to Title.
- **Journal screen:** a two-page book.
  - Left page: the list of 13 titles. Locked entries show as "???".
  - Right page: the selected entry (2–3 sentences and a chapter tag).
  - Arrow keys move, Esc returns.
- **Credits:** "Based on *A Walk in the Woods* by Bill Bryson (1998)". Made by the two developers as an AP Language project, plus the tools used. All sound is generated in code.
- **Tutorial:** hints on the first Georgia steps, and the Outfitter explains choices and stats.

## Expansion Build Plan

Built as Milestones 9–14 in docs/implementation-plan.md, one at a time with a review stop after each.

| Milestone | What it covers |
| --- | --- |
| M9 | These docs: story, outline, blueprint, plan |
| M10 | Engine: play as Bill (no name entry), Katz-away mode, the Journal system and screen, 6-map journey, new ending checks, debug starts |
| M11 | Part 1 content: Prologue, Georgia, Smokies/Gatlinburg, Shenandoah |
| M12 | Part 2: the Pennsylvania and New England maps, new tiles and palettes, E9–E11 |
| M13 | Maine, the four endings rewritten, all Journal entries |
| M14 | Polish and playtest: trail-map travel screen, sprites, idle NPCs, music, credits, balance, timed runs |

**If behind schedule:** use the cut list in the scene outline. Never cut the event template, the stats and ending checks, or the four endings.
