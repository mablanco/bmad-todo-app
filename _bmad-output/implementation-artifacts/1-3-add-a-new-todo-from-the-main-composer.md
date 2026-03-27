# Story 1.3: Add a New Todo from the Main Composer

Status: review

## Story

As a solo user,
I want to enter a task quickly and add it from the main screen,
so that I can capture work the moment I think of it.

## Acceptance Criteria

1. Given I am on the main todo screen, when I type a valid task description and submit it by button or keyboard, then the app creates the todo through `POST /api/v1/todos` and the new task appears clearly in the list without a full page reload.
2. Given I submit an empty description or a description longer than 500 characters after trim, when validation runs, then the app prevents submission and shows inline, accessible validation feedback near the input.
3. Given a create request succeeds, when the response returns, then the input resets to a ready state and focus behavior remains logical for continued capture.
4. Given a create request fails, when the backend returns an error, then the app preserves my typed value and shows calm, actionable error feedback without losing orientation.

## Tasks / Subtasks

- [x] Add the frontend create-todo contract and mutation hook (AC: 1, 4)
  - [x] Extend the todo feature API layer with `POST /api/v1/todos`.
  - [x] Add a mutation hook that updates the shared todo query state without a full page reload.
- [x] Upgrade the main composer from placeholder shell to working create flow (AC: 1, 2, 3, 4)
  - [x] Manage input state locally in `TodoComposer`.
  - [x] Add inline validation for trimmed empty input and descriptions longer than 500 characters.
  - [x] Preserve the typed value on backend failure and reset it on success.
  - [x] Keep keyboard submit working and maintain logical focus after success.
- [x] Integrate mutation state into the existing shell without collapsing Story 1.2 list behavior (AC: 1, 4)
  - [x] Keep the list, empty state, and query-driven shell intact.
  - [x] Ensure a newly created todo appears immediately in the rendered list.
- [x] Add frontend tests for create success, validation, and failure handling (AC: 1, 2, 3, 4)
  - [x] Cover button or form submission for a valid task.
  - [x] Cover client-side validation for blank and oversized descriptions.
  - [x] Cover backend failure preserving the typed value and showing calm feedback.

## Dev Notes

- Story 1.2 already established the list query, error normalization, and TanStack Query provider. Build on that foundation rather than introducing a second request or state-management path.
- The backend contract already exists at `POST /api/v1/todos` and trims/validates descriptions server-side. Frontend validation in this story should mirror the same 1..500 trimmed rule for fast feedback, but the backend remains the source of truth.
- Keep this story scoped to create behavior only. Toggle, delete, and richer mutation-state visuals belong to later stories.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story 1.2 already provided the list query, API client, and error normalization.
- `npm run test:frontend` passed.
- `npm run build:frontend` passed.
- `npm run test` passed, including backend regression coverage.

### Completion Notes List

- Added the frontend `POST /api/v1/todos` contract and a dedicated `useCreateTodo` mutation hook built on the existing TanStack Query cache.
- Replaced the placeholder composer behavior with a controlled form that validates the trimmed `1..500` rule, preserves typed text on failure, and clears plus refocuses on success.
- Updated the todo cache immediately after successful creation so the new task appears without a page reload.
- Added frontend tests for create success, inline validation, backend failure handling, and preserved the existing Story 1.2 coverage.

### File List

- _bmad-output/implementation-artifacts/1-3-add-a-new-todo-from-the-main-composer.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- web/src/App.test.tsx
- web/src/app/styles/globals.css
- web/src/features/todos/api/todos.ts
- web/src/features/todos/components/TodoComposer.tsx
- web/src/features/todos/hooks/useCreateTodo.ts
- web/src/features/todos/types/todo.ts

### Change Log

- 2026-03-27: Implemented Story 1.3 by wiring the composer to the existing create endpoint, adding inline validation and error handling, updating the shared todo query cache after creation, and expanding frontend test coverage for the create flow.
