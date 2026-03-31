# Story 3.3: Make Core Todo Flows Keyboard-Accessible and Screen-Reader-Friendly

Status: review

## Story

As a user who relies on keyboard or assistive technology,
I want to complete the core todo flows accessibly,
so that I can use the product effectively without barriers.

## Acceptance Criteria

1. Given I use only keyboard navigation, when I move through task creation, completion, retry, and deletion flows, then every interactive element is reachable and operable and focus indicators are clearly visible.
2. Given I use assistive technology, when validation errors, loading states, and status changes occur, then they are announced or structured accessibly and form controls have associated labels or accessible names.
3. Given completed tasks are displayed, when I interpret task state, then completion is communicated through semantic and visual cues beyond color alone.
4. Given the app uses semantic HTML, when the list and controls render, then list, button, form, and status semantics are preserved throughout the core flow.

## Tasks / Subtasks

- [x] Audit and verify keyboard reachability for all interactive flows (AC: 1)
  - [x] Verify tab order: composer input → add button → toggle buttons → delete buttons → retry button (when visible).
  - [x] Verify all buttons are keyboard-operable (Enter/Space to activate).
  - [x] Verify focus ring is visible on all interactive elements (shared `color-mix` outline).
- [x] Audit and verify ARIA and screen-reader semantics (AC: 2, 3)
  - [x] Verify composer form has `aria-label` and input has associated `<label>`.
  - [x] Verify `aria-invalid` is set on the input when validation fails.
  - [x] Verify `role="status"` is used for success feedback and `role="alert"` for error feedback.
  - [x] Verify `aria-label` on each todo item includes description and completion state.
  - [x] Verify toggle button has `sr-only` action label ("Mark complete" / "Mark active").
  - [x] Verify delete button has `sr-only` accessible name including the task description.
- [x] Audit and verify semantic HTML structure (AC: 4)
  - [x] Verify `<main>`, `<section>`, `<header>`, `<form>`, `<ol>`, `<li>`, `<article>`, `<button>` are used correctly.
  - [x] Verify headings have logical hierarchy (h1 → h2).
  - [x] Verify completed state uses more than color (strikethrough + icon confirmed in Story 2.1).
- [x] Add a test verifying all interactive elements are keyboard-focusable (AC: 1)
  - [x] Test: each interactive element (input, add button, toggle, delete) can receive focus via `element.focus()`.

## Dev Notes

- Most accessibility work was built into components from the start (Stories 1.1–2.3). This story verifies completeness.
- The main risk is missing ARIA attributes or incorrect `role` usage. Audit each component's JSX.
- A small test addition verifying keyboard focusability completes the coverage.

### Testing Requirements

- Run: `npm run test:frontend`
- Add 1 new test for keyboard focusability audit.
- All existing tests must pass.

### References

- TodoComposer: [TodoComposer.tsx](web/src/features/todos/components/TodoComposer.tsx)
- TodoListItem: [TodoListItem.tsx](web/src/features/todos/components/TodoListItem.tsx)
- TodoErrorState: [TodoErrorState.tsx](web/src/features/todos/components/TodoErrorState.tsx)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- 31/31 tests pass. Audit confirmed all ARIA attributes, semantic HTML, and keyboard operability.

### Completion Notes List

- Audited all components: TodoComposer, TodoListItem, TodoList, TodoAppShell, TodoEmptyState, TodoErrorState, TodoLoadingState.
- Confirmed: `aria-label`, `aria-invalid`, `aria-describedby`, `aria-live`, `aria-labelledby`, `role="alert"`, `role="status"`, `sr-only` labels all present and correct.
- Confirmed: semantic HTML structure (`main`, `section`, `header`, `form`, `ol`, `li`, `article`, `button`, `h1`→`h2`).
- Confirmed: completed state uses strikethrough + icon + CSS modifier (more than color alone).
- Added 1 new test verifying all interactive elements (input, add, toggle, delete) are keyboard-focusable.

### File List

- web/src/App.test.tsx (modified — +1 test)

### Change Log

- 2026-03-31: Implemented Story 3.3 — audited accessibility across all components, added keyboard focusability test. All ARIA, semantics, and keyboard operability confirmed.
