/* ============================================
   CryptaKey Hash & KDF Lab
   Web Crypto hashing, HMAC, KDF demos
   ============================================ */

(function() {
    'use strict';

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

    // Simple MD5 implementation for legacy demo only
    function md5(string) {
        function md5cycle(x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];
            a = ff(a,b,c,d,k[0],7,-680876936);d = ff(d,a,b,c,k[1],12,-389564586);c = ff(c,d,a,b,k[2],17,606105819);b = ff(b,c,d,a,k[3],22,-1044525330);
            a = ff(a,b,c,d,k[4],7,-176418897);d = ff(d,a,b,c,k[5],12,1200080426);c = ff(c,d,a,b,k[6],17,-1473231341);b = ff(b,c,d,a,k[7],22,-45705983);
            a = ff(a,b,c,d,k[8],7,1770035416);d = ff(d,a,b,c,k[9],12,-1958414417);c = ff(c,d,a,b,k[10],17,-42063);b = ff(b,c,d,a,k[11],22,-1990404162);
            a = ff(a,b,c,d,k[12],7,1804603682);d = ff(d,a,b,c,k[13],12,-40341101);c = ff(c,d,a,b,k[14],17,-1502002290);b = ff(b,c,d,a,k[15],22,1236535329);
            a = gg(a,b,c,d,k[1],5,-165796510);d = gg(d,a,b,c,k[6],9,-1069501632);c = gg(c,d,a,b,k[11],14,643717713);b = gg(b,c,d,a,k[0],20,-373897302);
            a = gg(a,b,c,d,k[5],5,-701558691);d = gg(d,a,b,c,k[10],9,38016083);c = gg(c,d,a,b,k[15],14,-660478335);b = gg(b,c,d,a,k[4],20,-405537848);
            a = gg(a,b,c,d,k[9],5,568446438);d = gg(d,a,b,c,k[14],9,-1019803690);c = gg(c,d,a,b,k[3],14,-187363961);b = gg(b,c,d,a,k[8],20,1163531501);
            a = gg(a,b,c,d,k[13],5,-1444681467);d = gg(d,a,b,c,k[2],9,-51403784);c = gg(c,d,a,b,k[7],14,1735328473);b = gg(b,c,d,a,k[12],20,-1926607734);
            a = hh(a,b,c,d,k[5],4,-378558);d = hh(d,a,b,c,k[8],11,-2022574463);c = hh(c,d,a,b,k[11],16,1839030562);b = hh(b,c,d,a,k[14],23,-35309556);
            a = hh(a,b,c,d,k[1],4,-1530992060);d = hh(d,a,b,c,k[4],11,1272893353);c = hh(c,d,a,b,k[7],16,-155497632);b = hh(b,c,d,a,k[10],23,-1094730640);
            a = hh(a,b,c,d,k[13],4,681279174);d = hh(d,a,b,c,k[0],11,-358537222);c = hh(c,d,a,b,k[3],16,-722521979);b = hh(b,c,d,a,k[6],23,76029189);
            a = hh(a,b,c,d,k[9],4,-640364487);d = hh(d,a,b,c,k[12],11,-421815835);c = hh(c,d,a,b,k[15],16,530742520);b = hh(b,c,d,a,k[2],23,-995338651);
            a = ii(a,b,c,d,k[0],6,-198630844);d = ii(d,a,b,c,k[7],10,1126891415);c = ii(c,d,a,b,k[14],15,-1416354905);b = ii(b,c,d,a,k[5],21,-57434055);
            a = ii(a,b,c,d,k[12],6,1700485571);d = ii(d,a,b,c,k[3],10,-1894986606);c = ii(c,d,a,b,k[10],15,-1051523);b = ii(b,c,d,a,k[1],21,-2054922799);
            a = ii(a,b,c,d,k[8],6,1873313359);d = ii(d,a,b,c,k[15],10,-30611744);c = ii(c,d,a,b,k[6],15,-1560198380);b = ii(b,c,d,a,k[13],21,1309151649);
            a = ii(a,b,c,d,k[4],6,-145523070);d = ii(d,a,b,c,k[11],10,-1120210379);c = ii(c,d,a,b,k[2],15,718787259);b = ii(b,c,d,a,k[9],21,-343485551);
            x[0] = add32(a,x[0]);x[1] = add32(b,x[1]);x[2] = add32(c,x[2]);x[3] = add32(d,x[3]);
        }
        function cmn(q,a,b,x,s,t){a=add32(add32(a,q),add32(x,t));return add32((a<<s)|(a>>>(32-s)),b)}
        function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t)}
        function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t)}
        function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t)}
        function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t)}
        function add32(a,b){return(a+b)&0xFFFFFFFF}

        var n = string.length, state = [1732584193,-271733879,-1732584194,271733878], i;
        for(i=64;i<=n;i+=64){
            var tail = [], j;
            for(j=0;j<64;j+=4)
                tail.push((string.charCodeAt(i-64+j))|(string.charCodeAt(i-64+j+1)<<8)|(string.charCodeAt(i-64+j+2)<<16)|(string.charCodeAt(i-64+j+3)<<24));
            md5cycle(state,tail);
        }
        var tail2=[];
        for(j=i-64;j<n;j++) tail2.push(string.charCodeAt(j));
        tail2.push(0x80);
        var tl = [];
        for(j=0;j<tail2.length+3>>2;j++) tl.push(0);
        for(j=0;j<tail2.length;j++) tl[j>>2]|=tail2[j]<<((j%4)<<3);
        if(tl.length>14){var x2=tl.slice();while(x2.length<16) x2.push(0);md5cycle(state,x2);tl=tl.slice(16);while(tl.length<16) tl.push(0);}
        else{while(tl.length<14) tl.push(0);}
        tl.push(n*8);tl.push(0);
        while(tl.length<16) tl.push(0);
        md5cycle(state,tl);
        var hex='';
        for(i=0;i<4;i++)for(j=0;j<4;j++) hex+=(((state[i]>>(j*8))&0xFF)+256).toString(16).slice(1);
        return hex;
    }

    function init() {
        // Hash mode tabs
        document.querySelectorAll('[data-hash-mode]').forEach(btn => {
            btn.addEventListener('click', () => switchHashMode(btn.dataset.hashMode));
        });

        // Algorithm change — show legacy warning
        const algoSelect = document.getElementById('hash-algo');
        if (algoSelect) {
            algoSelect.addEventListener('change', () => {
                const warn = document.getElementById('hash-legacy-warning');
                const isLegacy = ['MD5', 'SHA-1'].includes(algoSelect.value);
                if (warn) warn.classList.toggle('hidden', !isLegacy);
            });
        }

        // Compute buttons
        bindBtn('hash-compute-btn', computeTextHash);
        bindBtn('hash-file-btn', computeFileHash);
        bindBtn('hmac-compute-btn', computeHMAC);
        bindBtn('kdf-compute-btn', computeKDF);
    }

    function bindBtn(id, fn) {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', fn);
    }

    function switchHashMode(mode) {
        document.querySelectorAll('[data-hash-mode]').forEach(btn => {
            const isActive = btn.dataset.hashMode === mode;
            btn.classList.toggle('mode-btn--active', isActive);
            btn.setAttribute('aria-checked', isActive);
        });

        ['hash-text-panel', 'hash-file-panel', 'hash-hmac-panel', 'hash-kdf-panel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', !id.includes(mode));
        });

        // Hide legacy warning when switching modes
        const warn = document.getElementById('hash-legacy-warning');
        if (warn) warn.classList.add('hidden');
    }

    async function computeTextHash() {
        const input = document.getElementById('hash-text-input');
        const algo = document.getElementById('hash-algo');
        const output = document.getElementById('hash-text-output');
        const result = document.getElementById('hash-text-result');

        if (!input || !algo || !output || !result) return;
        const text = input.value;
        if (!text) { CK.toast('Enter text to hash'); return; }

        try {
            let hash;
            const algoName = algo.value;

            if (algoName === 'MD5') {
                // Legacy demo — pure JS implementation
                hash = md5(text);
            } else {
                // Web Crypto API
                const encoded = new TextEncoder().encode(text);
                const buf = await crypto.subtle.digest(algoName, encoded);
                hash = CK.bufToHex(buf);
            }

            result.textContent = hash;
            output.classList.remove('hidden');

            // Show legacy warning
            const warn = document.getElementById('hash-legacy-warning');
            if (warn) warn.classList.toggle('hidden', !['MD5', 'SHA-1'].includes(algoName));
        } catch (err) {
            CK.toast('Hash computation failed: ' + err.message);
        }
    }

    async function computeFileHash() {
        const fileInput = document.getElementById('hash-file-input');
        const algo = document.getElementById('hash-file-algo');
        const output = document.getElementById('hash-file-output');
        const result = document.getElementById('hash-file-result');
        const progressBar = document.getElementById('hash-file-progress');
        const progressFill = document.getElementById('hash-file-progress-fill');

        if (!fileInput || !fileInput.files.length) {
            CK.toast('Select a file first');
            return;
        }

        const file = fileInput.files[0];
        if (file.size > MAX_FILE_SIZE) {
            CK.toast(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
            return;
        }

        try {
            if (progressBar) progressBar.classList.remove('hidden');
            if (progressFill) progressFill.style.width = '30%';

            const buffer = await file.arrayBuffer();
            if (progressFill) progressFill.style.width = '70%';

            const hashBuf = await crypto.subtle.digest(algo.value, buffer);
            const hash = CK.bufToHex(hashBuf);

            if (progressFill) progressFill.style.width = '100%';

            if (result) result.textContent = hash;
            if (output) output.classList.remove('hidden');

            setTimeout(() => {
                if (progressBar) progressBar.classList.add('hidden');
                if (progressFill) progressFill.style.width = '0';
            }, 500);
        } catch (err) {
            CK.toast('File hashing failed: ' + err.message);
            if (progressBar) progressBar.classList.add('hidden');
        }
    }

    async function computeHMAC() {
        const msgInput = document.getElementById('hmac-message');
        const keyInput = document.getElementById('hmac-key');
        const algoSelect = document.getElementById('hmac-algo');
        const output = document.getElementById('hmac-output');
        const result = document.getElementById('hmac-result');

        if (!msgInput || !keyInput) return;
        const message = msgInput.value;
        const keyStr = keyInput.value;

        if (!message) { CK.toast('Enter a message'); return; }
        if (!keyStr) { CK.toast('Enter an HMAC key'); return; }

        try {
            const algo = algoSelect ? algoSelect.value : 'SHA-256';
            const enc = new TextEncoder();

            const key = await crypto.subtle.importKey(
                'raw',
                enc.encode(keyStr),
                { name: 'HMAC', hash: algo },
                false,
                ['sign']
            );

            const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
            const hex = CK.bufToHex(sig);

            if (result) result.textContent = hex;
            if (output) output.classList.remove('hidden');
        } catch (err) {
            CK.toast('HMAC failed: ' + err.message);
        }
    }

    async function computeKDF() {
        const pwInput = document.getElementById('kdf-password');
        const algoSelect = document.getElementById('kdf-algo');
        const output = document.getElementById('kdf-output');
        const results = document.getElementById('kdf-results');

        if (!pwInput || !pwInput.value) { CK.toast('Enter a password'); return; }

        const password = pwInput.value;
        const algo = algoSelect ? algoSelect.value : 'PBKDF2';

        try {
            const enc = new TextEncoder();
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const iterations = 100000;

            const start = performance.now();

            // Import password as key material
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                enc.encode(password),
                'PBKDF2',
                false,
                ['deriveBits']
            );

            // Derive key
            const derived = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: iterations,
                    hash: 'SHA-256'
                },
                keyMaterial,
                256
            );

            const elapsed = (performance.now() - start).toFixed(1);
            const derivedHex = CK.bufToHex(derived);
            const saltHex = CK.bufToHex(salt.buffer);

            if (results) {
                results.innerHTML = `
                    <div class="kdf-item">
                        <div class="kdf-item-label">Algorithm</div>
                        <div class="kdf-item-value">PBKDF2-HMAC-SHA256</div>
                    </div>
                    <div class="kdf-item">
                        <div class="kdf-item-label">Iterations</div>
                        <div class="kdf-item-value">${iterations.toLocaleString()}</div>
                    </div>
                    <div class="kdf-item">
                        <div class="kdf-item-label">Salt (random, 16 bytes)</div>
                        <div class="kdf-item-value">${saltHex}</div>
                    </div>
                    <div class="kdf-item">
                        <div class="kdf-item-label">Derived key (256 bits)</div>
                        <div class="kdf-item-value">${derivedHex}</div>
                    </div>
                    <div class="kdf-item">
                        <div class="kdf-item-label">Time elapsed</div>
                        <div class="kdf-item-value">${elapsed} ms</div>
                    </div>
                `;
            }

            if (output) output.classList.remove('hidden');
        } catch (err) {
            CK.toast('KDF computation failed: ' + err.message);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
