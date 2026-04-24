---
title: Where Latchkey Is Right Now
date: 2026-04-24
author: Chaz
excerpt: Progress notes on Latchkey, the idle RPG I've been building. The combat loop, the hero stats, the ability cards, and two different gacha systems that each feel like something physical you would dig through as a kid.
tags: [latchkey, idle-rpg, ios, spritekit, swiftui, gacha]
readMinutes: 7
ogImage: /images/latchkey-update.png
ogImageAlt: The word LATCHKEY in a bold pixel font, with Sam (the kid hero) holding a baseball bat below it, above the word UPDATE.
---

<img src="/images/latchkey-update.png" alt="Latchkey update title card with Sam holding his bat." style="image-rendering: pixelated; border: 0; width: 100%; height: auto; margin: 1em 0;" />

Latchkey is an idle RPG where a kid named Sam auto-battles corrupted suburban enemies with a small army of imagination-powered toy companions. The pitch, in one line, is Earthbound energy in a cul-de-sac. I've written about the Mac Mini that chips away at this game overnight, but this post is about what the game itself actually does now, because the last few weeks have been big.

## Start with the sixty-second loop

I wanted Latchkey to feel different from most idle RPGs. Fair gacha pulls, a modern setting, beautiful pixel art steeped in nostalgia. Everything about an idle RPG lives or dies on the first minute, so I wanted the first minute to be about play, not about tapping through screens.

<figure style="margin: 1.5em 0;">
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; align-items: end;">
    <img src="/images/latchkey-house-bungalow.png" alt="A yellow bungalow." style="border: 0; margin: 0; width: 100%; height: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-house-colonial.png" alt="A navy-roofed colonial." style="border: 0; margin: 0; width: 100%; height: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-house-craftsman.png" alt="A brown-timber craftsman." style="border: 0; margin: 0; width: 100%; height: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-house-victorian.png" alt="A purple victorian." style="border: 0; margin: 0; width: 100%; height: auto; image-rendering: pixelated;" />
  </div>
  <figcaption style="text-align: center; font-style: italic; margin-top: 10px; color: var(--ink-2); font-size: 0.9em;">A few houses on Sam's block.</figcaption>
</figure>

When you open Latchkey, you jump right in. Sam is already running through the suburbs, already swinging at the first corrupted neighbor, already picking up Pocket Change. Damage numbers float up. A wave meter at the top inches forward. And the whole thing is built so the fight never pauses. You can pop open a menu, swap out a piece of gear, check your quests, tinker with your ability deck, and pop back to find Sam still mid-punch, the coin fountain still running, the wave meter still creeping. It's a small thing that cost me weeks to get right, and it's the single biggest reason the game feels like a living place instead of a menu simulator.

Still missing: an intro story that leads into the first stage, and a pixel artist to design the animated sequence that sets it up. Right now the game just starts. Some people will like that. Most will want the context, and they should get it.

## Stats, slowly becoming a real system

This is the part that has evolved the most. When I started, "stats" meant HP, attack, and a level number. Now:

- **Heroes level up** from combat XP. Sam gets stronger on a tuned curve that I've rebalanced about four times based on how the early game actually feels.
- **Gear drops** across four rarity tiers, with slot assignments, duplicate fusion for enhancement, and ascension by merging duplicates into a higher rarity.
- **Set bonuses** activate when you have two or more pieces from the same thematic set equipped. They are still a little invisible in the UI right now, and surfacing them better is on the list.
- **Companions** (the toys, the friends, the thing the game is actually about) each have their own level, their own scaling, and their own place in the party.

<figure style="margin: 1.5em 0;">
  <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; align-items: center; justify-items: center;">
    <img src="/images/latchkey-gear-dads-golf-club.png" alt="Dad's Golf Club." style="border: 0; margin: 0; height: 80px; width: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-gear-garden-hose-whip.png" alt="Garden Hose Whip." style="border: 0; margin: 0; height: 80px; width: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-gear-football-shoulder-pads.png" alt="Football Shoulder Pads." style="border: 0; margin: 0; height: 80px; width: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-gear-bike-helmet.png" alt="Bike Helmet." style="border: 0; margin: 0; height: 80px; width: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-gear-fanny-pack.png" alt="Fanny Pack." style="border: 0; margin: 0; height: 80px; width: auto; image-rendering: pixelated;" />
    <img src="/images/latchkey-gear-band-aid.png" alt="Band-Aid." style="border: 0; margin: 0; height: 80px; width: auto; image-rendering: pixelated;" />
  </div>
  <figcaption style="text-align: center; font-style: italic; margin-top: 10px; color: var(--ink-2); font-size: 0.9em;">Six pieces of loot: two weapons, two pieces of armor, two accessories.</figcaption>
</figure>

None of those pieces are individually exciting. They don't look like much in a screenshot. Together they are the progression lattice the idle loop pulls on: fight, loot, equip, level, push further. It is the oldest shape in the genre, and getting it to actually feel good is most of the work.

The moment I knew it was working was the first time I got a full matching gear set onto Sam. The set bonus flash fires. His damage jumps a visible chunk. The next enemy goes down in one hit instead of three, and the one after that in half a second. I sat up on the couch. None of that is revolutionary game design, but you can feel in your body when a progression chain is clicking, and that was the click.

## Abilities: a real pivot

For months, the game had one ability per companion, and you tapped companion buttons in combat to trigger them. That shipped. It worked. But it had a quiet problem I couldn't stop noticing. Want a defensive build? Bench your attackers. Want more area damage? Bench the single-target toys. The party you ended up fielding was the party that did the thing, not the party you actually wanted to hang out with. The companion **was** the ability, and choosing your build meant benching your friends.

So a few weeks ago I tore that out and built **The Binder**, the second gacha in the game, which does abilities as trading cards. Your companions still fight alongside you, but the abilities themselves come from a three-card loadout you pick from your collection. Each card has a type (Strike, Area, Buff, Drain, Summon), a rarity, and a flavor quote that tries very hard to sound like something a ten-year-old wrote on the back of a trading card.

![The Binder — the Common page of the collection view, showing three cards: Thunderclap, Hex, and Iron Will.](/images/latchkey-the-binder.png)

The swap quietly solved a pile of boring problems I didn't love having. There's no new currency to explain, because The Binder pulls from the existing Dig Token pool. There's no new pity system to balance, because it shares the same pull engine as the Cereal Box. And the first time you ever open The Binder, the game just hands you a guaranteed three-card starter pack, so day one feels like finally getting a deck instead of being told to go grind for one.

Anyone who has shipped a gacha will tell you the boring wins are the real wins. Reusing the existing pull engine for a second banner saved me a month of work I very much did not want to do.

## Gacha: two flavors of digging through something

The game's first gacha is the **Cereal Box**, which is exactly what it sounds like. You spend Tokens. The box sits on the screen like an enormous cereal box on a grocery shelf. As your pity meter builds, the cereal inside visually drains. On a hard-pity pull the box tips over and a golden toy falls out with a seven-second, full-screen legendary reveal. Common pulls resolve in under a second. Epic and Legendary get progressively more dramatic.

The Binder is the second gacha and feels like the counter of a card shop at the mall. Packs slide in. You tear the foil. Cards fan out. You tap to flip. Duplicates convert to a separate card currency for later use. The two gachas are deliberately different diegetic experiences, even though they share most of the code underneath.

The newest thing in this space is a **per-banner pull level**, a mechanic I lifted from another gacha I study religiously. Each banner has its own XP bar and level, and Legendary drops are flat-out locked until you hit Pull Level 6. The reason I wanted it is selfish: one of my favorite moments in any gacha is the first Legendary pull, and I hate watching that moment get burned on someone's very first ticket. Locking Legendaries behind a few pulls' worth of progress means the "whoa" lines up with actually having earned the "whoa." Early pulls still feel good. Epic cards still drop. Rarity still matters. You just can't short-circuit the whole collection curve on your first try.

## Companions, the other half

Companions are toys. Your GI Joe. Your plush frog. Your Polly Pocket. When the kid's imagination is strong enough, they come to life and fight with you. You get them from the Cereal Box, from story milestones (a few are locked to narrative beats and never drop from a pull), and sometimes from events. Duplicate companions convert into shards used for awakening, which is our version of the "pull the same unit enough times and it gets scarier" pattern.

Right now the roster is ten companions across five rarity tiers, each with their own base stats and party role. That's deliberately small. I would rather ship a playable cast I can actually balance than launch with forty characters who are all kind of the same.

## Where it is, honestly

- Act 1 of the story is fully playable end to end.
- Combat feels good. Measurably so. I keep losing ten minutes to it when I meant to be testing a specific bug.
- Gear has all its systems but could use a surfacing polish pass.
- Both gachas, the Cereal Box and The Binder, are shipping and tuned.
- IAP wiring is the next big piece. The monthly Cereal Club card is the feature I'm most looking forward to.
- Content for Acts 2 and 3 is scoped but not built.

Latchkey isn't shippable yet, but it feels like a game now instead of a tech demo, and that's the transition I was waiting to be able to write about. If you want to hear when it's ready for a small test group, email me at [hello@bsidesstudio.com](mailto:hello@bsidesstudio.com) and I'll put you on the list.
