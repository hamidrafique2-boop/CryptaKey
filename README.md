<div align="center">

<img src="assets/banner.svg" alt="CryptaKey — Password Security Studio" width="100%">

<br>

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-B2420F?style=for-the-badge&logoColor=white)](https://hamidrafique2-boop.github.io/CryptaKey/)
[![CI](https://img.shields.io/github/actions/workflow/status/hamidrafique2-boop/CryptaKey/ci.yml?branch=main&style=for-the-badge&label=CI&color=46702F)](https://github.com/hamidrafique2-boop/CryptaKey/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-7A4B2A?style=for-the-badge)](LICENSE)
[![Privacy First](https://img.shields.io/badge/Privacy-First-46702F?style=for-the-badge)](docs/PRIVACY.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES2020+-C28A1F?style=flat-square&logo=javascript&logoColor=white)
![Web Crypto](https://img.shields.io/badge/Web_Crypto-API-B2420F?style=flat-square)
![No Build Step](https://img.shields.io/badge/Build-none-7A4B2A?style=flat-square)
![Dependencies](https://img.shields.io/badge/Runtime_deps-0_(zxcvbn_bundled)-46702F?style=flat-square)
![Responsive](https://img.shields.io/badge/Responsive-320px_→_4K-B2420F?style=flat-square)
![Themes](https://img.shields.io/badge/Themes-Beige_%26_Rust_·_Espresso-7A4B2A?style=flat-square)

**Generate · Analyze · Breach-check · Estimate · Hash · Encode — entirely in your browser.**

[Live Demo](https://hamidrafique2-boop.github.io/CryptaKey/) · [Features](#-features) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [Security](#-security--privacy) · [Roadmap](#-roadmap)

</div>

---

## 🧭 What is CryptaKey?

Most password tools ask you to trust a server. **CryptaKey asks you to trust nothing but your own browser.**

It is a single-page **password security studio** that lets you create strong credentials, measure how they would hold up against real attackers, check whether they have leaked, and *understand why* — through interactive labs for entropy, hashing, key derivation and encoding. Every sensitive operation runs locally on the Web Crypto API, so privacy is a property of the **architecture**, not a promise in a policy page. You can verify it yourself in the DevTools Network tab.

> 🎓 Built as part of a **Cybersecurity Internship Program** project, with the goal of demonstrating application-security engineering, privacy-by-design and polished, accessible front-end craft — with no framework and no build step.

<div align="center">

| 🔒 **0** servers | 🍪 **0** cookies | 📡 **5** chars of a hash ever leave the device (and only if you ask) | 📦 **0** CDN requests |
|:--:|:--:|:--:|:--:|

</div>

---

## 📸 A look inside

<div align="center">

<img src="docs/screenshots/home-desktop.png" alt="CryptaKey landing page on desktop, beige and rust theme" width="92%">

</div>

<table>
  <tr>
    <td width="50%" align="center"><b>🌙 Espresso &amp; Rust (dark)</b><br><img src="docs/screenshots/home-dark.png" alt="Dark theme"></td>
    <td width="25%" align="center"><b>📱 Phone</b><br><img src="docs/screenshots/home-mobile.png" alt="Mobile layout"></td>
    <td width="25%" align="center"><b>📟 Tablet</b><br><img src="docs/screenshots/generator-tablet.png" alt="Tablet generator"></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><b>📊 Strength Analyzer</b><br><img src="docs/screenshots/analyzer-desktop.png" alt="Strength analyzer"></td>
    <td colspan="1" align="center"><b>⏱️ Crack-Time Estimator</b><br><img src="docs/screenshots/estimator-desktop.png" alt="Crack-time estimator"></td>
  </tr>
</table>

---

## ✨ Features

| | Tool | What it does | Under the hood |
|:-:|------|--------------|----------------|
| 🔐 | **Password Generator** | Random passwords, EFF Diceware passphrases and PINs with length, character-class and exclusion rules; bulk generation up to 20 | `crypto.getRandomValues()` + rejection sampling (no modulo bias) |
| 📊 | **Strength Analyzer** | Live scoring (0–4), crack-time estimate, pattern warnings and suggestions; optional, informational policy checks | [zxcvbn](https://github.com/dropbox/zxcvbn) v4.4.2, bundled & lazy-loaded |
| 🛡️ | **Breach Check** | Has this password appeared in a known breach? Only a 5-character hash prefix is sent | SHA-1 prefix · HIBP range API · `Add-Padding: true` |
| ⏱️ | **Crack-Time Estimator** | Brute-force time under four attacker models with a live entropy chart | `BigInt` arithmetic — never overflows to `Infinity` |
| 🧬 | **Hash & KDF Lab** | SHA-256/384/512, HMAC, file hashing (≤ 100 MB) and a PBKDF2 key-derivation demo; MD5/SHA-1 flagged as legacy | Web Crypto `SubtleCrypto` |
| 🔄 | **Encoder / Decoder** | Base64, Base64URL, Base32, Hex, URL, HTML entities, ROT13 — with swap & copy | Native JS, XSS-safe rendering |
| 📚 | **Learn & Privacy** | Short lessons on entropy, hashing, breaches and a full data-flow disclosure table | Tabbed, accessible content |

### 🎨 Design & experience

- **Beige & Rust identity** — a warm "paper" palette with rust accents, a serif display face, subtle grain and flowing contour lines. A matching **Espresso & Rust** dark theme is one click away (your choice is the only thing ever stored locally).
- **Truly responsive** — fluid type and spacing, rem-based sizing that scales up to 4K, a collapsing drawer navigation, touch-sized controls, safe-area support for notched phones and landscape-friendly layouts. Verified from **320 px to 2560 px** with no horizontal scroll.
- **Alive, not noisy** — a live sample password generated with the real CSPRNG on the landing page, scroll-reveal animations and micro-interactions that all respect `prefers-reduced-motion`.
- **Accessible** — semantic landmarks, skip link, visible focus rings, ARIA live regions, keyboard-operable everything, WCAG-AA contrast on both themes.

<details>
<summary><b>🎨 Colour palette</b></summary>

<br>

| Role | Light — Beige & Rust | Dark — Espresso & Rust |
|------|:---:|:---:|
| Background | ![](https://img.shields.io/badge/-%23F3EADB-F3EADB?style=flat-square) `#F3EADB` | ![](https://img.shields.io/badge/-%2316100C-16100C?style=flat-square) `#16100C` |
| Surface / card | ![](https://img.shields.io/badge/-%23FCF8F0-FCF8F0?style=flat-square) `#FCF8F0` | ![](https://img.shields.io/badge/-%23231A14-231A14?style=flat-square) `#231A14` |
| Primary text | ![](https://img.shields.io/badge/-%232B1D14-2B1D14?style=flat-square) `#2B1D14` | ![](https://img.shields.io/badge/-%23F2E7D5-F2E7D5?style=flat-square) `#F2E7D5` |
| **Rust accent** | ![](https://img.shields.io/badge/-%23B2420F-B2420F?style=flat-square) `#B2420F` | ![](https://img.shields.io/badge/-%23E57F43-E57F43?style=flat-square) `#E57F43` |
| Clay (secondary) | ![](https://img.shields.io/badge/-%237A4B2A-7A4B2A?style=flat-square) `#7A4B2A` | ![](https://img.shields.io/badge/-%23E3B88C-E3B88C?style=flat-square) `#E3B88C` |

All colours are CSS custom properties in [`css/design-system.css`](css/design-system.css) — re-theming the whole app means editing one block.

</details>

---

## 🚀 Quick Start

No build step, no package manager, no runtime dependencies.

```bash
git clone https://github.com/hamidrafique2-boop/CryptaKey.git
cd CryptaKey

# pick any static server
npm start                    # Node (serves on :8000)
python3 -m http.server 8000  # or Python

npm run check                # optional: syntax, CSPRNG-only, no inline scripts, file refs
```

Then open **http://localhost:8000**.

> 💡 Serve over `http://localhost` or HTTPS — the Web Crypto API and the clipboard need a *secure context*, and the wordlist is loaded with `fetch`.

**Requirements:** any modern browser (Chrome 37+, Firefox 34+, Safari 11+, Edge 79+). **Deployment:** push to `main` and the included GitHub Actions workflow publishes to GitHub Pages.

---

## 📖 Usage guide

<details>
<summary><b>🔐 Password Generator</b></summary>

1. Open **Generator** and pick **Password**, **Passphrase** or **PIN**.
2. Tune length, character classes and exclusions (or word count and separator).
3. Choose a **Bulk** size (1–20) and press **Generate**.
4. Copy any result with one click. Entropy is shown as `length × log₂(pool size)`.
5. **Clear All** wipes the output from the page.

</details>

<details>
<summary><b>📊 Strength Analyzer</b></summary>

1. Type or paste a password — analysis runs live (debounced 300 ms).
2. Read the score (0–4), crack-time estimate, warnings and suggestions.
3. Expand **Optional policy checks** to see character-class compliance (informational only — never a gate).

</details>

<details>
<summary><b>🛡️ Breach Check</b></summary>

1. Read the privacy note: your password is SHA-1 hashed **locally**.
2. Press **Check Against Breaches** — only the first 5 hex characters of the hash are sent.
3. The matching suffixes returned are compared **in your browser**. Result: *found in N breaches*, *not found*, or *could not check*.

</details>

<details>
<summary><b>⏱️ Crack-Time Estimator · 🧬 Hash Lab · 🔄 Encoder</b></summary>

- **Estimator** — set length and pool size; compare throttled-online, unthrottled-online, slow-hash and fast-hash attackers.
- **Hash Lab** — choose Text, File, HMAC or KDF mode; MD5/SHA-1 show a legacy warning.
- **Encoder** — pick a format, **Encode →** / **← Decode**, **⇅ Swap**. Encoding is *not* encryption, and the UI says so.

</details>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Browser ["🌐 Browser — everything runs here"]
        UI["HTML · CSS<br/>Design system"]
        NAV["Hash router &<br/>theme / drawer"]
        GEN["Generator"]
        ANA["Analyzer"]
        BRC["Breach Check"]
        EST["Estimator"]
        HSH["Hash Lab"]
        ENC["Encoder"]
        LRN["Learn"]
        HERO["Hero sample"]
        UTL["utils.js<br/>CSPRNG · clipboard · formatting"]
        ZXC["zxcvbn.js"]
        WDL["EFF wordlist"]
        WCA["Web Crypto API"]
    end

    subgraph External ["☁️ Optional · user-initiated"]
        HIBP["HIBP range API<br/>5-char prefix only"]
    end

    UI --> NAV
    NAV --> GEN & ANA & BRC & EST & HSH & ENC & LRN & HERO
    GEN --> UTL & WDL
    HERO --> UTL
    ANA --> ZXC
    BRC --> UTL
    BRC -->|"k-anonymity"| HIBP
    HSH --> WCA
    UTL --> WCA

    classDef local fill:#faf4e8,stroke:#b2420f,color:#2b1d14;
    classDef ext fill:#f3dcc9,stroke:#8f320a,color:#2b1d14,stroke-dasharray:4 3;
    class UI,NAV,GEN,ANA,BRC,EST,HSH,ENC,LRN,HERO,UTL,ZXC,WDL,WCA local;
    class HIBP ext;
```

### Privacy boundary

```mermaid
flowchart LR
    subgraph LOCAL ["🟢 LOCAL — your browser"]
        A["Your input"] --> C{"Which tool?"}
        C -->|Generator| D["getRandomValues"]
        C -->|Analyzer| E["zxcvbn"]
        C -->|Hash Lab| F["SubtleCrypto.digest"]
        C -->|Estimator| H["BigInt math"]
        C -->|Breach Check| I["SHA-1 locally"]
        D & E & F & H --> J["Result on screen"]
        I --> K["First 5 chars"]
    end
    subgraph NET ["🟠 NETWORK — breach check only"]
        K -->|"GET /range/ABCDE"| L["HIBP"]
        L -->|"~800 suffixes"| M["Compare locally"]
    end
    M --> J

    classDef loc fill:#faf4e8,stroke:#46702f,color:#2b1d14;
    classDef net fill:#f3dcc9,stroke:#b2420f,color:#2b1d14;
    class A,C,D,E,F,H,I,J,K loc;
    class L,M net;
```

### Project structure

```text
CryptaKey/
├── index.html                  # Single-page app shell
├── css/
│   ├── design-system.css       # Tokens (beige/rust + espresso), reset, form controls, buttons
│   ├── components.css          # Header, nav drawer, tool widgets, responsive rules
│   └── pages.css               # Landing page, hero, tool layout, footer
├── js/
│   ├── utils.js                # CSPRNG helpers, clipboard, BigInt-safe formatting
│   ├── navigation.js           # Hash router, theme toggle, mobile drawer
│   ├── generator.js            # Password / passphrase / PIN generation
│   ├── analyzer.js             # zxcvbn analysis
│   ├── breach-check.js         # HIBP k-anonymity lookup
│   ├── estimator.js            # Crack-time maths + chart
│   ├── hash-lab.js             # Hashes, HMAC, PBKDF2
│   ├── encoder.js              # Encoding formats
│   ├── learn.js                # Educational content
│   ├── hero.js                 # Live sample password + scroll reveal
│   └── app.js                  # Bootstrap
├── lib/zxcvbn.js               # Bundled zxcvbn 4.4.2 (MIT)
├── data/eff-wordlist.json      # EFF Diceware large wordlist (CC BY 3.0 US)
├── assets/                     # favicon, animated README banner, social preview
├── docs/                       # ARCHITECTURE · PRIVACY · THREAT_MODEL · DECISIONS · AUDIT · PROVENANCE · PLAN · screenshots
├── scripts/check.js            # Zero-dependency project checks (npm run check)
├── .github/                    # CI + Pages workflows, issue & PR templates
├── .editorconfig · .gitattributes · .gitignore · .nojekyll
├── package.json                # Scripts only — no dependencies
├── CHANGELOG.md · CONTRIBUTING.md · CODE_OF_CONDUCT.md · SECURITY.md · LICENSE
└── README.md
```

---

## 🔐 Security & Privacy

| Question | Answer |
|----------|--------|
| Are passwords sent to a server? | ❌ **Never** |
| Analytics / telemetry? | ❌ None |
| Cookies? | ❌ None |
| Remote fonts or CDN? | ❌ None — system font stacks, self-hosted libraries |
| What is stored locally? | Only your theme choice (`ck-theme`) |
| Network requests? | Only the optional, user-initiated HIBP prefix lookup |

**Controls:** CSPRNG with rejection sampling and Fisher-Yates shuffle · `Math.random()` is never used · user data is rendered via `textContent`/escaping · no `eval`, no inline scripts · `BigInt` prevents overflow · legacy hashes are clearly labelled · zxcvbn is never gated behind arbitrary composition rules (NIST SP 800-63B Rev. 4 aligned).

See [docs/PRIVACY.md](docs/PRIVACY.md), [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) and [SECURITY.md](SECURITY.md).

---

## 🧪 Testing

| Area | Method |
|------|--------|
| Generator | Length bounds, class rules, exclusions, passphrase, PIN, bulk uniqueness |
| Analyzer | Known weak/strong samples against zxcvbn output |
| Breach check | Network inspection confirms prefix-only request; timeout & offline handling |
| Estimator | Small/huge values, BigInt overflow, formatting |
| Hash Lab | Known SHA-256 vectors, file hashing, HMAC, PBKDF2 |
| Encoder | Round-trips, Unicode, malformed input, XSS strings |
| Privacy | DevTools Network tab — no requests from local-only tools |
| Responsive | 320 · 390 · 768 · 1024 · 1440 · 2560 px — no horizontal overflow, drawer & theme toggle verified |
| Accessibility | Keyboard-only run-through, focus order, contrast on both themes |

---

## 🧗 Challenges overcome

1. **Overflow-safe maths** — `Math.pow()` yields `Infinity`; all crack-time maths uses `BigInt`.
2. **Unbiased randomness** — naïve modulo skews distributions; rejection sampling fixes it.
3. **Privacy-preserving breach lookups** — HIBP's k-anonymity range API supports browser CORS, so no proxy server is needed.
4. **Bundle weight** — zxcvbn is large, so it is lazy-loaded the first time the Analyzer is used.
5. **One design, every screen** — fluid `clamp()` typography, rem-based layout and a drawer breakpoint chosen so navigation never overflows.

## 🗺️ Roadmap

- [ ] Argon2 / bcrypt / scrypt demos via WebAssembly
- [ ] Hash-type identification tool
- [ ] Playwright end-to-end tests in CI
- [ ] PWA / offline service worker
- [ ] Custom password-policy builder
- [ ] Localisation

---

## 🙌 Contributing

Contributions are welcome — please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first. Notable changes are tracked in [CHANGELOG.md](CHANGELOG.md). Security issues: see [SECURITY.md](SECURITY.md).

## 📚 References

- [NIST SP 800-63B Rev. 4 — Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Have I Been Pwned — Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords)
- [Dropbox zxcvbn](https://github.com/dropbox/zxcvbn) · [EFF Diceware](https://www.eff.org/dice) · [MDN Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## 📄 License

[MIT](LICENSE). Third-party: **zxcvbn** (MIT, © Dan Wheeler & Dropbox) · **EFF Diceware wordlist** (CC BY 3.0 US, © EFF).

---

<div align="center">

**Built with care by [Hamid Rafique](https://github.com/hamidrafique2-boop)** · Cybersecurity Internship Project · © 2026

*If CryptaKey helped you, a ⭐ is always appreciated.*

</div>
