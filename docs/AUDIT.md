# CryptaKey — Phase 0 Audit (Previous Implementation)

**Date:** 2026-10-14  
**Auditor:** Antigravity (automated analysis)  
**Scope:** All files in the previous PasswordNexus implementation

---

## 1. Previous Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Python 3, Flask, zxcvbn (Python) | Single-file `backend.py`, no app factory, no blueprints |
| Frontend | Jinja2 templates, vanilla CSS | 7 HTML templates, 2 CSS files |
| Database | SQLite (`nexus.db`) | Relative path, usage-logging |
| Static Assets | 1 JPEG background (420 KB), 2 CSS | Google Fonts loaded via CDN |
| Deployment | None configured | `flask run` with `debug=True` |

---

## 2. Confirmed Issues (Addressed in Rewrite)

### CRITICAL

| ID | Issue | Evidence |
|----|-------|----------|
| C1 | `random.shuffle()` used after `secrets.choice()` — non-cryptographic shuffle undermines CSPRNG | `backend.py:77` |
| C2 | Flask debug mode enabled in entry point | `backend.py:215` |
| C3 | `export_logs()` at module scope — crashes on import, writes usage log | `backend.py:217` |
| C4 | Passwords sent to server via POST — privacy violation | All tool routes |
| C5 | Usage logging records operation metadata to persistent SQLite | `backend.py:148,163` |

### HIGH

| ID | Issue | Evidence |
|----|-------|----------|
| H1 | Unchecked `int()` conversion crashes on invalid input | `backend.py:144` |
| H2 | Hash converter accepts arbitrary algorithm names including parameterized ones | `backend.py:101` |
| H3 | `math.pow()` overflow produces `Infinity` | `backend.py:125` |
| H4 | Strength analyzer gated behind mandatory policy — rejects valid passphrases | `backend.py:157-166` |
| H5 | Base encoder select values don't match backend logic | `templates/base.html` vs `backend.py` |
| H6 | Bare `except` blocks swallow all errors | Multiple locations |
| H7 | SQLite relative path — fragile in deployment | `backend.py:17` |

### MEDIUM

| ID | Issue | Evidence |
|----|-------|----------|
| M1 | No Content Security Policy | All templates |
| M2 | No CSRF protection | All forms |
| M3 | Generator length inconsistency between frontend and backend | Frontend: 8-50, Backend: 8-100 |
| M4 | No rate limiting | All routes |
| M5 | External Google Fonts CDN dependency | Both CSS files |

### LOW

| ID | Issue | Evidence |
|----|-------|----------|
| L1 | Typo: "Hash coverter" in navigation | Multiple templates |
| L2 | No favicon, meta descriptions | All pages |
| L3 | Fixed 500px width — breaks on mobile | `generator.css:69` |
| L4 | No copy-to-clipboard functionality | All tool pages |
| L5 | No keyboard navigation or accessibility features | All pages |

---

## 3. Resolution

**All issues above are resolved by the complete rewrite to a browser-first static architecture.** The new CryptaKey implementation eliminates the Flask server, database, and all server-side secret handling entirely.
