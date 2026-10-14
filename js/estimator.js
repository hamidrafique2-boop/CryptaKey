/* ============================================
   CryptaKey Crack-Time Estimator
   BigInt-safe brute-force time calculator
   ============================================ */

(function() {
    'use strict';

    // Attacker scenarios (guesses per second)
    const SCENARIOS = [
        { id: 'est-throttled', rate: 100n / 3600n || 1n, ratePerSec: 100, unit: 'hour', label: '100/hour' },
        { id: 'est-unthrottled', rate: 1000n, label: '1,000/sec' },
        { id: 'est-slow-hash', rate: 10000n, label: '10,000/sec' },
        { id: 'est-fast-hash', rate: 10000000000n, label: '10B/sec' }
    ];

    // Rates in guesses/second as BigInt
    const RATES = {
        'est-throttled': { perSecond: 1n, label: '~0.028/sec (100/hour)' },   // ~100 per hour
        'est-unthrottled': { perSecond: 1000n, label: '1,000/sec' },
        'est-slow-hash': { perSecond: 10000n, label: '10,000/sec' },
        'est-fast-hash': { perSecond: 10000000000n, label: '10 billion/sec' }
    };

    function init() {
        const lengthInput = document.getElementById('est-length');
        const charsetSelect = document.getElementById('est-charset');
        const customInput = document.getElementById('est-charset-custom');

        if (lengthInput) lengthInput.addEventListener('input', calculate);
        if (charsetSelect) {
            charsetSelect.addEventListener('change', () => {
                const isCustom = charsetSelect.value === 'custom';
                if (customInput) customInput.classList.toggle('hidden', !isCustom);
                calculate();
            });
        }
        if (customInput) customInput.addEventListener('input', calculate);

        // Initial calculation
        calculate();
    }

    function getPoolSize() {
        const select = document.getElementById('est-charset');
        if (!select) return 95;
        if (select.value === 'custom') {
            const custom = document.getElementById('est-charset-custom');
            return custom ? parseInt(custom.value, 10) || 95 : 95;
        }
        return parseInt(select.value, 10);
    }

    function calculate() {
        const lengthInput = document.getElementById('est-length');
        const length = lengthInput ? parseInt(lengthInput.value, 10) : 20;
        const poolSize = getPoolSize();

        if (!length || length < 1 || !poolSize || poolSize < 2) {
            Object.keys(RATES).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '—';
            });
            return;
        }

        // Calculate combinations using BigInt to avoid overflow
        const combinations = BigInt(poolSize) ** BigInt(length);

        // Update each scenario
        // Throttled online: 100 guesses per hour ≈ 1 guess per 36 seconds
        const throttledSeconds = combinations * 36n; // seconds per guess at 100/hour
        updateScenario('est-throttled', throttledSeconds);

        // Unthrottled: 1000/sec
        updateScenario('est-unthrottled', combinations / 1000n);

        // Slow hash: 10,000/sec
        updateScenario('est-slow-hash', combinations / 10000n);

        // Fast hash: 10 billion/sec
        updateScenario('est-fast-hash', combinations / 10000000000n);

        // Entropy
        const entropy = length * Math.log2(poolSize);
        const entropyVal = document.getElementById('est-entropy-value');
        const entropyDetail = document.getElementById('est-entropy-detail');
        if (entropyVal) entropyVal.textContent = `${entropy.toFixed(1)} bits`;
        if (entropyDetail) {
            const combStr = combinations.toString();
            const displayComb = combStr.length > 20
                ? `~10^${combStr.length}`
                : combinations.toLocaleString();
            entropyDetail.textContent = `${length} × log₂(${poolSize}) — search space: ${displayComb} combinations`;
        }

        // Update visualization
        updateVisualization(poolSize);
    }

    function updateScenario(id, seconds) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = CK.formatDuration(seconds < 0n ? 0n : seconds);
    }

    function updateVisualization(currentPool) {
        const canvas = document.getElementById('est-viz-canvas');
        const legend = document.getElementById('est-viz-legend');
        if (!canvas) return;

        const pools = [
            { size: 10, label: 'Digits', color: 'var(--strength-0)' },
            { size: 26, label: 'Lower', color: 'var(--strength-1)' },
            { size: 52, label: 'Mixed', color: 'var(--strength-2)' },
            { size: 62, label: 'Alnum', color: 'var(--strength-3)' },
            { size: 95, label: 'Full', color: 'var(--strength-4)' }
        ];

        const lengths = [8, 12, 16, 20, 24];
        const maxEntropy = 24 * Math.log2(95); // max bar reference

        canvas.innerHTML = '';

        lengths.forEach(len => {
            const group = document.createElement('div');
            group.className = 'viz-bar-group';

            const ent = len * Math.log2(currentPool);
            const height = Math.min(100, (ent / maxEntropy) * 100);

            const bar = document.createElement('div');
            bar.className = 'viz-bar';
            bar.style.height = height + '%';
            bar.style.backgroundColor = ent < 40 ? 'var(--strength-0)' :
                                        ent < 60 ? 'var(--strength-1)' :
                                        ent < 80 ? 'var(--strength-2)' :
                                        ent < 100 ? 'var(--strength-3)' :
                                        'var(--strength-4)';

            const valLabel = document.createElement('div');
            valLabel.className = 'viz-bar-value';
            valLabel.textContent = `${ent.toFixed(0)}b`;

            const lenLabel = document.createElement('div');
            lenLabel.className = 'viz-bar-label';
            lenLabel.textContent = `${len} chars`;

            group.appendChild(valLabel);
            group.appendChild(bar);
            group.appendChild(lenLabel);
            canvas.appendChild(group);
        });

        // Legend
        if (legend) {
            legend.innerHTML = `
                <div class="viz-legend-item"><div class="viz-legend-dot" style="background:var(--strength-0)"></div> &lt;40 bits (Weak)</div>
                <div class="viz-legend-item"><div class="viz-legend-dot" style="background:var(--strength-2)"></div> 60–80 bits (Fair)</div>
                <div class="viz-legend-item"><div class="viz-legend-dot" style="background:var(--strength-4)"></div> 100+ bits (Strong)</div>
            `;
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
