/* ============================================
   CryptaKey Breach Check
   HIBP Pwned Passwords with k-anonymity
   ============================================ */

(function() {
    'use strict';

    const HIBP_API = 'https://api.pwnedpasswords.com/range/';
    const TIMEOUT_MS = 5000;

    function init() {
        const checkBtn = document.getElementById('breach-check-btn');
        const clearBtn = document.getElementById('breach-clear-btn');

        if (checkBtn) checkBtn.addEventListener('click', checkBreach);
        if (clearBtn) clearBtn.addEventListener('click', clearBreach);
    }

    async function checkBreach() {
        const input = document.getElementById('breach-input');
        const resultEl = document.getElementById('breach-result');
        const checkBtn = document.getElementById('breach-check-btn');

        if (!input || !resultEl) return;

        const password = input.value;
        if (!password) {
            CK.toast('Enter a password to check');
            return;
        }

        // Disable button during check
        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.textContent = 'Checking…';
        }

        try {
            // Hash locally with SHA-1
            const fullHash = await CK.sha1(password);
            const prefix = fullHash.substring(0, 5);
            const suffix = fullHash.substring(5);

            // Fetch only the prefix range from HIBP
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(HIBP_API + prefix, {
                headers: {
                    'Add-Padding': 'true'
                },
                signal: controller.signal
            });

            clearTimeout(timer);

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const text = await response.text();

            // Parse response: each line is SUFFIX:COUNT
            const lines = text.split('\n');
            let breachCount = 0;
            let found = false;

            for (const line of lines) {
                const parts = line.trim().split(':');
                if (parts.length !== 2) continue;

                const hashSuffix = parts[0];
                const count = parseInt(parts[1], 10);

                // Skip padding rows (count = 0)
                if (count === 0) continue;

                if (hashSuffix === suffix) {
                    breachCount = count;
                    found = true;
                    break;
                }
            }

            // Display result
            resultEl.classList.remove('hidden', 'breach-result--found', 'breach-result--safe', 'breach-result--error');

            if (found) {
                resultEl.classList.add('breach-result--found');
                resultEl.innerHTML = `
                    <div class="breach-result-icon">⚠️</div>
                    <div class="breach-result-title">Password Found in Breaches</div>
                    <div class="breach-result-desc">
                        This password has appeared in <strong>${breachCount.toLocaleString()}</strong> known data breach${breachCount !== 1 ? 'es' : ''}.
                        It should not be used. Attackers use breached password lists to attempt logins on other services.
                    </div>
                `;
            } else {
                resultEl.classList.add('breach-result--safe');
                resultEl.innerHTML = `
                    <div class="breach-result-icon">✓</div>
                    <div class="breach-result-title">Not Found in Breach Database</div>
                    <div class="breach-result-desc">
                        This password was not found in the Have I Been Pwned database of breached passwords.
                        This does <strong>not</strong> guarantee it is safe — it may appear in breaches not yet included in the database,
                        or it could still be a weak password. Always use a unique, strong password for each account.
                    </div>
                `;
            }

        } catch (err) {
            resultEl.classList.remove('hidden', 'breach-result--found', 'breach-result--safe');
            resultEl.classList.add('breach-result--error');

            let message = 'Could not complete the breach check.';
            if (err.name === 'AbortError') {
                message = 'Request timed out. The breach check service may be unavailable. Please try again later.';
            } else if (!navigator.onLine) {
                message = 'You appear to be offline. The breach check requires an internet connection to query the Have I Been Pwned database.';
            }

            resultEl.innerHTML = `
                <div class="breach-result-icon">⚡</div>
                <div class="breach-result-title">Could Not Check</div>
                <div class="breach-result-desc">${message}</div>
            `;
        } finally {
            if (checkBtn) {
                checkBtn.disabled = false;
                checkBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Check Against Breaches
                `;
            }
        }
    }

    function clearBreach() {
        const input = document.getElementById('breach-input');
        const resultEl = document.getElementById('breach-result');
        if (input) {
            input.value = '';
            input.type = 'password';
        }
        if (resultEl) {
            resultEl.classList.add('hidden');
            resultEl.innerHTML = '';
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
