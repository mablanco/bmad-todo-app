# Project Deliverables — bmad-todo-app

This document indexes all deliverables produced during the development of the bmad-todo application, organized by category for easy navigation.

---

## 1. BMAD Planning Artifacts

| Artifact | Path |
|----------|------|
| Product Brief | [docs/project-brief.md](docs/project-brief.md) |
| Product Requirements Document (PRD) | [_bmad-output/planning-artifacts/prd.md](_bmad-output/planning-artifacts/prd.md) |
| PRD Validation Report | [_bmad-output/planning-artifacts/prd-validation-report.md](_bmad-output/planning-artifacts/prd-validation-report.md) |
| Architecture Decision Document | [_bmad-output/planning-artifacts/architecture.md](_bmad-output/planning-artifacts/architecture.md) |
| UX Design Specification | [_bmad-output/planning-artifacts/ux-design-specification.md](_bmad-output/planning-artifacts/ux-design-specification.md) |
| Test Strategy | [_bmad-output/planning-artifacts/test-strategy.md](_bmad-output/planning-artifacts/test-strategy.md) |
| Epics and Stories | [_bmad-output/planning-artifacts/epics.md](_bmad-output/planning-artifacts/epics.md) |
| Implementation Readiness Report | [_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-27.md](_bmad-output/planning-artifacts/implementation-readiness-report-2026-03-27.md) |

---

## 2. Story Files (with Acceptance Criteria)

### Epic 0 — Backend API Foundation
| Story | Path |
|-------|------|
| 0.1 Bootstrap FastAPI | [_bmad-output/implementation-artifacts/0-1-bootstrap-the-fastapi-project-and-define-the-api-contract.md](_bmad-output/implementation-artifacts/0-1-bootstrap-the-fastapi-project-and-define-the-api-contract.md) |
| 0.2 Todo Data Model | [_bmad-output/implementation-artifacts/0-2-implement-the-todo-data-model-and-persistence-layer.md](_bmad-output/implementation-artifacts/0-2-implement-the-todo-data-model-and-persistence-layer.md) |
| 0.3 CRUD Endpoints | [_bmad-output/implementation-artifacts/0-3-implement-todo-crud-endpoints-with-service-and-repository-layers.md](_bmad-output/implementation-artifacts/0-3-implement-todo-crud-endpoints-with-service-and-repository-layers.md) |
| 0.4 Backend Hardening | [_bmad-output/implementation-artifacts/0-4-harden-the-backend-foundation.md](_bmad-output/implementation-artifacts/0-4-harden-the-backend-foundation.md) |

### Epic 1 — Trustworthy Task Capture
| Story | Path |
|-------|------|
| 1.1 Task Capture Shell | [_bmad-output/implementation-artifacts/1-1-replace-starter-ui-with-the-task-capture-shell.md](_bmad-output/implementation-artifacts/1-1-replace-starter-ui-with-the-task-capture-shell.md) |
| 1.2 Connect to API | [_bmad-output/implementation-artifacts/1-2-connect-the-web-app-to-the-todo-list-api.md](_bmad-output/implementation-artifacts/1-2-connect-the-web-app-to-the-todo-list-api.md) |
| 1.3 Create Todo | [_bmad-output/implementation-artifacts/1-3-add-a-new-todo-from-the-main-composer.md](_bmad-output/implementation-artifacts/1-3-add-a-new-todo-from-the-main-composer.md) |
| 1.4 Trust Signals | [_bmad-output/implementation-artifacts/1-4-establish-capture-state-trust-signals.md](_bmad-output/implementation-artifacts/1-4-establish-capture-state-trust-signals.md) |

### Epic 2 — Clear Task State Management
| Story | Path |
|-------|------|
| 2.1 Render Items | [_bmad-output/implementation-artifacts/2-1-render-todo-items-with-clear-task-state-information.md](_bmad-output/implementation-artifacts/2-1-render-todo-items-with-clear-task-state-information.md) |
| 2.2 Toggle Complete | [_bmad-output/implementation-artifacts/2-2-mark-a-todo-complete-or-active-from-the-list.md](_bmad-output/implementation-artifacts/2-2-mark-a-todo-complete-or-active-from-the-list.md) |
| 2.3 Delete Todo | [_bmad-output/implementation-artifacts/2-3-delete-a-todo-cleanly-from-the-list.md](_bmad-output/implementation-artifacts/2-3-delete-a-todo-cleanly-from-the-list.md) |
| 2.4 Reload Trust | [_bmad-output/implementation-artifacts/2-4-preserve-trust-across-state-changes-and-reload.md](_bmad-output/implementation-artifacts/2-4-preserve-trust-across-state-changes-and-reload.md) |

### Epic 3 — Calm, Accessible, Responsive Experience
| Story | Path |
|-------|------|
| 3.1 Soft Calm Visual | [_bmad-output/implementation-artifacts/3-1-apply-the-soft-calm-visual-foundation-to-the-todo-experience.md](_bmad-output/implementation-artifacts/3-1-apply-the-soft-calm-visual-foundation-to-the-todo-experience.md) |
| 3.2 State Components | [_bmad-output/implementation-artifacts/3-2-implement-consistent-empty-loading-and-error-state-components.md](_bmad-output/implementation-artifacts/3-2-implement-consistent-empty-loading-and-error-state-components.md) |
| 3.3 Accessibility | [_bmad-output/implementation-artifacts/3-3-make-core-todo-flows-keyboard-accessible-and-screen-reader-friendly.md](_bmad-output/implementation-artifacts/3-3-make-core-todo-flows-keyboard-accessible-and-screen-reader-friendly.md) |
| 3.4 Responsive Design | [_bmad-output/implementation-artifacts/3-4-optimize-the-experience-across-mobile-tablet-and-desktop.md](_bmad-output/implementation-artifacts/3-4-optimize-the-experience-across-mobile-tablet-and-desktop.md) |

### Epic 4 — Developer Readiness and Product Hardening
| Story | Path |
|-------|------|
| 4.1 Documentation | [_bmad-output/implementation-artifacts/4-1-complete-local-run-and-environment-documentation.md](_bmad-output/implementation-artifacts/4-1-complete-local-run-and-environment-documentation.md) |
| 4.2 API Contract | [_bmad-output/implementation-artifacts/4-2-harden-api-contract-reliability-and-error-consistency.md](_bmad-output/implementation-artifacts/4-2-harden-api-contract-reliability-and-error-consistency.md) |
| 4.3 E2E Confidence | [_bmad-output/implementation-artifacts/4-3-establish-end-to-end-confidence-for-the-core-todo-loop.md](_bmad-output/implementation-artifacts/4-3-establish-end-to-end-confidence-for-the-core-todo-loop.md) |
| 4.4 Extensibility | [_bmad-output/implementation-artifacts/4-4-preserve-extensibility-and-maintenance-boundaries.md](_bmad-output/implementation-artifacts/4-4-preserve-extensibility-and-maintenance-boundaries.md) |

### Epic 5 — Docker Containerization
| Story | Path |
|-------|------|
| 5.1 Dockerfiles | [_bmad-output/implementation-artifacts/5-1-create-optimized-dockerfiles-for-frontend-and-backend.md](_bmad-output/implementation-artifacts/5-1-create-optimized-dockerfiles-for-frontend-and-backend.md) |
| 5.2 Docker Compose | [_bmad-output/implementation-artifacts/5-2-create-docker-compose-for-container-orchestration.md](_bmad-output/implementation-artifacts/5-2-create-docker-compose-for-container-orchestration.md) |
| 5.3 Health Checks | [_bmad-output/implementation-artifacts/5-3-implement-container-health-checks-and-logging.md](_bmad-output/implementation-artifacts/5-3-implement-container-health-checks-and-logging.md) |
| 5.4 Compose Profiles | [_bmad-output/implementation-artifacts/5-4-support-dev-and-test-environments-via-compose-profiles.md](_bmad-output/implementation-artifacts/5-4-support-dev-and-test-environments-via-compose-profiles.md) |

### Sprint Tracking
| Artifact | Path |
|----------|------|
| Sprint Status | [_bmad-output/implementation-artifacts/sprint-status.yaml](_bmad-output/implementation-artifacts/sprint-status.yaml) |
| Deferred Work | [_bmad-output/implementation-artifacts/deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md) |

---

## 3. Working Application

| Component | Path | Tech Stack |
|-----------|------|------------|
| Backend API | [api/](api/) | Python 3.12, FastAPI, SQLAlchemy, SQLite, Alembic |
| Frontend | [web/](web/) | React 19, TypeScript, Vite, TanStack Query |
| Root scripts | [package.json](package.json) | Bootstrap, dev, test commands |
| Makefile | [Makefile](Makefile) | Make-based workflow mirror |

### How to run
```bash
npm run bootstrap    # Install all dependencies
npm run dev          # Start frontend + backend
docker compose up    # Run via Docker
```

---

## 4. Test Suites

### Backend Tests (42 tests)
| Suite | Path | Count |
|-------|------|-------|
| Integration (CRUD + health) | [api/tests/test_todos_api.py](api/tests/test_todos_api.py), [api/tests/test_health.py](api/tests/test_health.py) | 10 |
| Unit — Service | [api/tests/unit/test_todo_service.py](api/tests/unit/test_todo_service.py) | 6 |
| Unit — Repository | [api/tests/unit/test_todo_repository.py](api/tests/unit/test_todo_repository.py) | 5 |
| Unit — Logging | [api/tests/unit/test_logging.py](api/tests/unit/test_logging.py) | 4 |
| Unit — Config | [api/tests/unit/test_config.py](api/tests/unit/test_config.py) | 4 |
| Unit — Schemas | [api/tests/unit/test_schemas.py](api/tests/unit/test_schemas.py) | 8 |
| Unit — Session | [api/tests/unit/test_session.py](api/tests/unit/test_session.py) | 3 |
| Unit — Test Support | [api/tests/unit/test_test_support.py](api/tests/unit/test_test_support.py) | 3 |

### Frontend Tests (42 tests)
| Suite | Path | Count |
|-------|------|-------|
| App Integration | [web/src/App.test.tsx](web/src/App.test.tsx) | 29 |
| API Client Unit | [web/src/lib/\_\_tests\_\_/api-client.test.ts](web/src/lib/__tests__/api-client.test.ts) | 6 |
| Errors Unit | [web/src/lib/\_\_tests\_\_/errors.test.ts](web/src/lib/__tests__/errors.test.ts) | 7 |

### E2E Tests (8 tests)
| Suite | Path | Count |
|-------|------|-------|
| Core Todo Loop | [web/tests/e2e/smoke.spec.ts](web/tests/e2e/smoke.spec.ts) | 5 |
| Accessibility (axe-core) | [web/tests/e2e/accessibility.spec.ts](web/tests/e2e/accessibility.spec.ts) | 3 |

### How to run
```bash
npm run test           # All unit tests (frontend + backend)
npm run test:e2e       # Playwright E2E tests
npm run test:all       # Everything
```

---

## 5. Docker Setup

| File | Path | Purpose |
|------|------|---------|
| Backend Dockerfile | [api/Dockerfile](api/Dockerfile) | Multi-stage build, non-root user, Python healthcheck |
| Frontend Dockerfile | [web/Dockerfile](web/Dockerfile) | Node build stage → nginx serve stage, healthcheck |
| Nginx config | [web/nginx.conf](web/nginx.conf) | SPA fallback, API reverse proxy, security headers, gzip |
| Docker Compose | [docker-compose.yml](docker-compose.yml) | Orchestrates api + web, named volume, dev/test profiles |
| Docker Ignore | [.dockerignore](.dockerignore) | Excludes dev artifacts from builds |

### How to run
```bash
docker compose up --build            # Production-like
docker compose --profile dev up      # Dev mode (hot reload)
docker compose --profile test up     # Test mode (isolated DB)
```

---

## 6. QA Reports

| Report | Path | Tool Used |
|--------|------|-----------|
| Security Review | [_bmad-output/implementation-artifacts/qa-security-review-2026-04-02.md](_bmad-output/implementation-artifacts/qa-security-review-2026-04-02.md) | Adversarial OWASP review |
| Test Coverage Analysis | [_bmad-output/implementation-artifacts/qa-test-coverage-2026-04-02.md](_bmad-output/implementation-artifacts/qa-test-coverage-2026-04-02.md) | Manual coverage mapping |
| Accessibility Audit | [_bmad-output/implementation-artifacts/qa-accessibility-review-2026-04-02.md](_bmad-output/implementation-artifacts/qa-accessibility-review-2026-04-02.md) | axe-core + Lighthouse |
| Performance (Chrome DevTools) | [_bmad-output/implementation-artifacts/qa-performance-devtools-2026-04-02.md](_bmad-output/implementation-artifacts/qa-performance-devtools-2026-04-02.md) | Chrome DevTools MCP |
| Performance (Code Analysis) | [_bmad-output/implementation-artifacts/qa-performance-review-2026-04-02.md](_bmad-output/implementation-artifacts/qa-performance-review-2026-04-02.md) | Code-level analysis |
| API Contract Validation | [_bmad-output/implementation-artifacts/qa-api-contract-validation-2026-04-03.md](_bmad-output/implementation-artifacts/qa-api-contract-validation-2026-04-03.md) | Postman MCP |
| Browser Interaction Testing | [_bmad-output/implementation-artifacts/qa-playwright-browser-testing-2026-04-03.md](_bmad-output/implementation-artifacts/qa-playwright-browser-testing-2026-04-03.md) | Playwright MCP |

### Screenshot Evidence
All browser testing screenshots: [_bmad-output/qa-playwright-evidence/](_bmad-output/qa-playwright-evidence/)

### Lighthouse Reports
- Desktop: [_bmad-output/report.html](_bmad-output/report.html)
- Mobile: [_bmad-output/mobile/report.html](_bmad-output/mobile/report.html)

---

## 7. BMAD Process Documentation

| Document | Path | Purpose |
|----------|------|---------|
| Project README | [README.md](README.md) | Setup, dev, test, and API reference |
| AI Development Log | [AI-DEVELOPMENT-LOG.md](AI-DEVELOPMENT-LOG.md) | Agent usage, MCP servers, test generation, debugging, limitations |
| Final Retrospective | [_bmad-output/implementation-artifacts/final-retrospective-2026-03-31.md](_bmad-output/implementation-artifacts/final-retrospective-2026-03-31.md) | How BMAD guided implementation, lessons learned |
| Sprint Status (final) | [_bmad-output/implementation-artifacts/sprint-status.yaml](_bmad-output/implementation-artifacts/sprint-status.yaml) | All 6 epics, 24 stories — done |
| Deferred Work | [_bmad-output/implementation-artifacts/deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md) | Items tracked for future work |
| Environment Config | [api/.env.example](api/.env.example), [web/.env.example](web/.env.example) | Environment variable documentation |
