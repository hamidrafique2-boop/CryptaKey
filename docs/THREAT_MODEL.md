# Threat Model

## Assets

| Asset | Sensitivity | Notes |
|-------|-------------|-------|
| User-entered passwords | Critical | Exist only in browser memory during use |
| Generated passwords | Critical | Exist only in DOM until cleared |
| SHA-1 hash prefix (5 chars) | Low | Sent to HIBP; insufficient to recover password |
| Theme preference | None | Stored in localStorage |

## Trust Boundaries

1. **Browser ↔ HIBP API**: Only the 5-char SHA-1 prefix crosses this boundary
2. **Browser ↔ User**: All sensitive data is displayed to the user and cleared on demand
3. **Browser ↔ Local Storage**: Only theme preference crosses this boundary

## Threats & Mitigations

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| XSS injection via tool input | Medium | High | All user input rendered via `textContent`; no `innerHTML` with user data |
| Password leaking to server | N/A | N/A | No server — eliminated by architecture |
| Password in browser storage | Low | High | No use of localStorage/sessionStorage for sensitive data |
| Password in URL/history | Low | Medium | No query parameters; only hash-based navigation |
| HIBP prefix revealing password | Very Low | Low | 5-char prefix matches ~800 suffixes; k-anonymity with padding |
| Weak random generation | Low | Critical | `crypto.getRandomValues()` with rejection sampling; no `Math.random()` |
| Clipboard data persistence | Low | Medium | Best-effort clear; documented limitation |
| Dependency vulnerability | Low | Medium | zxcvbn pinned at v4.4.2, self-hosted, no auto-update |
| Man-in-middle on HIBP request | Low | Low | HTTPS enforced; only hash prefix exposed |

## Residual Risks

- Browser extensions or malware can read page DOM content
- Clipboard contents may persist beyond the application's control
- Browser memory could be inspected by other processes
- The HIBP service could be compromised (mitigated by k-anonymity)
- zxcvbn scoring is heuristic and may not catch all weak patterns
