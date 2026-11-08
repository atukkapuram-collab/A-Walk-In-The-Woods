# White Blazes: Game Design Blueprint

See also: docs/story.md (story and endings) and docs/scene-outline.md (scene-by-scene outline).

## Overview

**One-line pitch:** walk the Appalachian Trail with Katz in a cozy top-down pixel world, where every few minutes the trail throws a problem at you and your choice shapes the journey and its ending.

**The blend:**
- **Pokémon-style exploration:** you walk a tile-based map in four directions, the camera follows you, and Katz follows one tile behind.
- **Oregon Trail-style events:** you reach a moment, read the situation, pick from 2–4 options, see the consequences, and your stats change.

**Design pillars**
1. **Story first:** every system exists to deliver the 16 scenes in the outline. No combat, no inventory, no puzzles.
2. **Every choice costs something:** consequences are always shown right after a choice, so the player feels them.
3. **Small and finished beats big and broken:** four short maps, one event template, one ending template.

**Length:** about 20–30 minutes per playthrough, with replay value from the four endings.

**Controls:** arrow keys or WASD to move · Space or Enter to talk, advance text and confirm · arrow keys or 1–4 to pick a choice · Esc for the pause/settings menu.

## Core Gameplay Loop

This loop repeats about eight times, once per decision event, and matches the planning doc's loop: explore, challenge, decide, consequence, progress.

1. **Explore:** walk the trail map, read signs, and talk to Katz.
2. **Encounter:** step onto an event spot or talk to an event character. The game freezes movement.
3. **Read:** narration and dialogue set up the problem.
4. **Decide:** pick one of 2–4 choices.
5. **Consequence:** a result card shows what happened and the stat changes (for example ❤️ +2, 🥾 −1).
6. **Progress:** the path opens, and you keep walking to the next event or the map's exit.

**Larger loop:** each map has 2 events and ends at a campsite or exit, then a travel screen leads to the next map. After the fourth map, the Final Crossroads chooses the ending.

**Pacing target:** about 1–2 minutes of walking between events, so exploration is a breather between decisions, not a chore.

## Exploration

**Movement:** grid-based, four-directional walking (no diagonals), one tile per step with a short walk animation. There's no running, since the trail is meant to feel slow.

**Camera:** follows the player smoothly and stops at the map edges.

**Katz as a follower:** he walks one tile behind the player, like a Pokémon companion. Press Space next to him for a random line, which changes with Bond (warm, neutral or sarcastic) and points the player toward their next goal.

**Map shape:** each trail map is a winding path about 3–4 screens long, mostly linear with small side nooks. Trees, rocks, cliffs and water form the walls. White blazes painted on trees mark the way, so the player never gets lost.

**Things to interact with on each map (2–3, optional):**
- **Trail signs:** a funny line from the narrator.
- **One scenic overlook:** a short narrated moment of wonder, Morale +1, once per map. This rewards exploring and supports the "beauty of the trail" theme.
- **Side characters** (Dale, Sunshine) stand on the map as talkable NPCs where the outline places them.

**Gates:** the next stretch of trail is blocked (a fallen tree, the river, snow) until that map's event is finished. This keeps the story in order with no extra logic.

## Events, Dialogue and Choices

**How events start (only two kinds of trigger):**
- **Step trigger:** walking onto a marked spot starts the event automatically, like a Pokémon trainer spotting you. Used for Whiteout, Night Visitor, Last Bottle, River, Fall and the campfires.
- **Talk trigger:** facing a character and pressing Space. Used for the Outfitter (salesman), Pine Gap (Hazel) and side-character lines.

**Event flow (the same every time):**
1. Movement freezes, and the screen dims slightly.
2. **Narration box:** italic text with no portrait, the Hiker's narrator voice setting the scene.
3. **Dialogue boxes:** Pokémon-style box at the bottom of the screen with the speaker's name and a small pixel portrait. Text types out letter by letter, and Space shows it all or moves to the next line.
4. **Choice menu:** an Oregon Trail-style numbered list in a box above the dialogue, with 2–4 options. Only the option text is shown, not the numbers, so players choose by character rather than by math.
5. **Result card:** a small panel showing what happened (1–2 sentences, usually a Katz reaction) and each stat change with up or down arrows. The HUD bars flash as they change.
6. The gate opens and control returns to the player.

**Text style:** short lines of 2–3 sentences per box at most. Katz's lines carry the humor, and the narrator carries the reflection. The narrator's voice changes by act, as in the outline.

## Resources and Stats

The same stats as the story doc, kept deliberately small, like Oregon Trail's supplies and health.

| Stat | Icon | Start | Range | Changed by |
| --- | --- | --- | --- | --- |
| Stamina | 🥾 boot | 6 | 0–10 | events |
| Supplies | 🎒 backpack | 6 | 0–10 | events |
| Bond | ❤️ heart | 5 | 0–10 | events, the midpoint reaction |
| Morale | ☀️ sun | 6 | 0–10 | events, scenic overlooks (+1) |
| Miles | 🗺️ counter | 0 | — | finishing maps; event bonuses (+ / −) |

**HUD:** a small panel in the top-left with four icons, each with a 10-segment pixel bar. The Miles counter is in the top-right. It's always visible while exploring and hidden during the ending cards.

**Rules**
- Stats only change at the result card, so the player always sees why.
- Values stay between 0 and 10.
- **Danger warning:** when a stat enters its danger zone (Bond 3 or less, Morale 3 or less, Stamina or Supplies 2 or less), its bar blinks red and Katz says a worried line. This gives the player a chance to recover before an ending check.
- **Miles are flavor:** they appear on the travel screens and the ending card but never decide an ending by themselves. Endings depend only on the four stats and the two flags.

**Flags:** *skipped ahead* (Event 5) and *left the wilderness* (Event 8), as in the outline. Both are invisible to the player, and Katz references them in dialogue.

**Ending checks** run after Event 5, after Event 8 and at the Final Crossroads, in the outline's order: Broken Partnership, then Early Departure, then Finished Trail, then Changed Route.

## Location Progression

There are four trail maps in a fixed order, covering the planning doc's three to four settings. Each map reuses one tileset with a different season palette, which saves a lot of art time.

| Map | Season and mood | Scenes on this map | Ends at |
| --- | --- | --- | --- |
| **1. North Georgia** | Early spring, rain, bare trees | Outfitter shop at the trailhead (Event 1), muddy climb (Event 2) | Shelter: Act I close (starry-sky moment) |
| **2. Great Smoky Mountains** | Late spring, fog, snow patches | Snowed-in shelter (Event 3), night campsite (Event 4, dark tint) | Trail exit |
| **3. Virginia** | Midsummer, hot, green ridges | Pine Gap town at the start: Hazel's diner (Event 5), dry spring on the ridge (Event 6) | Campfire: Midpoint scene |
| **4. Maine, Hundred-Mile Wilderness** | Autumn, red and gold, lakes | River gate (Event 7), root-covered slope (Event 8) | Last campfire: Final Crossroads |

**The opening** (kitchen table and airport) comes before Map 1 as 3–4 illustrated still panels with narration, which needs no map. Name entry happens here.

**Travel screen between maps (the Oregon Trail moment):** a 4–5 second side-view strip showing two tiny sprites walking along a ribbon of trail across a simple East Coast map, with the miles counter ticking up and a label such as "Late Spring · Great Smoky Mountains." Optionally one narrator line, such as *"Somewhere around mile 200, my feet filed a formal complaint."*

**Special cases**
- **Skipped ahead (Event 5):** the travel screen shows a pickup truck zooming the sprites forward, as a visual joke and a reminder of the choice.
- **Left the wilderness (Event 8):** the rest of Map 4 is skipped. Fade straight to a roadside campground backdrop for the Final Crossroads.

## Transitions, Screens and Endings

**Transitions:** one style used everywhere, a quick fade to black and back.
- **Act title cards** (about 2 seconds): "Act I: The Beginning", "Act II: The Middle", "Act III: The Climax."
- **Night scenes** (Event 4 and the campfires) use a dark blue overlay with a warm glow around the fire, so no new art is needed.
- **Ending trigger:** if a check sends the player to an early ending (after Event 5 or 8), the result card is followed by a slow fade and the line *"And that's where the trail ended for us."*, then the ending.

**Ending presentation (the same template for all four):**
1. A full-screen pixel illustration: a bus stop, a motel bed covered in maps, a summit at sunrise, or a lakeshore.
2. 3–4 boxes of ending narration and Katz dialogue from the outline.
3. **Journey card:** ending name, miles walked, Bond rating (Strangers 0–3, Hiking Buddies 4–6, Trail Family 7–10), a final Katz line, and the theme lesson in italics.
4. Buttons: **Walk Again** (back to the title) and **See Endings Found** (a list of the four endings, with locked ones shown as "???"). This encourages replays.

**All screens**
- **Title screen:** a pixel trail scene, "White Blazes", with Start, Settings and Quit.
- **Settings:** music volume, sound effects volume, text speed (slow, normal, instant).
- **Tutorial:** built into Map 1 rather than a separate screen. On-screen hints ("Arrow keys to walk", "Space to talk") appear on the first steps, and the Outfitter event explains the choice menu and stats.
- **Pause menu** (Esc): Resume, Settings, Quit to Title.
- **Gameplay:** the four maps, event boxes, travel screen and endings above.

## 10-Hour Build Plan

This estimate assumes Phaser, Claude Code and the skills you installed. All writing comes straight from the story and outline docs.

| Block | What it covers | Time |
| --- | --- | --- |
| 1. Walking around | One map, grid movement, scrolling camera, Katz following | 1.5 h |
| 2. Event system | Triggers, narration and dialogue boxes, choice menu, result card | 2 h |
| 3. Stats and endings | HUD, stat changes, flags, ending checks, ending template | 1.5 h |
| 4. All four maps | Shared tileset with season palettes, place gates, events and NPCs | 2 h |
| 5. Story content | Enter all 16 scenes' text and choices from the outline | 1 h |
| 6. Screens and polish | Title, settings, opening panels, travel screen, act cards, fades | 1 h |
| 7. Playtest | Play every ending once, fix wording and balance | 1 h |
| **Total** | | **10 h** |

**Build order:** make one complete slice first: Map 1 with both events, the HUD, and a placeholder ending. Then add maps one at a time. If time runs out, you will still have a playable game.

**If behind schedule, cut in this order:** scenic overlooks → the "Endings Found" screen → the travel-screen animation (use a plain text card) → the outline's story cut list. **Never cut** the event template, the stats and ending checks, or the four endings.
