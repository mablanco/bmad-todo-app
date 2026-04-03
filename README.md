# bmad-todo-app

A calm, focused todo application with a React frontend and FastAPI backend, built entirely using the [BMad Method](https://github.com/bmadcode/BMAD-METHOD) as a proof of concept for AI-driven software development.

This project demonstrates the full BMad lifecycle — from product brief and architecture through implementation, testing, Docker containerization, and QA — with AI agents (Claude Code, Codex/GPT-5.4, Cursor, Gemini CLI) handling planning, coding, code review, and quality assurance under human oversight. See [AI-DEVELOPMENT-LOG.md](AI-DEVELOPMENT-LOG.md) for a detailed account of how AI was used and where human expertise was critical.

## Project Structure

- `web/` — React + TypeScript + Vite frontend with TanStack Query
- `api/` — Python FastAPI backend with SQLAlchemy + SQLite
- `web/tests/e2e/` — Playwright end-to-end tests

## Prerequisites

- Node.js 18+
- Python 3.11+

## Bootstrap

Install everything from the repo root:

```bash
npm run bootstrap
```

Install one side only:

```bash
npm run bootstrap:frontend
npm run bootstrap:backend
```

The backend bootstrap creates a local `.venv/` and installs the Python API dependencies there.

## Environment Configuration

Copy the example files and adjust as needed:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

| Variable | Location | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | `api/.env` | `sqlite:///./bmad_todo.db` | Database connection URL |
| `LOG_LEVEL` | `api/.env` | `INFO` | Logging level (DEBUG, INFO, WARNING, ERROR) |
| `ALLOWED_ORIGINS` | `api/.env` | local dev + E2E origins | Comma-separated frontend origins allowed by the API |
| `VITE_API_BASE_URL` | `web/.env` | `http://127.0.0.1:8000` | Backend API base URL |

## Local Development

Run frontend and backend together:

```bash
npm run dev
```

Run one side only:

```bash
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://127.0.0.1:8000
```

If you prefer `make`, the root `Makefile` mirrors the same workflows:

```bash
make bootstrap
make dev
make test
make test-e2e
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/todos` | List all todos (newest-first) |
| `POST` | `/api/v1/todos` | Create a todo |
| `PATCH` | `/api/v1/todos/{todoId}` | Update a todo (toggle completion) |
| `DELETE` | `/api/v1/todos/{todoId}` | Delete a todo |

## Test Commands

```bash
npm run test           # All unit tests (frontend + backend)
npm run test:frontend  # Frontend unit tests only (Vitest)
npm run test:backend   # Backend unit tests only (pytest)
npm run test:e2e       # End-to-end tests (Playwright, auto-starts frontend + backend)
npm run test:all       # Full test suite
```

`npm run test:e2e` uses an isolated SQLite database under `/tmp` and resets backend state between tests so the suite stays repeatable.

## Project Documentation

- [DELIVERABLES.md](DELIVERABLES.md) — Index of all project deliverables: planning artifacts, story files, test suites, Docker setup, QA reports, and process documentation
- [AI-DEVELOPMENT-LOG.md](AI-DEVELOPMENT-LOG.md) — Record of AI agent usage, MCP server integrations, test generation approach, debugging cases, and limitations encountered
