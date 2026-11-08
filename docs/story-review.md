# Trail Mix: Story Review Script

Every line of story text in the game, in scene order, generated from `src/data/` so it matches what plays. Lines marked *(docs)* appear word for word in the creative docs; **everything unmarked is new writing from Milestone 5 for your review.** Choices and stat effects are the outline's, unchanged.

"Only if" notes show when a line appears (Bond, stats, flags, or an earlier choice). "picked Outfitter → katz" means the player chose that option earlier. Option ids: Outfitter `buyAll` / `ultralight` / `katz`; Event 2 `push` / `sit` / `joke`; Whiteout `wait` / `push` / `town`; Pine Gap `zero` / `resupply` / `rideTogether` / `katzAlone`; The Fall `carry` / `alone` / `walkOut`.

**Points to look at first:** the midpoint (the Hiker's reason is left unspoken), the Hazel echo in Early Departure, the formerly DRAFT salesman/Dale/worried lines, and Changed Route's length when several callbacks apply.

## Scene 1: Opening (kitchen table and airport)

- *Narrator:* A gray winter night. Your kitchen table has vanished under maps, guidebooks and a spreadsheet called HIKE (FINAL) (2).
- *Narrator:* The plan: walk the entire Appalachian Trail, 2,190 miles from Georgia to Maine. You have twenty years of desk work behind you and an excellent pair of new boots.
- *Narrator:* You invite everyone you know. Everyone you know is busy, injured or laughing. Then an old school friend you haven't spoken to in years calls back.
- **Katz:** "The whole trail? Yeah. Yes. I'm in. When do we leave?"
- *Narrator:* Stephen Katz says yes before you finish the question, like a man grabbing a rope. You decide that is enthusiasm.
- *Narrator:* Two weeks later, at the Atlanta airport, Katz steps off the plane wheeling a suitcase.
- **Katz:** "What? It has wheels. Wheels are efficient." *(docs)*
- *Narrator:* You have planned for blisters, bears and snow. You have not planned for Katz. Somehow he never came up in the spreadsheet.

# Act I: The Beginning

## Scene 2: Event 1, The Outfitter (Georgia)

- *Narrator:* The outfitter at the trailhead. Your gear list has 61 items, color-coded by weight. A very enthusiastic salesman and Dale the Gear Guy both have opinions about your pack.
- **Salesman:** "You'll want the deluxe stove, the backup stove and the emergency stove. The mountains punish the unprepared, friend."
- **Dale:** "I cut the handle off my toothbrush. Four grams. Every gram you carry, you carry two thousand miles."
- **Katz:** "They sell snack cakes here. Just putting that out there."
- **Choice menu:**
  1. Buy everything the salesman suggests. *(docs)*
     - Effects: Supplies +2, Stamina −1
     - *Result card:* You're ready for anything, including a back injury. *(docs)*
     - then **Katz:** "You look like a vending machine that learned to walk."
  2. Pack ultralight like Dale. *(docs)*
     - Effects: Stamina +1, Supplies −1
     - *Result card:* You saw off your toothbrush handle and feel ridiculous. *(docs)*
     - then **Katz:** "If you start cutting the handles off forks, I'm going home."
  3. Let Katz choose. *(docs)*
     - Effects: Morale +1, Bond +1, Supplies −1
     - *Result card:* He buys 14 snack cakes and a hammock neither of you can set up. *(docs)*
     - then **Katz:** "Fourteen. One for every day before we give up. Kidding. Mostly."

## First steps: Sunshine jogs past (Georgia, talk to her)

- *Narrator:* Under the trailhead sign you felt like an explorer. Ten minutes later you are bent over, gasping, when a young hiker jogs past.
- **Sunshine:** "Morning!" *(docs)*
- *Narrator:* Her trail name is Sunshine, Katz wheezes. By the time he's said it, she's out of sight. You still haven't moved.

## Scene 3: Event 2, "I'm Going Home" (Georgia)

- *Narrator:* Day two. On a muddy climb, Katz drops onto a log and announces the trip is over.
- *Narrator:* Sunshine has just jogged past, which makes it worse. *(docs)*
- *Narrator:* Your pack weighs as much as a fourth-grader. You'd sit down too, but you might never get up again. — *only if picked Outfitter → "buyAll"*
- *Narrator:* You're carrying almost nothing and still can't breathe. Dale did not mention this part. — *only if picked Outfitter → "ultralight"*
- *Narrator:* He has eaten thirteen of the fourteen snack cakes since breakfast. The hammock remains unopened. — *only if picked Outfitter → "katz"*
- **Katz:** "I'm going home." *(docs)*
- **Katz:** "Did you see her? She was jogging. Uphill. Like it was a choice."
- **Katz:** "I even packed snack cakes. For emergencies. This is the emergency." — *only if not picked Outfitter → "katz"*
- **Choice menu:**
  1. Push him. "We said the whole trail." *(docs)*
     - Effects: Miles +20, Bond −1
     - *Result card:* He follows in silence, which is worse than complaining. *(docs)*
  2. Sit with him. *(docs)*
     - Effects: Bond +2, Supplies −1, Miles −5
     - *Result card:* You share his last snack cake and slow the pace.
     - then **Katz:** "It's the last one. You can have half. Don't get used to it."
  3. Make a joke. "Fine, but home is back over all those hills." *(docs)*
     - Effects: Morale +1
     - *Result card:* Katz laughs despite himself and stands up. *(docs)*

## Scene 4: Act I close, the first night (Georgia, night)

- *Narrator:* That night the shelter is crowded with wet hikers and wetter socks. By your math you covered eight miles today. The plan said fourteen.
- *Narrator:* You step outside and look up. There are more stars than you've seen in years, so many the sky looks crowded too.
- *Narrator:* Inside, Katz snores like a chainsaw. Before he fell asleep he mumbled, "Same time tomorrow?" You realize you were hoping he would. — *only if Bond ≥ 5*
- *Narrator:* Inside, Katz snores like a chainsaw, his back to your spot. Neither of you said good night. — *only if not (Bond ≥ 5)*
- *Narrator:* Your spreadsheet has no column for this. Am I hiking the trail, you wonder, or is it hiking me?

# Act II: The Middle

## Scene 5: Event 3, Whiteout (Smokies)

- *Narrator:* The Smokies. One minute the ridges are green; the next the sky goes white and it is snowing sideways. In May. Your guidebook calls this "unusual."
- *Narrator:* The shelter ahead is packed, and Dale is inside giving a lecture on sock layering. *(docs)*
- **Dale:** "That pack has its own weather system. Anyway: liner sock, wool sock, bread bag. Trust the system." — *only if picked Outfitter → "buyAll"*
- **Dale:** "Toothbrush buddy! Liner sock, wool sock, bread bag. Trust the system." — *only if picked Outfitter → "ultralight"*
- **Dale:** "Liner sock, wool sock, bread bag. And no, a hammock is not a shelter." — *only if not picked Outfitter → "buyAll" and not picked Outfitter → "ultralight"*
- **Katz:** "There's a side trail down to a road. Roads have towns. Towns have pancakes. I'm just saying the word "pancakes.""
- **Choice menu:**
  1. Wait it out in the shelter. *(docs)*
     - Effects: Stamina +1, Morale −1
     - *Result card:* You survive the storm and the sock lecture, barely. *(docs)*
     - then **Katz:** "I now know more about socks than about my own family."
  2. Push on to the next shelter. *(docs)*
     - Effects: Miles +20, Stamina −2
     - *Result card:* Brutal, but you feel tougher. *(docs)*
     - then *Narrator:* Somewhere in the white you notice the rhododendrons, pink under the snow. You almost stop to look. Almost.
  3. Take a side trail down to a road and town. *(docs)*
     - Effects: Supplies +1, Miles −10
     - *Result card:* Warm, dry, and the first hint that the plan can bend. *(docs)*
     - then **Katz:** "Pancakes. I would like it noted that I was right."

## Scene 6: Event 4, Night Visitor (Smokies, night)

- *Narrator:* Night. Something is snuffling outside the tent. Something with claws, judging by the scratching.
- **Katz:** "That's a bear. I'm going to be famous. "Local Man Eaten. Friend Fine.""
- **Katz:** "If I die out here, tell people it was a bear. Not the hill. The bear." *(docs)*
- **Choice menu:**
  1. Get up and hang the food bag properly. *(docs)*
     - Effects: Stamina −1
     - *Result card:* Safe, sensible, freezing. *(docs)*
     - then *Narrator:* Your flashlight finds the bear: a raccoon on a log, watching you tie knots like a judge at a competition. It waddles off, unimpressed.
  2. Try Katz's plan: bang pots and yell. *(docs)*
     - Effects: Bond +1, Morale +1, Supplies −1
     - *Result card:* It was a raccoon. It took a bagel anyway. *(docs)*
     - then **Katz:** "We fought off a bear. I'm counting it. It was a bear-shaped raccoon."
  3. Ignore it and sleep. *(docs)*
     - Effects: Supplies −2
     - *Result card:* You wake to a crime scene of torn wrappers. *(docs)*
     - then *Narrator:* In the mud are tiny handprints. In the bushes a raccoon is finishing your bagel. It does not look sorry.

## Scene 7: Event 5, Pine Gap (Virginia) · ending check after

- *Narrator:* Virginia. Weeks of the same hot green ridge, over and over, until Pine Gap: a diner, a hostel with real beds, and pie.
- *Narrator:* Since that side trail in the Smokies, you've known the plan can bend. Pine Gap is about to find out how far. — *only if picked Whiteout → "town"*
- *Narrator:* Outside, a pickup truck is heading 100 miles north. Katz has ideas.
- **Katz:** "A hundred miles north, in a truck, together. Nobody has to know. I would even let you pick the radio." — *only if Bond ≥ 7*
- **Katz:** "That truck is going a hundred miles north. Nobody gives out medals for the boring parts." — *only if Bond 5-6*
- **Katz:** "That truck's going north. You can walk if you want. You usually do what you want." — *only if Bond ≤ 4*
- **Hazel:** "I've fed a thousand hikers who quit at this counter, and a thousand who didn't. Same pie."
- *Narrator:* Hazel wipes the counter without looking up.
- **Hazel:** "Everybody thinks the trail is about the walking. It's about the quitting you don't do." *(docs)*
- **Choice menu:**
  1. Take a zero day (a rest day with no miles). *(docs)*
     - Effects: Stamina +2, Morale +1, Miles −10
     - *Result card:* Twelve hours in a real bed and pie for two meals. Your legs forgive you, slightly.
  2. Resupply and keep going. *(docs)*
     - Effects: Supplies +2, Morale −1
     - *Result card:* Pack full, spirits empty. By noon the green tunnel has swallowed you again.
  3. Ride ahead with Katz to skip the "boring" part. *(docs)*
     - Effects: Miles +100, Morale +1 · sets **skippedAhead**
     - *Result card:* A hundred miles of Virginia blur past the window. Katz sings the whole way. It feels great, and a little like cheating.
  4. Let Katz ride ahead alone and meet up later. *(docs)*
     - Effects: Bond −2
     - *Result card:* Your miles stay honest. The trail is very quiet for three days.
     - then **Katz:** "Truck was great. Thanks for asking."

## Scene 8: Event 6, The Last Bottle (Virginia)

- *Narrator:* A heatwave. The ridge shimmers. The spring marked on your map is a dry hole full of dead leaves.
- *Narrator:* You have one liter left between you, and Katz is slowing. *(docs)*
- **Katz:** "I'm fine. I'm walking slower to enjoy the... heat."
- **Choice menu:**
  1. Split it evenly. *(docs)*
     - Effects: Bond +2, Stamina −1
     - *Result card:* Half a liter each. It's warm and tastes like plastic, and it's the best thing either of you has ever drunk.
     - then **Katz:** "You could've kept it. I would've kept it. Probably."
  2. Ration it by the plan. *(docs)*
     - Effects: Bond −1
     - *Result card:* The plan says one sip a mile. You hold the bottle. The supplies hold too.
     - then **Katz:** "You sound like a gym teacher." *(docs)*
  3. Gamble on a spring off-trail. *(docs)*
     - Coin flip (50%): Morale +2
       - *Result card:* Down a side ravine, a cold spring trickles out of the rocks. Katz puts his whole head in it.
     - Coin flip (50%): Stamina −1, Miles −10
       - *Result card:* The side trail finds nothing but more ravine. You lose half a day climbing back out.

## Scene 9: Midpoint, the campfire talk (Virginia, night)

- *Narrator:* A campfire on a Virginia ridge. Halfway, more or less. You notice you've stopped checking the mileage every hour.
- **Katz:** "Can I tell you something? Before you called, I hadn't finished anything in years. Jobs. Plans. Anything." — *only if Bond ≥ 5*
- **Katz:** "This is the first thing I've said yes to in a long time. So. Why did you come?" — *only if Bond ≥ 5*
- *Narrator:* You start to give the spreadsheet answer. Then you stop, and for once you tell him the real one. It takes a while. — *only if Bond ≥ 5*
- *Narrator:* Since Pine Gap, Katz has walked a few steps behind you. Tonight he stares at the fire for a long time. — *only if Bond ≤ 4 and picked Pine Gap → "katzAlone"*
- *Narrator:* Katz stares at the fire for a long time. — *only if Bond ≤ 4 and not picked Pine Gap → "katzAlone"*
- **Katz:** "I've been checking bus schedules. There's one from the next town on Thursdays." — *only if Bond ≤ 4*
- *Narrator:* Neither of you says anything else. The silence says the rest. — *only if Bond ≤ 4*
- *Narrator:* A headlamp bobs out of the dark. Sunshine, passing your camp, stops for a moment by the fire.
- **Sunshine:** "Nobody walks the trail they planned. You walk the one that shows up." *(docs)*

# Act III: The Climax

## Scene 10: Event 7, The River (Maine)

- *Narrator:* Maine. Red and gold leaves, icy lakes, and no town or road for days. It is the most beautiful place you have ever been afraid in.
- *Narrator:* Then the river, swollen brown and loud with rain. The far bank is close enough to see and far enough to scare you.
- *Narrator:* Dale is sitting on a rock by the bank, eating cold oatmeal and studying the water.
- **Dale:** "Should've packed a packraft." *(docs)*
- **Katz:** "Okay. Arms locked, eyes forward, nobody drowns. I've been practicing that speech." — *only if Bond ≥ 7*
- **Katz:** "So we're swimming now. Great. Love that for us." — *only if Bond 5-6*
- **Katz:** "Go on. Tell me what the plan says about rivers." — *only if Bond ≤ 4*
- **Choice menu:**
  1. Ford it together, locking arms with Katz. *(docs)*
     - Effects: Bond +1, Stamina −1, Supplies −1 if Stamina is 3 or less; otherwise Bond +1, Stamina −1
     - *Result card (low Stamina, 3 or less):* Halfway across, your tired legs buckle. Katz holds on, but the current takes a food bag.
     - *Result card (otherwise):* Cold to the bone, arm in arm, one step at a time. On the far bank Katz is laughing like an idiot, and so are you.
  2. Camp and wait for the water to drop. *(docs)*
     - Effects: Supplies −2, Morale −1
     - *Result card:* Two days of cold oatmeal, watching the water. It drops eventually. So does everyone's mood.
  3. Take the long detour upstream. *(docs)*
     - Effects: Stamina −1, Miles −10
     - *Result card:* Six extra miles of bog and fallen trees to find a log across. Your feet will be bringing this up later.

## Scene 11: Event 8, The Fall (Maine) · ending check after

- *Narrator:* Wet roots on a steep slope. Katz goes down hard, and his ankle bends a way ankles do not.
- **Katz:** "I'm fine. Totally fine. Ankles are supposed to be this color."
- *Narrator:* He is not fine. The nearest logging road is a long limp away. The end of the trail is farther.
- **Choice menu:**
  1. Carry his pack as well as yours. *(docs)*
     - Effects: Stamina −2, Bond +2
     - *Result card:* You strap his pack on top of yours. It is unbelievably heavy, and you don't mention it once.
     - then **Katz:** "This is the nicest thing anyone's done for me. Don't make it weird." *(docs)*
     - then *Narrator:* Back in Georgia he was the punchline. You are not sure when that stopped. — *only if Bond ≥ 5*
  2. Go ahead alone to find help. *(docs)*
     - Effects: Miles +20, Bond −1
     - *Result card:* You make good time and find a ranger by dark. Katz waits alone, and he remembers it.
  3. Walk him out to the nearest logging road. *(docs)*
     - Effects: Morale −1 · sets **leftWilderness**
     - *Result card:* His arm over your shoulder, you leave the trail together. Safe, and the end of the original plan.

## Scene 12: The Final Crossroads (Maine, or the roadside campground)

- *Narrator:* The last campfire. On the horizon the final mountain rises out of the dark: the end of the trail. — *only if not left the wilderness*
- *Narrator:* A roadside campground: picnic tables, an ice machine, the hum of trucks. Far off, the final mountain catches the last of the light. — *only if left the wilderness*
- *Narrator:* Your legs are trail legs now. The hills that flattened you in Georgia are just hills. — *only if Stamina ≥ 5 and not left the wilderness*
- *Narrator:* Your legs could take that mountain now. Katz's ankle, propped up on a cooler, has other opinions. — *only if Stamina ≥ 5 and left the wilderness*
- *Narrator:* Your bodies are spent. Every step today was a negotiation, and you lost most of them. — *only if not (Stamina ≥ 5)*
- *Narrator:* There is food for a few more days, if nobody looks too hard at the snack cakes. — *only if Supplies ≥ 3*
- *Narrator:* The food bag is nearly empty. Dinner was half a tortilla and a long look at the stars. — *only if not (Supplies ≥ 3)*
- *Narrator:* Katz hands you the last of the hot chocolate without being asked. — *only if Bond ≥ 7*
- *Narrator:* Katz sits across the fire, close enough to talk, if either of you wanted to. — *only if Bond 5-6*
- *Narrator:* Katz sits on the far side of the fire. You've both gotten good at silence. — *only if Bond ≤ 4*
- **Katz:** "For the record, I'm still thinking about that slope. Sitting there alone. Just so you know." — *only if picked The Fall → "alone"*
- **Katz:** "We could always get a truck for the last bit. Worked great in Virginia." — *only if skipped ahead*
- **Katz:** "So what now?" *(docs)*
- **Choice menu:**
  1. "Summit or nothing." *(docs)*
     - leads to the ending check with "summit"
  2. "Let's go home." *(docs)*
     - leads to the ending check with "home"
  3. "Let's finish it our way." *(docs)*
     - leads to the ending check with "ourWay"

# The Endings

Each plays as narration, then a card with miles, Bond rating, Katz's final line (by Bond: warm 7+, neutral 5-6, sarcastic 4 or less) and the lesson.

## Scene 13: Broken Partnership

- *Narrator:* After one argument too many, Katz buys a bus ticket at the next road crossing. He doesn't make a speech. He just gets on.
- **Katz:** "It's not the trail. It's... okay, it's a little the trail. Look after yourself."
- *Narrator:* You walk on alone for a day. The trail is very quiet without someone complaining about it. You go home too.
- *Narrator:* Weeks later a postcard arrives from Katz. No message, just a drawing of a raccoon holding a bagel. Maybe there is something left to fix.
- **Katz's final line on the card:** any Bond: "Tell the raccoon I said hi."
- **Lesson:** *No goal is worth more than the people you take with you.* *(docs)*

## Scene 14: Early Departure

- *Narrator:* A motel near a trailhead. The map is spread across the bed, and you're staring at how much of it is left.
- *Narrator:* Katz puts his finger on Georgia instead, and drags it north, slowly, over every mile behind you.
- **Katz:** "We walked from there to here. On purpose. Who does that?" *(docs)*
- *Narrator:* Tonight he's the one doing the comforting. You can't remember when that started, only that it did. — *only if Bond ≥ 7*
- *Narrator:* You think of Hazel and the quitting you don't do. You didn't quit on each other. That part, you finished. — *only if Bond ≥ 5*
- *Narrator:* You think of Hazel and the quitting you don't do. You still aren't sure which kind of stopping this is. Maybe it's allowed to be both. — *only if Bond 4 or less*
- **Katz's final line on the card:** warm: "Same time next year? I'll bring the suitcase." · neutral: "Two thousand miles was always a ridiculous number." · sarcastic: "Well. At least we're not walking."
- **Lesson:** *Stopping isn't the same as failing; the trail was harder than your plans.* *(docs)*

## Scene 15: Finished Trail

- *Narrator:* You reach the summit at sunrise, legs shaking, above a sea of clouds. Katz complains the whole way up. *(docs)*
- *Narrator:* At the top he falls completely silent. You take one photo, and neither of you can say anything for a while.
- *Narrator:* Sunshine is already there, cheering. For once you don't wonder how long ago she got here.
- *Narrator:* Back in Georgia you'd have counted the miles. Now you think of Hazel: it was never about the walking. It was the quitting you didn't do, mostly on each other.
- **Katz's final line on the card:** warm: "Two thousand miles. I'd complain, but I'm busy being amazed." · neutral: "Great. Now how do we get down?"
- **Lesson:** *Preparation, care for each other and stubbornness can carry you through.* *(docs)*

## Scene 16: Changed Route

- *Narrator:* You try for the summit. Halfway up you both stop, look at each other, and turn around without a word. It is the first plan you have changed together. — *only if final choice was "summit"*
- *Narrator:* You don't finish the trail as planned. Instead you go back for the stretches that meant something, and walk them at your own pace. — *only if not left the wilderness*
- *Narrator:* Katz's ankle takes two weeks to heal. Then you go back for the stretches that meant something, and walk them at your own pace. — *only if left the wilderness*
- *Narrator:* You even go back for the hundred miles of Virginia you skipped. They're boring. You love them anyway. — *only if skipped ahead*
- *Narrator:* It ends on a quiet lakeshore, watching the leaves fall. It isn't the trip you planned. It's better.
- **Katz:** "So we didn't hike the whole thing. We hiked our thing." *(docs)*
- *Narrator:* Somewhere in your pack is the old spreadsheet, soft as cloth from the rain. You never did fill in the last column.
- **Katz's final line on the card:** warm: "Best walk I ever didn't finish." · neutral: "Our thing. I still think we deserve a trophy." · sarcastic: "Fine. It was good. Don't tell anyone I said that."
- **Lesson:** *Growth comes from changing your goals when reality changes, not from forcing the original plan.* *(docs)*

# Talking to Katz on the trail

Press Space next to him. He picks from the lines for his current Bond, plus the line for the current map.

**Warm** (Bond 7+):
- "Admit it. You'd be bored out here without me."
- "I'm not saying this is fun. I'm saying I'd do it again. Don't quote me."
- "The trail's alright, you know? Don't tell the trail I said that."

**Neutral** (Bond 5-6):
- "Nature is just outside with extra steps." *(docs)*
- "I'm not quitting. I'm resting aggressively." *(docs)*
- "If I die out here, tell people it was a bear. Not the hill. The bear." *(docs)*

**Sarcastic** (Bond 4 or less):
- "Oh good, you're talking to me. Is that on the schedule?"
- "Keep walking. You're good at that."
- "I'm still here. Don't read into it."

**Per map** (any Bond):
- georgia: "Every tree has a white stripe on it. Either that is the trail, or someone really loves paint."
- smokies: "The sign says bears live here. I would like to speak to whoever approved that."
- virginia: "It's the same hill. I swear we've done this hill. Keep following the white paint, I guess."
- maine: "No roads for a hundred miles. Even the trees look nervous. Keep the blazes in sight."
- roadside: "An ice machine. Civilization. I could weep."

**Worried lines** (said once when a stat enters its danger zone):
- Stamina: "My legs have stopped speaking to me. Maybe we take it easy for a bit."
- Supplies: "Tell me there's more food in that pack. Please. Lie if you have to."
- Bond: "Go on ahead. I'll catch up. Or I won't. We'll see."
- Morale: "Do you ever feel like the trail is winning?"

# Travel screens (Milestone 6)

One narrator line under the map while the hikers walk. The truck line replaces it after Virginia if you rode ahead at Pine Gap.
- **Late Spring · Great Smoky Mountains** (+160 miles): Somewhere around mile 100, your feet file a formal complaint.
- **Midsummer · Virginia** (+380 miles): The snow melts into green. Katz starts naming the hills. All of them are called Gary.
- **Autumn · The Hundred-Mile Wilderness, Maine** (+1420 miles): A whole summer of rocks, mud and borrowed showers. You stop counting days and start counting lakes.
  - *Truck version:* Thanks to a certain pickup truck, a hundred miles of it go by with the radio on. Then a whole summer of rocks and mud.

Early endings (after Event 5 or 8) first fade in: *And that's where the trail ended for us.* *(docs)*

# Signs and overlooks

Signs are narration. An overlook gives Morale +1 the first time on each map.
- **georgia sign:** The sign says Katahdin, Maine: 2,190 miles. At fourteen miles a day you'll be done by August. You have checked this math eleven times.
- **georgia overlook:** Through the bare trees, ridge after ridge fades into the rain. Every one is a mile you have to walk, and for a moment you don't mind.
- **smokies sign:** Bears live here, says the sign, and lists what to do if you meet one. Katz reads it twice and walks a little closer to you.
- **smokies overlook:** Fog fills the valleys below, and the ridges float above it like islands. You forget to check your watch.
- **virginia sign:** Pine Gap, Virginia. Diner. Hostel. Showers. Underneath, someone has added in marker: PIE.
- **virginia overlook:** Green ridges roll away to the horizon. Much of this was cut for timber once. The forest grew back, slowly, because people let it.
- **maine sign:** A warning sign: no supplies and no help for the next hundred miles, so carry enough food. You count yours. Then you count it again.
- **maine overlook:** An icy lake lies perfectly still below, ringed with red and gold. Somewhere a loon calls. You've stopped measuring days in miles.
