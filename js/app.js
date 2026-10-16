/* ============================================
   CryptaKey App Initialization
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        console.log('%c CryptaKey ', 'background:#b2420f;color:#fff;font-size:14px;border-radius:4px;padding:2px 8px', 'Password Security Studio — All processing runs locally.');

        // Preload wordlist in background for passphrase generator
        if (window.location.hash === '#generator' || window.location.hash === '') {
            setTimeout(() => {
                fetch('data/eff-wordlist.json')
                    .then(r => r.json())
                    .catch(() => {});
            }, 1000);
        }
    });
})();
