# Deferred Work

## Deferred from: code review of Epic 0 stories 0.1, 0.2, 0.3 (2026-03-27)

- **Module-level `SessionLocal` creates database file on import** [`api/app/db/session.py`] — `SessionLocal = create_session_factory()` runs at module level, immediately opening or creating the SQLite file when the module is imported; pre-existing design, test isolation is handled by the DI override in conftest.py.
- **No rollback on SQLAlchemy IntegrityError during concurrent writes** [`api/app/repositories/todo_repository.py`] — Simultaneous writes to the same row could raise an uncaught `IntegrityError`, returning a 500 instead of a structured error; out of scope for single-user MVP, relevant when multi-user is introduced.
- **Connection pool exhaustion raises unhandled exception** [`api/app/db/session.py`] — If the engine cannot allocate a connection, `SessionLocal()` will raise into the request handler uncaught; low risk for SQLite single-process deployment, deferred to production hardening.
- **`db.refresh()` failure after successful commit leaves client in unknown state** [`api/app/repositories/todo_repository.py`] — If `refresh()` raises after `commit()` succeeds, the data is persisted but the client receives a 500 with no body; architectural complexity beyond MVP scope.
- **Health test does not exercise full app wiring via new client fixture** [`api/tests/test_health.py`] — The health test was not updated to use the new `client` fixture that exercises exception handler registration; minor gap, health endpoint has no exception handling path to test.
