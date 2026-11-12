---
name: Browser interaction testing
description: Dependency-light end-to-end testing for the static website.
---

For browser-level regression checks, the Replit environment provides Chromium, and the project's static build does not otherwise depend on a browser testing framework. A small Python standard-library harness can drive the real page through Chrome DevTools Protocol instead of adding Playwright or another package.

**Why:** The gallery and quiz rely on browser interactions, while the project keeps a minimal dependency stack. A real browser check covered those flows without changing application code or visuals.

**How to apply:** Before adding browser automation dependencies for this site, check for the provided Chromium executable and prefer the existing lightweight DevTools approach when it meets the needed coverage.
