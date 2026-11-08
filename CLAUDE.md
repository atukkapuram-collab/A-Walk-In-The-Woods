# Trail Mix

*Trail Mix* (previously titled *White Blazes*) is a 2D pixel-art narrative adventure game based on Bill Bryson's Appalachian Trail journey in *A Walk in the Woods*. The player faces the challenges of hiking in the wild and makes decisions that affect the overall hiking experience.

The repository and folder are still named `A-Walk-In-The-Woods`. Leave that name alone: renaming it would break the GitHub remote, both developers' local clones and the Claude Code project memory path.

## Key decisions

- **Title:** *Trail Mix*.
- **Engine:** Phaser, as a browser game, using the version the official template installs, locked to that exact version.
- **Language:** JavaScript (ES modules), not TypeScript.
- **Deadline:** 11/17/2026.
- **Team:** two developers share this repo. See "Team workflow" below.

## Team workflow

The implementation plan and milestone order are in [docs/implementation-plan.md](docs/implementation-plan.md) (section 4 has the full workflow). **Start every session by reading [docs/handoff.md](docs/handoff.md)** to see what's done and which milestone is next.

**One milestone at a time, with a stop after each:**
1. Work on the next unfinished milestone only, in the plan's order (Milestone 0 first). Finish all of it: its Build list done and its Test list passing.
2. When it's finished, report what was implemented, which files changed, how to test it and any remaining issues.
3. Update `docs/handoff.md` (completed features, files changed, structure and decisions, how to run and test, known bugs and gaps, next milestone and its dependencies). Keep it short.
4. Then **stop and ask** whether to start the next milestone. Never begin another milestone without the developer's explicit approval, even if it seems like the natural next step. Review fixes the developer asks for stay inside the current milestone.

**The creative docs are authoritative.** Implement `docs/story.md`, `docs/scene-outline.md` and `docs/design-blueprint.md` as written. Don't rewrite story content, character decisions, choices, stat effects or ending conditions while implementing. If something looks wrong or can't be built as written, raise it and wait for explicit approval before changing it.

**Stay inside the current milestone's scope.** Don't build anything that belongs to a later milestone. Milestone 0 is setup only: no gameplay features and no story content.

**Handoff:** the project owner is working through the milestones for now. Either developer can take over later; they continue from the next unfinished milestone using `docs/handoff.md`. No milestone belongs permanently to either person, and the plan is not split into days.

**Code and git:**
- Keep changes small and focused, with systems, maps and each act's events in separate files, so a handoff (or working side by side later) doesn't cause merge conflicts.
- Story text, choices, stat effects and map layouts live in data files (`src/data/`), not inside scene code.
- One branch per milestone. Don't commit straight to `main` once code exists. Commit only when asked.
- **Never push to GitHub, open a PR or merge unless the developer you're working with explicitly asks for it in that conversation.**

## Planning document

The full plan is in [docs/planning.md](docs/planning.md). It is the source of truth for scope, art direction, gameplay loop, narrative and endings. Read it before designing or building anything. It is saved as the user wrote it (typos included), so don't "fix" it without being asked.

Summary of the plan:
- **Concept:** decision-based, Oregon Trail-inspired game about hiking the Appalachian Trail, based on Bill Bryson's *A Walk in the Woods* (not a direct recreation). Built as an alternative to an English essay, so the themes (adversity, personal growth) and Bryson-style humor matter.
- **Scope (minimum, for 11/17/2026):** one player character plus one companion (Bill and Katz inspired); 3-4 trail settings; 5-8 impactful decision events; simple exploration and resource management; narrative and dialogue; 3-4 endings; title screen, conclusion screen, settings and tutorial.
- **Loop:** explore, encounter a challenge, make a decision, see the consequence, continue along the trail, repeat.
- **Art:** 2D pixel art in a Stardew Valley / Terraria style: rugged but cozy, with forests, mountains, rivers, rocky paths, campsites, weather and lighting, and simple character animation.
- **Endings:** Finished Trail, Broken Partnership, Early Departure, Changed Route (the one closest to Bryson's book). The plan lists the factors that decide each.

Perspective: top-down, older-Pokemon-style exploration for every setting (no side-scrolling). Use top-down movement and tilemaps in Phaser, not platformer physics.

## Story and design docs

Read these before writing game content or code. Together with docs/planning.md they define the game:

- [docs/story.md](docs/story.md): the story of *Trail Mix*: premise, characters (the Hiker, Katz, Dale, Sunshine, Hazel), the four stats, the three acts, the 8 decision events and the 4 endings.
- [docs/scene-outline.md](docs/scene-outline.md): the 16 scenes in order, with each scene's purpose, choices and stat effects, the two flags (skipped ahead, left the wilderness), the ending checks, continuity rules and the cut list.
- [docs/design-blueprint.md](docs/design-blueprint.md): how the game plays: top-down exploration with Katz following, the event/dialogue/choice/result-card flow, the HUD, the four maps and travel screens, the ending template and the 10-hour build plan.

- [docs/implementation-plan.md](docs/implementation-plan.md): the technical build plan: architecture, folder layout and the milestones in order, each with files, dependencies, skills and tests.

If the docs disagree, the scene outline wins on story details and the blueprint wins on gameplay. The story, outline and blueprint are exported from Claude Docs; ask before rewriting them.

`docs/planning.md` still calls the game an "A Walk in the Woods" based game. That is accurate (the book is the source), and the file is kept as the user wrote it, so it was not changed for the *Trail Mix* rename. In the docs, lowercase "white blazes" means the paint marks on trees in the game world, not the old title.

## Project state

- Milestones 0-8 are built and committed locally on branch `m8-playtest` (not pushed yet). Milestone 8 (playtest, balance, build check, README) is awaiting the owner's review and three decisions: the hand-in method, the run length (about 12 minutes against the docs' 20-30), and Early Departure being impossible after Event 5 with the outline's numbers. `docs/handoff.md` has the details.
- All sound is generated in code (Web Audio); there are no audio files. Don't add downloaded sounds without the owner's go-ahead and a license check. `docs/handoff.md` has the details.
- In the event data, lines marked `// DOC` are quoted word for word from the creative docs; every other line is new writing that the owner reviews.
- Run with `npm install` then `npm run dev` (http://localhost:8080). `npm test` runs Vitest; `npm run build` writes `dist/`.
- The Phaser Vite template's `log.js` (it pings an external analytics server on every dev/build) was deliberately left out. Don't add it back.
- Many installed skills are for other engines (Godot, Unity, Unreal, Roblox, etc.) and don't apply.
- Most relevant for this game: `phaser-core`, `phaser-arcade-physics`, `make-game`, `game-assets`, `pixel-art-sprites`, `narrative-design`, `dialogue-systems`, `level-design`, `game-ui-ux`, `save-systems`, `game-jam` (for scoping to a deadline). Use `router` if unsure which skill applies.

## Installed skills (`.claude/skills/`, 81 total)

Installed with `npx skills add ... --agent claude-code`:

| Source | Skills |
|---|---|
| `gamedev-skills/awesome-gamedev-agent-skills` | 78 skills: engine skills (Godot, Unity, Unreal, Bevy, Phaser, PixiJS, three.js, Defold, LÖVE, pygame, Ebitengine, Roblox), genre skills (platformer, rpg, roguelike, puzzle, card-game, visual-novel, etc.) and cross-engine topics (audio, camera, input, physics, AI, shaders, save systems, publishing) |
| `opusgamelabs/game-creator` | `make-game`, `game-assets` |
| `omer-metin/skills-for-antigravity` | `pixel-art-sprites`, `narrative-design` |

### Notes on specific skills

- **Security:** the installer flagged `make-game` as Snyk High Risk, `game-assets` as Med Risk and `pixel-art-sprites` as Low Risk (Gen: Safe and Socket: 0 alerts for all). Skills run with full agent permissions, so review `make-game` before relying on it. Details: https://skills.sh/opusgamelabs/game-creator
- **`make-game` review (11/7/2026):** no destructive or credential-handling commands. Things to avoid: its `AGENTS.md` template and `useful-skills.md` tell agents to `npx skills add` more skills from the internet; it points to `/game-deploy` (deploys to here.now, Vercel or GitHub Pages) and `/viral-game` (here.now plus Play.fun monetization), which aren't installed and must not be used here. Its process (gameplan, ADRs, test-first for every acceptance criterion) is heavier than a 10-hour build allows, so we use it in its own "minimum-viable doc mode": the four docs act as the game plan, and `docs/implementation-plan.md` acts as the tech spec and milestone list.
- **`game-assets` caution:** its default "South Park character" tier composites photo heads of real people, and it suggests downloading logos and meme images. Don't use either. Use only its code-generated pixel-art matrices for placeholders.
- **`narrative-design` is a locally modified copy.** Upstream's `SKILL.md` has invalid YAML (an unquoted colon in the description), so the installer rejects it. We fixed it by making the description a `>-` folded block and shortening it from 1551 to 625 characters (the first sentence plus the "Use when …" list). The body and `references/` are unchanged from upstream. It will not update from upstream, and re-running the original install command will fail. `ai-world-building` in the same repo has the same upstream bug and was not installed.
- The 78-skill pack's descriptions load into context every session. Delete skills for engines we don't use to reduce noise.

## What has been done so far

1. Confirmed the working folder is `A-Walk-In-The-Woods`.
2. Installed the 78-skill pack, `make-game`, `game-assets` and `pixel-art-sprites`. The first command had no `--agent` flag, so `--agent claude-code -y` was added to run it non-interactively.
3. Tried `narrative-design`; the installer failed on the upstream YAML error. Fixed and installed it by hand (see above). It was checked with `npx skills add <path> --list`, not a full install.
4. Wrote this file.
5. Wrote the story, scene outline and design blueprint docs.
6. Renamed the game from *White Blazes* to *Trail Mix* in the docs, this file and the README.
7. Wrote `docs/implementation-plan.md`.
8. Switched to a one-milestone-at-a-time workflow with a review stop after each, and added `docs/handoff.md`.
9. Built Milestone 0 (setup) from the official Phaser Vite template on branch `m0-setup`.
10. Built Milestone 1 (walking prototype) on branch `m1-walking`.
11. Built Milestone 2 (events, dialogue, choices, result cards) on branch `m2-events`.
12. Built Milestone 3 (stats, HUD, ending checks, placeholder ending, saving, debug starts) on branch `m3-stats`.
13. Built Milestone 4 (four maps, season palettes, night tint, weather, journey, placeholder events) on branch `m4-maps`.
14. Built Milestone 5 (story content for all 16 scenes, choice memory for callbacks, Bond-based lines) on branch `m5-story`.
15. Built Milestone 6 (title, opening with name entry, act cards, travel screen, ending template, Endings Found, settings, pause, fades) on branch `m6-screens`.
16. Built Milestone 7 (code-generated sound effects and music on two volume buses, result-card bounce, footstep dust, outlined and shaded sprites) on branch `m7-polish`.
17. Milestone 8 on branch `m8-playtest`: a balance test over every choice path, all four endings played from the title, a run-length estimate, the built `dist/` checked, and the README's how-to-play section.
18. Added the book credit to the title screen and committed Milestones 0-8 locally on `m8-playtest`.

## Repo state

- `.claude/skills/`, `skills-lock.json`, this file and the docs are committed on `main`. Milestones 0-8 are committed on the local branch `m8-playtest`; it is not pushed and not merged into `main`. The older milestone branches `m0-setup` to `m7-polish` were never committed to and still point at the docs commit on `main`.
- `skills-lock.json` is written by the skills CLI. It does not include the hand-installed `narrative-design`.
