# Contributing to CryptaKey

Thanks for your interest! Please read the [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Getting started

```bash
git clone https://github.com/YOUR-USERNAME/CryptaKey.git
cd CryptaKey
npm start          # serves http://localhost:8000 (or: python3 -m http.server 8000)
npm run check      # project checks — must pass before you open a PR
```

No dependencies are installed; `npm` is only used to run scripts. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the project is organised.

## Workflow

1. Fork and create a branch: `feat/short-name`, `fix/short-name` or `docs/short-name`.
2. Make focused changes; update docs and [CHANGELOG.md](CHANGELOG.md) when behaviour changes.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
4. Open a pull request and fill in the template.

## Guidelines

### Code style
- Vanilla JavaScript (ES2020+), no frameworks or transpilers; `const`/`let`, never `var`; template literals.
- One IIFE module per tool; keep global state to the `CK` namespace.
- Follow `.editorconfig` (4 spaces, LF, UTF-8).

### Security
- Never use `Math.random()` — use `crypto.getRandomValues()` / `CK.secureRandomInt()`.
- Never send passwords, hashes or inputs to any server; never store secrets in storage, cookies or URLs.
- Render user data with `textContent` (or `CK.escapeHtml`) — never raw `innerHTML`.
- No inline scripts, no CDN or third-party requests; vendor dependencies locally with their licence.

### Design system
- Use CSS custom properties from `css/design-system.css`; never hard-code colours in components.
- Every change must look right in **both** themes (Beige & Rust and Espresso & Rust).
- Keep text contrast ≥ 4.5 : 1 (WCAG AA).

### Accessibility & responsiveness
- Everything must be keyboard-operable with visible focus; use semantic HTML and ARIA where needed.
- Test at **320, 390, 768, 1024, 1440 and 2560 px** — there must be no horizontal page scroll.
- Respect `prefers-reduced-motion`.

### Testing
- Run `npm run check`.
- Manually test in Chrome, Firefox and Safari.
- Confirm in DevTools → Network that local-only tools make **no** requests.

## Reporting issues
Use the issue templates. Never paste real passwords. Security issues: see [SECURITY.md](SECURITY.md).
