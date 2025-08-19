// Day 1: Tailwind Resume - JavaScript
// Keep functionality basic for Day 1, will expand in coming days

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Animation settings for future use
        scrollOffset: 100,
        transitionDuration: 300,

        // Debug mode
        debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    };

    // State management
    const STATE = {
        currentYear: new Date().getFullYear(),
        mobileMenuOpen: false,
        lastScrollY: 0
    };

    // DOM elements
    const ELEMENTS = {
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        navLinks: document.querySelectorAll('.nav-link'),
        currentYearSpan: document.getElementById('current-year'),
        header: document.querySelector('header'),
        menuOpenIcon: document.querySelector('.menu-open'),
        menuCloseIcon: document.querySelector('.menu-close')
    };

    /**
     * Initialize the application
     */
    function init() {
        if (CONFIG.debug) {
            console.log('🚀 Day 1: Tailwind Resume Initializing...');
        }

        // Set current year in footer
        setCurrentYear();

        // Setup event listeners
        setupEventListeners();

        // Initialize smooth scrolling
        setupSmoothScrolling();

        // Setup mobile menu
        setupMobileMenu();

        // Setup header scroll effect
        setupHeaderScrollEffect();

        if (CONFIG.debug) {
            console.log('✅ Day 1: Initialization complete');
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
        // Mobile menu toggle
        if (ELEMENTS.mobileMenuBtn) {
            ELEMENTS.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Scroll event for header effect
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Resize event
        window.addEventListener('resize', handleResize);

        // Navigation links
        ELEMENTS.navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
    }

    /**
     * Setup smooth scrolling for navigation
     */
    function setupSmoothScrolling() {
        // Already handled by CSS scroll-behavior: smooth
        // This is a placeholder for future enhancements
    }

    /**
     * Setup mobile menu functionality
     */
    function setupMobileMenu() {
        // Close mobile menu when clicking outside (placeholder for Day 2)
        document.addEventListener('click', (e) => {
            if (STATE.mobileMenuOpen && !ELEMENTS.mobileMenuBtn.contains(e.target)) {
                // Will implement mobile menu panel in Day 2
                if (CONFIG.debug) {
                    console.log('📱 Mobile menu: outside click detected');
                }
            }
        });
    }

    /**
     * Setup header scroll effects
     */
    function setupHeaderScrollEffect() {
        // Basic scroll effect - will enhance in Day 2
        handleScroll();
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Header background opacity based on scroll
        if (ELEMENTS.header) {
            if (currentScrollY > 50) {
                ELEMENTS.header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                ELEMENTS.header.style.backdropFilter = 'blur(10px)';
            } else {
                ELEMENTS.header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                ELEMENTS.header.style.backdropFilter = 'blur(4px)';
            }
        }

        // Update active navigation (basic version)
        updateActiveNavigation();

        STATE.lastScrollY = currentScrollY;
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 768 && STATE.mobileMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Handle navigation link clicks
     */
    function handleNavClick(e) {
        const href = e.target.getAttribute('href');

        // Only handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Smooth scroll to target
                const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active state
                updateActiveNavigation(targetId);

                // Close mobile menu if open
                if (STATE.mobileMenuOpen) {
                    closeMobileMenu();
                }

                if (CONFIG.debug) {
                    console.log(`🎯 Navigated to: ${targetId}`);
                }
            }
        }
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        if (STATE.mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        STATE.mobileMenuOpen = true;

        // Toggle icons
        if (ELEMENTS.menuOpenIcon && ELEMENTS.menuCloseIcon) {
            ELEMENTS.menuOpenIcon.classList.add('hidden');
            ELEMENTS.menuCloseIcon.classList.remove('hidden');
        }

        // Add visual feedback
        if (ELEMENTS.mobileMenuBtn) {
            ELEMENTS.mobileMenuBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ELEMENTS.mobileMenuBtn.style.transform = 'scale(1)';
            }, 150);
        }

        if (CONFIG.debug) {
            console.log('📱 Mobile menu: opened (panel will be added in Day 2)');
        }
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        STATE.mobileMenuOpen = false;

        // Toggle icons
        if (ELEMENTS.menuOpenIcon && ELEMENTS.menuCloseIcon) {
            ELEMENTS.menuOpenIcon.classList.remove('hidden');
            ELEMENTS.menuCloseIcon.classList.add('hidden');
        }

        if (CONFIG.debug) {
            console.log('📱 Mobile menu: closed');
        }
    }

    /**
     * Update active navigation state
     */
    function updateActiveNavigation(activeId = null) {
        if (!activeId) {
            // Determine active section based on scroll position
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + CONFIG.scrollOffset + 50;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeId = section.id;
                }
            });
        }

        // Update navigation links
        ELEMENTS.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${activeId}`;

            if (isActive) {
                link.style.color = '#2563eb'; // brand-600
                link.style.fontWeight = '600';
            } else {
                link.style.color = '#64748b'; // slate-500
                link.style.fontWeight = '500';
            }
        });
    }

    /**
     * Add hover effects to interactive elements
     */
    function addHoverEffects() {
        // Add hover effects to skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
            });

            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Add hover effects to stats cards
        const statCards = document.querySelectorAll('#about .grid > div');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Utility function to debounce events
     */
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
     * Utility function to throttle events
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add hover effects after load
    window.addEventListener('load', () => {
        addHoverEffects();

        if (CONFIG.debug) {
            console.log('🎉 Day 1: All features loaded successfully!');
            console.log('📈 Next: Day 2 will add dark mode, mobile menu panel, and enhanced animations');
        }
    });

    // Expose debug information in development
    if (CONFIG.debug) {
        window.resumeDebug = {
            CONFIG,
            STATE,
            ELEMENTS,
            functions: {
                toggleMobileMenu,
                updateActiveNavigation,
                handleScroll
            }
        };
        console.log('🐛 Debug mode enabled. Access window.resumeDebug for debugging tools.');
    }

})();

// Additional utilities for future days
class ResumeUtils {
    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            year: 'numeric'
        }).format(date);
    }

    static getScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }

    static isMobile() {
        return window.innerWidth < 768;
    }

    static preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}

// Make utilities available globally
window.ResumeUtils = ResumeUtils;