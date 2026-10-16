/* ============================================
   CryptaKey Navigation
   SPA routing, theme toggle, mobile menu
   ============================================ */

(function() {
    'use strict';

    // ---- Theme ----
    // Default is the beige & rust palette ("light"); the espresso theme is opt-in.
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#1e1611' : '#faf4e8');
    }

    function initTheme() {
        const toggle = document.getElementById('theme-toggle');
        let saved = null;
        try { saved = localStorage.getItem('ck-theme'); } catch (e) { /* storage blocked */ }
        applyTheme(saved === 'dark' ? 'dark' : 'light');

        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                try { localStorage.setItem('ck-theme', next); } catch (e) { /* storage blocked */ }
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

            // Escape closes the drawer and returns focus to the toggle
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('open')) {
                    closeMobileNav();
                    toggle.focus();
                }
            });

            // Close the drawer if the viewport grows past the mobile breakpoint
            window.addEventListener('resize', () => {
                if (window.innerWidth > 1000) closeMobileNav();
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
