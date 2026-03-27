---
stepsCompleted:
  - 1
  - 2
  - 3
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-27.md'
---

# bmad-todo-app - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-todo-app, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-001: User can view all todos in a single list on app load.

FR-002: User can create a todo with a short text description (<= 500 characters after trim; empty rejected with feedback).

FR-003: Each todo exposes completion status (active or completed).

FR-004: Each todo exposes created timestamp.

FR-005: User can toggle a todo between active and completed.

FR-006: User can delete a todo.

FR-007: User sees dedicated UI for empty list, loading, and error conditions.

FR-008: Application persists todos via an HTTP API so data survives refresh and later visits.

FR-009: API supports create, read, update, and delete for todo resources.

FR-010: On API or client failure for list/create/update/delete, the user sees visible error feedback (message or dedicated error state); no silent failures for those operations.

### NonFunctional Requirements

NFR-001: The app must meet the defined web-app performance targets and remain usable with up to 500 todos.

NFR-002: No unhandled exceptions may surface raw to users; errors must map to user-visible states or messages.

NFR-003: The repository must include a root README, API/UI run instructions, and environment documentation so a new developer can get the stack running within 60 minutes.

NFR-004: API inputs must be validated and bounded to prevent trivial abuse.

NFR-005: Core flows must conform to WCAG 2.1 AA.

NFR-006: Data model and API shapes must not block later addition of `user_id` or auth headers.

### Additional Requirements

- Use the selected starter foundation: Vite React TypeScript frontend and FastAPI multi-file backend.
- Backend architecture must preserve route -> service -> repository layering.
- API success responses use `{"data": ...}` and error responses use the standard `{"error": ...}` envelope.
- SQLite is the v1 datastore, with PostgreSQL-portable conventions.
- Current repo state matters: frontend and backend scaffolds already exist, health endpoint exists, and backend CRUD API plus integration tests are already implemented.
- Stories must be organized by user value, not technical milestones, per the implementation-readiness assessment.
- Naming should normalize on `bmad-todo-app`.

### UX Design Requirements

UX-DR-001: Use the `Soft Calm` visual direction with warm neutrals, restrained accent color, gentle surfaces, and calm, trustworthy visual hierarchy.

UX-DR-002: Build a lightweight internal design system based on reusable design tokens for color, typography, spacing, radius, borders, motion, and state feedback.

UX-DR-003: Implement the core custom components identified in the UX spec: `TodoComposer`, `TodoList`, `TodoListItem`, `TodoEmptyState`, `TodoLoadingState`, and `TodoErrorState`.

UX-DR-004: The defining experience is “capture a task and trust it instantly”; task entry and immediate visible confirmation are first-class priorities.

UX-DR-005: Empty, loading, success, and error states must preserve orientation and use calm, direct, non-technical language.

UX-DR-006: Completed tasks must be distinguishable through more than color alone.

UX-DR-007: The interaction model should remain familiar and low-friction: direct text entry, explicit add action, familiar completion control, and in-row delete behavior.

UX-DR-008: The experience must remain single-column and mobile-first across breakpoints, with clear adaptation from 320px upward.

UX-DR-009: Accessibility is component-level, not polish work: keyboard navigation, visible focus indicators, semantic structure, accessible validation, and WCAG 2.1 AA compliance are required throughout.

UX-DR-010: Error handling must support calm recovery with local, actionable retry paths rather than disruptive global failure patterns.

### FR Coverage Map

FR-001: Epic 1 - users can view all todos on app load
FR-002: Epic 1 - users can create a bounded, validated todo
FR-003: Epic 2 - users can understand completion state
FR-004: Epic 2 - users can see created timestamps
FR-005: Epic 2 - users can toggle completion
FR-006: Epic 2 - users can delete tasks
FR-007: Epic 1 and Epic 3 - users get empty/loading/error states, then those states are refined for consistency, accessibility, and responsiveness
FR-008: Epic 1 and Epic 4 - persistence is core to capture, then hardened in delivery readiness
FR-009: Epic 4 - API contract and maintainable delivery/test path
FR-010: Epic 1, Epic 2, and Epic 4 - visible failure handling across CRUD flows, then hardened in quality and testing

## Epic List

### Epic 1: Trustworthy Task Capture
Users can open the app, understand it immediately, add a task, and trust that it has been captured correctly.
**FRs covered:** FR-001, FR-002, FR-007, FR-008, FR-010

### Epic 2: Clear Task State Management
Users can review their list, understand active vs completed work, mark tasks complete, and remove tasks cleanly.
**FRs covered:** FR-003, FR-004, FR-005, FR-006, FR-010

### Epic 3: Calm, Accessible, Responsive Experience
Users can manage tasks across mobile and desktop with clear states, accessible interactions, and the Soft Calm visual direction.
**FRs covered:** FR-007 and supports FR-001 through FR-006 as a quality/value layer

### Epic 4: Developer Readiness and Product Hardening
The team can run, test, and extend the product reliably, with onboarding, environment setup, and maintainable implementation paths in place.
**FRs covered:** Supports FR-008, FR-009, FR-010 through delivery quality and maintainability rather than new end-user capability

## Epic 1: Trustworthy Task Capture

Users can open the app, understand it immediately, add a task, and trust that it has been captured correctly.

### Story 1.1: Replace Starter UI with the Task Capture Shell

As a solo user,
I want to land on a focused todo screen instead of a starter page,
So that I immediately understand the app's purpose and where to act.

**Requirements:** FR-007; Supports FR-001 and FR-002

**Acceptance Criteria:**

**Given** I open the web app
**When** the main screen renders
**Then** I see a focused single-column todo layout aligned with the Soft Calm direction
**And** the starter Vite content is no longer present

**Given** I open the web app with no tasks yet
**When** the initial screen loads
**Then** I see a clear task-entry area and an intentional empty-state prompt
**And** the empty state directs me toward adding my first task

**Given** I use the app on mobile or desktop
**When** the layout renders
**Then** the main content remains single-column and readable from 320px upward
**And** interactive controls remain visually clear and reachable

### Story 1.2: Connect the Web App to the Todo List API

As a solo user,
I want the app to load my current todos from the backend on page load,
So that I can trust the app as the source of truth for my list.

**Requirements:** FR-001, FR-007, FR-008, FR-010

**Acceptance Criteria:**

**Given** todos exist in the backend
**When** I open or reload the app
**Then** the frontend requests `GET /api/v1/todos`
**And** the returned todos are rendered in newest-first order

**Given** no todos exist in the backend
**When** I open the app
**Then** the frontend renders the dedicated empty state rather than a blank or broken screen

**Given** the initial list request fails
**When** the API returns an error
**Then** the app shows a dedicated error state with calm, non-technical language
**And** a retry action is available without requiring a page refresh

### Story 1.3: Add a New Todo from the Main Composer

As a solo user,
I want to enter a task quickly and add it from the main screen,
So that I can capture work the moment I think of it.

**Requirements:** FR-002, FR-008, FR-010

**Acceptance Criteria:**

**Given** I am on the main todo screen
**When** I type a valid task description and submit it by button or keyboard
**Then** the app creates the todo through `POST /api/v1/todos`
**And** the new task appears clearly in the list without a full page reload

**Given** I submit an empty description or a description longer than 500 characters after trim
**When** validation runs
**Then** the app prevents submission
**And** shows inline, accessible validation feedback near the input

**Given** a create request succeeds
**When** the response returns
**Then** the input resets to a ready state
**And** focus behavior remains logical for continued capture

**Given** a create request fails
**When** the backend returns an error
**Then** the app preserves my typed value
**And** shows calm, actionable error feedback without losing orientation

### Story 1.4: Establish Capture-State Trust Signals

As a solo user,
I want every capture-related state to be obvious,
So that I always know whether my task was added, is loading, or needs my attention.

**Requirements:** FR-007, FR-010; Supports FR-002

**Acceptance Criteria:**

**Given** the app is fetching or mutating capture-related data
**When** the UI updates
**Then** loading feedback is visible and localized
**And** the page does not collapse into an ambiguous blank state

**Given** a task is added successfully
**When** the list updates
**Then** the resulting state change is visually obvious and believable
**And** the app does not require extra confirmation dialogs or noisy success messaging

**Given** I rely on keyboard or assistive technology
**When** I use the composer and its related states
**Then** focus, validation, and feedback are exposed accessibly
**And** the flow supports WCAG 2.1 AA expectations for the capture path

## Epic 2: Clear Task State Management

Users can review their list, understand active vs completed work, mark tasks complete, and remove tasks cleanly.

### Story 2.1: Render Todo Items with Clear Task-State Information

As a solo user,
I want each todo item to clearly show its content and state,
So that I can scan my list without ambiguity.

**Requirements:** FR-003, FR-004

**Acceptance Criteria:**

**Given** one or more todos exist
**When** the list renders
**Then** each item displays its description and created timestamp
**And** each item visually communicates whether it is active or completed

**Given** a todo is completed
**When** it is rendered in the list
**Then** the completed state is distinguishable through more than color alone
**And** the styling remains legible and accessible

**Given** I view the list on mobile or desktop
**When** todo rows render
**Then** content hierarchy remains readable
**And** actions do not crowd or obscure the task content

### Story 2.2: Mark a Todo Complete or Active from the List

As a solo user,
I want to toggle a task between active and completed directly from the list,
So that I can keep my task state current with minimal effort.

**Requirements:** FR-005, FR-010; Supports FR-003

**Acceptance Criteria:**

**Given** an active or completed todo is visible
**When** I activate its completion control
**Then** the app sends a `PATCH /api/v1/todos/{todoId}` request with the updated completion state
**And** the item updates visibly without a page reload

**Given** the update succeeds
**When** the response returns
**Then** the final rendered state matches the persisted backend state
**And** the list remains stable and understandable

**Given** the update fails
**When** the backend returns an error
**Then** the app restores or preserves a believable UI state
**And** shows local, calm error feedback with a clear next step

**Given** I use keyboard navigation
**When** I move to and activate the completion control
**Then** the interaction is keyboard operable and visibly focused
**And** the resulting state change is accessible

### Story 2.3: Delete a Todo Cleanly from the List

As a solo user,
I want to remove a task that I no longer need,
So that my list stays relevant and uncluttered.

**Requirements:** FR-006, FR-007, FR-010

**Acceptance Criteria:**

**Given** a todo is visible in the list
**When** I activate its delete action
**Then** the app sends `DELETE /api/v1/todos/{todoId}`
**And** the item is removed from the rendered list when the deletion succeeds

**Given** deleting a todo leaves the list empty
**When** the UI updates
**Then** the app transitions into the dedicated empty state cleanly
**And** still directs me toward adding a new task

**Given** a delete request fails
**When** the backend returns an error
**Then** the todo remains or is restored in a believable state
**And** the app shows calm, local error feedback rather than a disruptive global failure

**Given** I use keyboard or touch interaction
**When** I reach the delete control
**Then** it is accessible, clearly labeled, and does not rely on hover-only discovery

### Story 2.4: Preserve Trust Across State Changes and Reload

As a solo user,
I want task-state changes to remain trustworthy after refresh,
So that I believe the app is keeping an accurate record of my list.

**Requirements:** FR-003, FR-004, FR-005, FR-006, FR-008

**Acceptance Criteria:**

**Given** I create, complete, or delete tasks
**When** I reload the page
**Then** the list reflects the persisted backend state accurately

**Given** multiple task-state changes occur in sequence
**When** the app re-fetches or re-renders data
**Then** active and completed items remain visually and semantically consistent
**And** no silent inconsistencies are introduced

**Given** the list is reloaded after prior successful interactions
**When** the screen renders again
**Then** the user can still understand the state immediately
**And** trust in the list as the source of truth is reinforced

## Epic 3: Calm, Accessible, Responsive Experience

Users can manage tasks across mobile and desktop with clear states, accessible interactions, and the Soft Calm visual direction.

### Story 3.1: Apply the Soft Calm Visual Foundation to the Todo Experience

As a solo user,
I want the app to look calm, clear, and trustworthy,
So that using it feels focused rather than stressful or generic.

**Requirements:** FR-007; Supports FR-001, FR-002, FR-003, FR-004, FR-005, FR-006

**Acceptance Criteria:**

**Given** I open the app
**When** the main interface renders
**Then** the UI applies the Soft Calm direction with warm neutrals, restrained accents, gentle surfaces, and clear visual hierarchy

**Given** I interact with primary controls and task rows
**When** hover, focus, active, and disabled states appear
**Then** those states are visually consistent across the app
**And** they reinforce clarity rather than visual noise

**Given** the UI uses reusable styling decisions
**When** shared surfaces, buttons, inputs, and status states are implemented
**Then** they are driven by a small internal design-token system
**And** the styling is not duplicated ad hoc across components

### Story 3.2: Implement Consistent Empty, Loading, and Error State Components

As a solo user,
I want system states to be clear and consistent wherever they appear,
So that I always understand what the app is doing and what I can do next.

**Requirements:** FR-007, FR-010

**Acceptance Criteria:**

**Given** the app has no todos
**When** the list area renders
**Then** a dedicated empty-state component appears with encouraging, direct copy and a clear path back to task entry

**Given** the app is fetching data
**When** loading is shown
**Then** the loading state preserves layout continuity and user orientation
**And** it does not present as a blank or broken screen

**Given** a list or mutation error occurs
**When** the error state appears
**Then** the message is calm, non-technical, and actionable
**And** retry behavior is available where appropriate

**Given** these states appear in multiple parts of the app
**When** they are rendered
**Then** they use consistent structure, tone, and interaction patterns

### Story 3.3: Make Core Todo Flows Keyboard-Accessible and Screen-Reader-Friendly

As a user who relies on keyboard or assistive technology,
I want to complete the core todo flows accessibly,
So that I can use the product effectively without barriers.

**Requirements:** FR-007; Supports FR-001, FR-002, FR-003, FR-004, FR-005, FR-006

**Acceptance Criteria:**

**Given** I use only keyboard navigation
**When** I move through task creation, completion, retry, and deletion flows
**Then** every interactive element is reachable and operable
**And** focus indicators are clearly visible

**Given** I use assistive technology
**When** validation errors, loading states, and status changes occur
**Then** they are announced or structured accessibly
**And** form controls have associated labels or accessible names

**Given** completed tasks are displayed
**When** I interpret task state
**Then** completion is communicated through semantic and visual cues beyond color alone

**Given** the app uses semantic HTML
**When** the list and controls render
**Then** list, button, form, and status semantics are preserved throughout the core flow

### Story 3.4: Optimize the Experience Across Mobile, Tablet, and Desktop

As a solo user,
I want the app to remain usable and readable on any common screen size,
So that I can manage tasks comfortably on phone or desktop.

**Requirements:** FR-007; Supports FR-001, FR-002, FR-003, FR-004, FR-005, FR-006

**Acceptance Criteria:**

**Given** the app is viewed at mobile widths from 320px upward
**When** the layout renders
**Then** the single-column structure remains intact
**And** no critical content or action overflows or becomes hard to use

**Given** the app is viewed on tablet or desktop
**When** additional screen space is available
**Then** the layout gains breathing room and stability without introducing unnecessary complexity

**Given** I interact with controls on touch devices
**When** I use add, toggle, delete, or retry actions
**Then** touch targets remain comfortably usable and visually clear

**Given** the UI changes across breakpoints
**When** responsive adaptations occur
**Then** the app remains recognizably the same product and preserves the same reading order and primary action flow

## Epic 4: Developer Readiness and Product Hardening

The team can run, test, and extend the product reliably, with onboarding, environment setup, and maintainable implementation paths in place.

### Story 4.1: Complete Local Run and Environment Documentation

As a developer new to the repo,
I want clear setup and run instructions for frontend and backend,
So that I can get the product running locally without guesswork.

**Requirements:** Supports FR-008, FR-009, FR-010

**Acceptance Criteria:**

**Given** I clone the repository fresh
**When** I read the root documentation
**Then** I can find the required bootstrap, development, and test commands for both frontend and backend

**Given** the project requires environment-specific values
**When** I inspect the repo
**Then** `.env.example` or equivalent documented environment expectations exist for the relevant app surfaces
**And** they match the actual runtime setup

**Given** I am onboarding to the project
**When** I follow the documented local run steps
**Then** I can start the frontend and backend successfully
**And** the instructions reflect the current repo reality rather than outdated setup steps

### Story 4.2: Harden API Contract Reliability and Error Consistency

As a developer and future frontend integrator,
I want the API contract and error behavior to remain stable and verified,
So that the user experience stays predictable as implementation evolves.

**Requirements:** FR-009, FR-010

**Acceptance Criteria:**

**Given** CRUD and health endpoints exist
**When** backend integration tests run
**Then** they verify the current success and error envelopes for all core endpoints

**Given** validation or not-found failures occur
**When** the API responds
**Then** responses remain consistent with the documented BMAD contract
**And** no raw internal exception details leak into user-facing responses

**Given** future backend changes are made
**When** tests fail due to contract drift
**Then** the failure makes the regression obvious before frontend behavior silently breaks

### Story 4.3: Establish End-to-End Confidence for the Core Todo Loop

As a team shipping the MVP,
I want automated coverage of the core user loop,
So that we can verify the app still supports capture, state change, deletion, and trust after change.

**Requirements:** Supports FR-008, FR-009, FR-010

**Acceptance Criteria:**

**Given** the local stack is running
**When** the end-to-end suite executes
**Then** it covers the core path of loading the app, adding a todo, updating or completing a todo, and removing a todo

**Given** the frontend and backend are integrated
**When** the core flow succeeds
**Then** the tests verify visible user-facing outcomes rather than only network-level behavior

**Given** a regression breaks the primary user loop
**When** automated tests run
**Then** the failure is caught in CI or local verification before release

### Story 4.4: Preserve Extensibility and Maintenance Boundaries

As a developer extending the product later,
I want the codebase to preserve the agreed architectural seams,
So that future additions like auth or per-user scoping do not require a rewrite.

**Requirements:** Supports FR-009; Preserves NFR-006 implementation headroom

**Acceptance Criteria:**

**Given** the current backend and frontend implementations
**When** new work is added
**Then** the route -> service -> repository pattern remains intact on the backend
**And** frontend feature boundaries remain consistent with the architecture

**Given** the current data and API model
**When** future user scoping or auth is introduced
**Then** the existing shapes do not block adding `user_id` or auth context later

**Given** new contributors work in the codebase
**When** they inspect tests, structure, and docs
**Then** the intended extension points and boundaries are discoverable
**And** the codebase remains maintainable rather than tightly coupled
