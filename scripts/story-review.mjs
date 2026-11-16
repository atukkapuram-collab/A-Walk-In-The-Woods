// Writes docs/story-review.md: every line of story text in the game, in play
// order, generated from src/data/ so it matches what plays. Run after any
// content change:
//
//   node scripts/story-review.mjs > docs/story-review.md
//
// Lines marked *(docs)* are quoted word for word from the creative docs (they
// carry a // DOC comment in the data files); everything else is new writing
// for the owner to review. "Only if" notes show the condition from the data.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { EVENTS } from '../src/data/events/index.js';
import { OPENING_PANELS } from '../src/data/opening.js';
import { ENDINGS, EARLY_ENDING_LINE, EARLY_ENDING_LINE_ALONE, milesLine } from '../src/data/endings.js';
import { KATZ_LINES, KATZ_MAP_LINES, KATZ_WORRIED, ALONE_LINES, ALONE_WORRIED } from '../src/data/katz-lines.js';
import { JOURNEY } from '../src/data/journey.js';
import { MAPS } from '../src/data/maps/index.js';
import { JOURNAL } from '../src/data/journal.js';
import { SPEAKERS } from '../src/data/speakers.js';

// Every source line with a // DOC comment, to mark quoted lines.
const DATA = new URL('../src/data/', import.meta.url).pathname;
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)]));
const docLines = files(DATA).flatMap((f) => readFileSync(f, 'utf8').split('\n')).filter((l) => l.includes('// DOC'));
const isDoc = (text) => docLines.some((l) => l.includes(JSON.stringify(text).slice(1, 40)) || l.includes(text.slice(0, 38).replace(/'/g, "\\'")));
const mark = (text) => (isDoc(text) ? ' *(docs)*' : '');

// A `when` condition, readable: "(s) => s.bond >= 5" -> "s.bond >= 5".
const NAMED = { endsAlone: 'Bryson is alone (Katz is home in Iowa, or the walk ends at the phone call)', atPhone: 'the walk ends at the phone call (E11)', atAirport: 'the walk ends at the airport (E8)', refuses: 'Bond after this choice is 2 or less (Katz says no)', warm: 'Bond 7+', sharp: 'Bond 4 or less', neutral: 'Bond 5-6' };
const cond = (fn) => {
    if (!fn) return '';
    const src = fn.toString().replace(/\s+/g, ' ');
    const text = NAMED[fn.name] && !src.startsWith('(s) => s.') ? NAMED[fn.name] : `\`${src.replace(/^\(?s\)?\s*=>\s*/, '')}\``;
    return ` — *only if* ${text}`;
};
const name = (id) => SPEAKERS[id]?.name ?? id;
const out = [];
const line = (s = '') => out.push(s);

function steps(list, indent = '') {
    for (const st of list ?? []) {
        const w = cond(st.when);
        if (st.narrate !== undefined) line(`${indent}- *Narrator:* ${st.narrate}${mark(st.narrate)}${w}`);
        else if (st.say !== undefined) line(`${indent}- **${name(st.say)}:** "${st.text}"${mark(st.text)}${w}`);
        else if (st.result !== undefined) line(`${indent}- *Result card:* ${st.result} (${effects(st.effects)})${w}`);
        else if (st.journal !== undefined) line(`${indent}- *Journal unlocks:* ${JOURNAL.find((j) => j.id === st.journal)?.title}${w}`);
        else if (st.choose) {
            line(`${indent}- **Choice menu:**`);
            st.choose.forEach((o, i) => {
                line(`${indent}  ${i + 1}. ${o.text}${mark(o.text)}${cond(o.when)}`);
                for (const side of o.chance ?? [o]) {
                    const pre = o.chance ? `${indent}     - coin side \`${side.id}\` (p ${side.p}): ` : `${indent}     - `;
                    if (side.effects) line(`${pre}Effects: ${typeof side.effects === 'function' ? `\`${side.effects.toString().replace(/\s+/g, ' ')}\`` : effects(side.effects)}`);
                    if (o.flags) line(`${indent}     - Flags: ${Object.entries(o.flags).map(([k, v]) => `${k} = ${v}`).join(', ')}`);
                    if (side.result) line(`${indent}     - *Result card:* ${typeof side.result === 'function' ? '(depends on state)' : side.result}${typeof side.result === 'string' ? mark(side.result) : ''}`);
                    if (o.final) line(`${indent}     - leads to the ending check with "${o.final}"`);
                    if (side.after || o.after) steps(side.after ?? o.after, `${indent}     `);
                }
            });
        }
    }
}

const effects = (e = {}) => Object.entries(e).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)} ${typeof v === 'number' && v > 0 ? '+' : ''}${v}`).join(', ') || 'no change';

function event(id, title, prefix = 'Scene') {
    const ev = EVENTS[id];
    const tags = [ev.night && 'night', ev.endingCheck && 'ending check after', ev.bondWhileAway && 'Bond can change while Katz is away'].filter(Boolean);
    line(`## ${prefix} ${ev.scene}: ${title}${tags.length ? ` · ${tags.join(' · ')}` : ''}`);
    line();
    steps(ev.steps);
    line();
}

line('# Trail Mix: Story Review Script');
line();
line('Every line of story text in the game, in play order. Generated from `src/data/` by `node scripts/story-review.mjs > docs/story-review.md`, so it matches what plays. Lines marked *(docs)* are word for word from the creative docs; **everything else is new writing for the owner to review**. Choices and stat effects are the outline\'s.');
line();
line('**Status (Milestone 13):** the whole game follows the book: the Prologue and Acts I-IV (Scenes 1-19) and the four endings (Scenes 20-23).');
line();

line('# Prologue: Hanover');
line();
line('## Scene 1: Opening');
line();
for (const [i, p] of OPENING_PANELS.entries()) {
    line(`**Panel ${i + 1}** (picture: ${p.art})`);
    line();
    if (p.event) line(`- *(plays E1, The Outfitter: Scene 2 below)*`);
    steps(p.steps);
    line();
}
event('e1_outfitter', 'E1, The Outfitter (tutorial, inside the opening)');

line('# Act I: Georgia');
line();
event('e2_lightens_load', 'E2, Katz Lightens His Load');
event('e3_mary_ellen', 'E3, Mary Ellen');
event('act1_close', 'Act I close, the woods at night');

line('# Act II: The Smokies and Shenandoah');
line();
event('e4_snowstorm', 'E4, Snowstorm');
event('e5_night_noises', 'E5, Night Noises');
event('e6_rental_car', 'E6, The Rental Car');
event('e7_skyline', 'E7, Skyline Drive');
event('midpoint_campfire', 'Midpoint, the campfire talk');
event('e8_katz_goes_home', 'E8, Katz Goes Home');

line('# Act III: Alone');
line();
event('home_in_hanover', 'Home in Hanover (plays as the Pennsylvania map starts)');
event('e9_car_hiking', 'E9, Car Hiking');
event('e10_mount_washington', 'E10, Mount Washington');
event('e11_phone_call', 'E11, The Phone Call');

line('# Act IV: Maine');
line();
event('reunion', 'Reunion (plays as the Maine map starts)');
event('e12_river', 'E12, The River');
event('e13_katz_is_lost', 'E13, Katz Is Lost');
event('final_crossroads', 'The Final Crossroads (on the logging road, or the roadside map)');

line('# The Endings');
line();
line(`Early-ending fade line: "${EARLY_ENDING_LINE}"${mark(EARLY_ENDING_LINE)} While Katz is home in Iowa: "${EARLY_ENDING_LINE_ALONE}"`);
line();
line(`Every ending card shows: the ending name (and tag), "${milesLine(1234)}" (with the player's own miles), the Bond rating, Journal entries found out of ${JOURNAL.length}, Katz's final line and the lesson. In the conditions below, \`s.at\` is the event whose check ended the walk and \`s.final\` is the Final Crossroads choice.`);
line();
for (const [id, e] of Object.entries(ENDINGS)) {
    line(`## ${e.name}${e.tag ? ` · ${e.tag}` : ''}`);
    line();
    steps(e.steps);
    const k = e.katzLine;
    line(`- **Katz's final line on the card:** ${typeof k === 'string' ? `"${k}"` : Object.entries(k).map(([b, t]) => `${b}: "${t}"`).join(' · ')}`);
    line(`- **Lesson:** *${e.lesson}*${mark(e.lesson)}`);
    line();
}

line('# Talking to Katz on the trail');
line();
for (const band of ['warm', 'neutral', 'sarcastic']) {
    line(`**${band[0].toUpperCase()}${band.slice(1)}:**`);
    KATZ_LINES[band].forEach((t) => line(`- "${t}"`));
    line();
}
line('**One line per map:**');
for (const [m, ls] of Object.entries(KATZ_MAP_LINES)) ls.forEach((t) => line(`- ${m}: "${t}"`));
line();
line('**Worried lines** (a stat enters its danger zone):');
for (const [s, t] of Object.entries(KATZ_WORRIED)) line(`- ${s}: "${t}"`);
line();
line('**While Katz is away** (Act III), the narrator instead:');
ALONE_LINES.forEach((t) => line(`- *Talking on the empty trail:* ${t}`));
for (const [s, t] of Object.entries(ALONE_WORRIED)) line(`- *Worried, ${s}:* ${t}`);
line();

line('# Act cards and travel screens');
line();
for (const st of JOURNEY) {
    if (st.type === 'act') line(`- **Act card:** ${st.title} (${st.subtitle})`);
    if (st.type === 'travel') {
        line(`- **Travel:** ${st.label}, ${st.miles} miles. "${st.line}"`);
        if (st.carIfSkipped) line(`  - with the rental car: "${st.carLine}"`);
    }
}
line();

line('# Signs and overlooks');
line();
for (const [key, m] of Object.entries(MAPS)) {
    const signs = m.signs ?? [];
    if (!signs.length && !m.overlook) continue;
    line(`**${m.title}**${m.placeholder ? ' (placeholder map)' : ''}`);
    for (const s of signs) line(`- *Sign:* ${s.text}${s.journal ? ` → Journal: ${JOURNAL.find((j) => j.id === s.journal).title}` : ''}`);
    if (m.overlook) line(`- *Overlook (Morale +1 once):* ${m.overlook.text}${m.overlook.journal ? ` → Journal: ${JOURNAL.find((j) => j.id === m.overlook.journal).title}` : ''}`);
    line();
}

line('# Trail Journal');
line();
JOURNAL.forEach((j, i) => line(`${i + 1}. **${j.title}** (${j.chapter}): ${j.text}`));
line();

process.stdout.write(out.join('\n'));
