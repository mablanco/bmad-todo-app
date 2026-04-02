# API Contract Validation (Postman MCP) — bmad-todo

**Date:** 2026-04-03
**Tool:** Postman MCP (collection runner with test assertions)
**Source:** `bmad-todo-app API` collection generated from `http://127.0.0.1:8000/openapi.json`
**Target:** `http://127.0.0.1:8000` (FastAPI backend)

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tests** | 12 |
| **Passed** | 12 |
| **Failed** | 0 |
| **Success rate** | **100%** |
| **Duration** | 5.29s |

---

## Collection Details

**Workspace:** Marco Antonio Blanco's Workspace (`d230ecfc-610b-4420-864f-6a870b6ac419`)
**Collection:** bmad-todo-app API (`d0bacb73-e5ac-49f8-8ec8-024a9942e0e0`)
**Origin:** Generated from FastAPI's auto-generated OpenAPI schema, then augmented with contract test scripts via Postman MCP.

---

## Test Results by Endpoint

### 1. GET /api/v1/health — Healthcheck
| Test | Result |
|------|--------|
| Status is 200 | Pass |
| Body has `{"status": "ok"}` | Pass |

### 2. POST /api/v1/todos — Create Todo
| Test | Result |
|------|--------|
| Status is 201 | Pass |
| Response has `{"data": {...}}` envelope with `id`, `description`, `completed`, `created_at`, `updated_at` | Pass |
| `completed` defaults to `false` | Pass |
| Created `todoId` stored for subsequent requests | Pass |

### 3. GET /api/v1/todos — List Todos
| Test | Result |
|------|--------|
| Status is 200 | Pass |
| Response has `{"data": [...]}` array | Pass |
| Each todo contains all required fields (`id`, `description`, `completed`, `created_at`, `updated_at`) | Pass |

### 4. PATCH /api/v1/todos/{todoId} — Update Todo
| Test | Result |
|------|--------|
| Status is 200 | Pass |
| Response has `{"data": {...}}` envelope | Pass |
| `completed` toggled to `true`, all fields present | Pass |
| Pre-request: auto-creates test todo if `todoId` not set (order-independent) | Pass |

### 5. DELETE /api/v1/todos/{todoId} — Delete Todo
| Test | Result |
|------|--------|
| Status is 204 | Pass |
| Response body is empty | Pass |
| Pre-request: auto-creates test todo if `todoId` not set (order-independent) | Pass |

---

## Contract Assertions Validated

| Contract Rule | Validated By |
|---------------|-------------|
| Success responses use `{"data": ...}` envelope | Create, List, Update |
| Error responses use `{"error": {"code", "message", "details"}}` envelope | Verified in separate collection run (19/19 pass) |
| `POST` returns `201 Created` | Create Todo |
| `DELETE` returns `204 No Content` with empty body | Delete Todo |
| `PATCH` returns `200 OK` with updated resource | Update Todo |
| `GET` returns `200 OK` | Health, List |
| Todo resource shape: `id`, `description`, `completed`, `created_at`, `updated_at` | Create, List, Update |
| New todos default to `completed: false` | Create Todo |

---

## Methodology

1. **Collection source:** Imported from FastAPI's OpenAPI schema (`/openapi.json`) — ensures the collection always mirrors the actual API spec.
2. **Test scripts added via Postman MCP:** Each request was augmented with `pm.test()` assertions validating status codes, response envelopes, field presence, and data types.
3. **Order-independent execution:** Update and Delete requests include pre-request scripts that auto-create a test todo if `todoId` is not already set, allowing the collection to run correctly regardless of request execution order.
4. **Collection runner:** Executed via `mcp__postman__runCollection` against the live backend.

---

## Related QA Artifacts

- [Security Review](qa-security-review-2026-04-02.md) — OWASP-focused audit with 9 remediations
- [Test Coverage Analysis](qa-test-coverage-2026-04-02.md) — 79% meaningful coverage (92 tests)
- [Accessibility Audit](qa-accessibility-review-2026-04-02.md) — axe-core automated WCAG 2.1 AA validation
- [Performance Audit (Chrome DevTools)](qa-performance-devtools-2026-04-02.md) — Core Web Vitals, Lighthouse scores
- [Performance Review (Code Analysis)](qa-performance-review-2026-04-02.md) — Code-level performance findings and fixes
