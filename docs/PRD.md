# BRAINS AI — Product Requirements Document (PRD)

**Version:** 0.1 (draft for build)
**Owner:** Stanley Canrold
**Last updated:** 2026-07-24
**Scope of this PRD:** The **Validation Engine** — from idea capture through validation feedback and the iteration loop. Go-to-market, marketing funnels, and the full product-lifecycle "kill / change / pass" verdicts are referenced as future phases but are **out of scope for build** here.

---

## 1. Summary

BRAINS AI is the 0→1 validation & startup engine. A founder brings a raw idea (or an existing product). BRAINS captures the **full context**, strengthens the idea with lightweight research, runs **validation** (a free/slow social-listening track and a paid **fast track** with real human interviews), and returns a **decision-grade feedback report** — a strong yes / no signal with AI-powered next steps. The founder then rebuilds or adjusts and repeats the loop.

This PRD covers the four stages the founder experiences:

1. **Entry point** — capture the idea + full build context (persisted).
2. **Research & strengthening** — social + web research; propose improvements.
3. **Validation** — slow track (social listening) and fast track (paid human interviews), ending in an analytics feedback window with AI next steps.
4. **Iterate** — rebuild / change, then repeat the loop.

---

## 2. Goals & non-goals

### Goals
- Persist a **complete, evolving context** for every idea/product so the whole system reasons with full history.
- Give founders a **fast, honest validation signal** without months of guesswork.
- Offer a **paid fast track** that delivers real interview-based evidence in **1–2 weeks**.
- Produce a **decision-grade report**: strong yes / weak / no, with confidence and AI next steps.
- Support an **iteration loop** so ideas evolve and are re-validated.

### Non-goals (this phase)
- Marketing funnels, ad creation, GTM automation.
- Full lifecycle portfolio verdicts across many products (future).
- Building the founder's actual product/MVP for them.
- Document/deck generation as an output (explicitly avoided — evidence, not paperwork).

---

## 3. Personas

- **Idea-stage founder** — has a concept, no product yet. Needs to know if it's worth building.
- **Building founder** — already has an app/MVP. Needs validation of demand, positioning, or a pivot.
- **Operator/PM** — validating a new feature or line inside an existing company.
- **(Internal) BRAINS analyst** — fulfills fast-track interviews and reviews AI analysis before it ships to the founder.

---

## 4. End-to-end user flow

### Stage 1 — Entry point (Idea + context capture)
The founder types in:
- **The idea** — what it is, in their words.
- **What they're building** — product description.
- **Stage** — `idea` | `prototype` | `live_product` (already built).
- **Optional context** — target user, problem, current traction, links (site, repo, deck), competitors.

Requirements:
- All of this is **saved to the database** as the idea's **context record**. This context is the backbone the rest of the system reasons over, and it is **versioned** (every meaningful change creates a new context revision).
- If `stage = live_product`, capture existing assets (URL, app store links, current metrics if provided) so validation accounts for real usage.
- A founder can have **multiple ideas**; each is its own workspace with its own context and history.

**Acceptance criteria**
- [ ] Founder can create an idea with title, description, build stage, and optional fields.
- [ ] Context is persisted and retrievable in full by every downstream stage.
- [ ] Editing context creates a new **context revision** (old revisions retained).
- [ ] Autosave; no data loss on refresh.

### Stage 2 — Research & idea strengthening
BRAINS runs **lightweight research** to sharpen the idea before spending validation effort.
- **Web search** for the problem space, existing solutions, and market signals.
- **Social scan** for where the problem/topic is discussed.
- AI synthesizes findings and **proposes concrete changes** to make the idea stronger (sharper ICP, clearer problem, differentiation, risky-assumption callouts).

Requirements:
- Research is **grounded** — every proposed change cites what prompted it (a source, a competitor, a discussion).
- Founder can **accept / reject / edit** each proposed change. Accepted changes update the context (new revision).
- Research output is stored and attached to the idea (re-runnable on later iterations).

**Acceptance criteria**
- [ ] System runs web + social research from the saved context.
- [ ] Returns a structured "strengthen your idea" set of suggestions, each with a reason/source.
- [ ] Founder can apply suggestions; applied ones update context revision.
- [ ] Research run is timestamped and stored for the audit trail.

### Stage 3 — Validation
Two tracks. The founder chooses (or runs slow first, then upgrades to fast).

#### 3a. Slow / Normal track — Social listening (self-serve)
- Integrate social platforms + web to **find spaces where people discuss the same problem** (threads, communities, posts, questions).
- Score and cluster the evidence: how often the problem appears, intensity of language, existing workarounds, willingness signals.
- Output feeds the same feedback/analytics window (Stage 3c) with a **social-evidence confidence level**.

**Acceptance criteria**
- [ ] System surfaces real discussions matching the problem, with links and context.
- [ ] Evidence is scored/clustered (frequency, intensity, sentiment, workaround mentions).
- [ ] Results populate the feedback window with a confidence indicator.

#### 3b. Fast track — Paid human interviews (managed)
The premium path. BRAINS contacts interviewees and niche experts, talks to them about the problem, and returns analyzed feedback in **1–2 weeks**.

Flow:
1. Founder opts into fast track.
2. Founder selects **how many people** they want us to talk to (interviewees and/or niche experts).
3. System generates an **estimate/quote**: **per-interviewee price + an analysis fee**, shown before commitment.
4. Founder approves and pays (or approves; payment integration TBD).
5. Internal BRAINS analysts (with AI assist) run the interviews, capture notes, and analyze.
6. Delivery target: **1 week (or up to 2 weeks)** depending on count/complexity.
7. Results flow into the feedback/analytics window (Stage 3c).

Requirements:
- **Quote engine**: `estimate = (per_interviewee_rate × count) + analysis_fee`. Rates configurable; show a clear breakdown and ETA before approval.
- Distinguish **interviewees** (target users) vs **niche experts** (may carry different rates).
- **Interview workspace** (internal): schedule, capture structured notes, tag signals per interview.
- Founder sees **status/progress** (e.g. "3 of 8 interviews complete") and the delivery ETA.
- A **human analyst reviews AI analysis before it's released** to the founder (quality gate).

**Acceptance criteria**
- [ ] Founder selects interviewee/expert counts and sees an itemized quote + ETA before approving.
- [ ] Approval creates a fast-track order with status tracking.
- [ ] Internal tooling captures per-interview structured notes and signal tags.
- [ ] Founder sees live progress and receives the final report within the promised window.

#### 3c. Feedback & analytics window (both tracks)
A single **decision-grade** view that answers: *did this validate?*
- **Verdict**: `strong_yes` | `lean_yes` | `mixed` | `lean_no` | `strong_no`, with a **confidence score**.
- **Evidence summary**: what we heard/found, signal strength distribution (weak/medium/strong), representative quotes/links.
- **Analytics visuals**: signal breakdown, sentiment, demand indicators, (fast track) interview-by-interview scoring.
- **AI-powered next steps**: specific, prioritized recommendations — e.g. narrow the ICP, sharpen the offer, run a pricing test, pivot the wedge, or "kill this and here's why."
- Clear **primary action**: iterate, upgrade to fast track, or proceed toward build/market (future phase).

**Acceptance criteria**
- [ ] One window shows verdict + confidence + evidence + analytics + AI next steps.
- [ ] Verdict logic is explainable (which signals drove it).
- [ ] Founder can export/share the report (link-based; not a "generated deck" product).

### Stage 4 — Iterate (rebuild / change / repeat)
- After feedback, the founder can **edit the idea/context** (new revision) or **spin a new validation cycle**.
- The system keeps **cycle history** so improvement (or decline) is visible across iterations.
- Each cycle references the prior verdict so trends are trackable (this powers the future "kill / change / pass" portfolio view).

**Acceptance criteria**
- [ ] Founder can start a new validation cycle from an updated context.
- [ ] All cycles are retained and comparable (verdict over time).
- [ ] The loop can repeat indefinitely without losing history.

---

## 5. Data model (first pass)

- `users` — founder accounts (auth).
- `ideas` — id, user_id, title, current_stage (`idea|prototype|live_product`), created_at, status.
- `idea_context_revisions` — id, idea_id, revision_no, description, product_desc, stage, target_user, problem, assets (jsonb: links/metrics/competitors), created_at. **Full context lives here; versioned.**
- `research_runs` — id, idea_id, context_revision_id, type (`web|social`), status, findings (jsonb), created_at.
- `research_suggestions` — id, research_run_id, suggestion, rationale, source_url, status (`proposed|accepted|rejected`).
- `validation_cycles` — id, idea_id, context_revision_id, track (`slow|fast`), status, verdict, confidence, created_at, completed_at.
- `social_evidence` — id, cycle_id, platform, url, excerpt, signal_strength (`weak|medium|strong`), sentiment, cluster_tag.
- `fast_track_orders` — id, cycle_id, interviewee_count, expert_count, per_interviewee_rate, expert_rate, analysis_fee, total_estimate, currency, status (`quoted|approved|in_progress|delivered`), eta, created_at.
- `interviews` — id, order_id, type (`interviewee|expert`), status (`scheduled|done`), notes (structured), signal_strength, tags, analyst_id.
- `verdicts` — id, cycle_id, verdict, confidence, evidence_summary (jsonb), next_steps (jsonb), released_at, reviewed_by.
- `audit_log` — who/what/when across context, orders, verdict release.

---

## 6. Integrations

- **Web search** — for problem-space and competitor research.
- **Social platforms** — listening/scanning for problem discussions (start with the highest-signal platforms for the ICP; expand later). Respect each platform's API terms and rate limits.
- **AI/LLM** — idea strengthening, research synthesis, non-leading interview prompt generation, signal scoring assistance, verdict explanation, next-step recommendations.
- **Payments** — quote approval + charge for fast track (provider TBD).
- **Scheduling/comms** — for fast-track interview coordination (internal, phase 2 of build).

> AI **assists**; it never unilaterally declares an idea validated. Verdict is driven by the evidence gate, and fast-track analysis is **human-reviewed before release**.

---

## 7. AI behavior & guardrails

- Interview prompts must be **non-leading** (problem-first, no "would you use…").
- Every AI suggestion carries a **reason/source** where possible.
- Signal scoring surfaces a suggested score; a human confirms on the fast track.
- Verdicts are **explainable**: list the signals and thresholds that produced them.
- No fabricated evidence, quotes, or sources — ever.

---

## 8. Key business logic

### Fast-track quote
```
total_estimate = (per_interviewee_rate × interviewee_count)
               + (expert_rate × expert_count)
               + analysis_fee
```
- Rates and analysis_fee are configurable (admin).
- Show itemized breakdown + delivery ETA (1 week target, 2 weeks max) before approval.

### Verdict scoring (directional, to refine)
- Aggregate signal strengths across evidence/interviews into a weighted score.
- Map to `strong_yes → strong_no` bands with a confidence value based on sample size and consistency.
- Thresholds are **defined up front** and shown to the founder so the verdict isn't a mood.

---

## 9. Non-functional requirements
- **Persistence-first**: never lose idea context; everything versioned and auditable.
- **Security/privacy**: founder ideas are confidential; access-controlled; private by default.
- **Performance**: research/validation runs are async with progress states.
- **Scalability**: multiple ideas per user; multiple cycles per idea.
- **Observability**: audit log for context changes, orders, and verdict releases.

---

## 10. Milestones (build order)

1. **M1 — Capture**: auth, ideas, versioned context revisions, entry-point UI.
2. **M2 — Research**: web + social research runs, strengthening suggestions, apply-to-context.
3. **M3 — Slow validation**: social listening, evidence scoring/clustering, feedback window v1.
4. **M4 — Fast track**: quote engine, order + payment approval, internal interview workspace, human-reviewed verdict.
5. **M5 — Analytics + iterate**: full feedback/analytics window with AI next steps; cycle history + comparison.

---

## 11. Open questions (need Stanley's input)

1. **Social platforms** — which first (Reddit, X, LinkedIn, niche forums)? ICP-dependent.
2. **Pricing** — default per-interviewee rate, expert rate, and analysis fee? Currency?
3. **Payment** — collect at approval, or approve-then-invoice for fast track?
4. **Self-serve vs assisted** — is the slow track fully self-serve while fast track is BRAINS-run? (Assumed yes.)
5. **Verdict bands** — your preferred thresholds for strong yes / no.
6. **Interview delivery** — do founders ever see raw interview notes, or only the analyzed verdict?
7. **Auth/DB** — preference (Supabase vs Clerk + Neon)? Same stack as marketing site is assumed.

---

## 12. Future phases (out of scope now)
- Go-to-market: funnels, first-customer motion, outreach automation.
- Full lifecycle portfolio: **kill / change / pass** recommendations across a founder's product set.
- Team seats, sharing, and collaboration.
