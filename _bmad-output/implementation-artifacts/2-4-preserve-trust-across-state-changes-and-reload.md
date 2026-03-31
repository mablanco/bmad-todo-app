# Story 2.4: Preserve Trust Across State Changes and Reload

Status: review

## Story

As a solo user,
I want task-state changes to remain trustworthy after refresh,
so that I believe the app is keeping an accurate record of my list.

## Acceptance Criteria

1. Given I create, complete, or delete tasks, when I reload the page, then the list reflects the persisted backend state accurately.
2. Given multiple task-state changes occur in sequence, when the app re-fetches or re-renders data, then active and completed items remain visually and semantically consistent and no silent inconsistencies are introduced.
3. Given the list is reloaded after prior successful interactions, when the screen renders again, then the user can still understand the state immediately and trust in the list as the source of truth is reinforced.

## Tasks / Subtasks

- [x] Add `onSettled` query invalidation to mutation hooks for cache consistency (AC: 1, 2)
  - [x] Add `onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] })` to `useUpdateTodo`.
  - [x] Add `onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] })` to `useDeleteTodo`.
  - [x] This ensures the cache is resynced from the server after every mutation, whether it succeeds or fails.
- [x] Add tests verifying state persists across simulated reload (AC: 1, 3)
  - [x] Test: after toggling a todo to completed, a simulated reload (fresh fetch mock returning updated state) shows the todo as completed.
  - [x] Test: after deleting a todo, a simulated reload shows the todo is gone.
- [x] Add tests verifying sequential mutations remain consistent (AC: 2)
  - [x] Test: toggling a todo twice in sequence (active→completed→active) leaves it in the correct final state.
- [x] Verify all existing tests pass — no regressions (AC: 1, 2, 3)

## Dev Notes

- This is a **verification and hardening story**, not a feature story. The mutation hooks from Stories 2.2 and 2.3 already handle optimistic updates and rollback. This story adds belt-and-suspenders cache invalidation and tests that prove reload consistency.
- Adding `onSettled` with `invalidateQueries` ensures the cache is always refreshed from the server after any mutation completes (success or failure). This prevents any scenario where the optimistic cache diverges from the backend.
- "Simulated reload" in tests means: after a mutation, update the fetch mock to return the post-mutation state, then trigger a refetch (e.g., by clearing the React Query cache or remounting the component).
- Do not add new UI components or visual changes. This story is purely about data integrity and test coverage.

### Previous Story Intelligence

- `useUpdateTodo` (Story 2.2): has `onMutate` (optimistic), `onError` (rollback), `onSuccess` (cache sync). Missing `onSettled` for guaranteed refetch.
- `useDeleteTodo` (Story 2.3): has `onMutate` (optimistic filter), `onError` (rollback). No `onSuccess` or `onSettled`.
- `useTodos`: simple `useQuery` that refetches on mount — reload = fresh server state.

### Testing Requirements

- Run: `npm run test:frontend`
- Run: `npm run build:frontend`
- All existing 25 tests must continue to pass.
- Add 4 new tests verifying reload consistency and sequential mutation stability.

### References

- Epic source: [epics.md](_bmad-output/planning-artifacts/epics.md#Story-2.4)
- useUpdateTodo: [useUpdateTodo.ts](web/src/features/todos/hooks/useUpdateTodo.ts)
- useDeleteTodo: [useDeleteTodo.ts](web/src/features/todos/hooks/useDeleteTodo.ts)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- `npm run test:frontend` passed — 28/28 tests (25 existing + 3 new).
- `npm run build:frontend` passed.
- Adding `onSettled` broke 4 existing tests (toggle/delete) because the refetch returned stale mock data. Fixed by making test mocks stateful — GET responses now reflect post-mutation state.

### Completion Notes List

- Added `onSettled` with `invalidateQueries` to `useUpdateTodo` and `useDeleteTodo` — ensures cache is resynced from server after every mutation.
- Updated 4 existing test mocks to be stateful (track mutation state so refetch returns correct post-mutation data).
- Added 3 new tests: toggle persists after refetch, delete persists after refetch, sequential toggle consistency.
- All 28 frontend tests passing with zero regressions.

### File List

- web/src/features/todos/hooks/useUpdateTodo.ts (modified)
- web/src/features/todos/hooks/useDeleteTodo.ts (modified)
- web/src/App.test.tsx (modified)

### Change Log

- 2026-03-31: Implemented Story 2.4 — added onSettled cache invalidation to mutation hooks, updated test mocks for stateful refetch behavior, added 3 new reload/consistency tests.
