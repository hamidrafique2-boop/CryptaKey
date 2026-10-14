# Privacy & Data Flow

## Summary

CryptaKey is a browser-only application. All password operations run locally. No passwords, hashes, or tool inputs are ever transmitted to any server.

## Data Flow Table

| Feature | Processing | Network Request | Data Stored |
|---------|------------|----------------|-------------|
| Password Generator | Local (Web Crypto API) | None | None |
| Strength Analyzer | Local (zxcvbn.js) | None | None |
| Breach Check | Local SHA-1 hash | 5-char prefix to api.pwnedpasswords.com | None |
| Crack-Time Estimator | Local (BigInt math) | None | None |
| Hash & KDF Lab | Local (Web Crypto API) | None | None |
| Encoder / Decoder | Local (JS APIs) | None | None |
| Theme Preference | — | None | localStorage (theme only) |

## Breach Check Details

When a user explicitly initiates a breach check:

1. The password is hashed with SHA-1 **locally** in the browser
2. Only the first 5 characters of the 40-character hash are sent to `https://api.pwnedpasswords.com/range/{prefix}`
3. The `Add-Padding: true` header is included to prevent response-size analysis
4. The API returns ~800 hash suffixes; comparison happens **locally**
5. The password and its full hash **never leave the browser**

This uses the [k-anonymity model](https://www.troyhunt.com/ive-just-launched-pwned-passwords-version-2/) designed by Troy Hunt.

## What Is NOT Collected

- Passwords, generated passwords, or hash inputs/outputs
- Analytics, telemetry, or usage tracking
- Cookies (none are used)
- IP addresses or device fingerprints
- Browser history entries beyond the URL hash

## What IS Stored

- **Theme preference** (light/dark) in `localStorage` — contains no sensitive data
- This can be cleared by clearing localStorage for the site

## Third-Party Requests

The **only** outbound request is the optional breach check. No other network requests are made at runtime. All fonts, libraries, and assets are self-hosted.
