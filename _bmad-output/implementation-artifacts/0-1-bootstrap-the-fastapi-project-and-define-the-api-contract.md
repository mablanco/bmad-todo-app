# Story 0.1: Bootstrap the FastAPI Project and Define the API Contract

Status: done

## Story

As a developer building the frontend,
I want a running FastAPI service with a versioned API router and a health endpoint,
so that I have a stable, observable integration surface to build against.

## Acceptance Criteria

1. Given the backend is started, when I send `GET /api/v1/health`, then the service responds with HTTP 200 and a body indicating healthy status.
2. Given a request produces a validation error, when the API responds, then the response uses the standard error envelope `{"error": {"code": "...", "message": "...", "details": {}}}` and no raw exception details or stack traces are exposed.
3. Given the API is running, when I navigate to the OpenAPI docs URL, then the auto-generated schema reflects all registered routes and their response shapes.
4. Given the project is freshly cloned, when I inspect `api/pyproject.toml`, then all required runtime and test dependencies are declared and the project installs cleanly in a virtual environment.

## Tasks / Subtasks

- [x] Create the FastAPI application factory in `api/app/main.py` with `create_app()` (AC: 1, 3)
  - [x] Register the API router with `/api/v1` prefix.
  - [x] Configure custom OpenAPI schema generation.
- [x] Implement error handling infrastructure in `api/app/core/errors.py` (AC: 2)
  - [x] Create `AppError` exception class with `code`, `message`, `status_code`, `details`.
  - [x] Create `error_payload` helper for the standard error envelope.
  - [x] Register custom handlers for `AppError` and `RequestValidationError`.
- [x] Set up the API router and health endpoint (AC: 1, 3)
  - [x] Create `api/app/api/router.py` aggregating sub-routers.
  - [x] Create `api/app/api/routes/health.py` returning HTTP 200.
- [x] Define Pydantic schemas for API contracts (AC: 2, 3)
  - [x] Create `api/app/schemas/common.py` with `APIModel` base and `DataResponse[T]` generic wrapper.
  - [x] Create `api/app/schemas/error.py` with `ErrorBody` and `ErrorResponse`.
- [x] Configure project dependencies in `api/pyproject.toml` (AC: 4)
  - [x] Declare `fastapi`, `sqlalchemy`, `alembic` as runtime dependencies.
  - [x] Declare `httpx`, `pytest` as test dependencies.

## Dev Notes

- The app factory pattern (`create_app()`) enables test isolation via `dependency_overrides`.
- The error envelope is a cross-cutting contract used by all endpoints — `{"error": {"code", "message", "details"}}`.
- The health endpoint is intentionally minimal; it proves the router stack works.

### File List

- api/app/main.py
- api/app/api/router.py
- api/app/api/routes/health.py
- api/app/core/errors.py
- api/app/core/__init__.py
- api/app/schemas/common.py
- api/app/schemas/error.py
- api/app/schemas/__init__.py
- api/pyproject.toml

### Change Log

- 2026-03-27: Implemented and code-reviewed. All acceptance criteria verified. Story closed as done.

### Review Findings

- [x] [Review][Defer] Module-level `SessionLocal` creates database file on import — deferred, pre-existing design
