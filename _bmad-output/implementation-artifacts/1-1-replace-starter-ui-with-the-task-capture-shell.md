# Story 1.1: Replace Starter UI with the Task Capture Shell

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo user,
I want to land on a focused todo screen instead of a starter page,
so that I immediately understand the app's purpose and where to act.

## Acceptance Criteria

1. Given I open the web app, when the main screen renders, then I see a focused single-column todo layout aligned with the Soft Calm direction and the starter Vite content is no longer present.
2. Given I open the web app with no tasks yet, when the initial screen loads, then I see a clear task-entry area and an intentional empty-state prompt, and the empty state directs me toward adding my first task.
3. Given I use the app on mobile or desktop, when the layout renders, then the main content remains single-column and readable from 320px upward, and interactive controls remain visually clear and reachable.

## Tasks / Subtasks

- [x] Replace the Vite starter experience in `web/src/App.tsx` with the first todo-focused shell (AC: 1, 2)
  - [x] Remove starter-specific content, assets, and copy (`Get started`, Vite/React promos, counter button, social/docs sections).
  - [x] Make `App.tsx` mount a todo shell component instead of inline starter markup, following the architecture boundary that `App.tsx` hosts the feature shell.
  - [x] Keep this story scoped to the shell only: do not implement API fetching, create mutations, or fake persisted state here.
- [x] Introduce the minimal frontend structure needed for the shell in architecture-aligned locations (AC: 1, 2)
  - [x] Create the first pass of `web/src/features/todos/components/TodoAppShell.tsx`.
  - [x] Create a presentational `TodoComposer` with labeled input and visible primary action, but no live submission logic yet.
  - [x] Create a presentational `TodoEmptyState` that intentionally points the user back to task entry.
  - [x] Create the first shared style foundation files needed for the shell, favoring `web/src/app/styles/tokens.css` and `web/src/app/styles/globals.css` over adding more ad hoc styling in `App.css`.
- [x] Apply the Soft Calm visual foundation and mobile-first layout rules (AC: 1, 3)
  - [x] Use warm neutral backgrounds, restrained teal/blue-green action emphasis, gentle surfaces, and moderate radii.
  - [x] Keep the page single-column from 320px upward, with comfortable desktop width but no dashboard-style multi-panel layout.
  - [x] Ensure primary interactive elements meet visible focus and touch-target expectations.
- [x] Update tests to validate the new shell instead of the starter page (AC: 1, 2, 3)
  - [x] Replace or remove the existing starter assertion in `web/src/App.test.tsx`.
  - [x] Add frontend test coverage that verifies the shell heading/input/empty-state prompt render and that starter copy is gone.
  - [x] Run the frontend unit test command and confirm the shell renders under Vitest.

## Dev Notes

- Story scope is intentionally narrow. This story establishes orientation and the first visual shell only. Story 1.2 handles list loading from the backend, and Story 1.3 handles actual create behavior. Avoid collapsing those later stories into this one.
- Do not invent alternate state-management or routing patterns. The architecture keeps the frontend intentionally small, single-route, and feature-oriented. TanStack Query is the planned server-state layer, but this story does not need it yet. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- The current frontend is still the Vite starter. The shell should replace the existing starter imports and promo content in `web/src/App.tsx`, and any now-unused starter assets can be removed if they are no longer referenced. [Source: /home/mablanco/Repos/github/bmad-todo/web/src/App.tsx]
- UX intent matters here more than feature depth. The page should immediately communicate “capture a task and trust it instantly,” with an obvious task-entry area and an empty state that preserves orientation rather than looking unfinished. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#2.1 Defining Experience] [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#2.5 Experience Mechanics]

### Project Structure Notes

- The architecture target structure for the frontend is:
  - `web/src/App.tsx` as app entry that mounts the todo feature shell
  - `web/src/app/styles/` for shared tokens and global styles
  - `web/src/features/todos/components/` for product-facing todo components
- This repo has not reached that structure yet. Current files are still `web/src/App.tsx`, `web/src/App.css`, and `web/src/index.css` from the starter scaffold. Story 1.1 is the right place to begin the migration toward the architecture-aligned shape without trying to build the entire future tree in one pass. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure] [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Architectural Boundaries]

### Technical Requirements

- Use React + TypeScript on the existing Vite frontend.
- Keep the page single-route and single-column.
- Keep state local and presentational for this story; no server-state integration yet.
- Preserve accessible semantics for headings, form labels, buttons, and empty-state copy.
- Remove starter dark-mode/purple-biased styling and replace it with the Soft Calm direction.

### Architecture Compliance

- `App.tsx` should mount the feature shell, not contain the whole product implementation inline. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Architectural Boundaries]
- Frontend code should move toward feature-first organization with shared app/lib concerns separated from todo-specific code. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Structure Patterns]
- Accessibility and status patterns are first-class behavior, not polish. Even a shell-only story must use semantic structure, visible focus styles, and readable spacing. [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend Architecture]

### Library / Framework Requirements

- Use the existing frontend toolchain already present in the repo:
  - React `^19.2.4`
  - Vite `^8.0.1`
  - Vitest `^4.1.2`
  - Testing Library React `^16.3.2`
- Do not add a heavyweight component library for this story. The UX direction explicitly calls for a lightweight internal design system and custom todo components. [Source: /home/mablanco/Repos/github/bmad-todo/web/package.json] [Source: /home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#1.1 Design System Choice]

### File Structure Requirements

- Expected files to touch:
  - `web/src/App.tsx`
  - `web/src/index.css` or new shared styles under `web/src/app/styles/`
  - `web/src/features/todos/components/TodoAppShell.tsx`
  - `web/src/features/todos/components/TodoComposer.tsx`
  - `web/src/features/todos/components/TodoEmptyState.tsx`
  - frontend test file(s), likely replacing `web/src/App.test.tsx` or moving coverage under `web/src/test/`
- Avoid adding API client files, TanStack Query hooks, or todo data types unless needed to support shell-only compilation; those belong naturally to later stories.

### Testing Requirements

- Frontend tests should assert user-visible outcomes, not implementation details.
- Minimum expectations for this story:
  - the starter heading/counter content is gone
  - a todo-oriented heading or shell landmark is present
  - the composer input is visible and labeled
  - the empty-state prompt is rendered
- Run:
  - `npm run test:frontend`
- If the test location is changed to align with the architecture, keep Vitest discovery working and remove or update the old starter test. [Source: /home/mablanco/Repos/github/bmad-todo/package.json] [Source: /home/mablanco/Repos/github/bmad-todo/web/src/App.test.tsx]

### References

- Epic and story source: [epics.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/epics.md#Epic-1-Trustworthy-Task-Capture)
- Frontend architecture: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Frontend-Architecture)
- Structure and boundaries: [architecture.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/architecture.md#Project-Structure--Boundaries)
- UX core experience: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#2-Core-User-Experience)
- Soft Calm direction: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Design-Direction-Decision)
- Component strategy: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Component-Strategy)
- Responsive and accessibility requirements: [ux-design-specification.md](/home/mablanco/Repos/github/bmad-todo/_bmad-output/planning-artifacts/ux-design-specification.md#Responsive-Design--Accessibility)
- Current starter implementation: [App.tsx](/home/mablanco/Repos/github/bmad-todo/web/src/App.tsx), [App.css](/home/mablanco/Repos/github/bmad-todo/web/src/App.css), [index.css](/home/mablanco/Repos/github/bmad-todo/web/src/index.css), [App.test.tsx](/home/mablanco/Repos/github/bmad-todo/web/src/App.test.tsx)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- No previous story file exists for Epic 1.
- No project-context file was found during story creation.
- `npm run test:frontend` passed.
- `npm run build:frontend` passed.
- `npm run test` passed, including backend regression coverage.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story scope explicitly separated from Stories 1.2 and 1.3 to prevent accidental API or mutation work here.
- Replaced the Vite starter experience with a first-pass `TodoAppShell`, `TodoComposer`, and `TodoEmptyState`.
- Added shared `tokens.css` and `globals.css` to establish the Soft Calm visual foundation and single-column responsive shell.
- Updated frontend tests to validate the new shell and imported Vitest globals so build-time type checking stays clean.
- Verified the implementation with `npm run test:frontend`, `npm run build:frontend`, and `npm run test`.

### File List

- _bmad-output/implementation-artifacts/1-1-replace-starter-ui-with-the-task-capture-shell.md
- web/src/App.tsx
- web/src/App.test.tsx
- web/src/app/styles/globals.css
- web/src/app/styles/tokens.css
- web/src/features/todos/components/TodoAppShell.tsx
- web/src/features/todos/components/TodoComposer.tsx
- web/src/features/todos/components/TodoEmptyState.tsx
- web/src/index.css

### Change Log

- 2026-03-27: Implemented Story 1.1 by replacing the Vite starter UI with the first `bmad-todo-app` capture shell, introducing shared shell styles and initial todo presentation components, and updating frontend tests.
