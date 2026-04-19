---
title: I Built a Mac Mini That Works While I Sleep
date: 2026-04-18
author: Chaz
excerpt: I turned a Mac Mini in my office into a small autonomous dev team. It reads briefs I leave it at night, runs Claude Code during the day, and ships me a digest when I wake up. Here's what I built, why it's been fun, and what's broken.
tags: [autonomous-agents, claude-code, infrastructure, mac-mini]
readMinutes: 6
---

I've been running a weird little experiment for a few weeks now and it finally feels worth writing about. There is a Mac Mini on a shelf in my office, an M4 with 24GB, nothing special, and every weekday morning at 9am it wakes up, reads a file of briefs I wrote the night before, and gets to work. It ships me an email digest when it's done. I call it the Autonomous Mac Mini. I also sometimes just call it "the agent," because that's what it is.

This is the first post on the new B·Sides blog, and it felt right to start with the thing that's been quietly rearranging how I work.

## Why

The pitch to myself was simple: **I'm one person running a studio, and I keep running out of evenings.** What if I could write down the thing I want done ("update the Skein row counter to handle lace-weight yarn," "triage the Latchkey issue list," "draft a new App Store screenshot set") and then… go to bed? And what if, when I woke up, some of those things were just *done*, or at least meaningfully further along?

Claude Code can already do real engineering work when I drive it. So the question was really: can I drive it asynchronously? Can I batch my intent and let something else run the loop?

Turns out, yes, mostly. With caveats. Lots of caveats.

## The Shape Of It

The rough architecture ended up like this:

- **Two users on the Mac Mini.** My regular one, and a dedicated `agent` user with no sudo, no iMessage, no Safari bookmarks. The agent user's entire life is `~/projects`. It does not know my Netflix password. It does not *need* my Netflix password.
- **A briefs repo** called `_briefs` where I write Markdown instructions the night before. Each entry has a project name, a goal, and any context or constraints. I learned to keep these tight. Vague briefs produce vague PRs.
- **An orchestrator** that runs via `launchd` every weekday at 9am. It reads the briefs, figures out which projects have active work, and asks a local Ollama model (qwen2.5-coder:14b, in case you were wondering) to do a first-pass triage: parsing, prioritizing, and filtering out anything that's clearly not ready. Using a local model for this keeps the cost down and the iteration loop fast.
- **Then Claude Code takes over.** For each project with real work, the orchestrator spins up a Claude Code session inside that project's repo, on a `staging` branch, with the brief as context. Each session has a timeout, a retry policy, and a fallback cascade. If Claude hits a wall, the system tries OpenCode, then Gemini. Nothing ever touches `main`.
- **Notifications** via `ntfy.sh` in real time while sessions run, and an email digest at the end of the day. The digest tells me what each session did, what branches got pushed, and what went sideways.
- **Archival.** Completed briefs migrate to a `done/` folder so I can look back and see what the agent actually accomplished vs. what I *thought* I asked for. Those rarely match perfectly. That's fine.

If that sounds like a lot of moving pieces, it is. But the separation is the whole point: the agent user can't touch anything important, the orchestrator is the only thing with keys to the kingdom, and every session is boxed into its own project and its own branch.

## Pattern Analysis (The Feature I've Been Iterating On)

One of the things the agent has been chipping away at lately is a feature in Skein I've been calling **pattern analysis**. The idea is to get an AI to actually read a knitting pattern, decode it, and translate it into something the app can use.

Turns out knitting patterns are a weirdly hard parsing problem. They're half-structured, half-prose, full of shorthand like "k2, p2, rep from *," and every designer has their own dialect. My first pass landed around 70% accuracy, which sounds fine until you picture a knitter thirty rows into a lace shawl realizing the thing is just… off.

So I built a feedback loop. The agent runs a pattern through. I review the output against the source, we figure out where it lost the thread, and iterate on the approach (tighter prompts, better pre-processing, a sturdier schema). A few weeks of that and accuracy climbed to about **95%**.

I'm still feeding it harder stuff like cables, charts, multi-size instructions, and the weird corner-case patterns, because every new failure mode teaches me something about the parsing layer. The last 5% is where it gets interesting.

## What's Working

- **Writing briefs in the evening has changed my relationship with end-of-day.** Instead of that low-grade "I should be working" hum, I can dump the ideas into the file and trust they'll get a shot tomorrow.
- **Staging branches, always.** Not once has the agent done something I couldn't reject by just… not merging. That's the whole safety story in one sentence.
- **The email digest is surprisingly motivating.** I look forward to it the way I used to look forward to `git pull` on a team project. The machine has been busy.

## What's Broken (Or At Least Weird)

- **Token costs are real.** I'm on Claude Max, which keeps this sane, but it's the single biggest thing I watch.
- **Brief ambiguity is the #1 failure mode.** If I write "clean up the Latchkey dialogue system," I'll get back a PR that technically "cleaned something up" but didn't touch the thing I was thinking about. Fix: write briefs like you're writing them for a new hire. Context first. Goal second. Acceptance criteria third.
- **Debugging is harder when you're not there.** When a session fails at 10:47am and I find out at 6pm, the context is stale. I've been building more logging into each session so I can reconstruct what happened without re-running it.
- **It's lonely.** Like, for the Mac Mini. I hope.

## Where It's Going

Next up:

1. Better brief templates. A little CLI that compiles a brief from a few questions, so I'm not staring at a blank file.
2. Cross-session memory. Right now each session is a clean room; I want the agent to be able to say "oh, last Tuesday we tried this and it didn't work, let's not re-try it."
3. More projects. Right now the rotation is Skein, Latchkey, Wether, this website, and a couple of private things. I'd like to get to the point where I can dump a new idea into the briefs file and watch it grow into something over a week.

If you're thinking of building something like this yourself: **start smaller than you think you need to.** My first version was one shell script and one brief. That worked for about four days, which is way longer than I'd have guessed. The whole orchestrator-and-Ollama-and-ntfy stack came after the idea had already proven itself on a Post-it note.

Anyway, hi, welcome to the B·Sides blog. I'll be writing more of these as I go. If you want to yell at me about this, my inbox is [hello@bsidesstudio.com](mailto:hello@bsidesstudio.com).

Now go find out w(h)ether the we(a)ther is good or bad. ☀️
