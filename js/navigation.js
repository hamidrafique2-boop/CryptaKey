/* ============================================
   CryptaKey Navigation
   SPA routing, theme toggle, mobile menu
   ============================================ */

(function() {
    'use strict';

    // ---- Theme ----
    function initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const saved = localStorage.getItem('ck-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);

        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('ck-theme', next);
            });
        }
    }

    // ---- SPA Navigation ----
    function initNavigation() {
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.nav-link');

        function showPage(hash) {
            const targetId = hash.replace('#', '') || 'home';
            let found = false;

            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('page--active');
                    found = true;
                } else {
                    page.classList.remove('page--active');
                }
            });

            if (!found) {
                // Default to home
                const homePage = document.getElementById('home');
                if (homePage) homePage.classList.add('page--active');
            }

            // Update active nav link
            navLinks.forEach(link => {
                const section = link.getAttribute('data-section');
                link.classList.toggle('active', section === targetId);
            });

            // Scroll to top
            window.scrollTo(0, 0);

            // Close mobile nav
            closeMobileNav();
        }

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            showPage(window.location.hash);
        });

        // Handle all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const hash = link.getAttribute('href');
            if (hash && hash.startsWith('#')) {
                e.preventDefault();
                window.location.hash = hash;
            }
        });

        // Initial page
        showPage(window.location.hash || '#home');
    }

    // ---- Mobile Nav ----
    function initMobileNav() {
        const toggle = document.getElementById('nav-toggle');
        const nav = document.getElementById('main-nav');

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                const isOpen = nav.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });
        }
    }

    function closeMobileNav() {
        const toggle = document.getElementById('nav-toggle');
        const nav = document.getElementById('main-nav');
        if (nav) nav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    // ---- Header scroll effect ----
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ---- Copy buttons ----
    function initCopyButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-copy-target]');
            if (!btn) return;

            const targetId = btn.getAttribute('data-copy-target');
            const target = document.getElementById(targetId);
            if (!target) return;

            const text = target.value || target.textContent;
            CK.copyToClipboard(text).then(ok => {
                if (ok) {
                    btn.classList.add('copied');
                    const orig = btn.textContent;
                    btn.textContent = '✓ Copied';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.textContent = orig;
                    }, 1500);
                }
            });
        });
    }

    // ---- Toggle password visibility ----
    function initPasswordToggles() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.input-toggle-vis');
            if (!btn) return;

            const wrapper = btn.closest('.password-input-wrapper');
            if (!wrapper) return;

            const input = wrapper.querySelector('input');
            if (!input) return;

            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

            const showIcon = btn.querySelector('.eye-icon--show');
            const hideIcon = btn.querySelector('.eye-icon--hide');
            if (showIcon) showIcon.classList.toggle('hidden', isPassword);
            if (hideIcon) hideIcon.classList.toggle('hidden', !isPassword);
        });
    }

    // ---- Init all ----
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initNavigation();
        initMobileNav();
        initHeaderScroll();
        initCopyButtons();
        initPasswordToggles();
    });
})();
