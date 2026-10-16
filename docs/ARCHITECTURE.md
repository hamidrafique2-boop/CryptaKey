# Architecture

CryptaKey is a **static, framework-free single-page application**. There is no server, database or build step: the repository root *is* the deployable site.

## Layers

| Layer | Files | Responsibility |
|-------|-------|----------------|
| Presentation | `index.html`, `css/design-system.css`, `css/components.css`, `css/pages.css` | Markup, design tokens (two themes), components, page layouts, responsive rules |
| Application | `js/*.js` | One self-contained IIFE module per tool, initialised on `DOMContentLoaded` |
| Platform & data | Web Crypto API, `lib/zxcvbn.js`, `data/eff-wordlist.json` | Randomness, hashing, strength estimation, passphrase words |
| Optional network | `api.pwnedpasswords.com/range/{5-char prefix}` | Breach lookup (user-initiated only) |

## Script load order

Scripts use `defer`, so they execute in document order:

`utils.js` → `navigation.js` → `generator.js` → `analyzer.js` → `breach-check.js` → `estimator.js` → `hash-lab.js` → `encoder.js` → `learn.js` → `hero.js` → `app.js`

`utils.js` creates the shared `CK` namespace (secure random integers, shuffle, clipboard, SHA helpers, BigInt-safe duration formatting) used by every other module.

## Navigation

Hash routing: links update `location.hash`; a `hashchange` listener activates the matching `<section class="page">` and nav link. No query strings are used, so user input never reaches the URL.

## Design system

All visual decisions are CSS custom properties in `css/design-system.css`.

- **Beige & Rust** is `:root` (default). **Espresso & Rust** overrides the same tokens under `[data-theme="dark"]`.
- Components never use raw colours — only tokens (`--bg-*`, `--text-*`, `--accent-*`, `--color-*`, `--strength-*`).
- Sizing is `rem`-based; the root font-size steps up at 1800 / 2400 / 3200 px and down below 340 px, so the whole UI scales.
- Type and gutters are fluid (`clamp()`); grids are intrinsic (`auto-fit` + `minmax(min(100%, …), 1fr)`).
- Breakpoints: **1000 px** (nav becomes a drawer), **900 px** (hero stacks), **768 px** (single-column tools), **480 px** (phone refinements), **340 px** (very narrow). Coarse pointers get 44 px hit-targets.

### Adding a colour or theme
1. Add the token to `:root` and to `[data-theme="dark"]`.
2. Check WCAG AA contrast (≥ 4.5 : 1 for body text) in both themes.
3. Reference the token — never a hex value — in component CSS.

## Adding a tool

1. Add a `<section class="page" id="my-tool" data-page="my-tool">` to `index.html` (reuse `.tool-container` / `.tool-body`).
2. Add a nav link (`data-section="my-tool"`) and, optionally, a feature card.
3. Create `js/my-tool.js` as an IIFE; render user data with `textContent`; use `CK.secureRandomInt` for randomness.
4. Add the script tag **before** `app.js`.
5. Update `docs/PRIVACY.md` (data-flow table) and run `npm run check`.

## Security invariants (enforced by `scripts/check.js` where possible)

- No `Math.random()` in first-party code.
- No inline `<script>` blocks and no remote script/style/font URLs.
- Every local file referenced from `index.html` exists.
- User-supplied data is never inserted with raw `innerHTML`.
- The only network request is the optional HIBP prefix lookup.
