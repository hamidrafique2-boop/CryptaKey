# Security Policy

## Reporting a vulnerability

Please report vulnerabilities **privately**:

1. Use GitHub's private reporting: **Security → Report a vulnerability** on the repository
   (<https://github.com/hamidrafique2-boop/CryptaKey/security/advisories/new>).
2. If that is unavailable, open a public issue labelled `security` with a *general* description only — no exploit details — and the maintainer will arrange a private channel.

You can expect an acknowledgement within a few days. Please allow reasonable time for a fix before public disclosure.

## Scope

CryptaKey is a client-side educational tool.

- **In scope:** XSS, data leaks to the network or storage, CSPRNG implementation flaws, privacy violations, supply-chain issues in bundled files.
- **Out of scope:** server-side vulnerabilities (there is no server) and denial-of-service against the user's own browser.

## Architecture security notes

- All sensitive operations run locally in the browser.
- No passwords, hashes or inputs are sent to any server except the 5-character HIBP prefix (breach check, user-initiated, `Add-Padding: true`).
- No cookies, analytics or telemetry; no CDN — all dependencies are self-hosted.
- Only the theme preference (`ck-theme`) is stored locally.
- See [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) and [docs/PRIVACY.md](docs/PRIVACY.md).

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x (latest) | ✅ |
| < 1.0 | ❌ |
