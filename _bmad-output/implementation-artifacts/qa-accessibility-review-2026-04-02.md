# Accessibility Audit — bmad-todo

**Date:** 2026-04-02
**Standard:** WCAG 2.1 AA
**Method:** Manual code-level audit of all frontend components, styles, and HTML

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0 | — |
| MODERATE | 5 | Actionable |
| MINOR | 3 | Low priority |
| COMPLIANT | 6 | No action needed |

**Overall:** The app has a strong accessibility foundation — semantic HTML, ARIA attributes, keyboard operability, and focus indicators are built in from the start. No critical violations found. Several moderate issues to address.

---

## Already Compliant

- **1.3.1 Semantic HTML** — `<main>`, `<section>`, `<header>`, `<form>`, `<ol>`, `<li>`, `<article>`, `<button>` used correctly throughout
- **1.4.1 Use of color** — Completed state uses strikethrough + icon change (✓ vs ○) + text label ("Completed" / "Active") — NOT color alone
- **2.1.1 Keyboard** — All interactive elements are native `<button>` and `<input>` — keyboard-operable by default
- **2.4.3 Focus order** — Natural DOM order: header → composer → list → items (toggle, delete)
- **3.1.1 Language** — `lang="en"` declared on `<html>`
- **3.3.1 Error identification** — Validation and server errors shown via `role="alert"` with `aria-describedby` linking to input
- **4.1.2 Name, role, value** — All components expose accessible names via `aria-label`, `<label htmlFor>`, and sr-only text

---

## Moderate Findings

### M1. Touch targets below 44px on toggle/delete buttons
**WCAG:** 2.5.8 Target Size (Minimum)
**Evidence:** `.todo-card__toggle` and `.todo-card__delete` have `min-height: 2rem` (32px) with small padding.
**Fix:** Increase `min-height` to `2.75rem` (44px).

### M2. Disabled button contrast reduced via opacity
**WCAG:** 1.4.3 Contrast (Minimum)
**Evidence:** Disabled states use `opacity: 0.65` / `opacity: 0.82` which degrades text contrast.
**Fix:** Use explicit muted colors instead of opacity for disabled text.

### M3. Input missing `required` attribute
**WCAG:** 3.3.2 Labels or Instructions
**Evidence:** TodoComposer input is validated for non-empty but has no `required` HTML attribute.
**Fix:** Add `required` to the `<input>` element.

### M4. Page title is "web" — not descriptive
**WCAG:** 2.4.2 Page Titled
**Evidence:** `index.html` has `<title>web</title>`.
**Fix:** Change to `<title>bmad-todo — Capture what matters now</title>`.

### M5. Delete button has redundant accessible name
**WCAG:** 4.1.2 Name, Role, Value
**Evidence:** Delete button contains visible "Delete" text AND sr-only "Delete {description}" — screen readers hear "Delete Delete [description]".
**Fix:** Remove the visible "Delete" text or the sr-only span (keep one, not both).

---

## Minor Findings

### L1. Loading skeleton lacks `aria-busy`
**Evidence:** `TodoLoadingState` section has `aria-live="polite"` but no `aria-busy="true"`.
**Fix:** Add `aria-busy="true"` to the loading section.

### L2. Hint text could be more discoverable
**Evidence:** "Keep it short and clear. Tasks can be up to 500 characters." appears below the button, not adjacent to the input.
**Fix:** Consider linking via `aria-describedby` or moving above the button.

### L3. Focus ring contrast depends on background
**Evidence:** Focus uses `color-mix(in srgb, var(--color-focus) 72%, white)` — may not meet 3:1 on all surfaces.
**Fix:** Test on both light and card backgrounds; adjust if needed.

---

## Recommended Quick Fixes

| # | Fix | Effort |
|---|-----|--------|
| M1 | Increase toggle/delete `min-height` to 2.75rem | 2 min |
| M3 | Add `required` to composer input | 1 min |
| M4 | Update page title in index.html | 1 min |
| M5 | Remove redundant "Delete" visible text from button | 2 min |
| L1 | Add `aria-busy="true"` to loading state | 1 min |
