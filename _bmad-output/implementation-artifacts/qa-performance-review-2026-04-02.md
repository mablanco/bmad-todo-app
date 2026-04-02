# Performance Review — bmad-todo

**Date:** 2026-04-02
**Target:** NFR-001 — usable with up to 500 todos
**Method:** Code-level analysis of backend, frontend, and infrastructure

---

## Summary

| Severity | Count | Layer |
|----------|-------|-------|
| HIGH | 2 | Backend (indexes, pagination) |
| MEDIUM | 4 | Frontend (cache storm, memo, staleTime, gzip) |
| LOW | 3 | Infra/minor |
| ACCEPTABLE | 5 | Correct for MVP scope |

---

## HIGH — Fix for 500-todo Target

### P1. Missing database index on `created_at`
**Evidence:** `todo_repository.py` orders by `created_at DESC` but no index exists on the column. Full table scan on every list request.
**Impact:** Linear degradation at 500+ todos.
**Fix:** Add `index=True` to `created_at` column; create Alembic migration.

### P2. No query pagination
**Evidence:** `list()` returns all todos with no LIMIT. Every list request loads entire table into memory and transfers over the wire.
**Impact:** At 500 todos, ~250KB JSON payload per list request; O(n) memory on both server and client.
**Fix:** Add optional `limit`/`offset` params. Frontend should paginate or virtualize. **Deferred** — acceptable for MVP single-user; track for post-MVP.

---

## MEDIUM — Should Fix

### P3. Cache invalidation storm after mutations
**Evidence:** `useUpdateTodo` and `useDeleteTodo` both call `invalidateQueries` in `onSettled`, triggering a full list refetch AFTER `onSuccess` already updated the cache optimally.
**Impact:** Every toggle/delete causes 2 network requests (mutation + full refetch). At 500 todos, refetch transfers ~250KB.
**Fix:** Remove `onSettled` invalidation — `onSuccess` already handles cache updates.

### P4. Missing `React.memo` on TodoListItem
**Evidence:** `TodoListItem` re-renders on every parent render even when its own props are unchanged.
**Impact:** At 500 todos, every mutation re-renders all 500 items. React VDOM diffing mitigates DOM cost but wastes CPU.
**Fix:** Wrap with `memo()`.

### P5. No `staleTime` configured in TanStack Query
**Evidence:** Default `staleTime: 0` means every component mount and window refocus triggers a background refetch.
**Impact:** Excessive network requests during normal usage.
**Fix:** Set `staleTime: 5 * 60 * 1000` (5 min) in QueryProvider.

### P6. No gzip compression in nginx
**Evidence:** No `gzip` directive in `nginx.conf`. JS bundle is 232KB uncompressed but 72KB gzipped.
**Impact:** 3x larger transfer without compression.
**Fix:** Add `gzip on;` with appropriate types.

---

## LOW / ACCEPTABLE

- **Client-side sorting** — Backend already sorts by `created_at DESC`; client re-sort is redundant but harmless at <500 items
- **N+1 in update/delete** — Service does SELECT then UPDATE/DELETE; acceptable for single-user MVP, not a bottleneck until concurrent users
- **StaticPool for SQLite** — Only used for in-memory test DBs; production uses default pool
- **Bundle size (72KB gzip)** — Acceptable for a React + TanStack Query app
- **No API-level caching in nginx** — Correct for real-time todo app; stale data would be worse than refetch cost

---

## Quick Fixes (under 30 min total)

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| P1 | Add index on `created_at` | 10 min | Faster list queries at scale |
| P3 | Remove `onSettled` from mutation hooks | 5 min | Eliminate double-fetch per mutation |
| P4 | Wrap TodoListItem in `React.memo` | 5 min | Skip 499 unnecessary re-renders |
| P5 | Set `staleTime: 300000` in QueryProvider | 2 min | Fewer background refetches |
| P6 | Add gzip to nginx.conf | 5 min | 3x smaller transfers |
