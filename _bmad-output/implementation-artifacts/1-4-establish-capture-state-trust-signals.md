# Story 1.4: Establish Capture-State Trust Signals

Status: review

## Story

As a solo user,
I want every capture-related state to be obvious,
so that I always know whether my task was added, is loading, or needs my attention.

## Acceptance Criteria

1. Given the app is fetching or mutating capture-related data, when the UI updates, then loading feedback is visible and localized and the page does not collapse into an ambiguous blank state.
2. Given a task is added successfully, when the list updates, then the resulting state change is visually obvious and believable and the app does not require extra confirmation dialogs or noisy success messaging.
3. Given I rely on keyboard or assistive technology, when I use the composer and its related states, then focus, validation, and feedback are exposed accessibly and the flow supports WCAG 2.1 AA expectations for the capture path.

## Tasks / Subtasks

- [x] Strengthen localized loading feedback for the capture flow (AC: 1)
  - [x] Review the current composer pending state and loading labels introduced in Story 1.3.
  - [x] Add any missing localized loading affordances so create activity is obvious without masking the entire shell or list.
  - [x] Ensure the list-loading and create-loading states remain distinct and understandable when they overlap.
- [x] Make successful task creation feel visible and trustworthy without adding noisy confirmation UI (AC: 2)
  - [x] Refine the immediate post-create visual state so the newly added task reads as a believable update, not a silent background change.
  - [x] Keep the interaction lightweight: no global toast or modal confirmation patterns.
  - [x] Preserve newest-first ordering and clear continuity from input submission to visible list state.
- [x] Improve capture-path accessibility and state announcements (AC: 3)
  - [x] Validate composer feedback semantics for loading, validation, and server-error states.
  - [x] Ensure focus behavior remains logical across success and failure paths.
  - [x] Add any needed ARIA or semantic refinements so screen-reader and keyboard users receive equivalent feedback.
- [x] Add verification coverage for capture-state trust signals (AC: 1, 2, 3)
  - [x] Add frontend tests for localized pending feedback during create.
  - [x] Add or refine tests that verify the success state is visible through the updated list state rather than auxiliary confirmation UI.
  - [x] Add tests for accessibility-critical behavior in the capture path, especially focus and feedback exposure.

## Dev Notes

- Story 1.3 already introduced a working create mutation, inline validation, preserved input-on-failure behavior, and success refocus. Story 1.4 should build on that implementation rather than replacing it.
- Keep this story scoped to trust signals around capture only. Do not pull in toggle/delete behavior from Epic 2.
- The UX intent here is “obvious, calm, localized feedback.” Prefer subtle state cues inside the composer and list over broad app-wide overlays or celebratory messaging.
- Accessibility is part of the acceptance criteria, not a follow-up polish pass. Any new feedback or motion added here must preserve keyboard and assistive-technology clarity.

## Relevant Context

- Epic source: [epics.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/epics.md)
- Previous implementation: [1-3-add-a-new-todo-from-the-main-composer.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/implementation-artifacts/1-3-add-a-new-todo-from-the-main-composer.md)
- UX guidance: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md)
- Architecture guidance: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story 1.3 already provided the working create flow and success/failure state transitions.
- `npm run test:frontend` passed.
- `npm run build:frontend` passed.
- `npm run test` passed, including backend regression coverage.

### Completion Notes List

- Added localized composer feedback for pending and success states using accessible `status` semantics instead of treating all feedback as field errors.
- Preserved field-invalid semantics for validation and server-error cases only, keeping the capture flow screen-reader-friendly.
- Added a visible fresh-state treatment to the most recently created todo so successful saves feel believable without toasts or modal confirmations.
- Expanded frontend tests to cover localized pending feedback, fresh-item visual trust signals, and the existing focus/feedback flow.

### File List

- _bmad-output/implementation-artifacts/1-4-establish-capture-state-trust-signals.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- web/src/App.test.tsx
- web/src/app/styles/globals.css
- web/src/features/todos/components/TodoAppShell.tsx
- web/src/features/todos/components/TodoComposer.tsx
- web/src/features/todos/components/TodoList.tsx

### Change Log

- 2026-03-27: Implemented Story 1.4 by adding localized capture-state feedback, a subtle fresh-item trust signal in the list, accessibility refinements for feedback semantics, and frontend regression tests for the new states.
