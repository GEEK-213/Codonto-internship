// Day 3: Dark Mode & Mobile Navigation - Enhanced JavaScript
// Tailwind Resume with advanced responsive features

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Theme settings
        theme: {
            storageKey: 'theme',
            defaultTheme: 'system',
            transitionDuration: 300
        },

        // Animation settings
        scrollOffset: 100,
        transitionDuration: 300,

        // Mobile settings
        mobileBreakpoint: 768,
        touchThreshold: 50,

        // Performance settings
        throttleDelay: 16, // ~60fps
        debounceDelay: 150,

        // Debug mode
        debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    };

    // State management
    const STATE = {
        currentYear: new Date().getFullYear(),
        currentTheme: 'light',
        systemPrefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
        mobileMenuOpen: false,
        lastScrollY: 0,
        scrollDirection: 'up',
        activeSection: 'about',
        isScrolling: false,
        isMobile: window.innerWidth < CONFIG.mobileBreakpoint
    };

    // DOM elements cache
    const ELEMENTS = {
        html: document.documentElement,
        body: document.body,
        themeToggle: document.getElementById('theme-toggle'),
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        mobileMenuClose: document.getElementById('mobile-menu-close'),
        mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
        mobileMenuPanel: document.getElementById('mobile-menu-panel'),
        navLinks: document.querySelectorAll('.nav-link'),
        mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
        currentYearSpan: document.getElementById('current-year'),
        header: document.querySelector('header'),
        scrollProgress: document.getElementById('scroll-progress'),
        scrollToTop: document.getElementById('scroll-to-top'),
        sections: document.querySelectorAll('section[id]'),
        menuOpenIcon: document.querySelector('.menu-open'),
        menuCloseIcon: document.querySelector('.menu-close')
    };

    /**
     * Initialize the application
     */
    function init() {
        if (CONFIG.debug) {
            console.log('🚀 Day 3: Enhanced Resume with Dark Mode Initializing...');
        }

        // Initialize theme system
        initializeTheme();

        // Set current year
        setCurrentYear();

        // Setup event listeners
        setupEventListeners();

        // Initialize navigation
        setupNavigation();

        // Setup mobile menu
        setupMobileMenu();

        // Setup scroll effects
        setupScrollEffects();

        // Initialize responsive features
        setupResponsiveFeatures();

        if (CONFIG.debug) {
            console.log('✅ Day 3: Initialization complete');
            console.log('📊 Current state:', STATE);
        }
    }

    /**
     * Theme Management System
     */
    function initializeTheme() {
        const savedTheme = localStorage.getItem(CONFIG.theme.storageKey);

        // Determine initial theme
        if (savedTheme) {
            STATE.currentTheme = savedTheme;
        } else if (STATE.systemPrefersDark) {
            STATE.currentTheme = 'dark';
        } else {
            STATE.currentTheme = 'light';
        }

        // Apply theme
        applyTheme(STATE.currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(CONFIG.theme.storageKey)) {
                STATE.systemPrefersDark = e.matches;
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        if (CONFIG.debug) {
            console.log('🎨 Theme initialized:', STATE.currentTheme);
        }
    }

    function applyTheme(theme) {
        STATE.currentTheme = theme;

        if (theme === 'dark') {
            ELEMENTS.html.classList.add('dark');
        } else {
            ELEMENTS.html.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem(CONFIG.theme.storageKey, theme);

        // Update theme toggle button accessibility
        if (ELEMENTS.themeToggle) {
            ELEMENTS.themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    function toggleTheme() {
        const newTheme = STATE.currentTheme === 'dark' ? 'light' : 'dark';

        // Add visual feedback
        if (ELEMENTS.themeToggle) {
            ELEMENTS.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                ELEMENTS.themeToggle.style.transform = 'scale(1)';
            }, 150);
        }

        applyTheme(newTheme);

        if (CONFIG.debug) {
            console.log('🌓 Theme toggled to:', newTheme);
        }
    }

    /**
     * Set current year in footer
     */
    function setCurrentYear() {
        if (ELEMENTS.currentYearSpan) {
            ELEMENTS.currentYearSpan.textContent = STATE.currentYear;
        }
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Theme toggle
        if (ELEMENTS.themeToggle) {
            ELEMENTS.themeToggle.addEventListener('click', toggleTheme);
        }

        // Mobile menu controls
        if (ELEMENTS.mobileMenuBtn) {
            ELEMENTS.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        if (ELEMENTS.mobileMenuClose) {
            ELEMENTS.mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        if (ELEMENTS.mobileMenuOverlay) {
            ELEMENTS.mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === ELEMENTS.mobileMenuOverlay) {
                    closeMobileMenu();
                }
            });
        }

        // Navigation links
        [...ELEMENTS.navLinks, ...ELEMENTS.mobileNavLinks].forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Scroll events with throttling
        window.addEventListener('scroll', throttle(handleScroll, CONFIG.throttleDelay), { passive: true });

        // Resize events with debouncing
        window.addEventListener('resize', debounce(handleResize, CONFIG.debounceDelay));

        // Scroll to top button
        if (ELEMENTS.scrollToTop) {
            ELEMENTS.scrollToTop.addEventListener('click', scrollToTop);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Touch events for mobile
        if (STATE.isMobile) {
            setupTouchEvents();
        }
    }

    /**
     * Setup navigation system
     */
    function setupNavigation() {
        // Initialize active navigation state
        updateActiveNavigation();

        // Add smooth scroll behavior fallback for older browsers
        if (!CSS.supports('scroll-behavior: smooth')) {
            enableSmoothScrollFallback();
        }
    }

    function handleNavClick(e) {
        const href = e.target.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate offset position
                const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;

                // Smooth scroll to target
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active state immediately
                updateActiveNavigation(targetId);

                // Close mobile menu
                if (STATE.mobileMenuOpen) {
                    closeMobileMenu();
                }

                if (CONFIG.debug) {
                    console.log('🎯 Navigated to:', targetId);
                }
            }
        }
    }

    function updateActiveNavigation(activeId = null) {
        if (!activeId) {
            // Determine active section based on scroll position
            const scrollPosition = window.scrollY + CONFIG.scrollOffset + 50;

            ELEMENTS.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeId = section.id;
                }
            });
        }

        if (activeId && activeId !== STATE.activeSection) {
            STATE.activeSection = activeId;

            // Update desktop navigation
            ELEMENTS.navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${activeId}`;

                if (isActive) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update mobile navigation
            ELEMENTS.mobileNavLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${activeId}`;

                if (isActive) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    /**
     * Mobile menu management
     */
    function setupMobileMenu() {
        // Prevent body scroll when mobile menu is open
        const preventBodyScroll = (e) => {
            if (STATE.mobileMenuOpen) {
                e.preventDefault();
            }
        };

        document.addEventListener('touchmove', preventBodyScroll, { passive: false });
        document.addEventListener('wheel', preventBodyScroll, { passive: false });
    }

    function toggleMobileMenu() {
        if (STATE.mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        STATE.mobileMenuOpen = true;

        // Show overlay
        if (ELEMENTS.mobileMenuOverlay) {
            ELEMENTS.mobileMenuOverlay.classList.add('show');
            ELEMENTS.mobileMenuOverlay.style.opacity = '1';
            ELEMENTS.mobileMenuOverlay.style.visibility = 'visible';
        }

        // Show panel
        if (ELEMENTS.mobileMenuPanel) {
            ELEMENTS.mobileMenuPanel.classList.add('show');
            ELEMENTS.mobileMenuPanel.style.transform = 'translateX(0)';
        }

        // Update hamburger icon
        if (ELEMENTS.menuOpenIcon && ELEMENTS.menuCloseIcon) {
            ELEMENTS.menuOpenIcon.classList.add('hidden');
            ELEMENTS.menuCloseIcon.classList.remove('hidden');
        }

        // Prevent body scroll
        ELEMENTS.body.style.overflow = 'hidden';

        if (CONFIG.debug) {
            console.log('📱 Mobile menu opened');
        }
    }

    function closeMobileMenu() {
        STATE.mobileMenuOpen = false;

        // Hide overlay
        if (ELEMENTS.mobileMenuOverlay) {
            ELEMENTS.mobileMenuOverlay.classList.remove('show');
            ELEMENTS.mobileMenuOverlay.style.opacity = '0';
            ELEMENTS.mobileMenuOverlay.style.visibility = 'hidden';
        }

        // Hide panel
        if (ELEMENTS.mobileMenuPanel) {
            ELEMENTS.mobileMenuPanel.classList.remove('show');
            ELEMENTS.mobileMenuPanel.style.transform = 'translateX(100%)';
        }

        // Update hamburger icon
        if (ELEMENTS.menuOpenIcon && ELEMENTS.menuCloseIcon) {
            ELEMENTS.menuOpenIcon.classList.remove('hidden');
            ELEMENTS.menuCloseIcon.classList.add('hidden');
        }

        // Restore body scroll
        ELEMENTS.body.style.overflow = 'auto';

        if (CONFIG.debug) {
            console.log('📱 Mobile menu closed');
        }
    }

    /**
     * Scroll effects and animations
     */
    function setupScrollEffects() {
        // Initialize scroll progress
        updateScrollProgress();

        // Initialize scroll to top button
        updateScrollToTop();
    }

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Determine scroll direction
        STATE.scrollDirection = currentScrollY > STATE.lastScrollY ? 'down' : 'up';
        STATE.lastScrollY = currentScrollY;

        // Update scroll-based elements
        updateScrollProgress();
        updateScrollToTop();
        updateActiveNavigation();
        updateHeaderState();

        // Mark as not scrolling after a delay
        clearTimeout(STATE.scrollingTimeout);
        STATE.isScrolling = true;
        STATE.scrollingTimeout = setTimeout(() => {
            STATE.isScrolling = false;
        }, 150);
    }

    function updateScrollProgress() {
        if (!ELEMENTS.scrollProgress) return;

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min((STATE.lastScrollY / scrollHeight) * 100, 100);

        ELEMENTS.scrollProgress.style.transform = `scaleX(${scrollProgress / 100})`;
    }

    function updateScrollToTop() {
        if (!ELEMENTS.scrollToTop) return;

        const isVisible = STATE.lastScrollY > CONFIG.scrollOffset * 2;

        if (isVisible) {
            ELEMENTS.scrollToTop.classList.add('visible');
        } else {
            ELEMENTS.scrollToTop.classList.remove('visible');
        }
    }

    function updateHeaderState() {
        if (!ELEMENTS.header) return;

        // Add/remove scrolled class based on scroll position
        if (STATE.lastScrollY > 50) {
            ELEMENTS.header.classList.add('scrolled');
        } else {
            ELEMENTS.header.classList.remove('scrolled');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        if (CONFIG.debug) {
            console.log('⬆️ Scrolled to top');
        }
    }

    /**
     * Responsive features
     */
    function setupResponsiveFeatures() {
        // Update mobile state
        updateMobileState();

        // Setup touch gestures for mobile
        if (STATE.isMobile) {
            setupTouchEvents();
        }
    }

    function setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Horizontal swipe (mobile menu)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > CONFIG.touchThreshold) {
                if (diffX > 0) {
                    // Swipe left - close menu if open
                    if (STATE.mobileMenuOpen) {
                        closeMobileMenu();
                    }
                } else {
                    // Swipe right - open menu if closed (from edge)
                    if (!STATE.mobileMenuOpen && touchStartX < 50) {
                        openMobileMenu();
                    }
                }
            }

            // Reset values
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    }

    function handleResize() {
        const wasMobile = STATE.isMobile;
        STATE.isMobile = window.innerWidth < CONFIG.mobileBreakpoint;

        // Close mobile menu when switching to desktop
        if (wasMobile && !STATE.isMobile && STATE.mobileMenuOpen) {
            closeMobileMenu();
        }

        // Update mobile state
        updateMobileState();

        if (CONFIG.debug) {
            console.log('🔄 Resize handled, mobile:', STATE.isMobile);
        }
    }

    function updateMobileState() {
        if (STATE.isMobile) {
            ELEMENTS.body.classList.add('is-mobile');
        } else {
            ELEMENTS.body.classList.remove('is-mobile');
        }
    }

    /**
     * Keyboard navigation
     */
    function handleKeyboard(e) {
        // Close mobile menu with Escape
        if (e.key === 'Escape' && STATE.mobileMenuOpen) {
            closeMobileMenu();
            return;
        }

        // Theme toggle with Ctrl/Cmd + D
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            toggleTheme();
            return;
        }

        // Mobile menu toggle with M key
        if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
            if (STATE.isMobile) {
                toggleMobileMenu();
            }
            return;
        }

        // Navigation shortcuts
        if (e.altKey) {
            switch (e.key) {
                case 'h':
                case 'Home':
                    e.preventDefault();
                    scrollToTop();
                    break;
                case '1':
                    e.preventDefault();
                    document.querySelector('a[href="#about"]')?.click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('a[href="#education"]')?.click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('a[href="#skills"]')?.click();
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('a[href="#experience"]')?.click();
                    break;
                case '5':
                    e.preventDefault();
                    document.querySelector('a[href="#contact"]')?.click();
                    break;
            }
        }
    }

    /**
     * Smooth scroll fallback for older browsers
     */
    function enableSmoothScrollFallback() {
        const smoothScroll = (targetY, duration = 500) => {
            const startY = window.scrollY;
            const distance = targetY - startY;
            const startTime = performance.now();

            const easeInOutQuart = (t) => {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            };

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeInOutQuart(progress);

                window.scrollTo(0, startY + distance * eased);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        };

        // Override smooth scroll behavior
        window.smoothScrollTo = smoothScroll;
    }

    /**
     * Performance utilities
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility functions
     */
    function getScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }

    function isElementInView(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top <= viewHeight * (1 - threshold) &&
            rect.bottom >= viewHeight * threshold &&
            rect.left <= viewWidth * (1 - threshold) &&
            rect.right >= viewWidth * threshold
        );
    }

    /**
     * Cleanup function
     */
    function cleanup() {
        // Clear timeouts
        if (STATE.scrollingTimeout) {
            clearTimeout(STATE.scrollingTimeout);
        }

        // Remove event listeners
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);

        if (CONFIG.debug) {
            console.log('🧹 Cleanup completed');
        }
    }

    /**
     * Debug utilities
     */
    function enableDebugMode() {
        if (CONFIG.debug) {
            window.resumeDebug = {
                state: STATE,
                config: CONFIG,
                elements: ELEMENTS,
                functions: {
                    toggleTheme,
                    toggleMobileMenu,
                    updateActiveNavigation,
                    scrollToTop,
                    getScrollProgress
                }
            };

            console.log('🐛 Debug mode enabled. Use window.resumeDebug');

            // Add visual debug indicators
            if (localStorage.getItem('debug-visual') === 'true') {
                addVisualDebugIndicators();
            }
        }
    }

    function addVisualDebugIndicators() {
        // Add scroll position indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            font-family: monospace;
        `;
        document.body.appendChild(scrollIndicator);

        window.addEventListener('scroll', () => {
            scrollIndicator.textContent = `Scroll: ${Math.round(window.scrollY)}px (${getScrollProgress()}%)`;
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Enable debug mode
    enableDebugMode();

    // Expose utilities globally
    window.ResumeTheme = {
        toggle: toggleTheme,
        set: applyTheme,
        get: () => STATE.currentTheme
    };

    window.ResumeMobile = {
        toggle: toggleMobileMenu,
        open: openMobileMenu,
        close: closeMobileMenu,
        isOpen: () => STATE.mobileMenuOpen
    };

    if (CONFIG.debug) {
        console.log('🎉 Day 3: Enhanced Resume fully loaded!');
        console.log('🌙 Dark mode available');
        console.log('📱 Mobile menu functional');
        console.log('🎯 Smooth navigation active');
    }

})();

// Additional feature: Auto-save scroll position
(function() {
    const STORAGE_KEY = 'resume-scroll-position';

    // Restore scroll position on page load
    window.addEventListener('load', () => {
        const savedPosition = sessionStorage.getItem(STORAGE_KEY);
        if (savedPosition && savedPosition !== '0') {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition, 10));
            }, 100);
        }
    });

    // Save scroll position before page unload
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem(STORAGE_KEY, window.scrollY.toString());
    });
})();

// Feature: Improved focus management
(function() {
    let isKeyboardNavigation = false;

    // Track keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            isKeyboardNavigation = true;
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Track mouse navigation
    document.addEventListener('mousedown', () => {
        isKeyboardNavigation = false;
        document.body.classList.remove('keyboard-navigation');
    });

    // Enhanced focus ring visibility
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px;
        }

        .keyboard-navigation .nav-link:focus,
        .keyboard-navigation .mobile-nav-link:focus {
            outline: 2px solid #3b82f6 !important;
            background-color: rgba(59, 130, 246, 0.1);
        }
    `;
    document.head.appendChild(style);
})();