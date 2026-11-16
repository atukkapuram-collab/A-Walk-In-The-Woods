# Trail Mix

*Trail Mix* (previously titled *White Blazes*) is a 2d pixel art adventure narrative style game that is based off of Bill Bryson’s journey through the Appalachian trail in “A Walk in the Woods”. Throughout the game the player will face challenges of hiking in the wild, by making decisions that affect the overall hiking experience.

**Pitch:** you are Bill Bryson, walking the Appalachian Trail through the story of *A Walk in the Woods*, mostly with your old friend Katz. In a cozy top-down pixel world the trail keeps throwing problems at you, and your choices decide whether your walk ends the way the book's did.

Built with Phaser as a browser game, due 11/17/2026.

**Play it online:** https://atukkapuram-collab.github.io/A-Walk-In-The-Woods/

## How to play

After twenty years in England, Bill Bryson decides to walk the Appalachian
Trail, 2,190 miles from Georgia to Maine. The only friend who agrees to come
is Stephen Katz. The game follows the book: Georgia, the Smokies and a rental
car to Virginia, then Bill walking alone through Pennsylvania and the White
Mountains, then Katz coming back for the Hundred-Mile Wilderness in Maine.
Every choice costs something, and together your choices decide which of four
endings you reach.

| Key | What it does |
|---|---|
| Arrow keys or WASD | Walk; move through menus |
| Space or Enter | Talk to the person (or sign) you're facing, read on, pick a choice |
| 1-4 | Pick a choice directly |
| ← / → | Change a setting |
| Esc | Pause on the trail (Resume, Journal, Settings, Quit); back out of a menu; skip the opening's narration |

- **Walk** up the trail. The white paint blazes mark the way, and a fallen
  tree, a snowdrift, a river or a road barrier blocks the path until that
  stretch's event is done.
- **Talk** to people by facing them and pressing Space. Press Space next to
  Katz any time to hear what he thinks (his mood follows how you treat him).
  In Act III Katz is home in Iowa and you walk alone.
- **Choose.** At each of the 13 events you pick from 2-4 options; the book's
  own choice is always one of them. A card then shows what happened and how
  your four stats changed:

  | Stat | Means | Watch out |
  |---|---|---|
  | Stamina | your bodies | 0 ends the walk |
  | Supplies | food, water, gear, money | 0 ends the walk |
  | Bond | how much you and Katz trust each other | 2 or less, and Katz leaves |
  | Morale | your will to keep going | 2 or less ends the walk |

  A bar blinks red when it's in danger. While Katz is away his Bond bar is
  greyed out and can only change when you phone him.
- **The Trail Journal:** signs, viewpoints and some choices unlock 13 short
  notes on the trail's history and nature, as Bryson tells them (MacKaye, Earl
  Shaffer, the chestnut blight, Centralia and more). Read them from the pause
  menu; they're kept between walks.
- **Four endings:** Changed Route (tagged "the book's ending"), Finished Trail
  (the "what if"), Early Departure and Broken Partnership. The ending card
  compares your miles with Bryson and Katz's 870 or so. The title screen
  counts the endings and Journal entries you've found.
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

The built game in `dist/` is four small files (about 1.4 MB) with relative paths,
so it can be hosted from any folder or web address. Like most browser games it
needs a web server: opening `dist/index.html` straight from the disk won't
work, because browsers block the game's modules on `file://` addresses.

Debug starts for testing (development build only): add
`?debug=1&map=shenandoah&stats=6,6,5,6&flags=skippedAhead&done=e7_skyline&choices=e1_outfitter:katzRoom`
to the address (maps: georgia, smokies, shenandoah, pennsylvania, newengland,
maine, roadside); F2 on the trail opens a debug menu.

`node scripts/story-review.mjs > docs/story-review.md` regenerates the script
of every line in the game, for reviewing the writing.

## Sound and credits

All sound effects and the four music loops are generated in code by the game
(Web Audio, see `src/systems/Audio.js` and `src/data/audio.js`). There are no
audio files and no third-party sounds, so there is nothing to license or credit.
All art is drawn in code too (`src/art/`). The story paraphrases Bill
Bryson's *A Walk in the Woods* (1998); the credits screen says so.

## Docs

- [docs/planning.md](docs/planning.md): the original project plan.
- [docs/story.md](docs/story.md): story, characters, stats and endings.
- [docs/scene-outline.md](docs/scene-outline.md): the 23 scenes in the book's order.
- [docs/story-review.md](docs/story-review.md): every line of the game, generated from the data.
- [docs/design-blueprint.md](docs/design-blueprint.md): how the game plays.
- [docs/implementation-plan.md](docs/implementation-plan.md): the technical build plan and milestones.
- [docs/handoff.md](docs/handoff.md): current progress, for whoever picks up the next milestone.

The repository is still named `A-Walk-In-The-Woods` so existing clones and links keep working.
