# Trail Mix: Handoff Record

Read this first when picking up the project. It is updated at the end of every milestone (see section 4 of [implementation-plan.md](implementation-plan.md)). Keep each section short; replace it rather than appending history.

**Last updated:** 11/8/2026, Milestone 8 (playtest, balance and hand-in) done as far as it can go without the owner. **Three owner decisions are open** (section 5).
**Current developer:** project owner.
**Branch:** `m8-playtest`. Nothing is committed yet (Milestones 0-8 are all uncommitted), nothing pushed, nothing published.

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
- **Decision 1, hand-in method** (plan, question 2). The build is ready for any of these:
  - **itch.io:** upload a zip of `dist/` as an HTML game. Easiest for a teacher to open.
  - **GitHub Pages:** serve `dist/` from the repo.
  - **A zip of `dist/`:** the person opening it would need to run a local server.

  Nothing is published without your go-ahead.
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

- Milestone 8 is the last milestone. What's left is the three decisions above, a playtest by a real person, committing the work (only when asked), and the hand-in (only with the owner's go-ahead).
