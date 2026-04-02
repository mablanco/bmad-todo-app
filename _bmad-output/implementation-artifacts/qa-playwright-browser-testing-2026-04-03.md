# Browser Interaction Testing (Playwright MCP) — bmad-todo

**Date:** 2026-04-03
**Tool:** Playwright MCP (automated browser interactions with screenshot evidence)
**URL:** http://127.0.0.1:3000 (Docker Compose frontend via nginx)
**Precondition:** All existing todos cleared before test run for clean state.

---

## Summary

| Test Case | Result | Screenshot |
|-----------|--------|------------|
| Empty state | PASS | [01-empty-state.png](../qa-playwright-evidence/01-empty-state.png) |
| Create first todo | PASS | [02-create-first-todo.png](../qa-playwright-evidence/02-create-first-todo.png) |
| Create second todo | PASS | [03-create-second-todo.png](../qa-playwright-evidence/03-create-second-todo.png) |
| Toggle todo to Completed | PASS | [04-toggle-completed.png](../qa-playwright-evidence/04-toggle-completed.png) |
| Toggle todo back to Active | PASS | [05-toggle-back-active.png](../qa-playwright-evidence/05-toggle-back-active.png) |
| Delete a todo | PASS | [06-delete-todo.png](../qa-playwright-evidence/06-delete-todo.png) |
| Delete last todo (empty transition) | PASS | [07-delete-last-empty-transition.png](../qa-playwright-evidence/07-delete-last-empty-transition.png) |
| Error: blank input validation | PASS | [08-error-blank-validation.png](../qa-playwright-evidence/08-error-blank-validation.png) |

**All 8 test cases passed.**

---

## Test Details

### TC-01: Empty State
**Steps:** Navigate to app with no todos.
**Expected:** "No tasks yet" heading with encouraging message directing user to the composer.
**Actual:** "No tasks yet" displayed with "Start with one clear next step" and arrow pointing to input field. PASS.

### TC-02: Create First Todo
**Steps:** Type "Write project documentation" in the input, click "Add task".
**Expected:** Todo appears in the list, input clears, success feedback shown.
**Actual:** "Added: Write project documentation" feedback shown in teal. Todo card appears with "○ Active" badge, fresh-item highlight border, timestamp. Input cleared. PASS.

### TC-03: Create Second Todo
**Steps:** Type "Fix login page bug", click "Add task".
**Expected:** Second todo appears at top (newest-first), counter updates.
**Actual:** "Fix login page bug" appears at top, "Write project documentation" below. Counter shows "2 tasks". PASS.

### TC-04: Toggle Todo to Completed
**Steps:** Click "Mark complete" on "Write project documentation".
**Expected:** Todo visually changes to completed state — strikethrough, checkmark, muted colors.
**Actual:** Badge changes to "✓ Completed" (gray), description shows strikethrough, card opacity reduced. PASS.

### TC-05: Toggle Todo Back to Active
**Steps:** Click "Mark active" on the completed todo.
**Expected:** Todo reverts to active state.
**Actual:** Badge returns to "○ Active" (teal), strikethrough removed, full opacity restored. PASS.

### TC-06: Delete a Todo
**Steps:** Click "× Delete" on "Fix login page bug".
**Expected:** Todo removed from list, counter decrements.
**Actual:** "Fix login page bug" disappears immediately. Counter shows "1 task". PASS.

### TC-07: Delete Last Todo (Empty State Transition)
**Steps:** Click "× Delete" on "Write project documentation" (the only remaining todo).
**Expected:** List transitions cleanly to empty state.
**Actual:** "No tasks yet" empty state appears with encouraging message. Clean transition, no flicker. PASS.

### TC-08: Error Handling — Blank Input Validation
**Steps:** Enter whitespace-only text "   ", click "Add task".
**Expected:** Submission blocked, inline error shown, no todo created.
**Actual:** "Description must be between 1 and 500 characters." shown in red below the input. Input border turns red. Empty state remains unchanged. No API call made. PASS.

---

## Observations

- **Fresh-item highlight:** Newly created todos show a teal border accent that fades after ~3 seconds — subtle, calm trust signal.
- **Optimistic updates:** Toggle and delete are instant — no loading spinner or delay visible to the user.
- **Accessibility:** All buttons are clearly labeled. "○ Active" / "✓ Completed" status uses icon + text (not color alone). Delete buttons have visible "× Delete" text.
- **Responsive:** The single-column layout is clean and well-spaced at the tested viewport width.
- **Error recovery:** Validation error clears as soon as the user starts typing again.

---

## Evidence Files

All screenshots saved to `_bmad-output/qa-playwright-evidence/`:
- `01-empty-state.png`
- `02-create-first-todo.png`
- `03-create-second-todo.png`
- `04-toggle-completed.png`
- `05-toggle-back-active.png`
- `06-delete-todo.png`
- `07-delete-last-empty-transition.png`
- `08-error-blank-validation.png`

---

## Related QA Artifacts

- [Security Review](qa-security-review-2026-04-02.md)
- [Test Coverage Analysis](qa-test-coverage-2026-04-02.md)
- [Accessibility Audit](qa-accessibility-review-2026-04-02.md)
- [Performance Audit (Chrome DevTools)](qa-performance-devtools-2026-04-02.md)
- [Performance Review (Code Analysis)](qa-performance-review-2026-04-02.md)
- [API Contract Validation (Postman)](qa-api-contract-validation-2026-04-03.md)
