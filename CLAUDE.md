# A Walk in the Woods

A 2D pixel-art narrative adventure game based on Bill Bryson's Appalachian Trail journey in *A Walk in the Woods*. The player faces the challenges of hiking in the wild and makes decisions that affect the overall hiking experience.

## Key decisions

- **Engine:** Phaser, as a browser game.
- **Deadline:** 11/17/2026.

## Planning document

The full plan is in [docs/planning.md](docs/planning.md). It is the source of truth for scope, art direction, gameplay loop, narrative and endings. Read it before designing or building anything. It is saved as the user wrote it (typos included), so don't "fix" it without being asked.

Summary of the plan:
- **Concept:** decision-based, Oregon Trail-inspired game about hiking the Appalachian Trail, based on Bill Bryson's *A Walk in the Woods* (not a direct recreation). Built as an alternative to an English essay, so the themes (adversity, personal growth) and Bryson-style humor matter.
- **Scope (minimum, for 11/17/2026):** one player character plus one companion (Bill and Katz inspired); 3-4 trail settings; 5-8 impactful decision events; simple exploration and resource management; narrative and dialogue; 3-4 endings; title screen, conclusion screen, settings and tutorial.
- **Loop:** explore, encounter a challenge, make a decision, see the consequence, continue along the trail, repeat.
- **Art:** 2D pixel art in a Stardew Valley / Terraria style: rugged but cozy, with forests, mountains, rivers, rocky paths, campsites, weather and lighting, and simple character animation.
- **Endings:** Finished Trail, Broken Partnership, Early Departure, Changed Route (the one closest to Bryson's book). The plan lists the factors that decide each.

Open question: the plan asks for a top-down, older-Pokemon-style view and also calls each setting "similar to a side scroller". Confirm which perspective each part of the game uses before building maps, physics or art.

## Project state

- Early stage: the repo holds only `README.md`, `skills-lock.json` and the installed skills in `.claude/skills/`. No game code or assets yet.
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
- **`narrative-design` is a locally modified copy.** Upstream's `SKILL.md` has invalid YAML (an unquoted colon in the description), so the installer rejects it. We fixed it by making the description a `>-` folded block and shortening it from 1551 to 625 characters (the first sentence plus the "Use when …" list). The body and `references/` are unchanged from upstream. It will not update from upstream, and re-running the original install command will fail. `ai-world-building` in the same repo has the same upstream bug and was not installed.
- The 78-skill pack's descriptions load into context every session. Delete skills for engines we don't use to reduce noise.

## What has been done so far

1. Confirmed the working folder is `A-Walk-In-The-Woods`.
2. Installed the 78-skill pack, `make-game`, `game-assets` and `pixel-art-sprites`. The first command had no `--agent` flag, so `--agent claude-code -y` was added to run it non-interactively.
3. Tried `narrative-design`; the installer failed on the upstream YAML error. Fixed and installed it by hand (see above). It was checked with `npx skills add <path> --list`, not a full install.
4. Wrote this file.

## Repo state

- Nothing is committed yet beyond the initial commit. `.claude/`, `skills-lock.json` and this file are untracked.
- `skills-lock.json` is written by the skills CLI. It does not include the hand-installed `narrative-design`.
