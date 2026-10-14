# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in CryptaKey, please report it responsibly:

1. **Email**: Open a [GitHub Issue](https://github.com/hamidrafique2-boop/CryptaKey/issues) with the label `security`
2. **Do not** include sensitive details in public issues — provide a general description and we will coordinate privately

## Scope

CryptaKey is a client-side educational tool. The security scope includes:

- **In scope**: XSS vulnerabilities, data leaks to network/storage, CSPRNG implementation flaws, privacy violations
- **Out of scope**: Server-side vulnerabilities (there is no server), denial-of-service against the user's own browser

## Architecture Security Notes

- All sensitive operations run locally in the browser
- No passwords, hashes, or inputs are sent to any server (except the 5-char HIBP prefix check)
- No cookies, analytics, or telemetry
- All dependencies are self-hosted (no CDN)
- The HIBP breach check uses k-anonymity with the `Add-Padding: true` header

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |
