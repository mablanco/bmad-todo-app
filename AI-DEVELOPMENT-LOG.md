# AI Development Log — bmad-todo-app

This document records how AI agents, MCP servers, and automated tooling were used throughout the development of the bmad-todo application, including what worked well, what required human intervention, and lessons learned.

---

## 1. Agent Usage

### Tasks Completed with AI Assistance

Multiple AI agents were used throughout this project, each playing a distinct role:

- **Claude Code (Claude Opus 4.6, 1M context)** — Primary agent for planning, story creation, implementation, QA, and Docker containerization. Operated within the BMad Method framework.
- **Codex with GPT-5.4** — Used as the dedicated code reviewer for all stories. Using a different AI model for review than the one that wrote the code was a deliberate choice — it produces genuinely independent adversarial feedback rather than self-review bias.
- **Cursor (auto mode)** — Used intermittently to test whether a different AI-powered IDE could pick up work mid-stream within the BMad workflow.
- **Gemini CLI (Gemini 3 Flash Preview)** — Also used intermittently for the same interoperability testing, as a CLI-based alternative to Claude Code.

| Phase | Agent/Skill Used | AI Model |
|-------|-----------------|----------|
| **Planning** | `bmad-pm`, `bmad-create-prd`, `bmad-create-architecture` | Claude Opus 4.6 |
| **Story Creation** | `bmad-agent-sm` (Bob), `bmad-create-story` | Claude Opus 4.6 |
| **Sprint Planning** | `bmad-sprint-planning` | Claude Opus 4.6 |
| **Implementation** | `bmad-dev-story` | Claude Opus 4.6 |
| **Code Review** | `bmad-code-review` | Codex / GPT-5.4 |
| **QA Activities** | `bmad-review-adversarial-general`, manual analysis | Claude Opus 4.6 |
| **Docker** | `bmad-dev-story` | Claude Opus 4.6 |
| **Ad-hoc testing** | Various skills | Cursor (auto mode) |
| **Ad-hoc testing** | Various skills | Gemini CLI / Gemini 3 Flash Preview |

### Multi-Agent Interoperability

A key experiment was testing whether different AI agents could work interchangeably within the BMad Method framework. The results were mixed:

**What worked:** Using GPT-5.4 (via Codex) as a dedicated reviewer was highly effective. Because code review is a self-contained task with clear inputs (diff + spec) and outputs (findings list), switching to a different model added genuine value — it caught issues that Claude might have been blind to in its own code.

**What was problematic:** Switching to Cursor (auto mode) or Gemini CLI mid-workflow sometimes generated confusion when returning to Claude. These agents would make implementation choices or file modifications that diverged from patterns Claude had established, and when Claude resumed it would encounter unexpected state. This required human oversight to:
- Identify where the other agents' changes diverged from the established architecture
- Guide Claude through understanding and reconciling those changes
- Get the project back on track with consistent patterns

**Lesson learned:** The BMad Method's file-based context (story files, architecture.md, sprint-status.yaml) made multi-agent handoffs *possible* — all the context lives in the repo, not in conversation memory. But seamless handoffs require that all agents respect the same conventions. When they don't, a human "air traffic controller" is essential to spot divergence early and course-correct.

### Prompts That Worked Best

**Structured skill invocations** outperformed open-ended prompts. The BMad Method's skill system (`/bmad-dev-story`, `/bmad-code-review`, `/bmad-create-story`) provided consistent, reproducible results because each skill loaded its own workflow definition with step-by-step instructions.

**Effective patterns:**
- "Create story 2.1" — the `bmad-create-story` skill autonomously gathered context from epics, architecture, previous stories, and git history to produce implementation-ready story files
- "Implement what's pending for epic 0" — combined with `bmad-dev-story`, the agent followed the story file's task list sequentially, running tests after each task
- "Apply the quick fixes (C1, C2, M4) now" — direct, specific instructions with clear scope produced the best results for targeted changes
- Providing the full QA task list upfront ("Security, Coverage, Accessibility, Performance") let the agent plan the approach before executing

**Less effective patterns:**
- Vague requests like "make it better" or "fix the tests" without specifying which tests or what the expected behavior should be
- Asking the agent to evaluate its own work quality without an external reference (spec, architecture doc, or acceptance criteria)

### Agent Execution Model

The AI operated in a **single continuous session** for most epics, maintaining context across story creation, implementation, and review. This worked because:
- The BMad Method kept all context in files (story files, sprint-status.yaml, architecture.md) rather than relying on conversation memory
- Each story file contained enough context for the dev agent to work independently
- Sprint status tracking provided clear "what's next" signaling

---

## 2. MCP Server Usage

Three MCP servers were used during QA activities:

### Chrome DevTools MCP (`chrome-devtools-mcp`)

**Purpose:** Performance auditing with real browser instrumentation.

**How it helped:**
- Ran Lighthouse audits (desktop + mobile) producing accessibility (95/100), best practices (100/100), and SEO (82/100) scores
- Captured a full performance trace with Core Web Vitals: LCP 102ms, CLS 0.027, TTFB 2ms
- Analyzed render-blocking resources, LCP breakdown, and CLS culprits via `performance_analyze_insight`
- Captured network waterfall showing only 4 requests on initial load
- Took screenshots of the running application

**Findings it surfaced that manual review missed:**
- CSS file was render-blocking (7ms, negligible impact — confirmed no action needed)
- Precise LCP breakdown showing 98.5% was render delay vs 1.5% TTFB

**Setup challenges:** Required Google Chrome installed at the standard path (`/opt/google/chrome/chrome`). Chromium via snap was not detected by the underlying Puppeteer library despite multiple env var attempts (`CHROME_PATH`, `PUPPETEER_EXECUTABLE_PATH`, `CHROME_BIN`). Resolved by installing official Google Chrome.

### Postman MCP (`postman`)

**Purpose:** API contract validation against the OpenAPI-generated collection.

**How it helped:**
- Connected to the user's Postman workspace and discovered the existing `bmad-todo-app API` collection (imported from `/openapi.json`)
- Added test assertions (`pm.test()`) to all 5 endpoints via `updateCollectionRequest`
- Ran the collection via `runCollection` — 12/12 contract tests passed
- Also created a separate purpose-built collection with 19 contract tests covering success paths, validation errors, and not-found scenarios

**Challenges:**
- The OpenAPI-imported collection had a folder structure where `{todoId}` requests executed before `Create`, causing `todoId` to be unset. Fixed by adding pre-request scripts that auto-create test data when the variable is missing.
- The Postman MCP API doesn't support reordering requests within folders, so pre-request scripts were the workaround.

### Playwright MCP (`playwright`)

**Purpose:** Automated browser interaction testing with screenshot evidence.

**How it helped:**
- Navigated to the running app and executed the full user flow: empty state → create → toggle → delete → empty transition → validation error
- Captured 8 screenshot evidence files documenting each step
- Used accessibility snapshots (`browser_snapshot`) to inspect the DOM tree, ARIA attributes, and element refs before interacting
- Verified real rendered output (strikethrough on completed tasks, status badges, error messages) — things unit tests can't catch

**What made it effective:**
- The `browser_snapshot` tool provides a YAML accessibility tree with `ref` identifiers, making it easy to target specific elements for clicks and form fills
- Screenshots serve as visual evidence that can be reviewed by humans who weren't present during the test run

---

## 3. Test Generation

### How AI Assisted in Generating Test Cases

The AI generated all 92 tests across the project. The approach varied by layer:

**Backend integration tests (10 tests):**
- Generated during `bmad-dev-story` execution for Stories 0.3 and 0.4
- The story file's acceptance criteria directly mapped to test cases (e.g., "Given a valid payload → Then HTTP 201" became `test_create_todo_returns_created_resource`)
- The AI followed a red-green pattern: write the test assertion, implement the code, verify it passes

**Backend unit tests (32 tests):**
- Generated during Story 0.4 (service + repository) and QA test coverage gap-filling
- The AI analyzed each source file's public methods and generated tests covering: happy path, error path, boundary conditions
- Gap-filling was driven by the test coverage analysis — the AI identified untested modules (config, session, schemas, test_support) and wrote targeted tests

**Frontend integration tests (29 tests in App.test.tsx):**
- Generated incrementally across Stories 1.1–2.4, each story adding 3–4 tests
- These are full-app renders with mocked `fetch` — they exercise all components, hooks, and the API layer through the real component tree
- The AI reused the same mock pattern throughout: `vi.stubGlobal('fetch', fetchMock)` with `mockImplementation` for stateful responses

**Frontend unit tests (13 tests):**
- Generated during QA coverage gap-filling for `lib/api-client.ts` and `lib/errors.ts`
- These test the HTTP client and error mapping in isolation

**E2E tests (8 tests):**
- Smoke tests (5) generated during Story 4.3 — cover create, toggle, delete, reload persistence
- Accessibility tests (3) generated during QA — use `@axe-core/playwright` to scan empty, populated, and completed states

### What AI-Generated Tests Missed

1. **Stateful mock interactions:** When `onSettled` cache invalidation was added (Story 2.4), the existing test mocks returned stale data on refetch. The AI initially wrote tests that expected 3 fetch calls (GET + mutation + refetch), but the mocks weren't stateful. This required updating mocks to track mutation state (`let toggled = false; ... if (method === 'PATCH') toggled = true`).

2. **Selector specificity after DOM changes:** When the delete button was added (Story 2.3), the existing ordering test broke because `/task$/i` matched both the todo description and the sr-only "Delete [description]" text. The AI had to narrow the selector to `.todo-card__description`.

3. **Color contrast violations:** The manual code-level accessibility review missed that `#2c7a74` on `#e7f0ec` had a contrast ratio of 4.36:1 (below 4.5:1 threshold). Only the automated axe-core scan caught this. Lesson: always use real rendering tools for contrast checking.

4. **Performance test implications:** When `onSettled` was removed for performance (eliminating double-fetch), 4 existing tests that verified refetch behavior broke. The AI had to restructure those tests to verify cache-only updates instead of refetch round-trips.

---

## 4. Debugging with AI

### Case 1: SQLAlchemy Model Mocking (Story 0.4)

**Problem:** Service unit tests used `Todo.__new__(Todo)` to create mock todo objects, but SQLAlchemy's instrumented attributes require `_sa_instance_state`. Setting attributes via `setattr` raised `AttributeError`.

**How AI helped:** Recognized the error immediately and switched to `MagicMock(spec=Todo, **defaults)` — creating mock objects that satisfy type hints without triggering SQLAlchemy internals.

**Time saved:** Fixed in under 1 minute. A developer unfamiliar with SQLAlchemy's descriptor protocol might spend 30+ minutes.

### Case 2: Alembic Autogenerate "Phantom Table Removal" (Story 0.4)

**Problem:** Running `alembic revision --autogenerate` detected "Removed table 'todos'" even though the table existed in both the model and the database.

**How AI helped:** Diagnosed that `app/db/models/__init__.py` only had a docstring — it didn't re-export `Todo`. The `import app.db.models` in `migrations/env.py` loaded the package but not the model module, so `Base.metadata` was empty when autogenerate ran.

**Fix:** Added `from app.db.models.todo import Todo  # noqa: F401` to `__init__.py`.

### Case 3: IPv6 Health Check Failure in Alpine Docker (Story 5.2)

**Problem:** The web container's health check (`wget --spider http://localhost:3000/health`) failed with "can't connect to remote host: Connection refused" even though nginx was running.

**How AI helped:** Identified that Alpine's `wget` resolves `localhost` to `[::1]` (IPv6) first, but nginx was listening on `0.0.0.0` (IPv4 only). Changed the health check to use `http://127.0.0.1:3000/health` explicitly.

### Case 4: Docker Compose SQLite "Unable to Open Database File" (Story 5.2)

**Problem:** The API container crashed on startup with `sqlite3.OperationalError: unable to open database file` when `DATABASE_URL=sqlite:////app/data/bmad_todo.db`.

**How AI helped:** Recognized that the named volume mounts to `/app/data/`, but the directory didn't exist inside the container image. Added `mkdir -p /app/data` to the Dockerfile.

### Case 5: CORS + onSettled Cache Invalidation Interaction (Performance QA)

**Problem:** After removing `onSettled` invalidation from mutation hooks (performance fix P3), 4 frontend tests failed because they expected a 3rd fetch call (refetch triggered by invalidation).

**How AI helped:** Understood the interaction between the performance optimization and the test expectations. Restructured the tests to verify cache correctness via `onSuccess` updates (2 fetch calls) instead of refetch round-trips (3 fetch calls). Removed 2 tests that specifically tested refetch-failure scenarios (no longer applicable).

### Case 6: Chrome DevTools MCP Server Not Connecting

**Problem:** The `chrome-devtools-mcp` server was configured in `~/.claude.json` but its tools never appeared. Error: "Could not find Google Chrome executable for channel 'stable' at /opt/google/chrome/chrome."

**How AI helped:** Diagnosed the root cause through multiple attempts: the MCP server uses Puppeteer internally which looks for Chrome at a hardcoded path. Tried `CHROME_PATH`, `PUPPETEER_EXECUTABLE_PATH`, `CHROME_BIN` env vars pointing to the snap Chromium — none worked because the snap sandbox prevents Puppeteer's launch mechanism. Resolution required installing official Google Chrome.

**Lesson:** MCP servers that wrap browser automation tools have strict executable path requirements that can't always be worked around via environment variables.

---

## 5. Limitations Encountered

### What AI Couldn't Do Well

**1. Real browser visual testing:**
The AI cannot "see" the running application. It can read component source code, CSS, and accessibility trees, but it cannot evaluate whether the rendered output actually looks correct. The manual code-level accessibility review missed color contrast issues that only axe-core (running in a real browser) caught. Visual design validation requires either automated tools or human eyes.

**2. MCP server troubleshooting:**
When the Chrome DevTools MCP failed to connect, the AI went through multiple iterations of env var changes, each requiring a Claude Code restart. The feedback loop was slow and the AI couldn't directly inspect the MCP server's internal Puppeteer configuration. Human expertise was critical to decide "just install Google Chrome" rather than continuing to troubleshoot snap path issues.

**3. Evaluating its own output quality without external references:**
When asked to review code it just wrote, the AI tended to find fewer issues than when reviewing code written by a different agent/model. The BMad `code-review` skill mitigated this by using parallel adversarial review layers (Blind Hunter, Edge Case Hunter, Acceptance Auditor), but the most effective reviews happened when the user prompted for a specific concern (e.g., "I fear the backend may not be working as expected").

**4. Context window management across long sessions:**
This project was implemented across a single extended conversation. As context accumulated, earlier decisions and file contents were compressed or evicted. The BMad Method's file-based approach (story files, sprint-status.yaml, architecture.md) served as persistent external memory, but the AI occasionally re-read files it had already seen to refresh its understanding.

**5. Performance profiling without instrumentation:**
The code-level performance review identified theoretical issues (missing indexes, no pagination, re-render costs) but couldn't measure actual impact. Only the Chrome DevTools MCP trace provided real numbers (LCP 102ms, CLS 0.027). The AI's code review estimated "linear degradation at 500+ todos" but couldn't verify whether that matters in practice without load testing.

**6. Docker networking and OS-level debugging:**
Issues like IPv6 vs IPv4 in Alpine containers, snap sandboxing, and port conflicts required understanding of the host OS environment that the AI can only infer from error messages. The AI's troubleshooting was systematic but sometimes slow — a developer familiar with Docker networking would recognize these patterns faster.

### Where Human Expertise Was Critical

1. **Architectural direction:** The human decided to add Epic 0 (Backend Foundation) after the AI's analysis revealed the backend wasn't covered by the original epics. The AI identified the gap, but the human made the strategic call.

2. **QA strategy:** The human decided to run QA activities as standalone quality gates rather than an epic, and chose the specific activities (security, coverage, accessibility, performance). The AI recommended the approach but the human set the scope.

3. **Tool selection:** The human specified which MCP servers to use (Chrome DevTools, Postman, Playwright) and resolved infrastructure issues (installing Chrome, configuring remote debugging).

4. **Scope control:** Throughout the project, the human controlled when to skip code review ("updating sprint-status.yaml to mark done, then create story 2.2"), when to apply fixes immediately vs defer, and when to move to the next phase.

5. **Docker compose refinements:** The human made manual edits to `docker-compose.yml` (changing ports for dev/test profiles to avoid conflicts) that the AI's initial implementation didn't account for.

6. **Final deliverable requirements:** The human specified the exact deliverable checklist for project closure, ensuring nothing was missed.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Epics delivered | 6 (Epic 0–5) |
| Stories completed | 24 |
| Tests generated | 92 (42 backend + 42 frontend + 8 E2E) |
| QA reports produced | 7 |
| Security findings fixed | 9 |
| Performance fixes applied | 5 |
| Accessibility fixes applied | 7 |
| MCP servers used | 3 (Chrome DevTools, Postman, Playwright) |
| Docker images created | 2 (api: 189MB, web: 62MB) |
| Debugging cases resolved by AI | 6 documented |
| Human interventions required | 6 documented |
