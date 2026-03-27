# Story 1.2: Connect the Web App to the Todo List API

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo user,
I want the app to load my current todos from the backend on page load,
so that I can trust the app as the source of truth for my list.

## Acceptance Criteria

1. Given todos exist in the backend, when I open or reload the app, then the frontend requests `GET /api/v1/todos` and the returned todos are rendered in newest-first order.
2. Given no todos exist in the backend, when I open the app, then the frontend renders the dedicated empty state rather than a blank or broken screen.
3. Given the initial list request fails, when the API returns an error, then the app shows a dedicated error state with calm, non-technical language, and a retry action is available without requiring a page refresh.

## Tasks / Subtasks

- [x] Add the frontend data-loading foundation using the architecture-selected query pattern (AC: 1, 2, 3)
  - [x] Add `@tanstack/react-query` to the frontend and create `web/src/app/providers/QueryProvider.tsx`.
  - [x] Update `web/src/App.tsx` to mount the todo shell inside the query provider rather than keeping the shell entirely standalone.
  - [x] Keep routing absent for now; this story still targets the single-route app.
- [x] Add the API client and todo-list data access layer for `GET /api/v1/todos` (AC: 1, 3)
  - [x] Create `web/src/lib/env.ts` to resolve the API base URL using frontend env configuration with a sensible local default.
  - [x] Create `web/src/lib/api-client.ts` for JSON requests and shared error handling.
  - [x] Create `web/src/lib/errors.ts` to normalize the backend `{ error: { code, message, details } }` envelope into frontend-safe messages.
  - [x] Create `web/src/features/todos/types/todo.ts` and `web/src/features/todos/api/todos.ts` to model and fetch the list response shape.
- [x] Add the todo list query hook and UI state components (AC: 1, 2, 3)
  - [x] Create `web/src/features/todos/hooks/useTodos.ts`.
  - [x] Create `web/src/features/todos/components/TodoList.tsx`.
  - [x] Create `web/src/features/todos/components/TodoLoadingState.tsx`.
  - [x] Create `web/src/features/todos/components/TodoErrorState.tsx`.
  - [x] Reuse the existing `TodoEmptyState` for the empty-list case rather than introducing a second empty-state pattern.
- [x] Integrate loaded, empty, and failed states into the current shell without leaking API details into presentation components (AC: 1, 2, 3)
  - [x] Update `TodoAppShell.tsx` so it composes the query hook and the correct state component (`TodoList`, `TodoEmptyState`, `TodoLoadingState`, `TodoErrorState`).
  - [x] Ensure `TodoComposer` remains present at the top of the screen in all relevant list states.
  - [x] Keep `TodoList` read-only in this story; toggling, deletion, and create mutation behavior belong to later stories.
- [x] Add tests for initial load behavior and failure recovery (AC: 1, 2, 3)
  - [x] Add frontend tests covering: populated list render, empty list render, and error state with retry.
  - [x] Verify newest-first ordering in the rendered list.
  - [x] Run `npm run test:frontend` and confirm the frontend still builds successfully after adding the query/data layer.

## Dev Notes

- Story 1.1 already introduced the first shell, shared style tokens, and the initial component folders. Reuse those components and styles rather than rebuilding the shell in a different shape.
- Story 1.1 is currently in `review`, not `done`. That means Story 1.2 should build on the existing implementation baseline, but avoid unnecessary churn in the same files beyond what is needed to wire data loading.
- This story is the first place where the architecture-selected TanStack Query approach should actually appear in code. It is not currently installed in `web/package.json`, so adding `@tanstack/react-query` here is expected and within story scope. Do not substitute Axios, SWR, Zustand, or a custom global store. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- The backend CRUD API is already implemented and tested. This story should consume the existing `GET /api/v1/todos` endpoint and the documented success/error envelopes rather than redefining the API surface. [Source: /home/mablanco/Repos/github/bmad-todo/api/app/api/routes/todos.py] [Source: /home/mablanco/Repos/github/bmad-todo/api/tests/test_todos_api.py]
- UX intent matters here: the first load should feel calm and trustworthy. Loading should preserve orientation, empty should feel intentional, and errors should offer a local retry instead of collapsing the whole page into confusion. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Journey-1-First-Task-Capture] [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Feedback-Patterns]

### Project Structure Notes

- The architecture target structure for Story 1.2 maps cleanly to the current gaps in the repo:
  - existing: `web/src/features/todos/components/TodoAppShell.tsx`, `TodoComposer.tsx`, `TodoEmptyState.tsx`
  - missing and appropriate to add now: `web/src/app/providers/QueryProvider.tsx`, `web/src/lib/api-client.ts`, `web/src/lib/env.ts`, `web/src/lib/errors.ts`, `web/src/features/todos/api/todos.ts`, `web/src/features/todos/hooks/useTodos.ts`, `web/src/features/todos/types/todo.ts`, `web/src/features/todos/components/TodoList.tsx`, `TodoLoadingState.tsx`, `TodoErrorState.tsx`
- Keep the code feature-first. `TodoAppShell` can coordinate state composition, but raw fetch logic should not live inside the component tree.

### Technical Requirements

- Frontend must call `GET /api/v1/todos` on initial load and use the backend as the source of truth for the list.
- Success responses from the backend arrive as `{ "data": [...] }`.
- Failure responses arrive as `{ "error": { "code": string, "message": string, "details": object } }`.
- The list must render newest-first, matching the backend response ordering assumption.
- The app must differentiate loading, empty, and error states clearly.
- Retry on list-load failure must be available in the UI without requiring a browser refresh.
- Story scope stops at read/list behavior. Do not implement create mutation wiring, toggle, or delete in this story.

### Architecture Compliance

- Use TanStack Query for server-state loading and retries. Do not add another client state library. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- Keep API calls behind a frontend feature API layer and query logic inside hooks. `TodoAppShell` and child components should not construct fetch requests directly. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Architectural-Boundaries]
- Keep empty/loading/error views as dedicated components rather than large conditional branches scattered across multiple files. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Architectural-Boundaries]
- Preserve the existing single-column shell and Soft Calm visual language introduced in Story 1.1.

### Library / Framework Requirements

- Existing frontend stack:
  - React `^19.2.4`
  - Vite `^8.0.1`
  - Vitest `^4.1.2`
  - Testing Library React `^16.3.2`
- Approved addition for this story:
  - `@tanstack/react-query` as the server-state layer selected in the architecture
- Prefer the platform `fetch` API inside the shared client layer unless a compelling repo-local reason appears; do not introduce Axios here because the architecture did not choose it and the need is not justified by current scope.

### Backend Contract Notes

- Endpoint: `GET /api/v1/todos`
- Success shape:
  ```json
  {
    "data": [
      {
        "id": "todo-id",
        "description": "Write integration tests",
        "completed": false,
        "created_at": "2026-03-27T10:00:00Z",
        "updated_at": "2026-03-27T10:00:00Z"
      }
    ]
  }
  ```
- Empty success shape:
  ```json
  {
    "data": []
  }
  ```
- Example error shape:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Request validation failed.",
      "details": {}
    }
  }
  ```
- Not-found examples exist for later mutation stories (`TODO_NOT_FOUND`), but Story 1.2 only needs list-load error handling.

### Previous Story Intelligence

- Story 1.1 established the current shell and style primitives:
  - `web/src/features/todos/components/TodoAppShell.tsx`
  - `web/src/features/todos/components/TodoComposer.tsx`
  - `web/src/features/todos/components/TodoEmptyState.tsx`
  - `web/src/app/styles/tokens.css`
  - `web/src/app/styles/globals.css`
- Story 1.1 also removed the Vite starter assets and layout. Do not reintroduce starter-specific imports, copy, or styling shortcuts.
- Story 1.1 verification already passed with `npm run test:frontend`, `npm run build:frontend`, and `npm run test`. Story 1.2 should preserve that baseline.

### File Structure Requirements

- Expected files to touch:
  - `web/package.json`
  - `web/src/App.tsx`
  - `web/src/app/providers/QueryProvider.tsx`
  - `web/src/lib/api-client.ts`
  - `web/src/lib/env.ts`
  - `web/src/lib/errors.ts`
  - `web/src/features/todos/api/todos.ts`
  - `web/src/features/todos/hooks/useTodos.ts`
  - `web/src/features/todos/types/todo.ts`
  - `web/src/features/todos/components/TodoAppShell.tsx`
  - `web/src/features/todos/components/TodoList.tsx`
  - `web/src/features/todos/components/TodoLoadingState.tsx`
  - `web/src/features/todos/components/TodoErrorState.tsx`
  - frontend test files such as `web/src/App.test.tsx` and/or feature-local tests
- Likely no backend code changes are needed for Story 1.2 because the list endpoint already exists and passes integration tests.

### Testing Requirements

- Frontend tests should verify:
  - populated list state renders fetched todos
  - empty response renders the empty state instead of a blank shell
  - list load failure renders a dedicated error state with retry
  - retry can re-run the request without a page refresh
  - ordering is newest-first from the rendered perspective
- Verification commands:
  - `npm run test:frontend`
  - `npm run build:frontend`
- Keep existing backend regression intact; if you touch shared root workflows, also run `npm run test`.

### References

- Epic and story source: [epics.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/epics.md#Epic-1-Trustworthy-Task-Capture)
- Story 1.1 context: [1-1-replace-starter-ui-with-the-task-capture-shell.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/implementation-artifacts/1-1-replace-starter-ui-with-the-task-capture-shell.md)
- API architecture: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#API--Communication-Patterns)
- Frontend architecture: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend-Architecture)
- Project structure and boundaries: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Project-Structure--Boundaries)
- UX journeys: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#User-Journey-Flows)
- UX component strategy: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Component-Strategy)
- UX consistency patterns: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#UX-Consistency-Patterns)
- Current shell components: [TodoAppShell.tsx](/home/mablanco/Repos/github/bmad-todo/web/src/features/todos/components/TodoAppShell.tsx), [TodoComposer.tsx](/home/mablanco/Repos/github/bmad-todo/web/src/features/todos/components/TodoComposer.tsx), [TodoEmptyState.tsx](/home/mablanco/Repos/github/bmad-todo/web/src/features/todos/components/TodoEmptyState.tsx)
- Implemented backend endpoint and schema: [todos.py](/home/mablanco/Repos/github/bmad-todo/api/app/api/routes/todos.py), [todo.py](/home/mablanco/Repos/github/bmad-todo/api/app/schemas/todo.py), [common.py](/home/mablanco/Repos/github/bmad-todo/api/app/schemas/common.py), [errors.py](/home/mablanco/Repos/github/bmad-todo/api/app/core/errors.py), [test_todos_api.py](/home/mablanco/Repos/github/bmad-todo/api/tests/test_todos_api.py)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story 1.1 exists and is currently in `review`.
- No project-context file was found during story creation.
- Backend list API already exists and passes integration tests.
- `npm run test:frontend` passed.
- `npm run build:frontend` passed.
- `npm run test` passed, including backend regression coverage.

### Completion Notes List

- Comprehensive Story 1.2 developer guide created from the approved epic, architecture, UX spec, current repo surface, and Story 1.1 learnings.
- Story explicitly authorizes the architecture-selected `@tanstack/react-query` addition because the current `web/package.json` does not yet include it.
- Scope stayed constrained to list loading, empty/error/loading states, and retry behavior only.
- Added the TanStack Query provider, shared frontend API/error/env utilities, and the `useTodos` query hook.
- Connected `TodoAppShell` to the live `GET /api/v1/todos` backend flow and added dedicated list, loading, and error components.
- Added frontend tests for populated, empty, and error-with-retry states, including newest-first rendering order.
- Verified the implementation with `npm run test:frontend`, `npm run build:frontend`, and `npm run test`.

### File List

- _bmad-output/implementation-artifacts/1-2-connect-the-web-app-to-the-todo-list-api.md
- web/package.json
- web/package-lock.json
- web/src/App.tsx
- web/src/App.test.tsx
- web/src/app/providers/QueryProvider.tsx
- web/src/app/styles/globals.css
- web/src/features/todos/api/todos.ts
- web/src/features/todos/components/TodoAppShell.tsx
- web/src/features/todos/components/TodoErrorState.tsx
- web/src/features/todos/components/TodoList.tsx
- web/src/features/todos/components/TodoLoadingState.tsx
- web/src/features/todos/hooks/useTodos.ts
- web/src/features/todos/types/todo.ts
- web/src/lib/api-client.ts
- web/src/lib/env.ts
- web/src/lib/errors.ts

### Change Log

- 2026-03-27: Implemented Story 1.2 by wiring the frontend shell to the existing todo list API with TanStack Query, introducing dedicated list/loading/error states, and adding frontend tests for populated, empty, and retry flows.
