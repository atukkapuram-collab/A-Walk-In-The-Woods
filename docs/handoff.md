# Trail Mix: Handoff Record

Read this first when picking up the project. It is updated at the end of every milestone (see section 4 of [implementation-plan.md](implementation-plan.md)). Keep each section short; replace it rather than appending history.

**Last updated:** 11/15/2026, **Milestone 14 (polish and playtest) done. The expansion (Milestones 9-14) is complete, committed and live.** The owner's decisions below are still open.

**Branches:**
- Milestones 9-14 were committed together on `m14-polish` (the earlier expansion branches were never committed to).
- With the owner's go-ahead, `main` was fast-forwarded to that commit and pushed (11/15/2026), so the live GitHub Pages site now runs the book version.
- After M14: the weather (rain, snow, leaves) now covers the whole screen (`src/systems/Weather.js`, `tests/weather.test.js`).

| Milestone | What | Status |
| --- | --- | --- |
| M9 | Docs | Done |
| M10 | Engine | Done |
| M11 | Part 1, chapters 1-11 | Done |
| M12 | Part 2: Alone, chapters 12-19 | Done |
| M13 | Maine and the four endings | Done |
| M14 | Polish and playtest | Done |

## M14: what was built

- **Miles tuned:**
  - On the book's path (the car from Gatlinburg, Part 2 walked in pieces), the travel screens add up to exactly Bryson and Katz's 870. Event bonuses move it a little: the full test run ended at 860.
  - The Finished Trail card shows the whole 2,190.
  - Each travel step now has `to`, the next map's place on the trail. Maine sits at mile 2,060, near the real Hundred-Mile Wilderness.
- **Travel map:**
  - the trail behind the marker is solid gold where walked and grey dashes where driven, with a small key;
  - a new rented-car sprite (`fx-car`) replaces the pickup;
  - `GameState.trailPos` and `skippedRanges` track the marker, and `TravelPath.travelledPieces` splits the trail into walked and driven pieces.
- **Characters:**
  - Bill has his beard (`BILL_SHAPE`);
  - Mary Ellen has her own look: a red bandana and long hair (`MARY_ELLEN_SHAPE`);
  - NPCs look around now and then. They turn on the spot only, so they never block the trail.
- **Tiles:** `signAlpine` (`%`) and `ledgeAlpine` (`&`), so the sign and overlook above the treeline sit on rock, not grass.
- **Music:** two new code-generated loops. "alone" (A minor) plays in Act III and "wilderness" (E minor) in Maine. A map picks its loop with `music`.
- **Credits screen** (`CreditsScene`, text in `src/data/credits.js`), opened from the title and the ending card.
- **Title:**
  - the credit now reads "Based on the book…";
  - the footer counts endings and Journal entries found.
- **README** rewritten for the book version: how to play, the Journal, the endings, debug starts and the review script.

## M14: files

- **New:**
  - `src/scenes/CreditsScene.js`
  - `src/data/credits.js`
  - `tests/polish.m14.test.js`
- **Modified:**
  - state and systems: `GameState.js`, `TravelPath.js`, `Debug.js`, `Journey.js`;
  - scenes: `TravelScene.js`, `EndingScene.js`, `TitleScene.js`, `TrailScene.js` (idle NPCs), `BootScene.js` (per-map music);
  - data: `journey.js`, `audio.js`, `maps/legend.js`, `maps/newengland.js`, `maps/pennsylvania.js`, `maps/maine.js`, `maps/roadside.js`;
  - art: `sprites.js`, `tiles.js`, `generate.js`, `illustrations.js`;
  - `main.js`, `Transitions.js`;
  - `README.md`, `docs/story-review.md`.

## M14: how it was tested

- `npm test`: 350 tests. `npm run build` succeeds (about 1.4 MB).
- **A full run from the title to an ending in one sitting** (scripted, in the browser pane, no debug start, no console errors):
  - the opening, all 6 maps, all 13 choices, 5 act cards and 5 travel screens;
  - ended in Early Departure at E13 (see Decisions below);
  - the ending card read "You: 860 miles · Bryson & Katz: about 870 of 2,190".
- **Run length (estimate from that run):** 103 boxes and cards, 1,872 words, 13 choices, 288 steps.

  | Part | Time |
  | --- | --- |
  | Reading (at 200 words a minute) | 9.4 min |
  | Box presses | 2.6 min |
  | Choices | 1.7 min |
  | Walking | 1.4 min |
  | Act cards, travel screens, ending | 1.1 min |
  | **Shortest path** | **about 16 minutes** |

  With signs, overlooks, the Journal and Katz's chats, about 18-20 minutes. That is up from about 12 and near the 20-25 target, but not inside it.
- **Looked at by eye** (screenshots):
  - the travel map with the car and the dashed stretch;
  - the alpine sign;
  - the Shenandoah wayside;
  - the new ending card;
  - the credits;
  - the three ending pictures (Katahdin, the parcel, the logging road).
- **Not yet done:** a playtest by a person who hasn't seen the game, and a second browser or a real keyboard.

## Decisions for the owner

1. **The book's choices can end in Early Departure.** The test run picked:
   - the book's own options where the outline marks them (the car, slipping away from Mary Ellen, day-hiking, waiting for Katz);
   - cautious options elsewhere.

   Morale fell to 2 at E13, so the walk ended in Early Departure before the Final Crossroads.
   - This is arguably faithful: in the book they do quit there.
   - But it means a player who copies Bryson may never see the ending tagged as the book's.
   - Changing it would mean changing the outline's numbers, for example E13 "wait" Morale −2 → −1. I left them as written.
2. **Developers' names for the credits:** they currently say "Made by two students as an AP English Language and Composition project." Give me the names to add (`src/data/credits.js`).
3. **Carried over:**
   - Centralia's entry unlocks only from E9's option (M12);
   - the "(verify)" book facts across the docs and data.
4. **Release:** commit the expansion, merge to `main` and deploy to GitHub Pages only on your go-ahead (pushing `main` publishes the site).

## Known gaps

- Run length is about 16-20 minutes against the 20-25 target (see above).
- NPCs turn but don't walk.
- Some travel-map labels sit close together (Georgia/Smokies, White Mountains/Maine).
- The story text still needs the owner's read-through (`docs/story-review.md`).

## Next

- **No milestone is left in the plan.** What remains:
  - the owner's review and the decisions above;
  - a playtest by a real person;
  - committing, merging and deploying (only with the go-ahead).

---

*Milestone 8 record (the current build on `main`) follows.*

**Current developer:** project owner.
**Branch (M8):** `main`. Milestones 0-8 are committed and pushed to GitHub `main`, and the game is **live on GitHub Pages**: https://atukkapuram-collab.github.io/A-Walk-In-The-Woods/ (rebuilt on every push to `main` by `.github/workflows/deploy.yml`).

## 1. Completed features

- **M0-M7:** the complete game:
  - title, opening with name entry, four maps and the roadside detour, the story for all 16 scenes, travel and act cards;
  - the full ending template, Endings Found, settings, pause;
  - code-generated sound and music, light game feel, outlined sprites.
- **M8, the playtest:**
  - **All four endings played from the title, without debug mode.** A test bot walked every map with the arrow keys (finding its own path, talking to people, passing every gate) and chose from a plan:

    | Run | Choices | Result |
    |---|---|---|
    | A | kind and careful, "Summit or nothing" | **Finished Trail** (Stamina 5, Supplies 3, Bond 10), 274 steps |
    | B | as A, then walk Katz out, "Our way" | **Changed Route** via the roadside campground |
    | C | ride the truck, gamble, go ahead alone, "Let's go home" | **Early Departure**; the truck travel screen appeared |
    | D | unkind all the way to Pine Gap | **Broken Partnership** after Event 5, with the early-ending fade |

    Endings Found then listed all four.
  - **Balance:** `tests/balance.test.js` plays the real event data through **every** combination of choices (31,602 paths, both coin-flip sides, with and without the overlooks):

    | Ending | Share of all paths |
    |---|---|
    | Changed Route | 60.7% |
    | Early Departure ("Let's go home") | 32.2% |
    | Finished Trail | 3.7% (about 11% of "Summit" attempts) |
    | Early Departure (check after Event 8) | 2.3% |
    | Broken Partnership (after Event 8) | 1.0% |
    | Broken Partnership (after Event 5) | 0.04% |

    Every ending is reachable, and Finished Trail is never reached with a flag set. **But see section 5:** Early Departure can't happen after Event 5.
  - **Run length:** about **11-12 minutes** per run (estimated; section 5).
  - **The built version** (`npm run build`, then served from `dist/`) plays correctly:
    - 3 files, 1.4 MB, relative paths;
    - no outside network requests;
    - no console errors;
    - the dev console hooks are absent.
  - **README:** a how-to-play section (story, controls, stats, endings, settings), plus notes on hosting the build and on debug starts.
  - **Title screen credit:** "Inspired by the book A Walk in the Woods by Bill Bryson", under the subtitle.
  - **Wording and overflows:** every box was measured in Milestone 5; no new overflows.

## 2. Files created or modified (Milestone 8)

- New: `tests/balance.test.js` (every choice path; prints the ending distribution).
- Modified:
  - `README.md` (how to play; hosting the build; debug starts);
  - `.claude/launch.json` (a `trail-mix-dist` preview on port 4173);
  - `docs/implementation-plan.md` (open questions 4 and 5);
  - `CLAUDE.md` and this file.
- No game code or story changed. Balance needed no tuning changes; the open items need the owner.

## 3. Project structure and technical decisions

- 14 test files, 244 tests (`npm test`).
- `npm run build` writes `dist/`, which is ignored by git. It needs a web server, like any module-based browser game: opening `dist/index.html` from the disk won't work.
- The playtest bot and the run-length estimate were throwaway scripts; the balance test is the lasting check.

## 4. How to run and test

```bash
npm run dev        # http://localhost:8080
npm test           # 244 tests (the balance test prints the ending distribution)
npm run build
npm run preview    # serves dist/ (or the "trail-mix-dist" preview, port 4173)
```

Playtest checklist for a person:
1. Play without debug mode and reach each ending:
   - Finished Trail: kind choices plus "Summit".
   - Changed Route: "Our way", or walk Katz out.
   - Early Departure: "Let's go home".
   - Broken Partnership: be unkind to Katz.
2. Time one full run.
3. Hand the game to someone who hasn't seen it and watch them finish without help. **Not done yet: it needs a real person.**

## 5. Known bugs and incomplete features (owner decisions)

- No known bugs.
- **Hand-in method: decided.** The game is on GitHub Pages (link above); share that link with the professor. itch.io is still possible later.
- **Decision 2, run length** (plan, question 4). About 12 minutes per run against the docs' 20-30. Options:
  - count replays (four endings) toward the total;
  - lengthen the maps toward the blueprint's 1-2 minutes between events;
  - accept a shorter game.
- **Decision 3, Early Departure after Event 5** (plan, question 5). Impossible with the outline's numbers: the worst case by then is Stamina 2, Supplies 2, Morale 4. The plan's test list expects it. Fixing it means changing the outline's numbers.
- Carried over:
  - the miles tuning (fine as is: miles never decide an ending);
  - Changed Route can run to 6 boxes;
  - Sunshine and Dale stand still;
  - the tunes and the blip volume haven't been heard by a person;
  - no testing yet with a real keyboard or in a second browser.

## 6. Next milestone

- **Milestone 10, engine changes**, starts after the owner approves Milestone 9's docs:
  - play as Bill;
  - Katz-away mode;
  - the Journal system;
  - the 6-map journey;
  - the new ending checks;
  - debug starts.
- It depends only on the M9 docs.
