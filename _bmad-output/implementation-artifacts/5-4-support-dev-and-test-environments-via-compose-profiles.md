# Story 5.4: Support Dev and Test Environments via Compose Profiles

Status: review

## Tasks / Subtasks

- [x] Add `dev` profile with source mounts and auto-reload
  - [x] `api-dev` service: mounts `./api/app` read-only, runs uvicorn with `--reload`, `LOG_LEVEL=DEBUG`.
- [x] Add `test` profile with isolated database
  - [x] `api-test` service: uses `/tmp/test_bmad_todo.db` for ephemeral test database, `LOG_LEVEL=WARNING`.
- [x] Support environment variable overrides
  - [x] `LOG_LEVEL` uses `${LOG_LEVEL:-INFO}` syntax so it can be overridden via `.env` or CLI.
  - [x] All environment config externalized — no compose file edits needed for overrides.

## Dev Notes

- `docker compose --profile dev up` starts `api-dev` (with reload) + `web`
- `docker compose --profile test up api-test` starts the test backend only
- Default `docker compose up` uses the production-like `api` + `web` services (no profile needed)
- Dev and production `api` services cannot run simultaneously on the same port — use one or the other.

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes List
- Added `api-dev` service under `dev` profile: source mounts, auto-reload, debug logging.
- Added `api-test` service under `test` profile: ephemeral `/tmp` database, warning-level logging.
- Made `LOG_LEVEL` overridable via env var substitution in default service.

### File List
- docker-compose.yml (modified)

### Change Log
- 2026-04-01: Implemented Story 5.4 — added dev and test compose profiles with source mounts, auto-reload, isolated databases, and env var overrides.
