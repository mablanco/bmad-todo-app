# Story 2.1: Render Todo Items with Clear Task-State Information

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo user,
I want each todo item to clearly show its content and state,
so that I can scan my list without ambiguity.

## Acceptance Criteria

1. Given one or more todos exist, when the list renders, then each item displays its description and created timestamp, and each item visually communicates whether it is active or completed.
2. Given a todo is completed, when it is rendered in the list, then the completed state is distinguishable through more than color alone, and the styling remains legible and accessible.
3. Given I view the list on mobile or desktop, when todo rows render, then content hierarchy remains readable, and actions do not crowd or obscure the task content.

## Tasks / Subtasks

- [x] Extract a dedicated `TodoListItem` component from the current inline rendering in `TodoList.tsx` (AC: 1, 2, 3)
  - [x] Create `web/src/features/todos/components/TodoListItem.tsx` accepting a `Todo` prop and optional `isHighlighted` boolean.
  - [x] Move the per-item `<article>` markup from `TodoList.tsx` into `TodoListItem`.
  - [x] Move or share the `formatCreatedAt` helper so both components can use it (keep it in `TodoList.tsx` or extract to a utility — either is fine as long as it's not duplicated).
  - [x] Keep `TodoList.tsx` as the list orchestrator: map todos to `<TodoListItem>` inside the `<ol>`.
- [x] Implement completed-state visual distinction that does not rely on color alone (AC: 2)
  - [x] Add a CSS modifier class (e.g., `todo-card--completed`) applied when `todo.completed` is `true`.
  - [x] Apply a text decoration (strikethrough or similar) to the description when completed.
  - [x] Add a visible status indicator (text label, icon, or symbol) that differs between active and completed — not just the existing `aria-hidden` text.
  - [x] Ensure completed styling meets WCAG 2.1 AA contrast requirements using existing design tokens.
- [x] Ensure semantic structure and accessibility for item-level rendering (AC: 1, 2, 3)
  - [x] Each item should have an accessible name or label that conveys its state (e.g., `aria-label` including completion status, or a visually-hidden label).
  - [x] The status indicator must be perceivable by screen readers — not `aria-hidden`.
  - [x] Preserve the `todo-card--fresh` highlight class for recently created items (passed via `isHighlighted` prop).
- [x] Add CSS for TodoListItem states using design tokens (AC: 2, 3)
  - [x] Use `--color-ink-400` or lighter for completed description text (reduced emphasis, still legible).
  - [x] Use `--color-accent-600` or similar for the active status indicator.
  - [x] Keep the item layout single-row on mobile, with description taking priority and timestamp secondary.
  - [x] Ensure touch targets and spacing are comfortable from 320px upward using `--space-*` tokens.
- [x] Update tests to verify item rendering and state distinction (AC: 1, 2)
  - [x] Add a test that verifies completed and active todos render with visually distinct classes or attributes.
  - [x] Add a test that verifies the status indicator text differs between active and completed states.
  - [x] Add a test that verifies the `todo-card--fresh` highlight still works through the new component.
  - [x] Verify existing tests still pass — no regressions in list loading, empty state, or create flow.

## Dev Notes

- **Story scope is rendering only.** Do not add toggle, delete, or any mutation behavior. Stories 2.2 and 2.3 handle those. The `TodoListItem` structure should make future interactive controls easy to add, but do not implement placeholders or stub buttons.
- The current `TodoList.tsx` renders items inline as `<article>` tags. The architecture explicitly requires a separate `TodoListItem.tsx` that "owns one item row's interactions." This story extracts it.
- The `highlightedTodoId` prop is passed from `TodoAppShell` → `TodoList` (Story 1.4). `TodoList` should pass an `isHighlighted` boolean to each `TodoListItem` rather than exposing the raw ID.
- `formatCreatedAt` currently lives inside `TodoList.tsx` as a module-level function. It can stay there or be extracted — just don't duplicate it.

### Project Structure Notes

- New file: `web/src/features/todos/components/TodoListItem.tsx`
- Modified file: `web/src/features/todos/components/TodoList.tsx` (delegate to TodoListItem)
- Modified file: `web/src/app/styles/globals.css` (add TodoListItem styles)
- Modified file: `web/src/App.test.tsx` (add item-state tests)
- Architecture boundary: `TodoListItem` owns single-item rendering. `TodoList` owns list orchestration. Neither fetches data.

### Technical Requirements

- Use React + TypeScript on the existing Vite frontend.
- Style with CSS classes driven by design tokens from `web/src/app/styles/tokens.css`.
- BEM naming: `todo-card`, `todo-card--completed`, `todo-card--fresh`, `todo-card__description`, `todo-card__status`, `todo-card__timestamp`.
- Completed state must use **more than color** — at minimum text-decoration (strikethrough) plus a distinct status label/icon.
- No new dependencies required.

### Architecture Compliance

- `TodoListItem.tsx` owns one item row's rendering and will own its interactions in future stories. [Source: architecture.md#Component Boundaries]
- UI components do not construct HTTP requests or know DB details. `TodoListItem` receives a `Todo` prop only. [Source: architecture.md#Data Boundaries]
- Empty/loading/error views remain separate components — this story does not touch them. [Source: architecture.md#Architectural Boundaries]

### Library / Framework Requirements

- Existing frontend stack only — no additions needed:
  - React `^19.2.4`, Vite `^8.0.1`, Vitest `^4.1.2`, Testing Library React `^16.3.2`

### Backend Contract Notes

- `Todo` type: `{ id: string, description: string, completed: boolean, created_at: string, updated_at: string }`
- The `completed` field is a boolean. Active = `false`, completed = `true`.
- `created_at` is an ISO 8601 UTC string, formatted for display via `Intl.DateTimeFormat`.
- No backend changes needed for this story.

### Previous Story Intelligence

- Story 1.4 established the fresh-item highlighting pattern via `highlightedTodoId` state in `TodoAppShell`, passed to `TodoList`. The `todo-card--fresh` CSS class is applied via this prop. Story 2.1 must preserve this mechanism through the `TodoListItem` extraction.
- Story 1.4 used `role="status"` for success feedback and `role="alert"` for errors. Follow the same pattern if any status announcements are needed.
- Stories 1.1–1.4 established BEM-style CSS naming (`todo-card`, `todo-composer`, `todo-shell`), semantic HTML (`<section>`, `<article>`, `<ol>`), and accessible form patterns. Continue these conventions.
- All test patterns use `@testing-library/react` queries by accessible name (`getByRole`, `getByText`, `findByRole`). Class assertions use `toHaveClass()`. Follow the same patterns.

### File Structure Requirements

- Expected files to touch:
  - `web/src/features/todos/components/TodoListItem.tsx` (new)
  - `web/src/features/todos/components/TodoList.tsx` (modified — delegate to TodoListItem)
  - `web/src/app/styles/globals.css` (modified — add completed-state styles)
  - `web/src/App.test.tsx` (modified — add state-distinction tests)

### Testing Requirements

- Frontend tests should verify:
  - Active and completed todos render with visually distinct CSS classes
  - Status indicator text or label differs between states
  - Fresh-item highlight still applies through the new component
  - Description and timestamp are visible for each item
  - Existing tests (list loading, empty state, create flow, error handling) still pass
- Run: `npm run test:frontend`
- Run: `npm run build:frontend` to verify no TypeScript/build errors

### Design Token Reference

Key tokens for this story:
- `--color-ink-800` — body text (active description)
- `--color-ink-400` — muted text (completed description)
- `--color-accent-600` — teal accent (active status indicator)
- `--color-ink-600` — medium text (completed status indicator)
- `--space-1` through `--space-3` — internal item spacing
- `--radius-card: 28px` — card border radius
- `--shadow-soft` — card elevation
- `--color-surface` — card background

### References

- Epic source: [epics.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/epics.md#Epic-2-Clear-Task-State-Management)
- Frontend architecture: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend-Architecture)
- Component boundaries: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Architectural-Boundaries)
- UX component strategy: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Component-Strategy)
- UX completed state: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Completed-State-Pattern)
- Current TodoList: [TodoList.tsx](/home/mablanco/Repos/github/bmad-todo/web/src/features/todos/components/TodoList.tsx)
- Story 1.4 context: [1-4-establish-capture-state-trust-signals.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/implementation-artifacts/1-4-establish-capture-state-trust-signals.md)
- Design tokens: [tokens.css](/home/mablanco/Repos/github/bmad-todo/web/src/app/styles/tokens.css)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- `npm run test:frontend` passed — 17/17 tests (14 existing + 3 new).
- `npm run build:frontend` passed — TypeScript and Vite build clean.
- No regressions in list loading, empty state, create flow, or fresh-item highlighting.

### Completion Notes List

- Created `TodoListItem.tsx` accepting `Todo` prop and `isHighlighted` boolean, with `aria-label` combining description and status.
- Moved `formatCreatedAt` into `TodoListItem` (removed from `TodoList` — no duplication).
- `TodoList.tsx` now delegates per-item rendering to `TodoListItem`, passing `isHighlighted` boolean instead of raw ID.
- Replaced the `aria-hidden` status text with a visible status indicator: `○ Active` / `✓ Completed` — perceivable by screen readers.
- Applied `todo-card--completed` CSS modifier: strikethrough on description (`text-decoration: line-through`), muted text color (`--color-ink-400`), and shifted status badge styling.
- Completed state uses more than color alone: strikethrough + checkmark symbol + text label change.
- Fixed the "loaded from the API" technical copy — now shows "N tasks" / "1 task".
- Added 3 new tests covering state distinction, fresh highlighting through TodoListItem, and description+timestamp visibility.

### File List

- web/src/features/todos/components/TodoListItem.tsx (new)
- web/src/features/todos/components/TodoList.tsx (modified)
- web/src/app/styles/globals.css (modified)
- web/src/App.test.tsx (modified)

### Change Log

- 2026-03-31: Implemented Story 2.1 — extracted TodoListItem component, added completed-state visual distinction (strikethrough + status icon + CSS modifier), semantic accessibility, and 3 new frontend tests.
