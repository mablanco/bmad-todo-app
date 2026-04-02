# Test Coverage Analysis — bmad-todo

**Date:** 2026-04-02
**Target:** 70% meaningful coverage
**Method:** Manual source-to-test mapping across all layers

---

## Test Inventory

| Layer | Tests | Framework |
|-------|-------|-----------|
| Backend integration | 9 | pytest + TestClient |
| Backend unit (service) | 6 | pytest + mock |
| Backend unit (repository) | 5 | pytest + in-memory SQLite |
| Backend unit (logging) | 4 | pytest + async |
| Frontend integration | 31 | Vitest + Testing Library |
| E2E | 5 | Playwright |
| **Total** | **60** | |

---

## Backend Coverage (24 tests)

| Module | Coverage | What's Tested | Gaps |
|--------|----------|--------------|------|
| `routes/todos.py` | **85%** | All CRUD ops, validation, not-found, UUID validation | `build_service()` factory, partial update combos |
| `routes/health.py` | **95%** | Health endpoint | — |
| `services/todo_service.py` | **90%** | All 5 methods + error cases | Simultaneous description+completed update |
| `repositories/todo_repository.py` | **95%** | All 5 methods + ordering | — |
| `core/errors.py` | **70%** | Error envelope via integration tests | Direct `error_payload()` test, empty error list edge case |
| `core/logging.py` | **80%** | Handler setup, 3 log levels, exception logging | Invalid log level string, format validation |
| `schemas/todo.py` | **70%** | Trim+reject blank, max length (via Field) | 500-char boundary test, TodoUpdate both-null |
| `core/config.py` | **10%** | Used implicitly | `get_allowed_origins()` not tested directly |
| `db/session.py` | **10%** | Used implicitly via conftest | Direct factory tests, rollback behavior |
| `routes/test_support.py` | **0%** | — | Reset endpoint, env var guard, secret header |

**Backend estimated coverage: 62%**

---

## Frontend Coverage (31 integration tests)

App.test.tsx tests the full app through the root `<App />` component, exercising all components, hooks, and API layer indirectly:

| Component/Module | Coverage | What's Tested |
|-----------------|----------|--------------|
| `TodoAppShell` | **85%** | Loading, empty, error, populated states, toggle/delete wiring, error display, fresh highlight |
| `TodoComposer` | **90%** | Submit, validation (blank + oversized), focus restore, pending feedback, error preservation |
| `TodoList` | **80%** | Rendering, ordering, task count, delegation to TodoListItem |
| `TodoListItem` | **85%** | Active/completed classes, status icons, toggle click, delete click, highlight, timestamp |
| `TodoEmptyState` | **80%** | Renders on empty response, renders after last delete |
| `TodoErrorState` | **80%** | Renders on list failure, calm message, retry button |
| `TodoLoadingState` | **60%** | Renders during initial fetch (implicit) |
| `useTodos` | **70%** | Fetch, refetch, error state (via integration) |
| `useCreateTodo` | **85%** | Mutate, cache update, race condition, pending state |
| `useUpdateTodo` | **85%** | Optimistic update, rollback on error, refetch consistency |
| `useDeleteTodo` | **85%** | Optimistic removal, rollback on error, empty transition, refetch |
| `api/todos.ts` | **70%** | All 4 functions exercised via hooks | `sortTodos()` not tested directly |
| `lib/api-client.ts` | **60%** | 204 handling, JSON parsing, error mapping | Direct unit tests missing |
| `lib/errors.ts` | **50%** | `SAFE_MESSAGES` mapping exercised via error tests | Direct unit tests missing |
| `lib/env.ts` | **20%** | Used implicitly | Direct test missing |

**Frontend estimated coverage: 73%**

### Gaps

1. **No isolated unit tests for `lib/` utilities** — api-client, errors, env are tested only through integration
2. **`sortTodos()` not directly tested** — ordering is verified via full-app test but not the sort function itself
3. **No explicit loading-state assertion** — `TodoLoadingState` renders but no test asserts its specific content

---

## E2E Coverage (5 tests)

| Scenario | Covered |
|----------|---------|
| App loads with capture shell | Yes |
| Create a todo | Yes |
| Toggle active ↔ completed | Yes |
| Delete a todo | Yes |
| Persist across reload | Yes |
| Error/failure scenarios | **No** |
| Validation (blank input) | **No** |
| Multiple todos interaction | **No** |

**E2E estimated coverage: 50%**

---

## Overall Assessment

| Layer | Estimated Coverage | Status |
|-------|-------------------|--------|
| Backend | **62%** | Below target |
| Frontend | **73%** | **Above target** |
| E2E | **50%** | Below target |
| **Weighted overall** | **65%** | **Near target** |

### Verdict: **Close but not quite at 70%**

The frontend integration tests in `App.test.tsx` are excellent — 31 tests covering all user flows through full-app renders. The backend has solid service/repository coverage but gaps in config and infrastructure code.

---

## Top 10 Gaps (by risk)

| # | Gap | Layer | Risk | Effort |
|---|-----|-------|------|--------|
| 1 | `config.py` `get_allowed_origins()` untested | Backend | HIGH | 15 min |
| 2 | `test_support.py` reset endpoint untested | Backend | HIGH | 20 min |
| 3 | `db/session.py` rollback/exception behavior untested | Backend | MEDIUM | 20 min |
| 4 | `lib/api-client.ts` no direct unit tests | Frontend | MEDIUM | 30 min |
| 5 | `lib/errors.ts` `SAFE_MESSAGES` mapping untested directly | Frontend | MEDIUM | 15 min |
| 6 | `schemas/todo.py` 500-char boundary not tested | Backend | MEDIUM | 10 min |
| 7 | E2E: no error/failure scenarios | E2E | MEDIUM | 30 min |
| 8 | `TodoLoadingState` content not asserted | Frontend | LOW | 5 min |
| 9 | `sortTodos()` not tested directly | Frontend | LOW | 10 min |
| 10 | `lib/env.ts` not tested directly | Frontend | LOW | 5 min |

**To reach 70%:** Fix gaps #1-#6 (~1.5 hours). This would push backend from 62% → 75% and overall to ~72%.
