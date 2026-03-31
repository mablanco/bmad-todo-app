# Story 5.1: Create Optimized Dockerfiles for Frontend and Backend

Status: review

## Story

As a developer,
I want Dockerfiles for frontend and backend with multi-stage builds, non-root users, and health checks,
so that each service runs in a minimal, secure, production-ready container.

## Acceptance Criteria

1. Given the backend Dockerfile exists, when I build the backend image, then it uses a multi-stage build (install deps → copy app → runtime stage), the final image runs as a non-root user, and a HEALTHCHECK instruction hits `GET /api/v1/health`.
2. Given the frontend Dockerfile exists, when I build the frontend image, then it uses a multi-stage build (install deps → build static assets → serve with nginx), the final image runs as a non-root user, and a HEALTHCHECK instruction is defined.
3. Given both Dockerfiles, when I build them, then each image is under 200MB and starts in under 5 seconds.

## Tasks / Subtasks

- [x] Create the backend Dockerfile at `api/Dockerfile` (AC: 1, 3)
  - [x] Stage 1 (`builder`): use `python:3.12-slim`, install deps from `pyproject.toml` via pip.
  - [x] Stage 2 (`runtime`): copy installed packages and app code, create non-root `appuser`, expose port 8000.
  - [x] Add HEALTHCHECK using inline Python script (avoids installing curl, keeps image small).
  - [x] Entry point: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
- [x] Create the frontend Dockerfile at `web/Dockerfile` (AC: 2, 3)
  - [x] Stage 1 (`builder`): use `node:22-alpine`, install deps, run `npm run build` to produce `dist/`.
  - [x] Stage 2 (`runtime`): use `nginx:alpine`, copy `dist/` to nginx html dir, copy custom nginx config.
  - [x] Add HEALTHCHECK using `wget --spider http://localhost:3000/health`.
  - [x] Expose port 3000 via nginx config with SPA fallback and `/health` endpoint.
- [x] Create a root `.dockerignore` file (AC: 1, 2, 3)
  - [x] Exclude: `.git`, `node_modules`, `.venv`, `__pycache__`, `web/dist`, `_bmad`, `.claude`, test artifacts, IDE files.
- [x] Verify both images build and meet size/startup requirements (AC: 3)
  - [x] Backend: 189MB (under 200MB), starts in ~3s, health check reports `healthy`.
  - [x] Frontend: 62MB (under 200MB), starts in ~1s, health check reports `healthy`.
  - [x] Both containers tested with `docker run` and verified via HTTP.

## Dev Notes

- The backend runs FastAPI via uvicorn. The `pyproject.toml` declares `fastapi[standard]` which includes uvicorn. Use `pip install .` in the builder stage.
- The frontend builds via `npm run build` (`tsc -b && vite build`) producing static files in `web/dist/`. Serve with nginx for minimal runtime footprint.
- `VITE_API_BASE_URL` is a build-time env var. In Docker, default to `/api/v1` (relative) or pass via `--build-arg`. For Story 5.2 (compose), nginx will reverse-proxy to the backend.
- The health endpoint is `GET /api/v1/health` returning `{"status": "ok"}` with HTTP 200.
- Use `python:3.12-slim` (not alpine) for the backend to avoid musl libc compatibility issues with some Python packages.
- Use `node:22-alpine` for the frontend build stage — lightweight and sufficient for npm + vite.

### Backend Dockerfile Pattern

```dockerfile
# Stage 1: Install dependencies
FROM python:3.12-slim AS builder
WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Stage 2: Runtime
FROM python:3.12-slim
RUN useradd --create-home appuser && apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY app/ ./app/
COPY migrations/ ./migrations/
COPY alembic.ini .
USER appuser
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:8000/api/v1/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile Pattern

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
```

### Testing Requirements

- Build both images: `docker build -t bmad-todo-api ./api` and `docker build -t bmad-todo-web ./web`
- Check sizes: `docker images | grep bmad-todo`
- Test startup: `docker run --rm -d -p 8000:8000 bmad-todo-api` then `curl localhost:8000/api/v1/health`
- Test frontend: `docker run --rm -d -p 3000:3000 bmad-todo-web` then `curl localhost:3000`

### References

- Epic source: [epics.md](_bmad-output/planning-artifacts/epics.md#Epic-5)
- Backend deps: [pyproject.toml](api/pyproject.toml)
- Frontend build: [package.json](web/package.json)
- Health endpoint: [health.py](api/app/api/routes/health.py)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Backend image initially 227MB due to `apt-get install curl` for health check. Replaced with inline Python healthcheck script using `urllib.request`, plus stripped `__pycache__` and test directories from deps — reduced to 189MB.
- Frontend image 62MB using nginx:alpine — well under target.
- Both containers verified: backend returns `{"status":"ok"}` on `/api/v1/health`, frontend serves SPA on port 3000 with `/health` returning `ok`.
- Docker health checks confirmed: backend reports `healthy` within 30s, frontend `healthy` after first interval.
- All 31 frontend + 24 backend unit tests still pass.

### Completion Notes List

- Created `api/Dockerfile`: 2-stage build (python:3.12-slim builder → runtime), non-root `appuser`, Python-based HEALTHCHECK (no curl needed), uvicorn entrypoint on port 8000.
- Created `web/Dockerfile`: 2-stage build (node:22-alpine builder → nginx:alpine runtime), HEALTHCHECK via wget, port 3000.
- Created `web/nginx.conf`: SPA fallback with `try_files`, aggressive caching for `/assets/`, `/health` endpoint returning `ok`.
- Created `.dockerignore`: excludes git, node_modules, .venv, IDE, BMad tooling, and build artifacts.
- Image sizes: backend 189MB, frontend 62MB — both under 200MB target.

### File List

- api/Dockerfile (new)
- web/Dockerfile (new)
- web/nginx.conf (new)
- .dockerignore (new)

### Change Log

- 2026-03-31: Implemented Story 5.1 — created optimized Dockerfiles for frontend and backend with multi-stage builds, non-root users, health checks, and root .dockerignore.
