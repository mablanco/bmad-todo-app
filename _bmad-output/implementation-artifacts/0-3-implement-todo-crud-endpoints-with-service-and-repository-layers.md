# Story 0.3: Implement Todo CRUD Endpoints with Service and Repository Layers

Status: done

## Story

As a frontend developer,
I want working endpoints to list, create, update, and delete todos,
so that the frontend can persist and manage todo state through the API.

## Acceptance Criteria

1. Given todos exist in the database, when I send `GET /api/v1/todos`, then the response is `{"data": [...]}` with todos ordered newest-first, and each todo includes `id`, `description`, `completed`, `created_at`, and `updated_at`.
2. Given a valid payload `{"description": "Buy milk"}`, when I send `POST /api/v1/todos`, then the response is HTTP 201 with `{"data": {...}}` containing the created todo.
3. Given an empty or whitespace-only description is submitted, when the API validates the payload, then the response is HTTP 422 with a `VALIDATION_ERROR` error envelope and no todo is persisted.
4. Given a todo exists with a known `todoId`, when I send `PATCH /api/v1/todos/{todoId}` with `{"completed": true}`, then the response is HTTP 200 with the updated todo in a `{"data": {...}}` envelope and the change is persisted.
5. Given a `todoId` that does not exist, when I send `PATCH` or `DELETE` for that id, then the response is HTTP 404 with a `TODO_NOT_FOUND` error envelope.
6. Given a todo exists, when I send `DELETE /api/v1/todos/{todoId}`, then the response is HTTP 204 with no body and the todo is removed from subsequent list responses.
7. Given the backend integration test suite runs, when all tests execute against an isolated in-memory database, then all tests pass and each CRUD operation and its primary error path is covered.

## Tasks / Subtasks

- [x] Implement the repository layer for data access (AC: 1, 2, 4, 6)
  - [x] Create `api/app/repositories/todo_repository.py` with `list`, `get`, `create`, `update`, `delete` methods.
  - [x] Use `select().order_by(Todo.created_at.desc())` for newest-first ordering.
- [x] Implement the service layer for business logic (AC: 2, 4, 5, 6)
  - [x] Create `api/app/services/todo_service.py` wrapping repository with not-found checks.
  - [x] Raise `AppError(code="TODO_NOT_FOUND", status_code=404)` for missing resources.
- [x] Implement Pydantic request/response schemas (AC: 2, 3, 4)
  - [x] Create `api/app/schemas/todo.py` with `TodoRead`, `TodoCreate`, `TodoUpdate`.
  - [x] Add `model_validator` for trim + empty/max-length checks in `TodoCreate` and `TodoUpdate`.
  - [x] Use `Field(max_length=500)` so OpenAPI schema reflects `maxLength: 500`.
- [x] Create CRUD route handlers (AC: 1, 2, 3, 4, 5, 6)
  - [x] Create `api/app/api/routes/todos.py` with `GET`, `POST`, `PATCH /{todoId}`, `DELETE /{todoId}`.
  - [x] Use `Annotated[str, Path(min_length=1, max_length=36)]` for `todoId` validation.
  - [x] Wire routes through `build_service(db)` factory.
- [x] Add integration tests (AC: 7)
  - [x] Create `api/tests/test_todos_api.py` covering list, create, validate, update, not-found, delete.
  - [x] Add `test_list_todos_returns_newest_first` for ordering guarantee.
  - [x] Update `api/tests/conftest.py` with isolated in-memory DB fixture.

## Dev Notes

- Route handlers use `build_service(db)` to construct the service+repository per request. This keeps the route layer thin and testable via DI override.
- The `todoId` path parameter is bounded to 36 characters (UUID format) to prevent oversized input reaching the DB.
- `Field(max_length=500)` is used alongside the `model_validator` — Field ensures OpenAPI docs reflect the constraint, the validator handles trim-then-check logic.

### File List

- api/app/api/routes/todos.py
- api/app/repositories/todo_repository.py
- api/app/repositories/__init__.py
- api/app/services/todo_service.py
- api/app/services/__init__.py
- api/app/schemas/todo.py
- api/tests/test_todos_api.py
- api/tests/conftest.py

### Change Log

- 2026-03-27: Implemented and code-reviewed. Patches applied for `todoId` validation, `Field(max_length)`, and ordering test. All 9 backend tests passing. Story closed as done.

### Review Findings

- [x] [Review][Patch] `todoId` path parameter accepted arbitrarily long strings — fixed with `Path(min_length=1, max_length=36)` [routes/todos.py:15]
- [x] [Review][Patch] `Field` imported but unused for length validation — fixed, OpenAPI now reflects `maxLength: 500` [schemas/todo.py]
- [x] [Review][Patch] No test verified newest-first ordering — fixed, `test_list_todos_returns_newest_first` added [test_todos_api.py]
- [x] [Review][Defer] SQLAlchemy IntegrityError on concurrent writes — deferred, out of scope for single-user MVP
- [x] [Review][Defer] Health test does not exercise new client fixture — deferred, minor gap
