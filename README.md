# B·Sides Studio

Source for [bsidesstudio.com](https://bsidesstudio.com) — the B·Sides Studio marketing site.

## Stack

- **Astro 6** with **React 19** islands (`GameArt` canvas)
- **Cloudflare Pages** hosting + **Pages Functions** (the contact endpoint)
- **Resend** for the contact form
- **Buttondown** for the newsletter

## Requirements

- Node `>= 22.12`
- npm

## Local dev

```sh
npm install
npm run dev       # http://localhost:4321
```

## Commands

| Command              | What it does                              |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Local dev server with HMR                 |
| `npm run build`      | Static build to `./dist/`                 |
| `npm run preview`    | Preview the production build              |
| `npm run astro ...`  | Astro CLI (e.g. `astro check`)            |

## Project layout

```
functions/api/contact.ts   Cloudflare Pages Function — POST handler for the contact form
src/
  components/              Astro + one React island (GameArt.jsx)
  content/blog/            Markdown blog posts (files starting with `_` are ignored)
  content.config.ts        Blog collection schema
  data/games.ts            Static game catalog used by workbench + detail pages
  layouts/BaseLayout.astro Shared <head>, nav, footer, contact modal
  pages/                   Routes (incl. [slug] pages, rss.xml.ts, 404.astro)
  styles/global.css        All base styles + palette variables
public/                    Static assets served from /
```

## Environment variables

Set these in Cloudflare Pages → Settings → Environment variables.

| Variable                    | Required | Purpose                                                                 |
| --------------------------- | -------- | ----------------------------------------------------------------------- |
| `RESEND_API_KEY`            | yes      | Resend API key with send permission for `bsidesstudio.com`              |
| `CONTACT_TO`                | no       | Override recipient (default: `hello@bsidesstudio.com`)                  |
| `CONTACT_FROM`              | no       | Override sender (default: `B·Sides Studio <no-reply@bsidesstudio.com>`) |
| `CONTACT_ALLOWED_ORIGINS`   | no       | Comma-separated Origin allowlist; `.pages.dev` and localhost are always allowed |

For abuse protection, also enable a **Cloudflare Rate Limiting** rule on `/api/contact` in the dashboard (e.g. 5 requests per 10 minutes per IP).

## Adding a blog post

Create `src/content/blog/<slug>.md` with frontmatter matching `src/content.config.ts`:

```md
---
title: Post title
date: 2026-05-01
author: Chaz
excerpt: One-sentence blurb that shows in listings + RSS + social cards.
tags: [tag-one, tag-two]
readMinutes: 6
draft: false
---

Markdown body.
```

Files prefixed with `_` (like `_template.md`) are excluded from the collection.

## Deploy

Cloudflare Pages auto-deploys from `main`. Previews ship for every branch.
