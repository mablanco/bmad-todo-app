# Story 0.4: Harden the Backend Foundation

Status: backlog

## Story

As a developer maintaining or extending the API,
I want Alembic migration infrastructure, structured logging, unit tests, and documented environment setup,
so that the backend is observable, evolvable, and onboardable without friction.

## Acceptance Criteria

1. Given the backend project is freshly cloned, when I read `api/.env.example`, then I find every environment variable the app reads, with descriptions and default values documented.
2. Given the app receives an HTTP request, when the request completes or raises an exception, then a structured log line is emitted at the appropriate level and no raw internal details are included in user-facing error responses.
3. Given I run the unit test suite for the service and repository layers, when tests execute, then `TodoService` business rules (not-found, partial update, delegation) are covered in isolation without a running database, and `TodoRepository` query logic is covered against an in-memory session.
4. Given Alembic is configured, when I run `alembic upgrade head` against a fresh database, then the `todos` table is created with all required columns including the reserved `user_id` column, and running `alembic upgrade head` a second time is a no-op.
5. Given a future schema change is needed, when I generate a new migration with `alembic revision --autogenerate`, then Alembic detects the delta from the current model and produces a migration file.

## Tasks / Subtasks

- [x] Verify and complete `api/.env.example` documentation (AC: 1)
  - [x] `api/.env.example` already exists from Story 0.2 code review patches with `DATABASE_URL` documented.
  - [ ] Review for completeness: confirm no other env vars are read by the app and that defaults match reality.
- [ ] Add structured request logging to the API (AC: 2)
  - [ ] Create `api/app/core/logging.py` with a structured logging setup (JSON or key-value format).
  - [ ] Add request/response logging middleware or FastAPI event handlers that emit method, path, status, and duration.
  - [ ] Ensure log level is configurable via environment variable (e.g., `LOG_LEVEL`).
  - [ ] Confirm no raw exception internals leak into user-facing responses (already enforced by `errors.py` handlers — verify logging does not bypass this).
- [ ] Add unit tests for the service layer (AC: 3)
  - [ ] Create `api/tests/unit/test_todo_service.py`.
  - [ ] Mock `TodoRepository` to test `TodoService` business rules in isolation:
    - `list_todos` delegates to repository
    - `create_todo` passes trimmed description
    - `update_todo` raises `AppError(404)` when repository returns `None`
    - `update_todo` passes partial fields correctly
    - `delete_todo` raises `AppError(404)` when repository returns `None`
- [ ] Add unit tests for the repository layer (AC: 3)
  - [ ] Create `api/tests/unit/test_todo_repository.py`.
  - [ ] Use an in-memory SQLAlchemy session to test repository query logic:
    - `list()` returns todos ordered newest-first
    - `get()` returns `None` for missing ID
    - `create()` persists and returns a todo with all fields set
    - `update()` modifies only provided fields
    - `delete()` removes the record
- [x] Verify Alembic migration scaffold works end-to-end (AC: 4, 5)
  - [x] Alembic scaffold created in Story 0.2 code review patches: `alembic.ini`, `migrations/env.py`, `migrations/script.py.mako`, `migrations/versions/0001_create_todos_table.py`.
  - [ ] Verify `alembic upgrade head` creates the table correctly against a fresh database.
  - [ ] Verify `alembic upgrade head` is idempotent (second run is a no-op).
  - [ ] Verify `alembic revision --autogenerate` detects no delta against the current model (model and migration are in sync).

## Dev Notes

- Several items in this story were partially addressed during the Story 0.2/0.3 code review cycle. Alembic scaffolding, `.env.example`, and the `user_id` column are already in the codebase. This story verifies they work correctly and adds the missing pieces (logging, unit tests).
- The architecture document explicitly calls for `api/app/core/logging.py` and `api/tests/unit/` and `api/tests/integration/` subfolders. This story is the right place to establish that test structure.
- Unit tests should use mocking for the service layer (no DB) and an in-memory session for the repository layer. The existing `conftest.py` already supports in-memory SQLite with `StaticPool`.
- Keep logging simple. A middleware that logs method, path, status code, and response time is sufficient for v1. Do not introduce a full observability stack.

### Project Structure Notes

- Architecture expects this test layout:
  - `api/tests/unit/test_todo_service.py`
  - `api/tests/unit/test_todo_repository.py`
  - `api/tests/integration/` (existing tests should be moved here, but this is optional and low-priority)
- Architecture expects `api/app/core/logging.py` for structured logging configuration.

### Technical Requirements

- Use Python's `logging` module; do not add third-party logging libraries.
- Logging format should be structured (JSON or `key=value`) for easy parsing.
- Unit tests should use `unittest.mock.MagicMock` or `pytest` fixtures to mock dependencies.
- Repository unit tests use the same `create_session_factory("sqlite:///:memory:")` pattern from `conftest.py`.

### Architecture Compliance

- Route -> Service -> Repository layering must remain intact. [Source: architecture.md]
- Logging middleware must not modify response bodies or error envelopes. [Source: architecture.md#Process Patterns]
- Unit tests validate individual layers in isolation; integration tests validate the full stack. [Source: architecture.md#Test Organization]

### Testing Requirements

- Run: `cd api && python -m pytest tests/ -v`
- All existing 9 integration tests must continue to pass.
- New unit tests should add 8-10 test cases covering service and repository layers.
- Verification commands:
  - `cd api && alembic upgrade head` (against a fresh DB)
  - `cd api && alembic upgrade head` (idempotent second run)
  - `cd api && alembic revision --autogenerate -m "test"` (should show no changes)

### References

- Epic and story source: [epics.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/epics.md#Epic-0-Backend-API-Foundation)
- Architecture patterns: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Implementation-Patterns--Consistency-Rules)
- Previous stories: [0-2](0-2-implement-the-todo-data-model-and-persistence-layer.md), [0-3](0-3-implement-todo-crud-endpoints-with-service-and-repository-layers.md)
- Deferred work from code reviews: [deferred-work.md](deferred-work.md)
