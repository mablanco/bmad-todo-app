# Story 2.2: Mark a Todo Complete or Active from the List

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo user,
I want to toggle a task between active and completed directly from the list,
so that I can keep my task state current with minimal effort.

## Acceptance Criteria

1. Given an active or completed todo is visible, when I activate its completion control, then the app sends a `PATCH /api/v1/todos/{todoId}` request with the updated completion state and the item updates visibly without a page reload.
2. Given the update succeeds, when the response returns, then the final rendered state matches the persisted backend state and the list remains stable and understandable.
3. Given the update fails, when the backend returns an error, then the app restores or preserves a believable UI state and shows local, calm error feedback with a clear next step.
4. Given I use keyboard navigation, when I move to and activate the completion control, then the interaction is keyboard operable and visibly focused and the resulting state change is accessible.

## Tasks / Subtasks

- [x] Add the `updateTodo` API function and `UpdateTodoInput` type (AC: 1)
  - [x] Add `UpdateTodoInput` type to `web/src/features/todos/types/todo.ts`: `{ description?: string; completed?: boolean }`.
  - [x] Add `updateTodo(todoId, input)` to `web/src/features/todos/api/todos.ts` calling `PATCH /api/v1/todos/{todoId}`. Follow the same error-handling pattern as `createTodo` (catch `NETWORK_ERROR`, rethrow with calm message).
- [x] Create the `useUpdateTodo` mutation hook (AC: 1, 2, 3)
  - [x] Create `web/src/features/todos/hooks/useUpdateTodo.ts` using `useMutation`.
  - [x] Implement optimistic update in `onMutate`: cancel queries, snapshot previous todos, toggle `completed` in the cache.
  - [x] Implement rollback in `onError`: restore the snapshot if the mutation fails.
  - [x] Implement `onSuccess`: replace the cached todo with the server response to ensure consistency.
- [x] Add an interactive toggle control to `TodoListItem` (AC: 1, 2, 4)
  - [x] Accept `onToggle` callback prop (receives `todoId` and new `completed` value).
  - [x] Accept optional `isUpdating` boolean prop to disable the control during mutation.
  - [x] Render a `<button>` for the toggle — replace the current static status `<div>` with an interactive control.
  - [x] The button label should read "Mark complete" or "Mark active" based on current state.
  - [x] Ensure the button is keyboard-operable and has a visible focus ring.
- [x] Wire the toggle through `TodoList` and `TodoAppShell` (AC: 1, 2, 3)
  - [x] Call `useUpdateTodo` in `TodoAppShell` (or `TodoList` — either is fine, but keep mutation state management in one place).
  - [x] Pass the `onToggle` handler and per-item `isUpdating` state down to each `TodoListItem`.
  - [x] Show inline error feedback near the list if a toggle fails — calm, non-technical, with retry path.
- [x] Add tests for toggle success, failure, and accessibility (AC: 1, 2, 3, 4)
  - [x] Test: clicking toggle on an active todo sends PATCH with `completed: true` and the item visually updates to completed.
  - [x] Test: clicking toggle on a completed todo sends PATCH with `completed: false` and the item visually updates to active.
  - [x] Test: when PATCH fails, the todo reverts to its previous state and calm error feedback is shown.
  - [x] Test: the toggle control is keyboard-accessible (focusable and operable).
  - [x] Verify existing tests still pass — no regressions.

## Dev Notes

- Story 2.1 extracted `TodoListItem` with the completed-state visual distinction (strikethrough, `✓`/`○` icons, `todo-card--completed` class). This story adds the interactive toggle on top of that foundation.
- Follow the `useCreateTodo` hook pattern: `useMutation` + `onMutate` for query cancellation + `onSuccess` for cache update. **Add rollback** in `onError` — `useCreateTodo` is missing this, but `useUpdateTodo` should have it since optimistic toggle is visible to the user.
- The architecture requires explicit mutation state naming: `isUpdatingTodo`. TanStack Query exposes `isPending` — rename in the component destructure.
- Error handling must be non-silent. If a toggle fails, show a brief inline message and restore the previous state. Do not leave the UI in an inconsistent state.

### Backend Contract

- **Endpoint:** `PATCH /api/v1/todos/{todoId}`
- **Request body:** `{ "completed": true }` or `{ "completed": false }`
- **Success response:** HTTP 200, `{ "data": { id, description, completed, created_at, updated_at } }`
- **Not found:** HTTP 404, `{ "error": { "code": "TODO_NOT_FOUND", "message": "Todo not found.", "details": {} } }`
- **Validation error:** HTTP 422, `{ "error": { "code": "VALIDATION_ERROR", ... } }`

### Project Structure Notes

- New files:
  - `web/src/features/todos/hooks/useUpdateTodo.ts`
- Modified files:
  - `web/src/features/todos/types/todo.ts` (add `UpdateTodoInput`)
  - `web/src/features/todos/api/todos.ts` (add `updateTodo` function)
  - `web/src/features/todos/components/TodoListItem.tsx` (add toggle button)
  - `web/src/features/todos/components/TodoList.tsx` (pass toggle props)
  - `web/src/features/todos/components/TodoAppShell.tsx` (wire `useUpdateTodo`)
  - `web/src/App.test.tsx` (add toggle tests)

### Technical Requirements

- Use React + TypeScript on the existing Vite frontend.
- Use TanStack Query `useMutation` for the update — no custom state management.
- Optimistic updates: toggle the `completed` field in the cache immediately, roll back on failure.
- The toggle control must be a `<button>` (not a checkbox) with accessible label.
- No new dependencies required.

### Architecture Compliance

- Server state belongs to TanStack Query. Do not duplicate in local state. [Source: architecture.md#State Management]
- Mutation state names should be explicit: `isUpdatingTodo`. [Source: architecture.md#State Management]
- Silent failures are forbidden for update paths. [Source: architecture.md#Error Handling]
- Frontend never shows raw exception text. [Source: architecture.md#Error Handling]
- `TodoListItem` owns one item row's interactions. [Source: architecture.md#Component Boundaries]

### Previous Story Intelligence

- Story 2.1 established `TodoListItem` with `todo-card--completed` class, `✓`/`○` status icons, strikethrough, and `aria-label`. The toggle button replaces the static status `<div>` with an interactive control — keep the same visual styling.
- Story 1.3 established the `useCreateTodo` hook pattern. Follow the same structure but add `onError` rollback.
- Story 1.4 established calm feedback patterns: `role="status"` for info, `role="alert"` for errors.

### Testing Requirements

- Run: `npm run test:frontend`
- Run: `npm run build:frontend`
- All existing 17 tests must continue to pass.
- Add 4-5 new tests covering toggle success (both directions), failure + rollback, and keyboard accessibility.

### References

- Epic source: [epics.md](_bmad-output/planning-artifacts/epics.md#Story-2.2)
- Architecture state management: [architecture.md](_bmad-output/planning-artifacts/architecture.md#State-Management-Patterns)
- Architecture error handling: [architecture.md](_bmad-output/planning-artifacts/architecture.md#Error-Handling-Patterns)
- Backend PATCH route: [todos.py](api/app/api/routes/todos.py)
- useCreateTodo pattern: [useCreateTodo.ts](web/src/features/todos/hooks/useCreateTodo.ts)
- TodoListItem: [TodoListItem.tsx](web/src/features/todos/components/TodoListItem.tsx)
- Story 2.1: [2-1-render-todo-items-with-clear-task-state-information.md](_bmad-output/implementation-artifacts/2-1-render-todo-items-with-clear-task-state-information.md)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- `npm run test:frontend` passed — 21/21 tests (17 existing + 4 new).
- `npm run build:frontend` passed — TypeScript and Vite build clean.
- No regressions in any existing tests.

### Completion Notes List

- Added `UpdateTodoInput` type and `updateTodo()` API function with NETWORK_ERROR handling matching `createTodo` pattern.
- Created `useUpdateTodo` hook with optimistic cache update (`onMutate` snapshot + toggle), rollback on error (`onError` restores snapshot), and server sync on success (`onSuccess` replaces cached todo).
- Replaced static status `<div>` in `TodoListItem` with interactive `<button class="todo-card__toggle">` — keyboard-operable, disabled during mutation, with screen-reader-only action label ("Mark complete" / "Mark active").
- Wired `useUpdateTodo` through `TodoAppShell` → `TodoList` → `TodoListItem` with per-item `isUpdating` state and `onToggle` callback.
- Added inline error feedback (`role="alert"`) below the list when toggle fails.
- Added CSS for toggle button (hover, disabled, focus states) and update error message.
- Added `.sr-only` utility class for screen-reader-only content.
- Added 4 new tests: toggle active→completed, toggle completed→active, failure rollback + error display, keyboard accessibility.

### File List

- web/src/features/todos/types/todo.ts (modified)
- web/src/features/todos/api/todos.ts (modified)
- web/src/features/todos/hooks/useUpdateTodo.ts (new)
- web/src/features/todos/components/TodoListItem.tsx (modified)
- web/src/features/todos/components/TodoList.tsx (modified)
- web/src/features/todos/components/TodoAppShell.tsx (modified)
- web/src/app/styles/globals.css (modified)
- web/src/App.test.tsx (modified)

### Change Log

- 2026-03-31: Implemented Story 2.2 — added toggle completion control with optimistic updates, rollback on failure, inline error feedback, keyboard accessibility, and 4 new frontend tests.
