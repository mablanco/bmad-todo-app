# Story 2.3: Delete a Todo Cleanly from the List

Status: review

## Story

As a solo user,
I want to remove a task that I no longer need,
so that my list stays relevant and uncluttered.

## Acceptance Criteria

1. Given a todo is visible in the list, when I activate its delete action, then the app sends `DELETE /api/v1/todos/{todoId}` and the item is removed from the rendered list when the deletion succeeds.
2. Given deleting a todo leaves the list empty, when the UI updates, then the app transitions into the dedicated empty state cleanly and still directs me toward adding a new task.
3. Given a delete request fails, when the backend returns an error, then the todo remains or is restored in a believable state and the app shows calm, local error feedback rather than a disruptive global failure.
4. Given I use keyboard or touch interaction, when I reach the delete control, then it is accessible, clearly labeled, and does not rely on hover-only discovery.

## Tasks / Subtasks

- [x] Add the `deleteTodo` API function (AC: 1)
  - [x] Add `deleteTodo(todoId)` to `web/src/features/todos/api/todos.ts` calling `DELETE /api/v1/todos/{todoId}`. Return `void`. Catch `NETWORK_ERROR` with calm message.
- [x] Create the `useDeleteTodo` mutation hook (AC: 1, 2, 3)
  - [x] Create `web/src/features/todos/hooks/useDeleteTodo.ts` using `useMutation`.
  - [x] Implement optimistic removal in `onMutate`: cancel queries, snapshot previous todos, filter the deleted todo from the cache.
  - [x] Implement rollback in `onError`: restore the snapshot if the mutation fails.
- [x] Add a delete control to `TodoListItem` (AC: 1, 4)
  - [x] Accept `onDelete` callback prop (receives `todoId`).
  - [x] Accept optional `isDeleting` boolean prop to disable the button during mutation.
  - [x] Render a `<button>` with accessible label "Delete" (or "Delete [description]") — always visible, not hover-only.
  - [x] Style with `--color-danger-600` for visual distinction from the toggle control.
- [x] Wire delete through `TodoList` and `TodoAppShell` (AC: 1, 2, 3)
  - [x] Call `useDeleteTodo` in `TodoAppShell`.
  - [x] Pass `onDelete` handler and per-item `isDeleting` state down through `TodoList` → `TodoListItem`.
  - [x] Show inline error feedback (`role="alert"`) when delete fails — reuse the existing error pattern from toggle.
  - [x] When the last todo is deleted, the list naturally transitions to `TodoEmptyState` via the existing `todos.length > 0` conditional.
- [x] Add tests for delete success, empty transition, failure, and accessibility (AC: 1, 2, 3, 4)
  - [x] Test: clicking delete sends `DELETE /api/v1/todos/{todoId}` and the item is removed from the list.
  - [x] Test: deleting the last todo transitions to the empty state.
  - [x] Test: when DELETE fails, the todo reappears and calm error feedback is shown.
  - [x] Test: the delete control is keyboard-accessible.
  - [x] Verify existing tests still pass — no regressions.

## Dev Notes

- Follow the exact same pattern as `useUpdateTodo` (Story 2.2): optimistic cache update + rollback on error. The only difference is filter-out instead of map-replace.
- The `api-client.ts` already handles 204 responses by returning `undefined`. The `deleteTodo` function should call `apiRequest<void>(...)`.
- The empty-state transition is already handled by `TodoAppShell`'s `todos.length > 0` conditional — no extra logic needed.
- Both toggle and delete error states can share the same `role="alert"` element in the shell. Consider showing the most recent mutation error.

### Backend Contract

- **Endpoint:** `DELETE /api/v1/todos/{todoId}`
- **Success:** HTTP 204 No Content (empty body)
- **Not found:** HTTP 404, `{ "error": { "code": "TODO_NOT_FOUND", "message": "Todo not found.", "details": {} } }`

### Project Structure Notes

- New file: `web/src/features/todos/hooks/useDeleteTodo.ts`
- Modified: `api/todos.ts` (add `deleteTodo`), `TodoListItem.tsx` (add delete button), `TodoList.tsx` (pass delete props), `TodoAppShell.tsx` (wire `useDeleteTodo`), `globals.css` (delete button styles), `App.test.tsx` (add tests)

### Previous Story Intelligence

- Story 2.2 established the optimistic-update + rollback pattern in `useUpdateTodo`. Follow the same structure: `onMutate` snapshot + cache edit, `onError` restore, `onSuccess` no-op (or invalidate).
- Story 2.2 added `onToggle`, `isUpdating` props to `TodoListItem`. Add `onDelete`, `isDeleting` alongside them.
- Story 2.2 added inline `role="alert"` error feedback in `TodoAppShell`. Reuse or share that error display for delete failures.

### Testing Requirements

- Run: `npm run test:frontend`
- Run: `npm run build:frontend`
- All existing 21 tests must continue to pass.
- Add 4-5 new tests covering delete success, empty transition, failure + rollback, and keyboard accessibility.

### References

- Epic source: [epics.md](_bmad-output/planning-artifacts/epics.md#Story-2.3)
- useUpdateTodo pattern: [useUpdateTodo.ts](web/src/features/todos/hooks/useUpdateTodo.ts)
- Story 2.2: [2-2-mark-a-todo-complete-or-active-from-the-list.md](_bmad-output/implementation-artifacts/2-2-mark-a-todo-complete-or-active-from-the-list.md)
- Backend DELETE route: [todos.py](api/app/api/routes/todos.py)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- `npm run test:frontend` passed — 25/25 tests (21 existing + 4 new).
- `npm run build:frontend` passed — TypeScript and Vite build clean.
- Fixed one existing test regression: `/task$/i` regex matched sr-only "Delete Newer task" text — narrowed selector to `.todo-card__description`.

### Completion Notes List

- Added `deleteTodo(todoId)` API function returning `void`, with NETWORK_ERROR handling.
- Created `useDeleteTodo` hook with optimistic removal (filter from cache), rollback on error, following the same pattern as `useUpdateTodo`.
- Added delete `<button>` to `TodoListItem` with `onDelete` callback, `isDeleting` prop, sr-only accessible label "Delete [description]", styled with `--color-danger-600`.
- Added `todo-card__actions` row in TodoListItem to lay out toggle and delete side by side.
- Wired `useDeleteTodo` through `TodoAppShell` → `TodoList` → `TodoListItem`.
- Unified error display: `role="alert"` shows either update or delete error (whichever is most recent).
- Empty-state transition handled automatically by existing `todos.length > 0` conditional.
- Added 4 new tests: delete + removal, empty-state transition, failure + rollback + error, keyboard accessibility.

### File List

- web/src/features/todos/api/todos.ts (modified)
- web/src/features/todos/hooks/useDeleteTodo.ts (new)
- web/src/features/todos/components/TodoListItem.tsx (modified)
- web/src/features/todos/components/TodoList.tsx (modified)
- web/src/features/todos/components/TodoAppShell.tsx (modified)
- web/src/app/styles/globals.css (modified)
- web/src/App.test.tsx (modified)

### Change Log

- 2026-03-31: Implemented Story 2.3 — added delete control with optimistic removal, rollback on failure, empty-state transition, inline error feedback, and 4 new frontend tests.
