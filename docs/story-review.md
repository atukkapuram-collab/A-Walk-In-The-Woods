# Trail Mix: Story Review Script

Every line of story text in the game, in play order. Generated from `src/data/` by `node scripts/story-review.mjs > docs/story-review.md`, so it matches what plays. Lines marked *(docs)* are word for word from the creative docs; **everything else is new writing for the owner to review**. Choices and stat effects are the outline's.

**Status (Milestone 13):** the whole game follows the book: the Prologue and Acts I-IV (Scenes 1-19) and the four endings (Scenes 20-23).

# Prologue: Hanover

## Scene 1: Opening

**Panel 1** (picture: kitchen)

- *Narrator:* After twenty years in England, I have moved my family to Hanover, New Hampshire. At the edge of town, a path slips into the woods.
- *Narrator:* It is the Appalachian Trail: more than 2,100 miles from Georgia to Maine. I decide, on no evidence at all, to walk the whole thing.
- *Narrator:* Then I make a mistake. I read books about bear attacks. Detailed ones. Late at night.

**Panel 2** (picture: kitchen)

- *(plays E1, The Outfitter: Scene 2 below)*

**Panel 3** (picture: phone)

- *Narrator:* I invite everyone I know. Everyone I know has a reason: work, children, knees, sense.
- *Narrator:* Then the phone rings. Stephen Katz, an old school friend from Des Moines I have not seen in years, has heard about the trip.
- **Katz:** "I hear you're walking the Appalachian Trail. I was thinking. Maybe I could come?"
- *Narrator:* Katz, as I remember him, was not built for the outdoors. I say yes before I can think about it.

**Panel 4** (picture: airport)

- *Narrator:* Atlanta, in March. Katz comes off the plane heavier than I remember, and out of breath from the walk to the gate.
- **Katz:** "I don't drink anymore, by the way. A few years now. Thought you should know before we share a tent."
- *Narrator:* His bag is mostly Little Debbie snack cakes. I decide not to ask about the rest.

## Scene 2: E1, The Outfitter (tutorial, inside the opening)

- *Narrator:* The outfitter in Hanover. A cheerful salesman walks me round the shop, and the pile on the counter grows: tent, stove, water filter, a knife with eleven blades.
- **Salesman:** "You'll want a backup stove. And a backup for the backup. The mountains don't forgive, my friend."
- *Narrator:* Every choice on the trail costs something. Four things will decide how far I get: Stamina, Supplies, my Bond with Katz, and Morale.
- **Choice menu:**
  1. Buy the whole list. *(docs)*
     - Effects: Supplies +2, Stamina -1
     - *Result card:* I am ready for anything, including a hernia. *(docs)*
     - *Narrator:* Fully loaded, the pack weighs about as much as a ten-year-old. I tell myself I will get stronger.
  2. Buy only what the guidebook says you need. *(docs)*
     - Effects: Stamina +1, Supplies -1
     - *Result card:* Lighter, cheaper, and nagged by a feeling I've forgotten something. *(docs)*
  3. Leave room for whatever Katz brings. *(docs)*
     - Effects: Bond +1, Morale +1, Supplies -1
     - *Result card:* Katz will bring snack cakes. Katz will always bring snack cakes. *(docs)*

# Act I: Georgia

## Scene 3: E2, Katz Lightens His Load

- *Narrator:* Day one: Amicalola Falls, then the approach trail up to Springer Mountain, where the trail begins. It is uphill. All of it is uphill.
- *Narrator:* My pack, stuffed with everything the salesman sold me, tries to pull me back down the mountain on every step. — *only if* `picked(s, 'e1_outfitter', 'buyAll')`
- *Narrator:* My light pack is the one thing going well. I make a note to thank the guidebook, if I live. — *only if* `picked(s, 'e1_outfitter', 'guidebook')`
- *Narrator:* Katz brought exactly what I expected: a great many Little Debbie snack cakes, and very little else of use. — *only if* `picked(s, 'e1_outfitter', 'katzRoom')`
- *Narrator:* Day two. Katz is far behind. When he finally appears, red-faced and wheezing, his pack looks a good deal lighter.
- **Katz:** "I threw some stuff away. The coffee. The sugar. A lot of the food. It was heavy."
- **Katz:** "It's down the hill somewhere. Don't look at me like that."
- **Choice menu:**
  1. Climb down and fetch it. *(docs)*
     - Effects: Supplies +1, Stamina -2
     - *Result card:* An hour of scrambling through brambles, collecting food like an angry squirrel.
     - **Katz:** "You went back for the pepperoni? Okay. That I respect."
  2. Share your food with him. *(docs)*
     - Effects: Bond +2, Supplies -2
     - *Result card:* We will run short sooner. But he is still here, and so am I.
     - **Katz:** "Thanks. Really. Don't tell anyone I said that."
  3. Laugh it off and keep walking. *(docs)*
     - Effects: Morale +1, Bond -1
     - *Result card:* It is funny, in its way. Katz does not find it funny at all.
     - **Katz:** "Glad I'm entertaining somebody."

## Scene 4: E3, Mary Ellen

- *Narrator:* On a long climb we meet Mary Ellen, from Florida. She talks without pausing for breath, mostly about everything we are doing wrong.
- **Mary Ellen:** "You guys are really slow. Like, really slow. What are you carrying in there, bricks?"
- **Mary Ellen:** "I'm walking with you tomorrow. You need somebody who knows what they're doing."
- **Katz:** "If she comes with us, I'm walking into a lake. I'll find a lake."
- **Choice menu:**
  1. Let her tag along. *(docs)*
     - Effects: Supplies +1, Morale -2
     - *Result card:* She shares her food generously, and her opinions more generously still.
     - *Narrator:* By evening I know her views on tents, Florida, Katz and me. None of them are favorable.
  2. Slip away at dawn with Katz. *(docs)*
     - Effects: Bond +1, Stamina -1
     - *Result card:* Packed and gone before sunrise, at a punishing pace. A conspiracy of two.
     - **Katz:** "Best hike of my life. Keep going. Don't look back."
  3. Tell her you'd rather hike alone. *(docs)*
     - Effects: Morale +1, Bond -1
     - *Result card:* She takes it badly. Katz thinks I was harsh, and is secretly relieved.

## Scene 5: Act I close, the woods at night · night

- *Narrator:* Night in the woods. No streetlights, no traffic, nothing. The dark is so complete I cannot see my own hand.
- *Narrator:* Then the stars come out, more than I have seen in my life. The woods, I begin to understand, are not like anywhere else.
- *Narrator:* From his tent Katz mumbles, "Same time tomorrow?" and is asleep before I can answer. I find I was hoping he would ask. — *only if* `s.bond >= 5`
- *Narrator:* From his tent Katz snores, loud and steady. Neither of us said good night. — *only if* `s.bond < 5`
- *Narrator:* I planned this walk down to the last ounce. Somehow I never planned for how it would feel.

# Act II: The Smokies and Shenandoah

## Scene 6: E4, Snowstorm

- *Narrator:* The Smokies. High ridges and old, dark forest, and then, in the space of an hour, the sky turns white.
- *Narrator:* By evening a foot of snow has fallen. The shelter is jammed with hikers, all of them steaming gently like laundry.
- **Hiker:** "Radio says more tonight. Trail's buried from here to the road."
- **Katz:** "Look on the bright side. Mary Ellen is not in this shelter." — *only if* `s.choices?.e3_mary_ellen === 'tagAlong'`
- **Katz:** "We've been through worse. I can't think of when, but I'm sure we have." — *only if* `s.bond >= 7`
- **Katz:** "Snow. In spring. Who signed off on this?" — *only if* Bond 5-6
- **Katz:** "Does your spreadsheet have a column for this?" — *only if* `s.bond <= 4`
- **Choice menu:**
  1. Wait it out in the shelter. *(docs)*
     - Effects: Stamina +1, Morale -1
     - *Result card:* Two cold, damp days of waiting. My body rests. My mind does not.
  2. Push on through the snow. *(docs)*
     - Effects: Miles plus, Stamina -2
     - *Result card:* Brutal, but we make the next shelter. I have never been so cold, or so pleased with myself.
     - *Narrator:* Somewhere in the white I notice rhododendrons, bent low under the snow. I almost stop to look.
  3. Get down to Gatlinburg early. *(docs)*
     - Effects: Supplies +1, Miles minus
     - *Result card:* A long, slushy walk down to the road, then a motel room with a heater.
     - **Katz:** "Pancakes. I would like it noted that pancakes exist."

## Scene 7: E5, Night Noises · night

- *Narrator:* Night. I am lying in my tent thinking about bears, when something outside starts thinking about me.
- *Narrator:* Heavy footsteps. Breathing. A branch snaps. Every bear book I ever read comes back to me at once, in detail.
- **Katz:** "Bryson. Bryson. You hear that?"
- **Choice menu:**
  1. Get up and hang the food bag. *(docs)*
     - Effects: Stamina -1, Morale +1
     - *Result card:* I creep out with a flashlight, string the food up a tree, and creep back in, alive.
  2. Wake Katz. *(docs)*
     - Effects: Bond +1, Stamina -1
     - *Result card:* We sit up together in the dark, whispering, until whatever it is moves off.
     - **Katz:** "If it comes back, you're the one who reads the bear books. You go talk to it."
  3. Lie still and listen. *(docs)*
     - Effects: Morale -2
     - *Result card:* I lie rigid until dawn, composing my own obituary.
- *Narrator:* In the morning there are marks in the leaves that tell me nothing. Whatever it was, we never find out.

## Scene 8: E6, The Rental Car · ending check after

- *Narrator:* Gatlinburg: pancake houses, wax museums and fudge shops. After the woods it is like landing on another planet.
- *Journal unlocks:* Gatlinburg
- *Narrator:* The high trail is closed by snow. And for two days now, Katz has barely said a word to me. — *only if* `!warm(s)`
- *Narrator:* The high trail is closed by snow. Two days of waiting, and even Katz is running out of jokes. — *only if* `s.bond >= 7`
- **Katz:** "The rental place has cars. Virginia's warm, I hear. I'm just saying." — *only if* `s.bond >= 7`
- **Katz:** "The trail's closed. There's a car rental right there. I'm not saying. I'm just saying." — *only if* Bond 5-6
- **Katz:** "You can wait for the snow. I'm getting in a car." — *only if* `s.bond <= 4`
- **Rental clerk:** "Going north? We do one-way rentals. You trail folks do it all the time."
- **Choice menu:**
  1. Rent a car and drive north to Virginia. *(docs)*
     - Effects: Morale +1, Supplies -1
     - Flags: skippedAhead = true
     - *Result card:* We drive north with the windows down. It feels wonderful, and a little like cheating.
  2. Walk on through, whatever it takes. *(docs)*
     - Effects: Stamina -2, Bond -1
     - *Result card:* We wait for the road to open and walk on through drifts to our knees. Katz says nothing for a day.
  3. Take zero days in Gatlinburg. *(docs)*
     - Effects: Stamina +2, Supplies -1, Morale -1
     - *Result card:* Three days of motel beds and pancakes. My legs recover. My resolve goes soft.

## Scene 9: E7, Skyline Drive

- *Narrator:* Shenandoah National Park. The trail and Skyline Drive cross and recross all day, like two strangers who keep meeting in a corridor.
- *Narrator:* Every crossing has a wayside: burgers, milkshakes, and families who drove up to see the view we walked to.
- **Day-tripper:** "You boys walked here? From where? Georgia? Honey, come look. These men walked from Georgia."
- **Katz:** "They've got milkshakes. I'm not saying we deserve one. I'm saying we deserve two." — *only if* `s.bond >= 7`
- **Katz:** "Burgers. Right there. I can smell them from here." — *only if* Bond 5-6
- **Katz:** "Go on. Tell me milkshakes aren't in the plan." — *only if* `s.bond <= 4`
- **Choice menu:**
  1. Hike every mile. *(docs)*
     - Effects: Stamina -1, Morale +1
     - *Result card:* The woods between the roads are quiet and green, and we earn every one of them.
  2. Stop at every wayside. *(docs)*
     - Effects: Bond +1, Morale +1, Supplies -1
     - *Result card:* The budget goes on milkshakes. *(docs)*
     - **Katz:** "This is the best national park. I have been to one national park."
  3. Hitch between waysides. *(docs)*
     - Effects: Stamina +1, Morale -1
     - *Result card:* It feels like cheating, because it is. *(docs)*

## Scene 10: Midpoint, the campfire talk · night

- *Narrator:* A campfire on a ridge in Shenandoah. I notice I have stopped checking the mileage every hour.
- **Katz:** "You know I used to drink. A lot. I've been sober a few years now. Some days it's still all I think about." — *only if* `s.bond >= 5`
- **Katz:** "When you said Appalachian Trail, I thought: here's something I could finish. So. Why did you come?" — *only if* `s.bond >= 5`
- *Narrator:* I start to give the clever answer. Then I stop and give him the true one, which is longer and less clever. He listens to all of it. — *only if* `s.bond >= 5`
- *Narrator:* I tell him I am glad he came. I am surprised by how much I mean it. — *only if* `s.bond >= 5`
- *Narrator:* Katz stares into the fire for a long time. — *only if* `s.bond <= 4`
- **Katz:** "I looked up flights home. Just so you know." — *only if* `s.bond <= 4`
- *Narrator:* Neither of us says anything else. The fire says it for us. — *only if* `s.bond <= 4`

## Scene 11: E8, Katz Goes Home · ending check after

- *Narrator:* A few days later we come down to a road, and the end of our first stretch together. Katz has to get back to Des Moines.
- **Katz:** "I'm going to miss this. Don't tell anyone. Especially not the blisters." — *only if* `s.bond >= 7`
- **Katz:** "So that is that. Some of it was even fun." — *only if* Bond 5-6
- **Katz:** "Well. That's me done." — *only if* `s.bond <= 4`
- **Choice menu:**
  1. Ask him to come back for the end. *(docs)*
     - Effects: Bond +1, Morale -1
     - Flags: invited = true, katzAway = true
     - *Result card:* He says he will think about it. He means yes. I can tell.
     - **Katz:** "Maine, huh? Okay. I'll start training. Probably."
  2. Tell him you're glad he came. *(docs)*
     - Effects: Bond +2, Morale -2
     - Flags: katzAway = true
     - *Result card:* It is harder to say than it should be. Watching his plane go, I feel suddenly very alone.
  3. Drop him at the airport and say little. *(docs)*
     - Effects: Morale +1, Bond -2
     - Flags: katzAway = true
     - *Result card:* A handshake, a nod, and he is gone. It is easier this way, I tell myself.

# Act III: Alone

## Scene 12: Home in Hanover (plays as the Pennsylvania map starts)

- *Narrator:* Home in Hanover for a few weeks. I sleep in a bed, eat at a table, and stand under hot water for longer than is decent.
- *Narrator:* But I keep drifting to the edge of town, where the white blazes go into the trees. The trail is not finished with me.
- *Result card:* Rested and restocked. I load the car and drive south to pick up the trail again, alone. (Stamina +1, Supplies +2)

## Scene 13: E9, Car Hiking

- *Narrator:* Pennsylvania. The trail here is famous for one thing: rocks. Mile after mile of them, tilted and loose, like walking over a dropped tray of crockery.
- *Narrator:* My new system is simple. I park the car, walk a piece of trail, turn round and walk back to the car. Then I drive to a motel.
- *Narrator:* It is easier. It is also a little hollow, and there is nobody to complain to. I had not expected to miss the complaining.
- **Choice menu:**
  1. Keep day-hiking from the car. *(docs)*
     - Effects: Supplies +1, Morale -2
     - *Result card:* Clean socks and a hot dinner every night. And the feeling that I am visiting the trail, not walking it.
  2. Commit to a solo overnight section. *(docs)*
     - Effects: Stamina -1, Morale +2, Supplies -1
     - *Result card:* A night alone in the woods with everything on my back. Harder, lonelier, and the first day that feels real.
  3. Drive over to see Centralia. *(docs)*
     - Effects: Morale -1
     - *Result card:* A town with almost nobody left in it, and smoke coming up through the ground. I stay longer than I meant to.
     - *Journal unlocks:* Centralia

## Scene 14: E10, Mount Washington

- *Narrator:* New Hampshire: the White Mountains. Above the treeline there is only rock, cairns and sky, and I can see for sixty miles.
- *Narrator:* Mount Washington is not especially high. It is especially deadly. The weather here can go from sunshine to killing cold in an hour.
- *Narrator:* This afternoon it turns. Cloud pours over the ridge like milk, and the wind starts to push at me with both hands.
- **Choice menu:**
  1. Go for the summit anyway. *(docs)*
     - Effects: Morale +2, Stamina -2
     - *Result card:* I reach the top soaked, shaking and thrilled, and find a cafeteria full of people who came up by car.
  2. Turn back. *(docs)*
     - Effects: Stamina +1, Morale -1
     - *Result card:* I go down while I still can. It is the right decision. It does not feel like one.
  3. Stay the night in a mountain hut. *(docs)*
     - Effects: Supplies -1, Stamina +1
     - *Result card:* A bunk, a hot meal and a room full of strangers swapping weather stories. It costs plenty. It is worth it.

## Scene 15: E11, The Phone Call · ending check after · Bond can change while Katz is away

- *Narrator:* A payphone at a trailhead in New Hampshire. Maine is next: the Hundred-Mile Wilderness, the hardest and loneliest stretch of the whole trail.
- *Narrator:* I do not want to walk it alone. I dial a number in Des Moines.
- **Katz:** "Bryson! I've been walking to work. Well, part of the way. I've been in training. Sort of." — *only if* `s.invited`
- **Katz:** "Bryson. Hey. I was hoping you'd call. Don't let that go to your head." — *only if* `!s.invited && picked(s, 'e8_katz_goes_home', 'glad')`
- **Katz:** "Oh. It's you. I figured you'd lost the number." — *only if* `!s.invited && picked(s, 'e8_katz_goes_home', 'sayLittle')`
- **Katz:** "Bryson? Where are you calling from, a tree?" — *only if* `!s.invited && !picked(s, 'e8_katz_goes_home', 'glad') && !picked(s, 'e8_katz_goes_home', 'sayLittle')`
- *Narrator:* I tell him about Maine: a hundred miles with no towns, no roads and no shops. There is a long pause on the line.
- **Choice menu:**
  1. "I miss having you out there." *(docs)*
     - Effects: Bond +2, Morale -1
     - Flags: katzAway = false
     - *Result card:* It costs me something to say it. It also happens to be true.
     - **Katz:** "I don't think so, Bryson. I think we said what we had to say in Virginia. Look after yourself out there." — *only if* Bond after this choice is 2 or less (Katz says no)
     - *Narrator:* The line goes quiet. Then it is only a dial tone, and the wind in the trees. — *only if* Bond after this choice is 2 or less (Katz says no)
     - **Katz:** "A hundred miles of nothing. You really know how to sell a vacation. I'm in." — *only if* Bond 7+
     - **Katz:** "Okay. Yeah. I'll come. Somebody has to carry the snack cakes." — *only if* Bond 5-6
     - **Katz:** "Fine. I'll come. But I'm not sharing a tent this time." — *only if* Bond 4 or less
     - *Narrator:* Katz will fly to Maine in two weeks. I hang up and find I am grinning at a payphone. — *only if* `!refuses(s)`
  2. "I'll sort out the gear and the flights." *(docs)*
     - Effects: Bond +1, Supplies -1
     - Flags: katzAway = false
     - *Result card:* I promise to book the flights and buy the gear. My wallet winces.
     - **Katz:** "I don't think so, Bryson. I think we said what we had to say in Virginia. Look after yourself out there." — *only if* Bond after this choice is 2 or less (Katz says no)
     - *Narrator:* The line goes quiet. Then it is only a dial tone, and the wind in the trees. — *only if* Bond after this choice is 2 or less (Katz says no)
     - **Katz:** "A hundred miles of nothing. You really know how to sell a vacation. I'm in." — *only if* Bond 7+
     - **Katz:** "Okay. Yeah. I'll come. Somebody has to carry the snack cakes." — *only if* Bond 5-6
     - **Katz:** "Fine. I'll come. But I'm not sharing a tent this time." — *only if* Bond 4 or less
     - *Narrator:* Katz will fly to Maine in two weeks. I hang up and find I am grinning at a payphone. — *only if* `!refuses(s)`
  3. "Only if you feel like it." *(docs)*
     - Effects: Morale +1, Bond -1
     - Flags: katzAway = false
     - *Result card:* I keep it light, as if it hardly matters either way. He hears that.
     - **Katz:** "I don't think so, Bryson. I think we said what we had to say in Virginia. Look after yourself out there." — *only if* Bond after this choice is 2 or less (Katz says no)
     - *Narrator:* The line goes quiet. Then it is only a dial tone, and the wind in the trees. — *only if* Bond after this choice is 2 or less (Katz says no)
     - **Katz:** "A hundred miles of nothing. You really know how to sell a vacation. I'm in." — *only if* Bond 7+
     - **Katz:** "Okay. Yeah. I'll come. Somebody has to carry the snack cakes." — *only if* Bond 5-6
     - **Katz:** "Fine. I'll come. But I'm not sharing a tent this time." — *only if* Bond 4 or less
     - *Narrator:* Katz will fly to Maine in two weeks. I hang up and find I am grinning at a payphone. — *only if* `!refuses(s)`

# Act IV: Maine

## Scene 16: Reunion (plays as the Maine map starts)

- *Narrator:* Maine. Katz arrives with a pack on his back and a doubtful expression, looking around as if someone had promised him a hotel.
- **Katz:** "Bryson! Look at this. Trees. I missed trees. I never thought I would say that sentence." — *only if* `s.bond >= 7`
- **Katz:** "So. More woods. You really know how to show a guy a good time." — *only if* Bond 5-6
- **Katz:** "Well. I'm here. Let's not make a thing of it." — *only if* `s.bond <= 4`
- **Katz:** "I should tell you. It's been a rough few months. I had a drink. More than one. I'm back off it now."
- *Narrator:* He says it to the trees, not to me. I tell him I am glad he came. It is all I can think of, and it is true.
- *Narrator:* Ahead lies the Hundred-Mile Wilderness: no towns, no shops, no way out but the way through. We set off.

## Scene 17: E12, The River

- *Narrator:* Dark lakes, wet roots and silence. It is the most beautiful place I have ever been uneasy in.
- *Narrator:* Then a river: wide, fast and very cold, with no bridge. The far bank is close enough to see and far enough to worry about.
- **Katz:** "Okay. Arms locked, eyes front, nobody drowns. I've been practicing that speech." — *only if* `s.bond >= 7`
- **Katz:** "So we're swimming now. Great. Nobody mentioned swimming." — *only if* Bond 5-6
- **Katz:** "Go on. Tell me what the guidebook says about rivers." — *only if* `s.bond <= 4`
- **Choice menu:**
  1. Ford it together, arms locked. *(docs)*
     - Effects: `(s) => (s.stamina <= 3 ? { bond: +1, stamina: -1, supplies: -1 } : { bond: +1, stamina: -1 })`
     - *Result card:* (depends on state)
  2. Camp and wait for the water to drop. *(docs)*
     - Effects: Supplies -2, Morale -1
     - *Result card:* Two days of noodles, watching the water. It drops in the end. So does the mood.
  3. Take the long way upstream. *(docs)*
     - Effects: Stamina -1, Miles minus
     - *Result card:* Miles of bog and fallen trees to find a place to cross. My feet will be bringing this up later.

## Scene 18: E13, Katz Is Lost · night · ending check after

- *Narrator:* Late in a long, hot day, I stop to wait for Katz. He has fallen behind, as usual. Ten minutes pass. Then thirty. Then an hour.
- *Narrator:* I walk back along the trail, calling his name. Nothing. Just trees, and the light going.
- *Narrator:* In Georgia I was afraid of bears. I would take a bear now, gladly, in exchange for one complaint from Katz.
- **Choice menu:**
  1. Search off-trail at dusk. *(docs)*
     - Effects: Stamina -2, Bond +2
     - *Result card:* I crash through the woods till long after dark, shouting myself hoarse. I do not find him. I do not stop.
     - *Narrator:* The next day he is there: sitting on a rock by a logging road, scratched, filthy and alive. He left the trail to find water and could not find it again.
     - **Katz:** "I threw my water bottle away. Before I got lost. It was heavy. I know. I know."
     - **Katz:** "I heard you out there, half the night. Yelling like a moose. Don't ever stop doing that."
     - *Narrator:* I am so relieved I cannot speak. Then I can, and I use most of the words I know.
  2. Wait at the agreed spot overnight. *(docs)*
     - Effects: Morale -2, Supplies -1
     - *Result card:* I sit by the trail all night with the stove lit, listening. It is the longest night of the whole walk.
     - *Narrator:* The next day he is there: sitting on a rock by a logging road, scratched, filthy and alive. He left the trail to find water and could not find it again.
     - **Katz:** "I threw my water bottle away. Before I got lost. It was heavy. I know. I know."
     - *Narrator:* I am so relieved I cannot speak. Then I can, and I use most of the words I know.
  3. Hike out to a road for help. *(docs)*
     - Effects: Bond -1, Morale -1
     - Flags: leftWilderness = true
     - *Result card:* I walk out to a logging road in the dark to find someone, anyone. It means leaving him in there.
     - *Narrator:* The next day he is there: sitting on a rock by a logging road, scratched, filthy and alive. He left the trail to find water and could not find it again.
     - **Katz:** "I threw my water bottle away. Before I got lost. It was heavy. I know. I know."
     - *Narrator:* I am so relieved I cannot speak. Then I can, and I use most of the words I know.

## Scene 19: The Final Crossroads (on the logging road, or the roadside map)

- *Narrator:* A logging road cuts across the trail. Katahdin, the end of it all, is still a long way north, blue and enormous on the horizon. — *only if* `!s.leftWilderness`
- *Narrator:* The logging road, the morning after. Somewhere far to the north, beyond all those trees, is Katahdin and the end of the trail. — *only if* `s.leftWilderness`
- **Driver:** "You boys look about done. I can run you into town, if you want. No charge for the pitiful."
- *Narrator:* My legs are trail legs now. The hills that flattened me in Georgia are only hills. — *only if* `s.stamina >= 5`
- *Narrator:* We are spent. Every step today was a negotiation, and I lost most of them. — *only if* `!(s.stamina >= 5)`
- *Narrator:* There is food for a few more days, if nobody looks too hard at the snack cakes. — *only if* `s.supplies >= 3`
- *Narrator:* The food bags are nearly empty. Breakfast was half a candy bar and a long look at the sky. — *only if* `!(s.supplies >= 3)`
- *Narrator:* Katz stands beside me, shoulder to shoulder, looking where I am looking. — *only if* `s.bond >= 7`
- *Narrator:* Katz stands a few feet off, close enough to talk, if either of us wanted to. — *only if* Bond 5-6
- *Narrator:* Katz stands on the far side of the road. We have both become good at silence. — *only if* `s.bond <= 4`
- **Katz:** "For the record, I am still thinking about last night. Out there on my own. Just so you know." — *only if* `picked(s, 'e13_katz_is_lost', 'hikeOut')`
- **Katz:** "Or we rent a car. Worked great in Tennessee." — *only if* `s.skippedAhead`
- **Katz:** "So what now?" *(docs)*
- **Choice menu:**
  1. "Summit or nothing." *(docs)*
     - leads to the ending check with "summit"
  2. "Let's go home." *(docs)*
     - leads to the ending check with "home"
  3. "Let's finish it our way." *(docs)*
     - leads to the ending check with "ourWay"

# The Endings

Early-ending fade line: "And that's where the trail ended for us." *(docs)* While Katz is home in Iowa: "And that's where the trail ended for me."

Every ending card shows: the ending name (and tag), "You: 1,234 miles · Bryson & Katz: about 870 of 2,190" (with the player's own miles), the Bond rating, Journal entries found out of 13, Katz's final line and the lesson. In the conditions below, `s.at` is the event whose check ended the walk and `s.final` is the Final Crossroads choice.

## Broken Partnership

- *Narrator:* Katz does not come to Maine. I go to the Hundred-Mile Wilderness without him, and last three days. — *only if* `s.at === 'e11_phone_call'`
- *Narrator:* Katz flies home, and this time he does not answer when I call. I go back to the trail without him. — *only if* `s.at === 'e8_katz_goes_home'`
- *Narrator:* At the next road Katz gets a ride out. He does not make a speech. He just lifts a hand, and goes. — *only if* `!atPhone(s) && !atAirport(s)`
- *Narrator:* I walk on alone for a day. The woods are very quiet without someone complaining about them. Then I go home too.
- *Narrator:* Weeks later a package arrives from Des Moines. Inside is one Little Debbie snack cake, slightly squashed. No note.
- *Narrator:* I put it on the shelf above my desk. Maybe there is something left to fix.
- **Katz's final line on the card:** "Look after yourself out there."
- **Lesson:** *No goal is worth more than the person you take with you.* *(docs)*

## Early Departure

- *Narrator:* A motel near the trail. The map is spread across the bed, and I am staring at how much of it is left. — *only if* `!endsAlone(s)`
- *Narrator:* Katz puts his finger on Georgia instead, and drags it slowly north, over every mile behind us. — *only if* `!endsAlone(s)`
- *Narrator:* A motel near the trail, alone. The map is spread across the bed, and I am staring at how much of it is left. I pick up the phone. — *only if* Bryson is alone (Katz is home in Iowa, or the walk ends at the phone call)
- *Narrator:* Katz listens to all of it. Then he asks where we started, and where I am standing now. — *only if* Bryson is alone (Katz is home in Iowa, or the walk ends at the phone call)
- **Katz:** "We walked from there to here. On purpose." *(docs)*
- *Narrator:* He is the one doing the comforting. I cannot remember when that started, only that it did. — *only if* `s.bond >= 7`
- *Narrator:* Stopping, I decide, is not the same as failing. The trail was simply bigger than my plans for it.
- **Katz's final line on the card:** warm: "Same time next year? I'll bring the snack cakes." · neutral: "Two thousand miles was always a ridiculous number." · sarcastic: "Well. At least we're not walking."
- **Lesson:** *Stopping is not the same as failing.* *(docs)*

## Finished Trail · What if

- *Narrator:* Katahdin, at sunrise. We climb the last mile on shaking legs, above a sea of cloud. Katz complains the whole way up.
- *Narrator:* At the summit sign he goes completely silent. We take one photograph, and for a while neither of us can say anything.
- *Narrator:* This is the version the book does not have. In the real one, two tired men walked out of these woods a long way short of here.
- *Narrator:* And still it is not the sign I will remember. It is the walk, and the man I walked it with.
- **Katz's final line on the card:** warm: "All of it. I'd complain, but I'm busy being amazed." · neutral: "Great. Now how do we get down?"
- **Lesson:** *Preparation, care and stubbornness can carry you all the way.* *(docs)*

## Changed Route · The book's ending

- *Narrator:* We set off for Katahdin anyway. A few miles on we both stop, look at each other, and turn round without a word. — *only if* `s.final === 'summit'`
- *Narrator:* We walk out of the woods on the logging road, and the man in the pickup runs us into town. And that, it turns out, is that.
- *Narrator:* Later I add up the miles. It is a long way short of 2,190, even counting the ones we drove. I find I do not mind. — *only if* `s.skippedAhead`
- *Narrator:* Later I add up the miles. It is a long way short of 2,190. I find, to my surprise, that I do not mind. — *only if* `!s.skippedAhead`
- *Narrator:* We learned the woods. We learned what we could do, and what we could not. And we did it together.
- *Narrator:* "We hiked the Appalachian Trail," I tell Katz. He looks at me for a moment. "Yeah," he says. "We did." *(docs)*
- **Katz's final line on the card:** warm: "Best walk I never finished." · neutral: "We hiked it. I still think we deserve a trophy." · sarcastic: "Fine. It was good. Don't tell anyone I said that."
- **Lesson:** *The trail humbles the plan; the honest attempt is the success.* *(docs)*

# Talking to Katz on the trail

**Warm:**
- "Admit it. You'd be bored out here without me."
- "I'm not saying this is fun. I'm saying I'd do it again. Don't quote me."
- "The trail's alright, you know? Don't tell the trail I said that."

**Neutral:**
- "Nature is just outside with extra steps."
- "I'm not quitting. I'm resting aggressively."
- "If I die out here, tell people it was a bear. Not the hill. The bear."

**Sarcastic:**
- "Oh good, you're talking to me. Is that on the schedule?"
- "Keep walking. You're good at that."
- "I'm still here. Don't read into it."

**One line per map:**
- georgia: "Every tree has a white stripe on it. Either that is the trail, or someone really loves paint."
- smokies: "The sign says bears live here. I would like to speak to whoever approved that."
- shenandoah: "They built a road right next to the trail. Somebody here has my priorities. Keep following the white paint."
- maine: "A hundred miles of woods and no bears so far. I checked. You checked twice. Keep the blazes in sight."
- roadside: "A road. An actual road. I could kiss it, but I have seen what drives on it."

**Worried lines** (a stat enters its danger zone):
- stamina: "My legs have stopped speaking to me. Maybe we take it easy for a bit."
- supplies: "Tell me there's more food in that pack. Please. Lie if you have to."
- bond: "Go on ahead. I'll catch up. Or I won't. We'll see."
- morale: "Do you ever feel like the trail is winning?"

**While Katz is away** (Act III), the narrator instead:
- *Talking on the empty trail:* I turn to say something to Katz. There is nobody there, just the trail and a chipmunk with no opinions.
- *Talking on the empty trail:* Walking alone, I notice I have started commenting on the scenery out loud. The trees are a poor audience.
- *Talking on the empty trail:* It is very quiet without someone complaining about it.
- *Worried, stamina:* My legs have filed a complaint, and there is nobody here to forward it to.
- *Worried, supplies:* I check the pack twice. There is less food in it than I would like.
- *Worried, bond:* I think about the airport, and what I did or did not say.
- *Worried, morale:* Some days the trail feels very long, and very empty.

# Act cards and travel screens

- **Act card:** Prologue: Hanover (Chapter 1 · Winter)
- **Act card:** Act I: Georgia (Chapters 2–5 · March)
- **Travel:** April · Great Smoky Mountains, 165 miles. "Somewhere around mile 100, my feet file a formal complaint."
- **Act card:** Act II: The Smokies and Shenandoah (Chapters 6–11 · Spring)
- **Travel:** May · Shenandoah, Virginia, 650 miles. "Six hundred and fifty miles of Tennessee, North Carolina and Virginia, every one of them on foot."
  - with the rental car: "We drive six hundred and fifty miles in a rented car. The trail watches us go by."
- **Travel:** Summer · Pennsylvania, 190 miles. "Katz flies home to Iowa. I go home to Hanover, then back to the trail, alone."
- **Act card:** Act III: Alone (Chapters 12–18 · Summer)
- **Travel:** Late Summer · The White Mountains, 400 miles. "New Jersey, New York, Connecticut, Massachusetts, Vermont. I walk them in pieces."
- **Travel:** Late Summer · The Hundred-Mile Wilderness, Maine, 115 miles. "North again, to Maine and the last real wilderness on the trail."
- **Act card:** Act IV: Maine (Chapters 19–21 · Late Summer)

# Signs and overlooks

**North Georgia**
- *Sign:* The sign says Katahdin, Maine: 2,190 miles. At fourteen miles a day I'll be done by August. I have checked this math eleven times. → Journal: White Blazes
- *Sign:* A bronze plaque on the way up Springer Mountain. The whole trail, it says, was Benton MacKaye's idea, back in 1921. → Journal: Benton MacKaye
- *Sign:* Another plaque, for Myron Avery, who mapped and measured nearly every mile of the trail and bullied it into being. → Journal: Myron Avery
- *Overlook (Morale +1 once):* Through the bare trees, ridge after ridge fades into the rain. Every one is a mile I have to walk, and for a moment I don't mind.

**Great Smoky Mountains**
- *Sign:* Bears live here, says the sign, and lists what to do if you meet one. Katz reads it twice and walks a little closer to me. → Journal: Bear Attacks
- *Overlook (Morale +1 once):* Below, whole ridges of Fraser firs stand grey and dead. From up here the forest looks like a ghost of itself. → Journal: The Fraser Firs

**Shenandoah**
- *Sign:* Skyline Drive. A plaque says the park opened in the 1930s. It says very little about the mountain families who lived here first. → Journal: Shenandoah's Mountain Families
- *Sign:* A trail register on a post. Someone has copied out a note about Earl Shaffer, who in 1948 walked the whole trail in one go. → Journal: Earl Shaffer, 1948
- *Sign:* A faded sign shows Asher Durand's painting of an old American forest: huge trees, deep shade. Almost none of it is left. → Journal: Durand and the Lost Forest
- *Overlook (Morale +1 once):* Green ridges to the horizon. Once, a quarter of these trees were chestnuts. A blight killed nearly every one. → Journal: The Chestnut Blight

**Pennsylvania**
- *Sign:* Pennsylvania, says the sign. Hikers call it Rocksylvania. Underneath, someone has scratched: "where boots come to die."
- *Sign:* ROAD CLOSED. Past the sign the old highway to Centralia is cracked and buckled, and thin smoke leaks out of the ground.
- *Sign:* Delaware Water Gap, 40 miles. Then New Jersey, which turns out to be far wilder and prettier than its turnpike suggests.
- *Overlook (Morale +1 once):* From the ridge, farms and small towns spread out like a quilt. I wish, briefly, that there were someone here to point at it with.

**The White Mountains**
- *Sign:* A sign for the mountain huts ahead: bunks and hot dinners, high in the Whites, for those who book ahead and can pay.
- *Sign:* A sign lists the people who have died on this mountain, with dates. It is a long list, and a surprising number of the dates are in summer. → Journal: Mount Washington's Weather
- *Sign:* The payphone. I have made my call.
- *Overlook (Morale +1 once):* The Presidential Range marches off into cloud, bare and enormous. I feel very small, and oddly glad of it.

**The Hundred-Mile Wilderness**
- *Sign:* A warning sign: no supplies and no help for the next hundred miles. Do not attempt it without ten days of food. I count ours. Then I count it again. → Journal: The Hundred-Mile Wilderness
- *Overlook (Morale +1 once):* A lake lies perfectly still below, ringed with dark spruce. Somewhere a loon calls. I have stopped measuring the days in miles.

# Trail Journal

1. **White Blazes** (Chapter 1): The trail is marked by white paint blazes, about two inches by six, on trees and rocks all the way from Georgia to Maine. It runs to more than 2,100 miles, and its length shifts a little every year as sections are rerouted.
2. **Bear Attacks** (Chapter 1): Before setting out, Bryson read books about bear attacks, which he came to regret. The black bears of the Appalachians very rarely hurt anyone. But rarely is not never, and the books lingered on the exceptions.
3. **Benton MacKaye** (Chapter 3): The trail was first proposed in 1921 by Benton MacKaye, a forester and planner, as a footpath along the Appalachian ridges with camps and communities along the way. Most of his grand plan never happened. The path did.
4. **Myron Avery** (Chapter 3): Myron Avery, a lawyer from Maine, turned MacKaye's idea into an actual trail. He walked and measured it with a wheel, drove the volunteers who built it, and quarrelled with nearly everyone. It was finished in 1937.
5. **The Fraser Firs** (Chapter 6): In the Smokies, Bryson walks through stands of dead Fraser firs, killed by a tiny insect brought over from Europe by accident. He is angry at how little was done to save them, and at the Park Service's priorities.
6. **Gatlinburg** (Chapter 7): Gatlinburg sits at the edge of the Great Smoky Mountains National Park. Bryson finds it a gaudy, baffling place, all souvenir shops and pancake houses, a short walk from some of the wildest country in the East.
7. **Earl Shaffer, 1948** (Chapter 9): In 1948 Earl Shaffer, a veteran just home from the Second World War, became the first person to walk the whole trail in a single season. At first, some people refused to believe he had done it.
8. **Durand and the Lost Forest** (Chapter 10): Bryson describes a painting by Asher Brown Durand of a wild, ancient American forest. That forest, he points out, is almost all gone: very little of the East's original woodland survived the axe.
9. **The Chestnut Blight** (Chapter (verify)): The American chestnut was once one of the commonest trees in the eastern woods. Early in the 1900s a fungus from Asia began killing them, and within a few decades almost every grown chestnut in America was dead.
10. **Shenandoah's Mountain Families** (Chapter (verify)): To make Shenandoah National Park in the 1930s, the government moved out the families who lived in the hills, many against their will. Bryson notes how little of their story the park chooses to tell.
11. **Centralia** (Chapter (verify)): Centralia, Pennsylvania, sat on a seam of coal that caught fire in 1962 and has burned underground ever since. Smoke rose through the streets, the ground sagged, and nearly everyone was moved away.
12. **Mount Washington's Weather** (Chapter (verify)): Mount Washington has some of the worst weather on Earth: in 1934 a wind of 231 miles an hour was measured at its summit. More than a hundred people have died on its slopes, many of them in summer.
13. **The Hundred-Mile Wilderness** (Chapter 19): The Hundred-Mile Wilderness in Maine is the most remote stretch of the whole trail: a hundred miles of forest, bog and lake with no towns, no shops and only logging roads. Hikers are told to carry food for ten days.
