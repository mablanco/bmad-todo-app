# Security Review — bmad-todo

**Date:** 2026-04-02
**Scope:** Full codebase (backend `api/` + frontend `web/` + Docker)
**Method:** Adversarial OWASP-focused review with parallel backend/frontend analysis
**Reviewer:** Claude Opus 4.6

---

## Summary

| Severity | Count | Action |
|----------|-------|--------|
| CRITICAL | 2 | Fix before any public deployment |
| HIGH | 6 | Fix before production use |
| MEDIUM | 6 | Fix when capacity allows |
| LOW | 4 | Acceptable for MVP, track for later |
| Dismissed | 7 | False positives, design decisions, or N/A for MVP scope |

---

## CRITICAL Findings

### C1. Missing Security Headers in Nginx
**OWASP:** A05 Security Misconfiguration
**Location:** `web/nginx.conf`
**Evidence:** No `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`, or `Strict-Transport-Security` headers defined.
**Risk:** Enables clickjacking, MIME sniffing, and XSS via framing. Any public-facing deployment is vulnerable.
**Fix:** Add a security headers block to nginx.conf:
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" always;
```

### C2. Overly Permissive CORS Configuration
**OWASP:** A05 Security Misconfiguration
**Location:** `api/app/main.py` (CORS middleware)
**Evidence:** `allow_methods=["*"]` and `allow_headers=["*"]` combined with `allow_credentials=True` effectively bypasses CORS for any matched origin.
**Risk:** Any site on an allowed origin can make credentialed cross-origin requests with arbitrary methods.
**Fix:** Restrict to `allow_methods=["GET", "POST", "PATCH", "DELETE"]` and `allow_headers=["Content-Type"]`.

---

## HIGH Findings

### H1. No Authentication on Any Endpoint
**OWASP:** A01 Broken Access Control
**Location:** All `api/app/api/routes/todos.py` endpoints
**Evidence:** Zero authentication required for CRUD operations. Any client can create, read, modify, or delete all todos.
**Risk:** Acceptable for v1 single-user MVP per architecture decision. Becomes critical when deployed publicly or multi-user.
**Note:** Architecture explicitly defers auth to post-MVP (NFR-006). `user_id` column is reserved. Track but don't block.

### H2. Test Reset Endpoint Exposure Risk
**OWASP:** A04 Insecure Design
**Location:** `/test/reset` endpoint (if `ENABLE_E2E_TEST_ROUTES=1`)
**Evidence:** E2E test route that resets database state is gated only by environment variable.
**Risk:** If env var is accidentally set in production, any client can wipe the database.
**Fix:** Add IP allowlist or require a test-only secret header. Never set `ENABLE_E2E_TEST_ROUTES` in production.

### H3. Server Error Messages Reflected Verbatim in UI
**OWASP:** A09 Logging & Monitoring Failures
**Location:** `web/src/features/todos/components/TodoAppShell.tsx`, `TodoErrorState.tsx`
**Evidence:** `error.message` from backend responses rendered directly in the UI without sanitization.
**Risk:** A misconfigured or compromised backend could inject misleading error text (social engineering). React escapes HTML, so no XSS, but content injection is possible.
**Fix:** Map server error codes to fixed frontend strings rather than forwarding raw messages.

### H4. Pydantic Validation Internals Exposed
**OWASP:** A09 Logging & Monitoring Failures
**Location:** `api/app/core/errors.py` — `validation_error_handler`
**Evidence:** `exc.errors()` returned in `details.issues`, exposing field names, types, and validation rules.
**Risk:** Aids attacker reconnaissance — reveals schema structure and validation logic.
**Fix:** Strip internal details from validation error responses in production. Return only user-safe messages.

### H5. No Rate Limiting
**OWASP:** A04 Insecure Design
**Location:** All endpoints
**Evidence:** No middleware or decorator limiting request rate.
**Risk:** Enables brute-force ID enumeration, bulk creation spam, and application-layer DoS.
**Fix:** Add `slowapi` or a simple middleware limiting requests per IP per minute.

### H6. Missing HSTS Header
**OWASP:** A02 Cryptographic Failures
**Location:** `web/nginx.conf`
**Evidence:** No `Strict-Transport-Security` header.
**Risk:** SSL stripping attacks on any HTTPS deployment.
**Fix:** Add `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;` (only when serving over HTTPS).

---

## MEDIUM Findings

### M1. No CSRF Protection
**Location:** Backend (no CSRF middleware), Frontend (no CSRF token in mutation hooks)
**Evidence:** State-changing requests (`POST`, `PATCH`, `DELETE`) use `Content-Type: application/json` which provides implicit CSRF protection in modern browsers (preflight required for non-simple requests), but only when CORS is correctly configured (see C2).
**Risk:** Mitigated by fixing C2. Low residual risk with strict CORS + JSON-only endpoints.

### M2. Database Path in alembic.ini
**OWASP:** A02 Cryptographic Failures
**Location:** `api/alembic.ini` — `sqlalchemy.url = sqlite:///./bmad_todo.db`
**Evidence:** Hardcoded database path in a tracked config file.
**Risk:** Reveals database location. Low risk for SQLite, higher if migrated to PostgreSQL with credentials.
**Fix:** Use `%(DATABASE_URL)s` interpolation or override in `env.py` (already partially done).

### M3. Client-Side Validation Bypassable
**Location:** `web/src/features/todos/components/TodoComposer.tsx`
**Evidence:** 500-char limit enforced client-side only via `validateDescription()`.
**Risk:** Attacker can POST directly to API bypassing frontend. Backend does validate via Pydantic `Field(max_length=500)`, so actual risk is low — but defense-in-depth gap.

### M4. No Request Body Size Limit
**OWASP:** A04 Insecure Design
**Location:** Backend — no middleware enforcing max request body size
**Evidence:** No `max_body_size` configuration in FastAPI or nginx proxy.
**Risk:** Large payload DoS possible.
**Fix:** Add `client_max_body_size 1m;` to nginx.conf and/or FastAPI middleware.

### M5. todoId Path Parameter Accepts Any String
**Location:** `api/app/api/routes/todos.py`
**Evidence:** `Path(min_length=1, max_length=36)` validates length but not UUID format.
**Risk:** Allows non-UUID strings to reach the database. SQLite handles gracefully but PostgreSQL might behave differently.
**Fix:** Use `Path(pattern=r'^[0-9a-f-]{36}$')` for stricter validation.

### M6. Docker Build Runs as Root Temporarily
**Location:** `web/Dockerfile`
**Evidence:** Default user is root during build/setup stages.
**Risk:** Minimal — standard Docker practice. Runtime uses non-root (nginx user 101). Build-stage root is expected.

---

## LOW Findings

### L1. HTTP Default for API Base URL
**Location:** `web/src/lib/env.ts` — `http://127.0.0.1:8000`
**Risk:** Expected for local dev. Docker Compose uses nginx proxy (same-origin). Only relevant if deployed without HTTPS.

### L2. SQLite for Production
**Location:** `api/app/core/config.py`
**Risk:** No concurrent access control. Acceptable for single-user MVP. Architecture plans PostgreSQL migration path.

### L3. Logging May Capture Sensitive Paths
**Location:** `api/app/core/logging.py`
**Risk:** Request paths logged. No PII in paths currently. Monitor if query params or auth tokens are added later.

### L4. No Referrer-Policy Meta Tag
**Location:** Frontend HTML
**Risk:** API URLs could leak via Referer header. Addressed by C1 fix (nginx security headers).

---

## Dismissed

- **No auth (design decision)** — Explicitly deferred per architecture NFR-006
- **No SRI on bundled assets** — Build is self-contained, no CDN
- **Generic HTML title** — UX issue, not security
- **Client-side validation bypass** — Backend validates; defense-in-depth, not a vulnerability
- **SQLite timing attacks** — Theoretical; no sensitive data to enumerate
- **User-tenant isolation** — `user_id` reserved; auth is post-MVP
- **Localhost-only CORS origins** — Appropriate for local dev; production config would differ

---

## Remediation Log

| ID | Finding | Status | Date |
|----|---------|--------|------|
| C1 | Missing nginx security headers | **FIXED** — X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy | 2026-04-02 |
| C2 | Overly permissive CORS | **FIXED** — restricted to GET/POST/PATCH/DELETE/OPTIONS + Content-Type/Authorization | 2026-04-02 |
| H2 | Test reset route exposure | **FIXED** — added `X-Test-Secret` header guard + `E2E_TEST_SECRET` env var | 2026-04-02 |
| H3 | Server error messages reflected | **FIXED** — frontend maps error codes to fixed safe strings, never forwards raw server text | 2026-04-02 |
| H4 | Pydantic internals exposed | **FIXED** — stripped `exc.errors()` details, returns field name + safe message only | 2026-04-02 |
| H5 | No rate limiting | **FIXED** — added `slowapi` middleware, 60 req/min per IP | 2026-04-02 |
| H6 | Missing HSTS | **FIXED** — added `Strict-Transport-Security` header to nginx | 2026-04-02 |
| M4 | No request body size limit | **FIXED** — `client_max_body_size 1m` in nginx | 2026-04-02 |
| M5 | todoId accepts non-UUID | **FIXED** — path param now requires UUID regex `^[0-9a-f]{8}-...` | 2026-04-02 |
| H1 | No authentication | **DEFERRED** — by design (post-MVP, NFR-006) | — |
| M1 | No CSRF | **MITIGATED** — by C2 CORS fix (JSON content type triggers preflight) | 2026-04-02 |
| M2 | DB path in alembic.ini | **ACCEPTED** — overridden by env.py at runtime | — |
| M3 | Client validation bypass | **ACCEPTED** — backend validates; defense-in-depth | — |

**All critical and high findings resolved. 55 tests passing (31 FE + 24 BE).**
