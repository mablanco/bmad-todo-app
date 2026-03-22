---
project_name: bmad-todo
brief_type: project
date: '2026-03-22'
author: Marco
related_prd: 'Product Requirement Document (PRD) for the Todo App.md'
---

# Project Brief: bmad-todo

**Complete strategic foundation** for a minimal full-stack todo web application.

**Companion document:** Product requirements are in the [PRD](Product%20Requirement%20Document%20(PRD)%20for%20the%20Todo%20App.md). This brief covers strategy and delivery context; the PRD holds numbered requirements.

---

## Vision

Deliver a **trustworthy, zero-friction** personal task list on the web: capture, complete, and clear todos with **durable persistence**, **clear visual state**, and **honest error handling**—without accounts, onboarding wizards, or feature bloat. v1 proves the core loop and a maintainable base for possible auth and multi-user later.

---

## Positioning statement

For **individuals** who want a **simple, reliable** task list **without signing up**, **bmad-todo** is a **responsive web app with a small API** that **persists todos and respects attention**—unlike heavy work managers or unstructured notes.

**Breakdown:** Target: solo users (workers, students, developers). Need: open → act → trust reload. Category: web productivity. Benefit: frictionless capture + durable list + clear complete vs active. Differentiator: strict MVP, measurable quality (PRD), extensibility for future auth.

---

## Business model

**Internal / portfolio / learning (v1).** No billing or ads. Future productization could use freemium/teams when Growth scope (accounts) is prioritized.

---

## Ideal customer profile

**Primary:** Browser-first user on phone or laptop who values speed and predictability; accepts online-first behavior. **Secondary (future):** shared lists / teams after Growth features.

---

## Success criteria (strategic)

Matches PRD: learnability (SC-01), reload trust (SC-02), visual clarity (SC-03), recoverable failures (SC-04). **Team north star:** a minimal product that still feels **complete** (states, errors, accessibility).

---

## Competitive landscape

Heavy suites (Asana, Jira) vs us = scope. Notes apps = weaker task semantics. Tutorial CRUD apps = often skip persistence, a11y, UX states—we treat those as first-class.

**Edge:** BMAD PRD + explicit NFRs + J1→FR trace for fast alignment.

---

## Constraints

v1 scope fixed in PRD (no auth/collaboration). Stack open until architecture. Compliance: general consumer. SEO out of scope v1. Onboarding ≤60 min local run (NFR-003).

---

## Platform and device strategy

**Web** on latest-two Chrome/Firefox/Safari/Edge; **320px+**; touch + pointer; online-first v1. **Future:** PWA/native optional. **Dev:** API contract, shared errors, documented local run.

---

## Tone of voice (UI)

**Direct, calm, lightly encouraging.** Examples: “Couldn’t save your task. Check your connection and try again.” / “Add task” / “No tasks yet. Add one above to get started.” Avoid jargon, guilt, silent failures.

---

## Additional context

Working name `bmad-todo`. Watch task completion rate, UI errors, and performance vs PRD after launch.

---

## Business context

**Goal:** Credible v1 meeting PRD SC/NFR. **Solution:** Web + API + datastore. **Users:** Solo, no org buyer v1.

---

## Related artifacts

| Artifact | Location |
|----------|----------|
| PRD | [Product Requirement Document (PRD) for the Todo App.md](Product%20Requirement%20Document%20(PRD)%20for%20the%20Todo%20App.md) |
| PRD (planning path) | `_bmad-output/planning-artifacts/prd.md` |
| Validation report | `_bmad-output/planning-artifacts/prd-validation-report.md` |

---

## Next steps

- Architecture (persistence, API, stack).  
- UX from journey J1.  
- Epics/stories from FR-001–FR-010.  
- Usability for SC-01.  
- Optional PRD re-validation after architecture.

---

*WDS-style brief; requirements live in the PRD.*
