---
project_name: bmad-todo
brief_type: project
date: '2026-03-22'
author: Marco
related_prd: '_bmad-output/planning-artifacts/prd.md'
---

# Project Brief: bmad-todo

**Complete strategic foundation** for a minimal full-stack todo web application.

**Companion document:** Product requirements are specified in the [PRD](prd.md) (`_bmad-output/planning-artifacts/prd.md`). This brief explains *why* the project exists, *who* it serves, and *how* the team should think about delivery—not the numbered requirements themselves.

---

## Vision

Deliver a **trustworthy, zero-friction** personal task list on the web: one place to capture, complete, and clear todos with **durable persistence**, **clear visual state**, and **honest error handling**—without dragging users through accounts, onboarding wizards, or feature bloat.

Long term, the same product line may grow into multi-user and richer task semantics; v1 intentionally **proves the core loop** and a maintainable technical base.

---

## Positioning Statement

For **individuals** who want a **simple, reliable** place to track tasks **without signing up**, **bmad-todo** is a **responsive web app with a small API** that **persists todos and respects attention** (fast feedback, accessible UI, explicit failures)—unlike **generic note apps** that blur structure or **heavy work managers** that demand setup.

**Breakdown:**

- **Target customer:** Solo knowledge workers, developers, students—anyone who wants a personal list without account overhead for v1.
- **Need / opportunity:** Reduce cognitive load: open → act → trust that state survives reload.
- **Category:** Personal productivity / lightweight task management (web).
- **Key benefit:** Frictionless capture + durable list + visible complete vs active.
- **Differentiator:** Ruthless MVP scope, measurable quality bar (see PRD SC/NFR), and a path to auth/multi-user without rewriting the core model.

---

## Business model

**Type:** Internal / portfolio / learning product (non-commercial v1).

- No monetization, billing, or ads in scope for v1.
- If productized later: freemium or team tiers would align with Growth scope (accounts, sync)—**out of scope until explicitly prioritized**.

*B2B buying roles: N/A for v1.*

---

## Ideal customer profile (ICP)

**Primary:** A single user on laptop or phone who:

- Uses a browser as the main surface for quick capture.
- Values **speed and predictability** over collaboration features.
- Tolerates **online-first** behavior (no offline requirement in v1 PRD).

**Behaviors:** Opens app daily or ad hoc; adds short tasks; marks done; occasionally deletes mistakes.

**Secondary users (future):** Household or team members once accounts and sharing exist (Growth / Vision in PRD).

---

## Success criteria (strategic view)

Aligned with PRD SC-01–SC-04:

1. **Learnability:** First-time users complete the core loop without coaching (usability study per PRD).
2. **Trust:** Reload does not lose data under normal conditions.
3. **Clarity:** Completed work is visually obvious.
4. **Resilience:** API/client failures never “fail silent”—users can recover or understand what happened.

**North-star for the team:** Ship a **complete-feeling** minimal product: polished empty/loading/error paths, not just happy-path demos.

---

## Competitive landscape

| Segment | Examples (illustrative) | Our stance |
|---------|-------------------------|------------|
| Full work suites | Asana, Jira, Linear | Too heavy; we avoid accounts and project hierarchy in v1. |
| Native notes | Apple Notes, Google Keep | Often fuzzy task semantics; we focus on explicit todo lifecycle. |
| Dev todo demos | Sample CRUD tutorials | Often skip persistence, a11y, and UX states; we treat those as **first-class**. |

### Our unfair advantage (for this codebase)

- **BMAD-shaped PRD** with traceable FRs/NFRs and journey J1—fast alignment for humans and agents.
- **Explicit quality gates** (performance numbers, WCAG AA, onboarding time box in NFR-003).
- **Documented extensibility** (NFR-006) so v1 does not paint the team into a corner.

---

## Constraints

| Type | Constraint |
|------|---------------|
| Scope | v1: CRUD + list UI + API persistence only; no auth, no collaboration (PRD). |
| Time / team | Sized for small team or solo dev; onboarding must fit NFR-003 (≤60 min local run). |
| Tech | Web client + HTTP API; stack **not** fixed in PRD—chosen in architecture. |
| Compliance | General consumer; no HIPAA/PCI scope (PRD Domain Requirements). |
| SEO | Explicitly out of scope for v1 with documented rationale (PRD). |

---

## Platform and device strategy

**Primary platform:** Modern web (SPA or MPA—architecture decision).

**Supported environments (from PRD):** Last two major versions of Chrome, Firefox, Safari, Edge; viewports from **320px** upward.

**Device priority:** **Mobile + desktop parity** for core flows (add, complete, delete, list, error).

**Interaction models:** Pointer + touch; keyboard where applicable for accessibility.

**Technical requirements:**

- **Offline:** Not required for v1 (online-first; PRD assumptions).
- **Native features:** None required (no app store, no push in v1).

**Platform rationale:** Web maximizes reach and matches “no install / no account” v1 positioning; PWA optional later.

**Future platform plans:** Native shells or PWA install only if metrics justify after v1 stability.

**Design implications:** Responsive layout, large tap targets, visible focus states, consistent empty/loading/error patterns.

**Development implications:** Contract-first API, shared error model between client and server, CI-friendly local run story (NFR-003).

---

## Tone of voice (UI microcopy and system messages)

### Tone attributes

1. **Direct:** Short sentences; say what happened and what to do next.  
2. **Calm:** Errors are factual, not alarming—no blame.  
3. **Encouraging (light):** Empty states invite a first task without sounding marketing-heavy.

### Examples

**Error messages**

- ✅ “Couldn’t save your task. Check your connection and try again.”  
- ❌ “Fatal error 500—contact administrator.”

**Button labels**

- ✅ “Add task” / “Mark done” / “Delete”  
- ❌ “Submit” / “Execute” / “Remove item permanently from datastore”

**Empty states**

- ✅ “No tasks yet. Add one above to get started.”  
- ❌ “Your queue is empty. Leverage productivity!”

**Success (if shown)**

- ✅ Optional subtle confirmation or inline update—no modal spam for every action.

### Guidelines

**Do:** Prefer verbs; match WCAG-friendly contrast; pair errors with retry when possible (PRD SC-04, FR-010).

**Don’t:** Jargon (HTTP codes to end users), guilt (“You forgot…”), or hiding failures.

---

## Additional context

- **Repository / product name:** `bmad-todo` (working name; rename in branding pass if needed).
- **Risk:** Over-building “just one more feature”—mitigate by tying changes to PRD scope tiers.
- **Metrics to watch post-launch (suggested):** Task add → complete rate, error rate surfaced in UI, time-to-interactive (validate against PRD performance targets).

---

## Business context (lightweight)

| Field | Content |
|-------|---------|
| **Primary goal** | Ship a credible v1 that passes PRD success criteria and is maintainable by a new dev in one session (NFR-003). |
| **Solution** | Web UI + HTTP API + single datastore; BMAD PRD drives epics next. |
| **Target users** | Solo users; no org buyer in v1. |

Deeper business modeling (pricing, channels) waits until the product moves beyond portfolio mode.

---

## Related artifacts

| Artifact | Path |
|----------|------|
| PRD (authoritative requirements) | `_bmad-output/planning-artifacts/prd.md` |
| PRD mirror (docs) | `docs/Product Requirement Document (PRD) for the Todo App.md` |
| Last validation report | `_bmad-output/planning-artifacts/prd-validation-report.md` |

---

## Next steps (recommended)

- [ ] **Architecture** — Persistence model, API shape, stack, deployment sketch (align with PRD assumptions).  
- [ ] **UX** — Wireframes or component list for list / add / complete / delete / states (from J1).  
- [ ] **Epics & stories** — Break FR-001–FR-010 into implementable stories (BMAD CE workflow).  
- [ ] **Run usability** — Execute SC-01 protocol when UI is stable.  
- [ ] **Re-validate PRD** — Optional quick VP pass after architecture adds `inputDocuments` if needed.

---

*Strategic sections follow WDS-style project brief structure; requirements and IDs remain in the PRD.*
