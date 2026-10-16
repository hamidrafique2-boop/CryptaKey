# Architecture & Design Decisions

**Date:** 2026-10-14  
**Project:** CryptaKey — Password Security Studio

---

## 1. Product Name Selection

### Candidates Evaluated

| Name | Collision Check Result | Decision |
|------|----------------------|----------|
| CipherForge | ❌ Excluded by prompt — existing password/security projects | Rejected |
| PassSentinel | ❌ Excluded by prompt — existing password/security projects | Rejected |
| KeySentinel | ⚠️ Some references to security bots/tools with this name on GitHub | Rejected |
| EntropyLab | ❌ Active GitHub project (m0lfiln/EntropyLab) — browser password generator with same concept | Rejected |
| CipherVault | ❌ Multiple GitHub repos, dev.to articles, medium posts using this name | Rejected |
| PassForge | ❌ Active repos: JPetovello/PassForge and irtb/PassForge — nearly identical concept | Rejected |
| SecureKey Studio | ✅ No results found for this exact name | Candidate |
| CryptaKey | ✅ No significant GitHub/web collisions. Minor reference to a hardware FIDO2 product by eFileSoftware, different domain entirely | **Selected** |

### Selected: **CryptaKey**
- **Tagline:** "Explore. Analyze. Secure."
- **Rationale:** Distinctive, professional, combines "Crypt" (cryptographic) with "Key" (password/credential). No direct collision with password security web tools on GitHub. The only reference found is a hardware USB security key product in a completely different market segment.
- **Note:** This is a reasonable public-name collision check only. No trademark clearance is claimed.

---

## 2. Architecture Decision

### Options Evaluated

#### Option A: Static/Browser-First Application (GitHub Pages)
- **Pros:**
  - True privacy: no server receives any data
  - Free hosting on GitHub Pages
  - Simple deployment via GitHub Actions
  - No server maintenance, no cold starts
  - All crypto operations available via Web Crypto API
  - zxcvbn.js runs entirely in browser
  - HIBP API supports CORS — direct browser fetch works
  - EFF wordlist can be bundled as static JSON
- **Cons:**
  - No server-side fallback
  - File hashing limited to browser memory
  - No server-side rate limiting (not needed for static tools)

#### Option B: Flask-Hosted Browser-First Application (Render)
- **Pros:**
  - Could add server-rendered pages
  - Health endpoint possible
  - Server-side rate limiting
- **Cons:**
  - Adds complexity without real benefit — all tool operations should run in browser anyway
  - Passwords would traverse the network (privacy violation)
  - Render free tier has cold starts (~30s)
  - Requires server maintenance and dependency updates
  - Python zxcvbn is less maintained than zxcvbn.js
  - Cannot claim "no data leaves the browser" if Flask processes requests

### Decision: **Option A — Static/Browser-First (GitHub Pages)**

**Rationale:** Every required feature can run entirely in the browser:
- Password generation: `crypto.getRandomValues()`
- Strength analysis: `zxcvbn.js` (MIT, bundled)
- Hash computation: Web Crypto API (SHA-256/384/512) + bundled libraries for legacy demos
- Encoding/decoding: Native JS APIs (`btoa`, `atob`, `TextEncoder`, etc.)
- Breach check: Direct CORS fetch to `api.pwnedpasswords.com` (only SHA-1 prefix sent)
- Crack-time calculation: Pure JavaScript math with BigInt for overflow safety

Flask would add no real value and would create a privacy liability. Removing the server entirely makes the "no password leaves the browser" claim verifiably true.

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Structure | HTML5 (semantic) | Standards-compliant, accessible |
| Logic | Vanilla JavaScript (ES2020+) | No framework overhead, full control |
| Styling | Vanilla CSS with custom properties | Design system via CSS variables, no build step |
| Crypto RNG | `crypto.getRandomValues()` | CSPRNG, browser-native |
| Hashing | Web Crypto API + js-sha1 (for HIBP) | Native performance, SHA-1 only for breach prefix |
| Strength | zxcvbn.js (bundled, MIT) | Industry standard, Dropbox-maintained |
| Wordlist | EFF Diceware large wordlist (CC BY 3.0) | 7,776 words, well-known, properly licensed |
| Typography | System font stacks (serif display + sans body) | No remote or bundled font files; privacy-preserving and instant |
| Build | None (static files) | Simplicity, no transpilation needed |
| Hosting | GitHub Pages | Free, reliable, HTTPS included |
| CI | GitHub Actions | Test, lint, deploy pipeline |

---

## 4. Logging & Usage Tracking Decision

**Decision: No usage tracking or logging.**

The existing PasswordNexus logged all tool usage to SQLite with detail strings. This is removed entirely:
- No database
- No `log.txt` export
- No analytics scripts
- No cookies
- No telemetry
- The only network request is the optional HIBP breach check (user-initiated, prefix-only)

---

## 5. Design Direction

> **Update (v1.1.0, 2026-10-16):** the visual identity was redesigned to **Beige & Rust** (default) with an **Espresso & Rust** dark theme; typography moved to system serif + sans stacks (no font files); layout became fully fluid and rem-based (320 px → 4K). The original direction below is kept for history.

**Aesthetic (original):** Professional security console — clean dark theme with light option.

- **Primary palette:** Deep slate/navy backgrounds, cyan-blue accents, warm amber for warnings
- **Typography:** Inter (self-hosted), clear hierarchy
- **Layout:** Single-page app with in-page navigation (no page reloads)
- **Interactions:** Subtle transitions, no excessive glow/particle effects
- **Accessibility:** WCAG AA contrast, visible focus, keyboard navigation, reduced-motion support
- **Responsive:** Mobile-first, 360px minimum

---

## 6. Feature Scope Boundaries

### In Scope (Required Core)
- Password generator (random, passphrase, PIN)
- Password strength analyzer (zxcvbn)
- Breached password lookup (HIBP k-anonymity)
- Crack-time / entropy estimator
- Hash / KDF lab
- Encoder / decoder workbench
- Education & privacy center

### Out of Scope (Deferred)
- Password vault / storage
- Account system / login
- TOTP/MFA generator
- Password sharing
- Browser extension
- Mobile native app

---

## 7. Deployment Strategy

1. Build all static files in the repository
2. GitHub Actions CI: lint (ESLint), test (Vitest + Playwright), security scan
3. Deploy to GitHub Pages from `main` branch via Actions
4. Custom domain configuration (optional, post-launch)

---

## 8. Key Trade-offs

| Decision | Trade-off | Justification |
|----------|-----------|---------------|
| No server | Cannot do server-side rate limiting | Not needed — no server endpoints to abuse |
| Bundled zxcvbn.js | ~400KB added to page | Loaded async, cached, essential for strength analysis |
| No framework (React/Vue) | More manual DOM management | Simpler build, smaller bundle, no framework lock-in |
| Self-hosted fonts | Slightly larger initial load | Privacy (no Google tracking), works offline |
| BigInt for crack-time math | Requires ES2020+ | All modern browsers support it; avoids `Infinity` overflow |
