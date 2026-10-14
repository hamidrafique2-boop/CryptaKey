# Contributing to CryptaKey

Thank you for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/CryptaKey.git`
3. Open `index.html` in a browser (or use `npx serve .` for a local server)
4. Make your changes
5. Test thoroughly in the browser
6. Submit a pull request

## Guidelines

### Code Style
- Use vanilla JavaScript (ES2020+) — no frameworks or transpilers
- Use `const` and `let`, never `var`
- Use template literals for string interpolation
- All user-facing text must be escaped with `textContent` (never `innerHTML` with user data)

### Security
- Never use `Math.random()` for security-sensitive operations — use `crypto.getRandomValues()`
- Never send passwords, hashes, or sensitive input to any server endpoint
- Never store secrets in localStorage, sessionStorage, cookies, or URLs
- All third-party dependencies must be self-hosted (no CDN)

### Accessibility
- All interactive elements must be keyboard-accessible
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure sufficient color contrast (WCAG AA)

### Testing
- Test all changes in Chrome, Firefox, and Safari
- Test at mobile (360px), tablet (768px), and desktop (1024px+) widths
- Verify no network requests are made from local-only tools (check DevTools Network tab)

## Reporting Issues

Use [GitHub Issues](https://github.com/hamidrafique2-boop/CryptaKey/issues) with clear descriptions and steps to reproduce.
