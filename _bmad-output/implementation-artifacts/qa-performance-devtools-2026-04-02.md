# Performance Audit (Chrome DevTools MCP) — bmad-todo

**Date:** 2026-04-02
**Tool:** Chrome DevTools MCP (Lighthouse + Performance Trace)
**URL:** http://localhost:3000 (Docker Compose)

---

## Lighthouse Scores

| Category | Desktop | Mobile |
|----------|---------|--------|
| Accessibility | **95** | **95** |
| Best Practices | **100** | **100** |
| SEO | **82** | **82** |

### Failed Audits (3)

| Audit | Category | Severity | Fix |
|-------|----------|----------|-----|
| Color contrast insufficient | Accessibility | Moderate | Remaining contrast issue on one element — investigate specific element from Lighthouse report |
| Missing meta description | SEO | Low | Add `<meta name="description">` to `index.html` |
| Missing robots.txt | SEO | Low | Add `robots.txt` to `web/public/` |

---

## Core Web Vitals (Performance Trace)

| Metric | Value | Rating | Target |
|--------|-------|--------|--------|
| **LCP** (Largest Contentful Paint) | **102 ms** | Excellent | < 2,500 ms |
| **CLS** (Cumulative Layout Shift) | **0.027** | Excellent | < 0.1 |
| **TTFB** (Time to First Byte) | **2 ms** | Excellent | < 800 ms |

### LCP Breakdown
- **LCP Element:** `<h1 id="todo-shell-title">` ("Capture what matters now")
- **TTFB:** 2 ms (1.5% of total)
- **Render Delay:** 101 ms (98.5% of total)
- **No resource load time** — LCP is text, not an image/font
- **Assessment:** Excellent. Render delay is dominated by JS parse/execute, which is expected for an SPA.

### CLS Analysis
- **Worst shift cluster:** 0.027 at 88ms
- **No identified culprits** — minor shift during initial render, within "Good" threshold
- **Assessment:** Excellent. No actionable layout shifts.

### Render-Blocking Resources
- **CSS:** `index-BCkLOCKn.css` (7ms total, 0.7ms download) — render-blocking but negligible impact
- **Estimated savings:** 0ms FCP, 0ms LCP
- **Assessment:** No action needed. CSS is small (8KB) and cached with immutable headers.

---

## Network Waterfall

| # | Resource | Size | Time | Cache |
|---|----------|------|------|-------|
| 1 | `index.html` | ~0.5KB | instant | no-cache |
| 2 | `index-BCkLOCKn.css` | 8KB | 7ms | 1yr immutable |
| 3 | `index-Cv1CVFJ5.js` | 236KB (72KB gzip) | fast | 1yr immutable |
| 4 | `GET /api/v1/todos` | dynamic | fast | no-cache |

**Total requests on initial load: 4** — minimal, no unnecessary requests.
**Critical path:** HTML → CSS + JS (parallel) → API call → render.
**Assessment:** Clean waterfall. No redundant requests, no external dependencies.

---

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Core Web Vitals | **All Excellent** | LCP 102ms, CLS 0.027, TTFB 2ms |
| Best Practices | **100/100** | Perfect score |
| Accessibility | **95/100** | One minor contrast element remaining |
| SEO | **82/100** | Missing meta description and robots.txt |
| Network | **4 requests** | Clean waterfall, proper caching |
| Bundle size | **72KB gzip** | Acceptable for React + TanStack Query |

### Remaining Quick Fixes

| Fix | Effort |
|-----|--------|
| Add `<meta name="description">` to `index.html` | 1 min |
| Add `robots.txt` to `web/public/` | 1 min |

---

## Reports

- Desktop Lighthouse: [report.html](_bmad-output/report.html)
- Mobile Lighthouse: [report.html](_bmad-output/mobile/report.html)
- Performance trace: [perf-trace.json.gz](_bmad-output/perf-trace.json.gz)
- Screenshot: [app-screenshot.png](_bmad-output/app-screenshot.png)
