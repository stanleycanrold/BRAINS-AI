# BRAINS-AI

**The 0→1 validation & startup engine.** BRAINS helps founders validate ideas and take them to market with evidence — not documents.

> Product truth: validation → offer → launch path → first customers, inside one SaaS workflow. Not GTM writeups, not strategy PDFs, not document generation.

- Marketing site: [nexa-brains (BRAINS)](https://github.com/stanleycanrold/nexa-brains) → https://nexa-brains.vercel.app
- This repo: the **application / engine**.

## Status

🚧 Scaffolding. The engine flow below is a **proposed working model** — confirm or correct it before we build the app logic (see `docs/ENGINE-FLOW.md`).

## What it does (at a glance)

A founder brings a raw idea. BRAINS walks it through an evidence-first pipeline and comes out the other side with either a killed idea (cheaply), a pivot, or a validated wedge with a path to first customers.

## Tech (proposed)

- **Next.js (App Router) + TypeScript** — same stack as the marketing site for shared components/design
- **Tailwind** — shared design tokens with nexa-brains
- **Postgres (Supabase/Neon)** — ideas, experiments, signals, decisions
- **Auth** — Supabase Auth / Clerk (TBD)
- **AI layer** — LLM-assisted interview prompts, signal scoring, offer drafting (assist, never replace market contact)
- **Deploy** — Vercel

## Docs

- `docs/ENGINE-FLOW.md` — the step-by-step engine (confirm this first)
- `docs/ARCHITECTURE.md` — modules, data model, AI usage
- `docs/ROADMAP.md` — MVP → v1 phases

## Principles

1. Evidence over opinions — including our own.
2. Behavior over compliments.
3. Workflows over binders.
4. One-job MVPs over platform fantasies.
5. Honest kill decisions over sunk-cost theater.
6. AI assists the loop; it never blesses an untested idea.
