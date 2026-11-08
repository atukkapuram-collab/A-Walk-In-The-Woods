# Trail Mix

*Trail Mix* (previously titled *White Blazes*) is a 2d pixel art adventure narrative style game that is based off of Bill Bryson’s journey through the Appalachian trail in “A Walk in the Woods”. Throughout the game the player will face challenges of hiking in the wild, by making decisions that affect the overall hiking experience.

**Pitch:** walk the Appalachian Trail with Katz in a cozy top-down pixel world, where every few minutes the trail throws a problem at you and your choice shapes the journey and its ending.

Built with Phaser as a browser game, due 11/17/2026.

**Play it online:** https://atukkapuram-collab.github.io/A-Walk-In-The-Woods/

## How to play

You and your old friend Katz set out to walk the whole Appalachian Trail,
2,190 miles from Georgia to Maine. Walk the trail, meet the people on it, and
decide what to do when things go wrong. Every choice costs something, and
together your choices decide which of four endings you reach.

| Key | What it does |
|---|---|
| Arrow keys or WASD | Walk; move through menus |
| Space or Enter | Talk to the person (or sign) you're facing, read on, pick a choice |
| 1-4 | Pick a choice directly |
| ← / → | Change a setting |
| Esc | Pause (on the trail); back out of a menu; skip the opening |

- **Walk** up the trail. The white paint blazes on the trees mark the way, and
  a fallen tree, a snowdrift or a river blocks the path until that stretch's
  event is done.
- **Talk** to people by facing them and pressing Space. Press Space next to
  Katz any time to hear what he thinks (his mood follows how you treat him).
  Signs and scenic overlooks are worth a look.
- **Choose.** At each event you pick from 2-4 options. A card then shows what
  happened and how your four stats changed:

  | Stat | Means | Watch out |
  |---|---|---|
  | Stamina | your bodies | 0 ends the hike |
  | Supplies | food, water, gear | 0 ends the hike |
  | Bond | how much you and Katz trust each other | 2 or less, and Katz leaves |
  | Morale | your will to keep going | 2 or less ends the hike |

  A bar blinks red when it's in danger. Miles are just for the record.
- **Four endings:** Finished Trail, Changed Route, Early Departure and Broken
  Partnership. None of them is the "right" one. A run takes about 12 minutes;
  the title screen counts the endings you've found.
- **Settings** (on the title or the pause menu): music and sound volume, and
  text speed (slow, normal, instant). They're saved in your browser.

## Run it

Needs Node.js 26 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Then open http://localhost:8080. Other commands: `npm test` (Vitest), `npm run build` (production build in `dist/`), `npm run preview` (serve the built version).

Every push to `main` rebuilds the game and publishes it to the link above
(`.github/workflows/deploy.yml`; the tests must pass first).

The built game in `dist/` is three files (about 1.4 MB) with relative paths,
so it can be hosted from any folder or web address. Like most browser games it
needs a web server: opening `dist/index.html` straight from the disk won't
work, because browsers block the game's modules on `file://` addresses.

Debug starts for testing (development build only): add
`?debug=1&map=virginia&stats=6,6,5,6&flags=skippedAhead&done=event5_pine_gap&choices=event1_outfitter:katz`
to the address; F2 on the trail opens a debug menu.

## Sound and credits

All sound effects and both music loops are generated in code by the game
(Web Audio, see `src/systems/Audio.js` and `src/data/audio.js`). There are no
audio files and no third-party sounds, so there is nothing to license or credit.
All art is drawn in code too (`src/art/`).

## Docs

- [docs/planning.md](docs/planning.md): the original project plan.
- [docs/story.md](docs/story.md): story, characters, stats and endings.
- [docs/scene-outline.md](docs/scene-outline.md): the 16 scenes in order.
- [docs/design-blueprint.md](docs/design-blueprint.md): how the game plays.
- [docs/implementation-plan.md](docs/implementation-plan.md): the technical build plan and milestones.
- [docs/handoff.md](docs/handoff.md): current progress, for whoever picks up the next milestone.

The repository is still named `A-Walk-In-The-Woods` so existing clones and links keep working.
