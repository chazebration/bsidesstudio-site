---
title: Teaching a Computer to Read a Knitting Pattern
date: 2026-04-24
author: Chaz
excerpt: Knitting patterns are half-structured, half-prose, full of shorthand, and every designer has their own dialect. Here's how I built the engine inside Skein that turns any of them into a step-by-step follow-along.
tags: [skein, ai, pattern-parsing, claude-api, ios]
readMinutes: 6
ogImage: /images/skein-social.png
ogImageAlt: The Skein wordmark in a warm serif, with a hand-drawn yarn skein trailing from the S, subtitled "Knitting pattern engine."
---

![Skein, the knitting pattern engine.](/images/skein-social.png)

Here is a line from a real knitting pattern: `Row 7 (RS): K2, *K3, YO, SSK; rep from * to last 2 sts, K2.` If that reads like a license plate to you, congratulations, you are the target user for Skein, the iOS app I've been building for knitters and crocheters who just want to follow a pattern without doing math on a sticky note. The pitch is simple. Import a pattern. Get a clean, tappable, teleprompter-style view that remembers your place. Behind the scenes there is a small engine chewing on raw pattern text and turning it into structured steps, and building that engine has been one of the most fun problems I've gotten to work on in years.

## The problem, in three bullets

- Knitting patterns are half-structured, half-prose.
- Every designer has their own dialect, sometimes within the same pattern.
- Getting it wrong by one row, thirty rows in, is a disaster.

That last one is the whole reason this thing needs to be good. A misread stitch count doesn't show up as a crash or a red squiggle. It shows up as a lace shawl that is gently, invisibly, wrong until you can't un-see it.

## First pass: throw it at an AI and pray

The first version of the parser was a one-shot. Extract the text from a PDF, hand the all of it to Claude, ask for JSON back. That got me to about 70% accuracy on a test set of ten real patterns, which sounds passable until you remember that 30% of rows being wrong is, uh, not great for the knitter.

It also taught me two important things. First, the model was actually quite good at the easy parts: casting on, basic ribbing, standard abbreviations, the stuff a human would also get right on the first read. Second, it was willing to guess on the hard parts without telling me. That second bit is what I had to fix.

## What the engine actually does now

The pipeline is less glamorous than "just ask the LLM," and that's the point. It goes:

1. **Extract.** PDFKit pulls text out of the uploaded PDF on-device. We try to do as much as we can before a token ever hits the wire.
2. **Parse.** The text goes to a Supabase Edge Function that talks to Claude with a tight system prompt and a strict JSON schema. Sections stay as sections (Back Panel, Sleeve, Ribbing). Rows keep their instructions, their stitch counts, and a plain-language translation. Multi-size patterns keep every size, not just one.
3. **Flag uncertainty.** This is the most important part. The prompt tells the model to flag anything ambiguous, with the original text and two or three possible interpretations, rather than silently picking one.
4. **Ask the human.** Uncertain sections route into a wizard flow where you, the knitter, pick the interpretation that matches what the designer meant. Your pick gets stored as an override so the app never has to ask again.
5. **Render.** The clean, structured pattern lands in the teleprompter view. Repeats get expanded at display time into individual tappable steps, so "Rep rows 3 to 4, five more times" becomes ten real rows you walk through one by one.

The whole thing is designed around one idea: get it right 99% of the time so you can get back to crafting. But when needed the knitter can review its mistakes before the pattern ever matters.

## The feedback loop that got us to 95%

The thing that actually moved the accuracy number was boring. A folder of ten hand-picked test patterns, a shell script that ran each one through the parser, and a results file I could eyeball. A simple scarf. A ribbed hat. A granny-square crochet thing. A multi-size cardigan. An intentionally ambiguous pattern I built myself to break things.

Every iteration looked the same. Run the suite. Read the outputs side by side with the originals. Find the new failure mode. Tighten the prompt, or tweak the schema, or add an abbreviation to the canonical list. Commit. Re-run. Over a few weeks, that loop climbed from 70% to about **95%**.

The last 5% is where it gets interesting. Cables. Charts. Stitch diagrams. Multi-size instructions where the stitch counts change across columns. The kind of dialect where a designer invents a new abbreviation on page two without defining it. Each of those is a prompt problem, a schema problem, and a UI problem, usually all at once.

## What I've learned

- **Flag more than you guess.** I would rather show a knitter a "hey, does this look right?" card twice per pattern than silently ship a wrong stitch count once.
- **Structured output is load-bearing.** Getting the model to return strict JSON that conforms to a schema is the difference between a parser and a vibes machine.
- **On-device pre-processing earns you accuracy and dollars.** Text extraction before the LLM call trims tokens, lowers cost, and gives the model cleaner material to work with.
- **Fixtures beat vibes.** A scrappy folder of ten patterns plus a shell script beat every clever evaluation framework I almost set up instead.

## Where it's going

Skein isn't ready for the App Store yet. The follow-along view is the next big piece, basic monetization comes after that, and I still have a pile of weirder import sources to go (web URLs, Ravelry). But the engine, the part I was most nervous about a few months ago, now feels like a thing I understand. There's a lot more to do to get it as accurate as possible, but I may jump to iterating more on the UI while Claude works on the engine accuracy.

If you knit or crochet and you have a favorite pattern that has absolutely wrecked other apps you've tried, I would love to throw it at Skein and see what happens. Drop it in an email to [hello@bsidesstudio.com](mailto:hello@bsidesstudio.com).
