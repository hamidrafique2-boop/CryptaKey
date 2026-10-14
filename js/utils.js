/* ============================================
   CryptaKey Utilities
   Shared helper functions
   ============================================ */

const CK = window.CK || {};

/** Show a toast notification */
CK.toast = function(message, duration = 2000) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('visible'), duration);
};

/** Copy text to clipboard with fallback */
CK.copyToClipboard = async function(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for non-secure contexts
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        CK.toast('Copied to clipboard');
        return true;
    } catch {
        CK.toast('Copy failed — please select and copy manually');
        return false;
    }
};

/** Cryptographically secure random integer in [0, max) using rejection sampling */
CK.secureRandomInt = function(max) {
    if (max <= 0) throw new Error('max must be positive');
    if (max === 1) return 0;
    const arr = new Uint32Array(1);
    // Rejection sampling to avoid modulo bias
    const limit = (0xFFFFFFFF - (0xFFFFFFFF % max)) >>> 0;
    let val;
    do {
        crypto.getRandomValues(arr);
        val = arr[0] >>> 0;
    } while (val >= limit);
    return val % max;
};

/** Cryptographically secure shuffle (Fisher-Yates with CSPRNG) */
CK.secureShuffleArray = function(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = CK.secureRandomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

/** Convert ArrayBuffer to hex string */
CK.bufToHex = function(buf) {
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

/** Format large time durations from seconds (using BigInt-safe approach) */
CK.formatDuration = function(seconds) {
    if (typeof seconds === 'bigint') {
        if (seconds < 1n) return 'Instant';
        if (seconds < 60n) return `${seconds} second${seconds !== 1n ? 's' : ''}`;
        if (seconds < 3600n) return `${seconds / 60n} minute${seconds / 60n !== 1n ? 's' : ''}`;
        if (seconds < 86400n) return `${seconds / 3600n} hour${seconds / 3600n !== 1n ? 's' : ''}`;
        if (seconds < 31536000n) return `${seconds / 86400n} day${seconds / 86400n !== 1n ? 's' : ''}`;
        const years = seconds / 31536000n;
        if (years < 1000n) return `${years.toLocaleString()} years`;
        if (years < 1000000n) return `${(years / 1000n).toLocaleString()} thousand years`;
        if (years < 1000000000n) return `${(years / 1000000n).toLocaleString()} million years`;
        if (years < 1000000000000n) return `${(years / 1000000000n).toLocaleString()} billion years`;
        if (years < 1000000000000000n) return `${(years / 1000000000000n).toLocaleString()} trillion years`;
        // Beyond comprehension
        const digits = years.toString().length;
        return `~10^${digits} years (beyond the age of the universe)`;
    }
    // Float fallback
    if (seconds < 0.001) return 'Instant';
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`;
    return `${(seconds / 31536000).toFixed(1)} years`;
};

/** Debounce function */
CK.debounce = function(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

/** Escape HTML to prevent XSS */
CK.escapeHtml = function(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/** SHA-1 hash (for HIBP only — not for security) */
CK.sha1 = async function(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    return CK.bufToHex(hashBuffer).toUpperCase();
};

/** SHA-256 hash */
CK.sha256 = async function(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return CK.bufToHex(hashBuffer);
};

window.CK = CK;
