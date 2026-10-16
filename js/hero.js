/* ============================================
   CryptaKey Hero
   Live sample password (CSPRNG) + scroll reveal
   Uses crypto.getRandomValues() only — no Math.random()
   ============================================ */

(function() {
    'use strict';

    // Unambiguous characters only (no 0/O, 1/l/I)
    const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+?';
    const SAMPLE_LENGTH = 18;
    const CYCLE_MS = 5200;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function randomChar() {
        return CHARSET[CK.secureRandomInt(CHARSET.length)];
    }

    function generate(len) {
        let out = '';
        for (let i = 0; i < len; i++) out += randomChar();
        return out;
    }

    // ---- Live sample ----
    function initSample() {
        const pwEl = document.getElementById('hero-password');
        const meter = document.getElementById('hero-meter');
        const entropyEl = document.getElementById('hero-entropy');
        const strengthEl = document.getElementById('hero-strength');
        const refresh = document.getElementById('hero-refresh');
        if (!pwEl || typeof CK === 'undefined') return;

        const entropy = SAMPLE_LENGTH * Math.log2(CHARSET.length);
        let frame = null;
        let timer = null;

        function showMeta() {
            if (entropyEl) entropyEl.textContent = `${entropy.toFixed(0)} bits of entropy`;
            if (strengthEl) strengthEl.textContent = 'Excellent';
            if (meter) meter.style.width = '100%';
        }

        function setPassword(finalText) {
            if (frame) cancelAnimationFrame(frame);

            if (reduceMotion) {
                pwEl.textContent = finalText;
                showMeta();
                return;
            }

            // Scramble effect: characters "lock in" from left to right
            const start = performance.now();
            const duration = 800;
            function tick(now) {
                const progress = Math.min(1, (now - start) / duration);
                const locked = Math.floor(progress * finalText.length);
                let text = finalText.slice(0, locked);
                for (let i = locked; i < finalText.length; i++) text += randomChar();
                pwEl.textContent = text;
                if (progress < 1) {
                    frame = requestAnimationFrame(tick);
                } else {
                    pwEl.textContent = finalText;
                    frame = null;
                }
            }
            if (meter) meter.style.width = '0';
            frame = requestAnimationFrame(tick);
            setTimeout(showMeta, 250);
        }

        function next() {
            setPassword(generate(SAMPLE_LENGTH));
        }

        function schedule() {
            clearInterval(timer);
            if (reduceMotion) return;
            timer = setInterval(() => {
                // Only animate while the home page is visible and the tab is active
                const home = document.getElementById('home');
                if (document.hidden || !home || !home.classList.contains('page--active')) return;
                next();
            }, CYCLE_MS);
        }

        if (refresh) {
            refresh.addEventListener('click', () => {
                next();
                schedule();
            });
        }

        next();
        schedule();
    }

    // ---- Scroll reveal ----
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) return; // content stays visible

        document.documentElement.classList.add('reveal-ready');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        items.forEach(el => observer.observe(el));
    }

    document.addEventListener('DOMContentLoaded', () => {
        initSample();
        initReveal();
    });
})();
