/* ============================================
   CryptaKey Encoder / Decoder
   Base64, Base32, Hex, URL, HTML, ROT13
   ============================================ */

(function() {
    'use strict';

    // Base32 alphabet (RFC 4648)
    const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    function init() {
        bindBtn('enc-encode-btn', doEncode);
        bindBtn('enc-decode-btn', doDecode);
        bindBtn('enc-swap-btn', doSwap);
        bindBtn('enc-clear-btn', doClear);
    }

    function bindBtn(id, fn) {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', fn);
    }

    function getFormat() {
        const sel = document.getElementById('enc-format');
        return sel ? sel.value : 'base64';
    }

    function showError(msg) {
        const el = document.getElementById('enc-error');
        if (el) {
            el.textContent = msg;
            el.classList.remove('hidden');
        }
    }

    function clearError() {
        const el = document.getElementById('enc-error');
        if (el) el.classList.add('hidden');
    }

    function doEncode() {
        clearError();
        const input = document.getElementById('enc-input');
        const output = document.getElementById('enc-output');
        if (!input || !output) return;

        const text = input.value;
        if (!text) { CK.toast('Enter text to encode'); return; }

        try {
            const result = encode(text, getFormat());
            output.value = result;
        } catch (err) {
            showError('Encoding error: ' + err.message);
        }
    }

    function doDecode() {
        clearError();
        const input = document.getElementById('enc-input');
        const output = document.getElementById('enc-output');
        if (!input || !output) return;

        // Decode from the output field (encoded text) or input field
        const text = output.value || input.value;
        if (!text) { CK.toast('Enter encoded text to decode'); return; }

        try {
            const result = decode(text, getFormat());
            input.value = result;
            output.value = text;
        } catch (err) {
            showError('Decoding error: ' + err.message);
        }
    }

    function doSwap() {
        const input = document.getElementById('enc-input');
        const output = document.getElementById('enc-output');
        if (input && output) {
            const tmp = input.value;
            input.value = output.value;
            output.value = tmp;
        }
    }

    function doClear() {
        const input = document.getElementById('enc-input');
        const output = document.getElementById('enc-output');
        if (input) input.value = '';
        if (output) output.value = '';
        clearError();
    }

    // ---- Encode ----
    function encode(text, format) {
        switch (format) {
            case 'base64':
                return btoa(unescape(encodeURIComponent(text)));
            case 'base64url':
                return btoa(unescape(encodeURIComponent(text)))
                    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            case 'base32':
                return base32Encode(new TextEncoder().encode(text));
            case 'hex':
                return Array.from(new TextEncoder().encode(text))
                    .map(b => b.toString(16).padStart(2, '0')).join('');
            case 'url':
                return encodeURIComponent(text);
            case 'html':
                return text.split('').map(c => {
                    const code = c.charCodeAt(0);
                    if (code > 127 || '<>&"\''.includes(c)) return `&#${code};`;
                    return c;
                }).join('');
            case 'rot13':
                return rot13(text);
            default:
                throw new Error('Unknown format: ' + format);
        }
    }

    // ---- Decode ----
    function decode(text, format) {
        switch (format) {
            case 'base64': {
                // Add padding if needed
                let padded = text;
                while (padded.length % 4 !== 0) padded += '=';
                return decodeURIComponent(escape(atob(padded)));
            }
            case 'base64url': {
                let s = text.replace(/-/g, '+').replace(/_/g, '/');
                while (s.length % 4 !== 0) s += '=';
                return decodeURIComponent(escape(atob(s)));
            }
            case 'base32':
                return new TextDecoder().decode(base32Decode(text));
            case 'hex': {
                const clean = text.replace(/\s/g, '');
                if (!/^[0-9a-fA-F]*$/.test(clean)) throw new Error('Invalid hex characters');
                if (clean.length % 2 !== 0) throw new Error('Hex string must have even length');
                const bytes = new Uint8Array(clean.length / 2);
                for (let i = 0; i < clean.length; i += 2) {
                    bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
                }
                return new TextDecoder().decode(bytes);
            }
            case 'url':
                return decodeURIComponent(text);
            case 'html':
                return text.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
                           .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                           .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
                           .replace(/&apos;/g, "'");
            case 'rot13':
                return rot13(text); // ROT13 is its own inverse
            default:
                throw new Error('Unknown format: ' + format);
        }
    }

    // ---- Base32 ----
    function base32Encode(bytes) {
        let bits = '';
        for (const b of bytes) bits += b.toString(2).padStart(8, '0');
        let result = '';
        for (let i = 0; i < bits.length; i += 5) {
            const chunk = bits.substr(i, 5).padEnd(5, '0');
            result += B32[parseInt(chunk, 2)];
        }
        // Add padding
        while (result.length % 8 !== 0) result += '=';
        return result;
    }

    function base32Decode(str) {
        const clean = str.replace(/=+$/, '').toUpperCase();
        let bits = '';
        for (const c of clean) {
            const idx = B32.indexOf(c);
            if (idx === -1) throw new Error('Invalid Base32 character: ' + c);
            bits += idx.toString(2).padStart(5, '0');
        }
        const bytes = new Uint8Array(Math.floor(bits.length / 8));
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
        }
        return bytes;
    }

    // ---- ROT13 ----
    function rot13(str) {
        return str.replace(/[a-zA-Z]/g, c => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
