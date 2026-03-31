# Story 3.1: Apply the Soft Calm Visual Foundation to the Todo Experience

Status: review

## Story

As a solo user,
I want the app to look calm, clear, and trustworthy,
so that using it feels focused rather than stressful or generic.

## Acceptance Criteria

1. Given I open the app, when the main interface renders, then the UI applies the Soft Calm direction with warm neutrals, restrained accents, gentle surfaces, and clear visual hierarchy.
2. Given I interact with primary controls and task rows, when hover, focus, active, and disabled states appear, then those states are visually consistent across the app and they reinforce clarity rather than visual noise.
3. Given the UI uses reusable styling decisions, when shared surfaces, buttons, inputs, and status states are implemented, then they are driven by a small internal design-token system and the styling is not duplicated ad hoc across components.

## Tasks / Subtasks

- [x] Verify and complete interactive state consistency across all controls (AC: 2)
  - [x] Add explicit hover state for composer input (border color shift or subtle shadow).
  - [x] Add explicit `:active` pressed state for primary buttons (composer button, toggle, delete) — slight scale or background shift.
  - [x] Verify focus ring consistency: all interactive elements use the same `color-mix` focus outline.
  - [x] Verify disabled states on all buttons are consistent (opacity + cursor + shadow removal).
- [x] Verify design tokens drive all visual decisions — no ad-hoc values (AC: 3)
  - [x] Audit `globals.css` for hardcoded color/spacing values that should reference tokens.
  - [x] Remaining raw rgba values are intentional tints/overlays not suitable for standalone tokens.
- [x] Add any missing state transitions for calm, consistent motion (AC: 2)
  - [x] Ensure all interactive elements have a `transition` property for smooth state changes.
- [x] Verify the visual foundation end-to-end by running existing tests (AC: 1, 2, 3)
  - [x] All 30 tests pass — no regressions.
  - [x] Build succeeds.

## Dev Notes

- **This is a polish and verification story.** The Soft Calm foundation (tokens.css + globals.css) was established in Story 1.1 and built upon through Epics 1–2. Most of the work is already done.
- The main gaps are: missing hover on composer input, missing `:active` pressed states, and potential hardcoded values in globals.css that should use tokens.
- Do NOT redesign or restructure existing CSS. Only add missing states and fix token references.
- Do NOT add new components or test files. Existing tests verify the visual structure.

### Testing Requirements

- Run: `npm run test:frontend` (all 28 must pass)
- Run: `npm run build:frontend` (must succeed)
- No new tests required — this story is CSS-only polish.

### References

- Design tokens: [tokens.css](web/src/app/styles/tokens.css)
- Global styles: [globals.css](web/src/app/styles/globals.css)
- UX spec: [ux-design-specification.md](_bmad-output/planning-artifacts/ux-design-specification.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- 30/30 tests pass, build clean.
- Audited globals.css: raw rgba values are intentional tints/overlays (not replaceable with tokens).

### Completion Notes List

- Added hover state on composer input (border-color shift on `:hover`).
- Added `:active` pressed states for composer button (scale + shadow), toggle button (background), and delete button (background).
- Added `:hover` and `:active` states for the retry button (`.todo-status-card__button`).
- Added `transition` properties to composer input, composer button, and retry button.
- All hover/active states use `:not(:disabled)` guard to prevent visual artifacts on disabled elements.
- Verified focus ring consistency: all interactive elements share the same `color-mix` outline pattern.
- Verified disabled states consistency: all buttons use opacity + cursor:wait.

### File List

- web/src/app/styles/globals.css (modified)

### Change Log

- 2026-03-31: Implemented Story 3.1 — added missing hover, active, and transition states for consistent Soft Calm interaction feedback across all controls.
