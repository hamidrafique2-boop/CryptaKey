# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-10-16

### Added
- **Beige & Rust** visual identity (default) with a matching **Espresso & Rust** dark theme; all colours are CSS custom properties.
- Redesigned landing page: contour-line hero, live sample password generated with the CSPRNG, trust strip, statistics band, workflow steps and scroll-reveal animation (`js/hero.js`).
- Fully responsive system: fluid `clamp()` type scale, rem-based layout that scales to 4K, intrinsic grids, drawer navigation at ≤ 1000 px, touch-sized controls, safe-area support, landscape-phone rules.
- Keyboard support: <kbd>Esc</kbd> closes the mobile drawer; drawer also closes when the viewport grows.
- Animated README banner, screenshots, social-preview image (`assets/og-image.png`) and complete Open Graph / Twitter meta tags.
- Project tooling: `npm run check` (`scripts/check.js`), CI workflow, issue and pull-request templates, `.editorconfig`, `.gitattributes`, `CODE_OF_CONDUCT.md`, `docs/ARCHITECTURE.md`, `docs/README.md`.

### Changed
- Fonts are now system stacks (serif display + sans body) — no remote or bundled font files.
- Theme preference storage is wrapped in `try/catch`; default theme is Beige & Rust instead of following the OS setting.
- Rewrote README with an overview, diagrams, design system and responsive notes.
- Removed a UTF-8 BOM from `data/eff-wordlist.json`.

### Fixed
- Feature card claimed Argon2/bcrypt support; it now accurately describes the PBKDF2 demo.
- Navigation links could overflow between 769 px and ~900 px.
- Long hashes, passwords and tables could widen the page on narrow screens.

## [1.0.0] — 2026-10-14

### Added
- Initial browser-only release: Password Generator, Strength Analyzer, Breach Check (HIBP k-anonymity), Crack-Time Estimator, Hash & KDF Lab, Encoder/Decoder, Learn & Privacy.
- GitHub Pages deployment workflow, privacy and threat-model documentation.
