# bmad-todo-app

Monorepo scaffold for the `bmad-todo-app` frontend, backend, and test infrastructure.

## Project Structure

- `web/`: React + Vite frontend with Vitest and Playwright tooling
- `api/`: Python backend scaffold with FastAPI and `pytest`
- `tests/e2e/`: Root end-to-end tests

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

## Local Development

Run frontend and backend together:

```bash
npm run dev
```

Run one side only:

```bash
npm run dev:frontend
npm run dev:backend
```

If you prefer `make`, the root `Makefile` mirrors the same workflows:

```bash
make bootstrap
make dev
make test
make test-e2e
```

## Test Commands

Run all unit tests:

```bash
npm run test
```

Run frontend unit tests only:

```bash
npm run test:frontend
```

Run backend unit tests only:

```bash
npm run test:backend
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run the full test suite:

```bash
npm run test:all
```
