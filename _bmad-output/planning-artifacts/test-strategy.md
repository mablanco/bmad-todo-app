# Test Strategy — Todo App

This document defines the testing approach for the Todo App, including unit, integration, and end-to-end (E2E) test scenarios. This strategy ensures the application meets all functional and non-functional requirements (NFRs) defined in the PRD and follows the chosen architecture.

---

## 1. Testing Pyramid & Tools

Our approach follows the testing pyramid to balance speed, cost, and confidence.

-   **Unit Tests:** Verify individual components, functions, and business logic in isolation.
    -   *Backend (Python):* `pytest` with `unittest.mock`.
    -   *Frontend (React):* `Vitest` with `React Testing Library`.
-   **Integration Tests:** Verify the interaction between different layers (e.g., API -> Service -> Repository -> DB).
    -   *Backend:* `pytest` with a dedicated SQLite test database.
-   **End-to-End (E2E) Tests:** Verify full user journeys from the browser to the backend and back.
    -   *Tooling:* `Playwright` (targeted at the production-like build of the web app and the running API).

---

## 2. Test Scenarios per Epic

### Epic 1: Foundation & Scaffolding

| Level | Target | Scenario |
| :--- | :--- | :--- |
| Unit | API (Schemas) | **Valid/Invalid Payload:** Verify `TodoCreate` schema rejects empty or >500 character descriptions. |
| Integration | API (Health) | **System Health:** Verify `GET /api/v1/health` returns `{"status": "ok"}` and checks DB connectivity. |
| Integration | Web (Client) | **Env Configuration:** Verify the API client correctly picks up the base URL from the environment. |

### Epic 2: Todo API & Persistence

| Level | Target | Scenario |
| :--- | :--- | :--- |
| Unit | Service | **Business Logic:** `TodoService.create_todo` trims whitespace and throws validation error for empty input. |
| Integration | Repository | **Persistence:** `TodoRepository` saves a todo and retrieves it with a stable UUID. |
| Integration | API (CRUD) | **Full CRUD Cycle:** Verify a sequence of POST, GET, PATCH, and DELETE operations result in the correct DB state and HTTP responses. |
| Integration | API (Errors) | **Error Envelope:** Verify an invalid `PATCH` request returns the standard `ErrorResponse` envelope with a `VALIDATION_ERROR` code. |

### Epic 3: Todo Web UI (Core Flows)

| Level | Target | Scenario |
| :--- | :--- | :--- |
| Unit | Component | **TodoComposer:** Verify typing in the input and clicking "Add" calls the create mutation. |
| Unit | Component | **TodoListItem:** Verify toggling the checkbox calls the update mutation with the toggled state. |
| Unit | Hook | **useTodos:** Verify the hook correctly manages loading, success, and error states from TanStack Query. |
| E2E | App Shell | **Happy Path:** User adds a task, marks it complete, reloads the page, and the state is preserved. |

### Epic 4: UX Refinement & Quality

| Level | Target | Scenario |
| :--- | :--- | :--- |
| Unit | Component | **Empty State:** `TodoEmptyState` is visible only when the todo list array is empty. |
| Unit | Component | **Error State:** `TodoErrorState` displays a "Retry" button that triggers the query refetch. |
| E2E | Responsive | **Mobile View:** Verify the "Add" button and todo toggles are usable and correctly sized on a 320px viewport. |
| E2E | Accessibility | **Keyboard Nav:** Verify a user can tab through the input, add button, and task list items without using a mouse. |

---

## 3. Non-Functional Requirement (NFR) Validation

| NFR ID | Target | Scenario |
| :--- | :--- | :--- |
| **NFR-001** | Performance | **Load Test (Light):** Render a list with 500 todos and verify scroll performance is smooth (no layout thrashing). |
| **NFR-002** | Reliability | **API Down Recovery:** Simulate a 500 error from the API and verify the `TodoErrorState` is shown without crashing the app. |
| **NFR-003** | Maintainability | **Developer Onboarding:** Verify that following the `README.md` allows a fresh install to run and pass the health check in under 60 minutes. |
| **NFR-004** | Security | **Input Sanitization:** Verify that a todo description with script tags is rendered as plain text (no XSS). |
| **NFR-005** | Accessibility | **Contrast Check:** Verify all core text and controls pass WCAG 2.1 AA contrast thresholds using automated tools. |

---

## 4. Acceptance Criteria (PRD Success Criteria) Mapping

### SC-01: Core tasks need no instruction
-   **Verification:** E2E smoke test covering: Add -> Complete -> Delete.
-   **Success:** 100% completion in the automated test flow.

### SC-02: Data survives reload
-   **Verification:** E2E test: Create todo -> Force page reload -> Check if todo is still present.
-   **Success:** Todo is retrieved from the API after reload.

### SC-03: Observable task state
-   **Verification:** Unit/Integration test for `TodoListItem` styling.
-   **Success:** Verify that `completed: true` results in a specific CSS class (e.g., strikethrough or opacity shift).

### SC-04: Recoverable failures
-   **Verification:** E2E test simulating API failure during any CRUD action.
-   **Success:** User sees a clear error message and a functional "Retry" or recovery path.
