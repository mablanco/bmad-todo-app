# Story 5.2: Create Docker Compose for Container Orchestration

Status: review

## Story

As a developer,
I want a docker-compose.yml that orchestrates all containers with proper networking, volume mounts, and environment configuration,
so that I can start the full stack with a single command.

## Acceptance Criteria

1. Given `docker-compose.yml` exists, when I run `docker compose up`, then the backend and frontend services start, and the app is accessible on `http://localhost:3000` (frontend) and `http://localhost:8000` (backend).
2. Given the compose file defines volume mounts, when the database restarts, then data persists across restarts via a named volume.
3. Given the compose file defines environment configuration, when services start, then each service receives its environment variables from `.env` files or compose environment sections.

## Tasks / Subtasks

- [x] Create `docker-compose.yml` with api and web services (AC: 1, 3)
  - [x] Define `api` service building from `./api`, exposed on port 8000, with environment variables and health check.
  - [x] Define `web` service building from `./web`, exposed on port 3000, dependent on api being healthy.
  - [x] Add nginx reverse proxy for `/api/` to avoid CORS — browser hits `localhost:3000/api/...`, nginx proxies to `api:8000`.
- [x] Update `web/nginx.conf` to proxy API requests to the backend (AC: 1)
  - [x] Add `location /api/ { proxy_pass http://api:8000; }` block with proxy headers.
  - [x] Set `VITE_API_BASE_URL` to empty string at build time so the frontend uses same-origin requests.
  - [x] Updated web Dockerfile to accept `VITE_API_BASE_URL` as a build arg.
- [x] Add a named volume for SQLite persistence (AC: 2)
  - [x] Mount `api-data` volume to `/app/data`, `DATABASE_URL` points to `/app/data/bmad_todo.db`.
  - [x] Created `/app/data` directory in Dockerfile.
  - [x] Verified data persists across `docker compose restart`.
- [x] Verify the full stack starts and works end-to-end (AC: 1, 2, 3)
  - [x] `docker compose up --build` starts both services — api healthy, web healthy.
  - [x] CRUD operations work through nginx proxy (`localhost:3000/api/v1/todos`).
  - [x] Data persists after restart.
  - [x] Fixed web healthcheck to use `127.0.0.1` instead of `localhost` (IPv6 issue on Alpine).

## Dev Notes

- The frontend uses `VITE_API_BASE_URL` at build time. In Docker Compose, nginx proxies `/api/` to the backend, so the frontend should use relative paths. Set `VITE_API_BASE_URL=` (empty) as a build arg.
- SQLite stores data in `api/bmad_todo.db`. Mount a named volume to `/app` in the backend container so the DB file persists.
- CORS: with nginx reverse proxy, the browser sees same-origin requests (`localhost:3000`), so CORS is not needed for the Docker setup.

### References

- Story 5.1 Dockerfiles: [api/Dockerfile](api/Dockerfile), [web/Dockerfile](web/Dockerfile)
- nginx config: [web/nginx.conf](web/nginx.conf)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Initial start failed: port 8000 conflict with local dev server — killed and retried.
- SQLite "unable to open database file" — `/app/data/` dir didn't exist; added `mkdir -p /app/data` to Dockerfile.
- Web healthcheck `unhealthy` — Alpine wget defaults to IPv6 (`[::1]`), nginx listens on IPv4; fixed to `127.0.0.1`.
- After fixes: both services `healthy`, CRUD works via proxy, data persists across restarts.

### Completion Notes List

- Created `docker-compose.yml` with `api` and `web` services, named `api-data` volume, and `depends_on` health gate.
- Updated `web/nginx.conf` with `/api/` reverse proxy to `http://api:8000` (avoids CORS entirely).
- Updated `web/Dockerfile` to accept `VITE_API_BASE_URL` as build arg (empty string for Docker Compose = same-origin).
- Updated `api/Dockerfile` to create `/app/data` directory for volume-mounted SQLite.
- Fixed web Dockerfile healthcheck to use `127.0.0.1` instead of `localhost`.
- Verified: `docker compose up --build` → both healthy, CRUD works via proxy, data persists.

### File List

- docker-compose.yml (new)
- web/nginx.conf (modified — API proxy)
- web/Dockerfile (modified — build arg)
- api/Dockerfile (modified — /app/data dir)

### Change Log

- 2026-04-01: Implemented Story 5.2 — Docker Compose orchestration with nginx reverse proxy, named volume persistence, and health-gated service startup.
