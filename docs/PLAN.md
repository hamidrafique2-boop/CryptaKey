# Implementation Plan — CryptaKey

**Date:** 2026-10-14  
**Deadline:** 2026-10-21  
**Architecture:** Static/browser-first, GitHub Pages deployment

---

## Phase 0 — Audit & Planning ✅
- [x] Inspect all source files
- [x] Document defects in `docs/AUDIT.md`
- [x] Resolve provenance in `docs/PROVENANCE.md`
- [x] Select product name and architecture in `docs/DECISIONS.md`
- [x] Create this plan

**Completion criteria:** All 4 docs created with confirmed findings.

---

## Phase 1 — Project Scaffold & Design System
**Estimated effort:** Core foundation

### Tasks
- [ ] Create new project structure (static site, no build step)
- [ ] Design CSS custom properties system (colors, typography, spacing, shadows)
- [ ] Implement dark/light theme toggle with `prefers-color-scheme` support
- [ ] Build responsive navigation component
- [ ] Build landing page with feature cards and value proposition
- [ ] Create page/section routing (hash-based SPA navigation)
- [ ] Self-host Inter font (download, subset)
- [ ] Generate favicon and brand mark (SVG)
- [ ] Implement reduced-motion and accessibility foundations
- [ ] Add meta tags, Open Graph, SEO structure

**Completion criteria:** Landing page renders, navigation works, theme toggles, responsive at 360px+.

---

## Phase 2A — Password Generator
**Estimated effort:** Core feature

### Tasks
- [ ] Random password mode with `crypto.getRandomValues()` and rejection sampling
- [ ] Configurable length (4–128), character classes (upper/lower/digits/symbols)
- [ ] Ambiguous character exclusion option
- [ ] Custom character exclusion
- [ ] Passphrase mode: bundle EFF large wordlist, word count, separator, capitalization, numeric suffix
- [ ] PIN mode: numeric-only generation
- [ ] Bulk generation (up to 20)
- [ ] Show/hide password toggle
- [ ] One-click copy with accessible feedback
- [ ] Entropy display with formula explanation
- [ ] Clear/reset button (wipes output from DOM)
- [ ] Validate impossible configurations (empty pool, etc.)

**Completion criteria:** All three modes generate correctly, entropy calculation matches expected values, copy works, bulk mode generates unique passwords.

---

## Phase 2B — Password Strength Analyzer
**Estimated effort:** Core feature

### Tasks
- [ ] Bundle zxcvbn.js (MIT, self-hosted)
- [ ] Live debounced analysis (no page reload)
- [ ] Score 0–4 with visual meter and labels
- [ ] Pattern detection feedback (common words, sequences, etc.)
- [ ] Improvement suggestions
- [ ] Optional policy checks (separate from strength score)
- [ ] No mandatory character-class gating
- [ ] Input not sent to server, not stored

**Completion criteria:** zxcvbn scores match known test passwords, debounce works, policy checks don't block analysis.

---

## Phase 2C — Breached Password Lookup
**Estimated effort:** Core feature

### Tasks
- [ ] Hash input with SHA-1 locally (using js-sha1 or SubtleCrypto workaround)
- [ ] Send only first 5 hex chars to `api.pwnedpasswords.com/range/{prefix}`
- [ ] Include `Add-Padding: true` header
- [ ] Set request timeout (5s)
- [ ] Compare suffixes locally
- [ ] Handle padding rows (count=0)
- [ ] Handle offline/network error/rate limit
- [ ] Explicit user-initiated action only (button, not automatic)
- [ ] Privacy disclosure before check
- [ ] Result: "Found in N breaches" or "Not found in breach database" or "Could not check"
- [ ] Never display as "safe" — explain limitations

**Completion criteria:** Breach check works for known breached password ("password"), handles offline gracefully, only prefix leaves the browser (verifiable in network tab).

---

## Phase 2D — Crack-Time & Entropy Estimator
**Estimated effort:** Core feature

### Tasks
- [ ] Input: length, character pool size, attacker rate
- [ ] Preset scenarios (throttled online, unthrottled, offline slow hash, offline fast hash)
- [ ] Use BigInt arithmetic to avoid `math.pow()` overflow
- [ ] Human-readable time formatting (seconds → centuries)
- [ ] Handle extreme values gracefully ("beyond heat death of universe")
- [ ] Interactive visualization (how length/pool affect search space)
- [ ] Editable/visible rate assumptions
- [ ] Accessibility: text equivalent for visualization, no color-only indicators

**Completion criteria:** Known small values compute correctly, large exponents don't overflow, visualization renders and is keyboard-accessible.

---

## Phase 2E — Hash / KDF Lab
**Estimated effort:** Core feature

### Tasks
- [ ] SHA-256, SHA-384, SHA-512 via Web Crypto API
- [ ] HMAC support via Web Crypto API
- [ ] MD5, SHA-1 as legacy demos with visual warnings
- [ ] Educational salt/KDF comparison (Argon2id, bcrypt, PBKDF2, scrypt) — demo mode only
- [ ] Text hashing and file hashing (with size limits, ~100MB max)
- [ ] Algorithm selector with clear categorization (modern/legacy)
- [ ] Copy hash output
- [ ] Clear inputs on navigation
- [ ] Never store input or derived key
- [ ] Malformed input handling

**Completion criteria:** SHA-256 of known string matches expected output, file hashing works for small files, legacy algorithms show warning labels.

---

## Phase 2F — Encoder / Decoder Workbench
**Estimated effort:** Core feature

### Tasks
- [ ] Base64, Base64URL, Base32, Hex, URL encoding, HTML entities, ROT13
- [ ] Encode and decode directions
- [ ] Swap input/output
- [ ] Handle padding/whitespace correctly
- [ ] Clear validation errors
- [ ] Copy output
- [ ] Explain "encoding ≠ encryption"
- [ ] Render all output as text (no HTML execution)
- [ ] Unicode support

**Completion criteria:** Round-trip encode/decode produces original input for all formats, malformed input shows clear error, XSS-like strings render as inert text.

---

## Phase 2G — Education & Privacy Center
**Estimated effort:** Documentation feature

### Tasks
- [ ] Help panels per tool
- [ ] Learning page: passwords vs passphrases, entropy, hashing, KDFs, breaches, password managers, MFA
- [ ] Privacy panel: what runs locally, what leaves the browser, what is stored
- [ ] Data flow table
- [ ] References section with verified links
- [ ] Original wording (no copied content)

**Completion criteria:** All educational content is accurate, privacy table is complete, references link to current resources.

---

## Phase 3 — Security Engineering
**Estimated effort:** Hardening

### Tasks
- [ ] Content Security Policy meta tag (no inline JS, self-hosted everything)
- [ ] Verify no secret values in any persistent storage
- [ ] Verify no network requests except HIBP prefix check
- [ ] Input sanitization / XSS prevention (textContent, not innerHTML)
- [ ] Cache-control headers documentation
- [ ] `.gitignore` review and secret scan
- [ ] Threat model document
- [ ] Privacy document
- [ ] Dependency license verification
- [ ] No `eval()`, no `document.write()`, no `innerHTML` with user data

**Completion criteria:** CSP in place, threat model written, privacy doc complete, no secrets in code.

---

## Phase 4 — UI Polish & Accessibility
**Estimated effort:** Refinement

### Tasks
- [ ] Full keyboard navigation testing
- [ ] ARIA labels audit
- [ ] Focus management for SPA navigation
- [ ] Contrast verification (WCAG AA)
- [ ] Reduced-motion support
- [ ] Mobile layout testing (360px, 768px, 1024px+)
- [ ] Loading/success/error states for all tools
- [ ] Micro-animations and transitions
- [ ] Favicon, OG metadata verification
- [ ] Dead link check

**Completion criteria:** All tools keyboard-navigable, contrast passes AA, responsive at all breakpoints.

---

## Phase 5 — Testing & Verification
**Estimated effort:** Quality assurance

### Tasks
- [ ] Unit tests (Vitest): generator, analyzer integration, encoder, crack-time math
- [ ] Integration tests: HIBP mock, hash verification
- [ ] E2E tests (Playwright): all tool flows, keyboard nav, theme toggle, mobile
- [ ] Privacy tests: verify no network requests for tool operations
- [ ] Security scan: ESLint security plugin, npm audit
- [ ] Manual browser verification
- [ ] Screenshots at desktop and mobile widths
- [ ] Test results documentation in `docs/testing/`
- [ ] Test matrix in `docs/TESTING.md`

**Completion criteria:** All tests pass, coverage reported (target 85% for core logic), screenshots captured, test matrix complete.

---

## Phase 6 — Documentation
**Estimated effort:** Writing

### Tasks
- [ ] README.md (full structure per spec)
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/THREAT_MODEL.md`
- [ ] `docs/PRIVACY.md`
- [ ] `docs/TESTING.md` + `docs/testing/` outputs
- [ ] `docs/DEMO_SCRIPT.md`
- [ ] `docs/screenshots/` with real captures
- [ ] `CONTRIBUTING.md`
- [ ] `SECURITY.md`
- [ ] `CHANGELOG.md`
- [ ] `LICENSE` (MIT, if appropriate)
- [ ] Third-party notice file
- [ ] Mermaid diagrams in architecture doc

**Completion criteria:** All docs written with real content, screenshots are actual app captures.

---

## Phase 7 — CI & Deployment
**Estimated effort:** DevOps

### Tasks
- [ ] GitHub Actions workflow: lint, test, deploy to Pages
- [ ] Verify `gh auth status`
- [ ] Create repository (if authenticated)
- [ ] Push source with conventional commits
- [ ] Verify deployment URL
- [ ] Add status badges
- [ ] Health check (basic — load test of deployed URL)
- [ ] Version tag (only after verified deployment)

**Completion criteria:** CI green, deployed URL accessible, key user journeys tested on live site.

---

## Timeline

| Phase | Target |
|-------|--------|
| Phase 0 | 2026-10-14 (today) ✅ |
| Phase 1 | 2026-10-15 |
| Phase 2A–2G | 2026-10-15–17 |
| Phase 3 | 2026-10-17–18 |
| Phase 4 | 2026-10-18 |
| Phase 5 | 2026-10-18–19 |
| Phase 6 | 2026-10-19–20 |
| Phase 7 | 2026-10-20–21 |

**Final deadline: 2026-10-21**
