# Story 4.3: Establish End-to-End Confidence for the Core Todo Loop

Status: review

## Tasks / Subtasks

- [x] Replace stale E2E smoke test with actual todo app coverage
  - [x] Removed old "Get started" starter page test
  - [x] Added: loads app and shows capture shell
  - [x] Added: creates a todo from the composer
  - [x] Added: toggles a todo between active and completed
  - [x] Added: deletes a todo from the list
  - [x] Added: persists todos across page reload
- [x] Tests verify visible user-facing outcomes (headings, text, classes)

## Dev Notes

- E2E tests require both frontend and backend running. The Playwright config auto-starts the dev server.
- Tests are designed to run against a real backend with a real database. Each test creates its own data.
- The tests cover the complete CRUD loop: create → read → update (toggle) → delete, plus reload persistence.

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes List
- Replaced stale Vite starter smoke test with 5 E2E tests covering the full todo CRUD loop.
- Tests verify user-visible outcomes: headings, text content, CSS classes, empty state transitions.

### File List
- tests/e2e/smoke.spec.ts (modified — complete rewrite)

### Change Log
- 2026-03-31: Rewrote E2E test suite with 5 tests covering the core todo loop.
