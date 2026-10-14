/* ============================================
   CryptaKey Password Generator
   Random passwords, passphrases, PINs
   ============================================ */

(function() {
    'use strict';

    // Character pools
    const CHARS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        digits: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
        ambiguous: '0O1lI'
    };

    // EFF Diceware large wordlist (7776 words) — loaded on demand
    let wordlist = null;

    async function loadWordlist() {
        if (wordlist) return wordlist;
        try {
            const resp = await fetch('data/eff-wordlist.json');
            wordlist = await resp.json();
            return wordlist;
        } catch {
            CK.toast('Failed to load wordlist');
            return null;
        }
    }

    let currentMode = 'password';
    let passwordsVisible = true;

    function init() {
        // Mode switching
        document.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', () => switchMode(btn.dataset.mode));
        });

        // Range sliders with output
        bindSlider('gen-length', 'gen-length-value');
        bindSlider('gen-word-count', 'gen-word-count-value');
        bindSlider('gen-pin-length', 'gen-pin-length-value');

        // Generate button
        const genBtn = document.getElementById('gen-generate-btn');
        if (genBtn) genBtn.addEventListener('click', generate);

        // Clear button
        const clearBtn = document.getElementById('gen-clear-btn');
        if (clearBtn) clearBtn.addEventListener('click', clearAll);

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'g' && window.location.hash === '#generator') {
                e.preventDefault();
                generate();
            }
        });
    }

    function bindSlider(sliderId, outputId) {
        const slider = document.getElementById(sliderId);
        const output = document.getElementById(outputId);
        if (slider && output) {
            slider.addEventListener('input', () => { output.textContent = slider.value; });
        }
    }

    function switchMode(mode) {
        currentMode = mode;
        document.querySelectorAll('[data-mode]').forEach(btn => {
            const isActive = btn.dataset.mode === mode;
            btn.classList.toggle('mode-btn--active', isActive);
            btn.setAttribute('aria-checked', isActive);
        });
        document.getElementById('gen-password-controls').classList.toggle('hidden', mode !== 'password');
        document.getElementById('gen-passphrase-controls').classList.toggle('hidden', mode !== 'passphrase');
        document.getElementById('gen-pin-controls').classList.toggle('hidden', mode !== 'pin');
        clearAll();
    }

    function generate() {
        const count = parseInt(document.getElementById('gen-bulk-count').value, 10) || 1;
        const output = document.getElementById('gen-output');
        const entropyEl = document.getElementById('gen-entropy');
        output.innerHTML = '';

        let results = [];
        let entropy = 0;
        let entropyFormula = '';

        try {
            for (let i = 0; i < count; i++) {
                let result;
                if (currentMode === 'password') {
                    result = generatePassword();
                    entropy = result.entropy;
                    entropyFormula = result.formula;
                    results.push(result.password);
                } else if (currentMode === 'passphrase') {
                    result = generatePassphrase();
                    if (!result) return; // wordlist not loaded
                    entropy = result.entropy;
                    entropyFormula = result.formula;
                    results.push(result.passphrase);
                } else if (currentMode === 'pin') {
                    result = generatePIN();
                    entropy = result.entropy;
                    entropyFormula = result.formula;
                    results.push(result.pin);
                }
            }
        } catch (err) {
            CK.toast(err.message || 'Generation error');
            return;
        }

        // Render results
        results.forEach((text, idx) => {
            const item = document.createElement('div');
            item.className = 'gen-output-item';
            item.innerHTML = `
                <span class="gen-output-text" id="gen-result-${idx}">${CK.escapeHtml(text)}</span>
                <button class="btn btn--sm btn--copy" data-copy-target="gen-result-${idx}" title="Copy">Copy</button>
            `;
            output.appendChild(item);
        });

        // Show entropy
        if (entropyEl) {
            entropyEl.classList.remove('hidden');
            document.getElementById('gen-entropy-value').textContent = `${entropy.toFixed(1)} bits`;
            document.getElementById('gen-entropy-detail').textContent = entropyFormula;
        }
    }

    function generatePassword() {
        const length = parseInt(document.getElementById('gen-length').value, 10);
        const useUpper = document.getElementById('gen-upper').checked;
        const useLower = document.getElementById('gen-lower').checked;
        const useDigits = document.getElementById('gen-digits').checked;
        const useSymbols = document.getElementById('gen-symbols').checked;
        const excludeAmbiguous = document.getElementById('gen-exclude-ambiguous').checked;
        const customExclude = document.getElementById('gen-custom-exclude').value;

        // Build character pool
        let pool = '';
        if (useUpper) pool += CHARS.upper;
        if (useLower) pool += CHARS.lower;
        if (useDigits) pool += CHARS.digits;
        if (useSymbols) pool += CHARS.symbols;

        if (pool.length === 0) {
            throw new Error('Select at least one character type');
        }

        // Apply exclusions
        if (excludeAmbiguous) {
            pool = pool.split('').filter(c => !CHARS.ambiguous.includes(c)).join('');
        }
        if (customExclude) {
            const excludeSet = new Set(customExclude);
            pool = pool.split('').filter(c => !excludeSet.has(c)).join('');
        }

        if (pool.length === 0) {
            throw new Error('Character pool is empty after exclusions');
        }

        if (length < 4 || length > 128) {
            throw new Error('Length must be between 4 and 128');
        }

        // Determine required characters per class
        const required = [];
        if (useUpper) required.push(filterPool(CHARS.upper, excludeAmbiguous, customExclude));
        if (useLower) required.push(filterPool(CHARS.lower, excludeAmbiguous, customExclude));
        if (useDigits) required.push(filterPool(CHARS.digits, excludeAmbiguous, customExclude));
        if (useSymbols) required.push(filterPool(CHARS.symbols, excludeAmbiguous, customExclude));

        if (required.length > length) {
            throw new Error(`Need at least ${required.length} characters to include all selected types`);
        }

        // Generate: first ensure one from each required class
        const chars = [];
        for (const reqPool of required) {
            if (reqPool.length > 0) {
                chars.push(reqPool[CK.secureRandomInt(reqPool.length)]);
            }
        }

        // Fill remaining from full pool
        for (let i = chars.length; i < length; i++) {
            chars.push(pool[CK.secureRandomInt(pool.length)]);
        }

        // Cryptographic shuffle (Fisher-Yates with CSPRNG)
        CK.secureShuffleArray(chars);

        const entropy = length * Math.log2(pool.length);
        return {
            password: chars.join(''),
            entropy,
            formula: `${length} × log₂(${pool.length}) = ${entropy.toFixed(1)} bits`
        };
    }

    function filterPool(chars, excludeAmbig, customExclude) {
        let result = chars;
        if (excludeAmbig) {
            result = result.split('').filter(c => !CHARS.ambiguous.includes(c)).join('');
        }
        if (customExclude) {
            const s = new Set(customExclude);
            result = result.split('').filter(c => !s.has(c)).join('');
        }
        return result;
    }

    function generatePassphrase() {
        if (!wordlist) {
            loadWordlist().then(wl => {
                if (wl) generate(); // retry after load
            });
            CK.toast('Loading wordlist…');
            return null;
        }

        const wordCount = parseInt(document.getElementById('gen-word-count').value, 10);
        const separator = document.getElementById('gen-separator').value;
        const capitalize = document.getElementById('gen-capitalize').checked;
        const addNumber = document.getElementById('gen-add-number').checked;

        const words = [];
        for (let i = 0; i < wordCount; i++) {
            let word = wordlist[CK.secureRandomInt(wordlist.length)];
            if (capitalize) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            words.push(word);
        }

        let passphrase = words.join(separator);
        if (addNumber) {
            passphrase += separator + CK.secureRandomInt(1000).toString();
        }

        const entropy = wordCount * Math.log2(wordlist.length);
        return {
            passphrase,
            entropy,
            formula: `${wordCount} × log₂(${wordlist.length}) = ${entropy.toFixed(1)} bits`
        };
    }

    function generatePIN() {
        const length = parseInt(document.getElementById('gen-pin-length').value, 10);
        const chars = [];
        for (let i = 0; i < length; i++) {
            chars.push(CHARS.digits[CK.secureRandomInt(10)]);
        }
        const entropy = length * Math.log2(10);
        return {
            pin: chars.join(''),
            entropy,
            formula: `${length} × log₂(10) = ${entropy.toFixed(1)} bits`
        };
    }

    function clearAll() {
        const output = document.getElementById('gen-output');
        if (output) output.innerHTML = '';
        const entropyEl = document.getElementById('gen-entropy');
        if (entropyEl) entropyEl.classList.add('hidden');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
