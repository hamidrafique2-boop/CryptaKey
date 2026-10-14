/* ============================================
   CryptaKey Strength Analyzer
   zxcvbn-powered password analysis
   ============================================ */

(function() {
    'use strict';

    const SCORE_LABELS = ['Terrible', 'Weak', 'Fair', 'Good', 'Strong'];
    const SCORE_COLORS = [
        'var(--strength-0)',
        'var(--strength-1)',
        'var(--strength-2)',
        'var(--strength-3)',
        'var(--strength-4)'
    ];

    let zxcvbnLoaded = false;

    function ensureZxcvbn() {
        if (typeof zxcvbn === 'function') {
            zxcvbnLoaded = true;
            return true;
        }
        if (!zxcvbnLoaded) {
            const s = document.createElement('script');
            s.src = 'lib/zxcvbn.js';
            s.async = true;
            s.onload = () => { zxcvbnLoaded = true; };
            document.head.appendChild(s);
        }
        return false;
    }

    function init() {
        const input = document.getElementById('analyzer-input');
        const clearBtn = document.getElementById('analyzer-clear-btn');

        if (input) {
            input.addEventListener('input', CK.debounce(analyze, 300));
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAnalysis);
        }

        ensureZxcvbn();
    }

    function analyze() {
        const input = document.getElementById('analyzer-input');
        const password = input ? input.value : '';
        const meter = document.getElementById('analyzer-meter');

        if (!password) {
            if (meter) meter.classList.add('hidden');
            return;
        }

        if (!ensureZxcvbn()) {
            CK.toast('Loading analyzer…');
            setTimeout(analyze, 500);
            return;
        }

        const result = zxcvbn(password);
        if (meter) meter.classList.remove('hidden');

        // Update strength bar
        const bar = document.getElementById('analyzer-bar');
        if (bar) {
            const widths = [5, 25, 50, 75, 100];
            bar.style.width = widths[result.score] + '%';
            bar.style.backgroundColor = SCORE_COLORS[result.score];
        }

        // Update label
        const label = document.getElementById('analyzer-label');
        if (label) {
            label.textContent = SCORE_LABELS[result.score];
            label.style.color = SCORE_COLORS[result.score];
        }

        // Update score
        const score = document.getElementById('analyzer-score');
        if (score) score.textContent = `${result.score} / 4`;

        // Crack time
        const ctVal = document.getElementById('analyzer-crack-time-val');
        if (ctVal) {
            ctVal.textContent = result.crack_times_display.offline_slow_hashing_1e4_per_second;
        }

        // Warning
        const warnVal = document.getElementById('analyzer-warning-val');
        const warnItem = document.getElementById('analyzer-warning');
        if (warnVal && warnItem) {
            if (result.feedback.warning) {
                warnVal.textContent = result.feedback.warning;
                warnItem.classList.remove('hidden');
            } else {
                warnItem.classList.add('hidden');
            }
        }

        // Suggestions
        const sugEl = document.getElementById('analyzer-suggestions');
        if (sugEl) {
            sugEl.innerHTML = '';
            if (result.feedback.suggestions && result.feedback.suggestions.length > 0) {
                result.feedback.suggestions.forEach(s => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.textContent = s;
                    sugEl.appendChild(div);
                });
            }
        }

        // Policy checks (optional, informational)
        updatePolicies(password);
    }

    function updatePolicies(password) {
        const el = document.getElementById('analyzer-policies');
        if (!el) return;

        const policies = [
            { label: 'At least 8 characters', pass: password.length >= 8 },
            { label: 'At least 12 characters', pass: password.length >= 12 },
            { label: 'Contains uppercase letter', pass: /[A-Z]/.test(password) },
            { label: 'Contains lowercase letter', pass: /[a-z]/.test(password) },
            { label: 'Contains digit', pass: /\d/.test(password) },
            { label: 'Contains symbol', pass: /[^A-Za-z0-9]/.test(password) }
        ];

        el.innerHTML = policies.map(p => `
            <div class="policy-item ${p.pass ? 'policy-item--pass' : 'policy-item--fail'}">
                ${p.pass ? '✓' : '○'} ${CK.escapeHtml(p.label)}
            </div>
        `).join('');
    }

    function clearAnalysis() {
        const input = document.getElementById('analyzer-input');
        if (input) {
            input.value = '';
            input.type = 'password';
        }
        const meter = document.getElementById('analyzer-meter');
        if (meter) meter.classList.add('hidden');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
