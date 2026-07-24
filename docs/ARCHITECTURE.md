# Architecture (draft — finalizes after ENGINE-FLOW is confirmed)

## Modules (map 1:1 to engine stages)

| Module | Stage | Responsibility |
|--------|-------|----------------|
| `capture` | 0 | Idea intake, hypothesis builder, assumption ranking |
| `validate` | 1 | Interview prompts, demand experiments, signal scoring, kill/pivot/build |
| `offer` | 2 | Offer + positioning drafting and message testing |
| `launch` | 3 | One-job MVP scoping, launch surface, first-customer motion |
| `traction` | 4 | Metrics capture, dashboards, push/pivot/stop signals |

## Data model (first pass)

- `users` — founder accounts
- `ideas` — one row per idea; belongs to a user
- `hypotheses` — problem, buyer, promised_change, why_now, status
- `assumptions` — text, risk, uncertainty, rank, idea_id
- `experiments` — type (interview | waitlist | landing | pilot), status, results
- `signals` — experiment_id, ladder (weak|medium|strong), score_0_12, notes
- `decisions` — idea_id, cycle, outcome (kill|pivot|build), evidence_ref, dated
- `offers` — idea_id, promise, icp, positioning
- `motions` — idea_id, contacts, cadence, conversions
- `metrics` — idea_id, date, conversations, pilots, activation, revenue

## AI usage (assist, never bless)

- Generate **non-leading** interview prompts from a hypothesis.
- Summarize interview notes into structured pain/urgency/budget signals.
- Suggest a **signal score** (human confirms).
- Draft offer lines and positioning variants for the founder to test.
- Never auto-declares an idea "validated" — only the evidence gate does.

## Shared with marketing site

- Design tokens (dark theme, cyan primary, pink accent, Geist) copied from nexa-brains.
- Reusable UI primitives where practical.

## Deploy

- Vercel project; Postgres via Supabase/Neon; env-based secrets.
