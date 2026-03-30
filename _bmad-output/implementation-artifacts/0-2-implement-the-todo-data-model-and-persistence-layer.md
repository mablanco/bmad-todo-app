# Story 0.2: Implement the Todo Data Model and Persistence Layer

Status: done

## Story

As a developer,
I want a defined SQLAlchemy Todo model with a session factory and dependency injection wiring,
so that routes can read and write todos through a clean, testable persistence boundary.

## Acceptance Criteria

1. Given the application starts, when the database layer initialises, then a `todos` table exists with columns: `id` (UUID string), `description` (max 500 chars), `completed` (boolean, default false), `created_at` (UTC timestamp), `updated_at` (UTC timestamp), and a nullable `user_id` column is reserved for future per-user scoping.
2. Given a FastAPI route handler requests a DB session via `Depends(get_db)`, when the dependency resolves, then a valid SQLAlchemy session is injected and the session is closed cleanly after the request completes.
3. Given the database URL needs to differ between environments, when the `DATABASE_URL` environment variable is set, then the application uses that value instead of the default SQLite path, and `api/.env.example` documents the available environment variables.
4. Given the schema changes in the future, when a migration is run via Alembic, then the change is tracked in a versioned migration file under `api/migrations/versions/` and an initial migration capturing the v1 `todos` table already exists.

## Tasks / Subtasks

- [x] Create the SQLAlchemy declarative base and Todo ORM model (AC: 1)
  - [x] Create `api/app/db/base.py` with `Base` class.
  - [x] Create `api/app/db/models/todo.py` with all required columns including `user_id`.
  - [x] Use `DateTime(timezone=True)` for timestamp columns and `utc_now()` default.
- [x] Create the session factory and dependency injection wiring (AC: 2)
  - [x] Create `api/app/db/session.py` with `create_session_factory()` and `get_db_session()`.
  - [x] Create `api/app/dependencies/db.py` wrapping the session generator for FastAPI `Depends`.
  - [x] Add rollback on exception in the session lifecycle.
  - [x] Support `StaticPool` for in-memory SQLite (test isolation).
- [x] Make the database URL configurable from environment (AC: 3)
  - [x] Update `api/app/core/config.py` to read `DATABASE_URL` from `os.environ`.
  - [x] Create `api/.env.example` documenting the variable.
- [x] Set up Alembic migration infrastructure (AC: 4)
  - [x] Add `alembic` to `pyproject.toml` runtime dependencies.
  - [x] Create `api/alembic.ini`, `api/migrations/env.py`, `api/migrations/script.py.mako`.
  - [x] Create initial migration `0001_create_todos_table.py` with all columns including `user_id`.

## Dev Notes

- The `create_all()` call in `create_session_factory` remains as a convenience for development. Alembic is the authoritative schema management path for tracked changes.
- `StaticPool` is required for `sqlite:///:memory:` so all connections share the same in-memory database during tests.
- The `user_id` column is nullable and unused in v1, reserved per architecture decision NFR-006.

### File List

- api/app/db/base.py
- api/app/db/models/todo.py
- api/app/db/models/__init__.py
- api/app/db/session.py
- api/app/db/__init__.py
- api/app/dependencies/db.py
- api/app/dependencies/__init__.py
- api/app/core/config.py
- api/.env.example
- api/alembic.ini
- api/migrations/env.py
- api/migrations/script.py.mako
- api/migrations/versions/0001_create_todos_table.py
- api/pyproject.toml

### Change Log

- 2026-03-27: Initial implementation and code review. Gaps identified (missing user_id, Alembic, env config) and patched. All acceptance criteria now verified. Story closed as done.

### Review Findings

- [x] [Review][Patch] Session not rolled back on exception — fixed, added `except: db.rollback()` [db/session.py:29]
- [x] [Review][Patch] `user_id` nullable column missing from Todo model — fixed [db/models/todo.py:22]
- [x] [Review][Patch] `DATABASE_URL` not env-configurable + `.env.example` absent — fixed [core/config.py]
- [x] [Review][Patch] No Alembic migrations — fixed, full scaffold created [migrations/]
- [x] [Review][Patch] Tests used file-based SQLite instead of in-memory — fixed with `StaticPool` [tests/conftest.py]
- [x] [Review][Defer] Connection pool exhaustion raises unhandled exception — deferred, low risk for SQLite
- [x] [Review][Defer] `db.refresh()` failure after commit leaves client in unknown state — deferred, beyond MVP scope
