/**
 * TAILWIND RESUME - ENHANCED JAVASCRIPT
 * Modern implementation with Tailwind CSS utilities
 * Features: Dark mode, animations, counters, typing effects, smooth interactions
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Animation settings
        observerOptions: {
            threshold: [0.1, 0.3, 0.5],
            rootMargin: '-50px 0px -50px 0px'
        },

        // Typing effect settings
        typingTexts: [
            "Aspiring AI Professional",
            "Web Development Enthusiast", 
            "BCA Final Year Student",
            "Innovation Seeker"
        ],
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseTime: 2000,

        // Performance settings
        scrollThreshold: 200,
        throttleDelay: 16,
        debounceDelay: 150,

        // Mobile detection
        isMobile: window.innerWidth <= 1024
    };

    // State management
    const STATE = {
        isLoading: true,
        scrollY: 0,
        activeSection: 'about',
        animationsTriggered: new Set(),
        isDarkMode: localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),

        // Animation instances
        typingInstance: null,
        intersectionObserver: null,
        cursorAnimation: null
    };

    // DOM elements cache
    const ELEMENTS = {
        html: document.documentElement,
        body: document.body,
        loadingScreen: document.getElementById('loading-screen'),
        themeToggle: document.getElementById('theme-toggle'),
        navToggle: document.getElementById('nav-toggle'),
        mobileNav: document.getElementById('mobile-nav'),
        navLinks: document.querySelectorAll('.nav-link'),
        mobileNavLinks: document.querySelectorAll('.nav-link-mobile'),
        progressBar: document.getElementById('progress-bar'),
        sections: document.querySelectorAll('.section'),
        counters: document.querySelectorAll('.counter'),
        skillBars: document.querySelectorAll('.skill-bar'),
        typedText: document.getElementById('typed-text'),
        contactForm: document.getElementById('contact-form'),
        scrollToTop: document.getElementById('scroll-to-top'),
        cursorCanvas: document.getElementById('cursor-canvas')
    };

    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 Tailwind Resume Initializing...');

        // Set initial theme
        setTheme(STATE.isDarkMode);

        // Setup event listeners
        setupEventListeners();

        // Initialize features after loading
        setTimeout(() => {
            hideLoadingScreen();
            initializeAfterLoad();
        }, 1200);
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Theme toggle
        if (ELEMENTS.themeToggle) {
            ELEMENTS.themeToggle.addEventListener('click', toggleTheme);
        }

        // Mobile navigation
        if (ELEMENTS.navToggle) {
            ELEMENTS.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links
        [...ELEMENTS.navLinks, ...ELEMENTS.mobileNavLinks].forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Scroll events
        window.addEventListener('scroll', throttle(handleScroll, CONFIG.throttleDelay));
        window.addEventListener('resize', debounce(handleResize, CONFIG.debounceDelay));

        // Scroll to top
        if (ELEMENTS.scrollToTop) {
            ELEMENTS.scrollToTop.addEventListener('click', scrollToTop);
        }

        // Contact form
        if (ELEMENTS.contactForm) {
            ELEMENTS.contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        console.log('✅ Event listeners setup complete');
    }

    /**
     * Initialize features after loading screen
     */
    function initializeAfterLoad() {
        // Initialize intersection observer
        setupIntersectionObserver();

        // Start animations
        animateCounters();
        animateSkillBars();
        initializeTypingEffect();

        // Initialize cursor effects (desktop only)
        if (!CONFIG.isMobile && ELEMENTS.cursorCanvas) {
            initializeCursorEffects();
        }

        // Update initial scroll state
        handleScroll();

        STATE.isLoading = false;
        console.log('🎉 Tailwind Resume Fully Loaded!');
    }

    /**
     * Hide loading screen with animation
     */
    function hideLoadingScreen() {
        if (!ELEMENTS.loadingScreen) return;

        ELEMENTS.loadingScreen.style.opacity = '0';
        ELEMENTS.loadingScreen.style.transform = 'scale(0.9)';

        setTimeout(() => {
            ELEMENTS.loadingScreen.style.display = 'none';
        }, 300);
    }

    /**
     * Theme management
     */
    function setTheme(isDark) {
        STATE.isDarkMode = isDark;

        if (isDark) {
            ELEMENTS.html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            ELEMENTS.html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    function toggleTheme() {
        setTheme(!STATE.isDarkMode);

        // Add feedback animation
        ELEMENTS.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            ELEMENTS.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Mobile menu management
     */
    function toggleMobileMenu() {
        const isOpen = !ELEMENTS.mobileNav.classList.contains('hidden');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        ELEMENTS.mobileNav.classList.remove('hidden');
        ELEMENTS.mobileNav.style.opacity = '0';
        ELEMENTS.mobileNav.style.transform = 'translateY(-10px)';

        // Update hamburger icon
        const openPath = ELEMENTS.navToggle.querySelector('.nav-open');
        const closePath = ELEMENTS.navToggle.querySelector('.nav-close');
        openPath.classList.add('hidden');
        closePath.classList.remove('hidden');

        // Animate in
        requestAnimationFrame(() => {
            ELEMENTS.mobileNav.style.opacity = '1';
            ELEMENTS.mobileNav.style.transform = 'translateY(0)';
        });
    }

    function closeMobileMenu() {
        ELEMENTS.mobileNav.style.opacity = '0';
        ELEMENTS.mobileNav.style.transform = 'translateY(-10px)';

        // Update hamburger icon
        const openPath = ELEMENTS.navToggle.querySelector('.nav-open');
        const closePath = ELEMENTS.navToggle.querySelector('.nav-close');
        openPath.classList.remove('hidden');
        closePath.classList.add('hidden');

        setTimeout(() => {
            ELEMENTS.mobileNav.classList.add('hidden');
        }, 200);
    }

    /**
     * Navigation handling
     */
    function handleNavClick(e) {
        e.preventDefault();

        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Smooth scroll to section
            const offsetTop = targetSection.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Update active navigation
            updateActiveNavigation(targetId);

            // Close mobile menu if open
            closeMobileMenu();
        }
    }

    function updateActiveNavigation(activeId = null) {
        if (!activeId) {
            // Determine active section based on scroll position
            const scrollPosition = window.scrollY + 100;

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

            // Update navigation links
            [...ELEMENTS.navLinks, ...ELEMENTS.mobileNavLinks].forEach(link => {
                const isActive = link.getAttribute('href') === `#${activeId}`;

                if (isActive) {
                    link.classList.add('active', 'text-brand', 'bg-brand/10');
                    link.classList.remove('text-slate-600', 'dark:text-slate-400');
                } else {
                    link.classList.remove('active', 'text-brand', 'bg-brand/10');
                    link.classList.add('text-slate-600', 'dark:text-slate-400');
                }
            });
        }
    }

    /**
     * Scroll handling
     */
    function handleScroll() {
        STATE.scrollY = window.scrollY;

        // Update progress bar
        updateScrollProgress();

        // Update scroll to top button
        updateScrollToTop();

        // Update active navigation
        updateActiveNavigation();

        // Update header transparency
        updateHeaderState();
    }

    function updateScrollProgress() {
        if (!ELEMENTS.progressBar) return;

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (STATE.scrollY / scrollHeight) * 100;

        ELEMENTS.progressBar.style.width = `${Math.min(Math.max(scrollProgress, 0), 100)}%`;
    }

    function updateScrollToTop() {
        if (!ELEMENTS.scrollToTop) return;

        const isVisible = STATE.scrollY > CONFIG.scrollThreshold;

        if (isVisible) {
            ELEMENTS.scrollToTop.classList.remove('opacity-0', 'invisible');
            ELEMENTS.scrollToTop.classList.add('opacity-100', 'visible');
        } else {
            ELEMENTS.scrollToTop.classList.add('opacity-0', 'invisible');
            ELEMENTS.scrollToTop.classList.remove('opacity-100', 'visible');
        }
    }

    function updateHeaderState() {
        const header = document.querySelector('header');
        if (!header) return;

        if (STATE.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            if (STATE.isDarkMode) {
                header.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
            }
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            if (STATE.isDarkMode) {
                header.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Counter animations
     */
    function animateCounters() {
        ELEMENTS.counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 1500;
            let current = 0;

            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = Math.floor(easeOutQuart * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            // Start animation with delay
            setTimeout(() => {
                requestAnimationFrame(updateCounter);
            }, index * 200);
        });
    }

    /**
     * Skill bar animations
     */
    function animateSkillBars() {
        ELEMENTS.skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress') || 0;

            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, index * 100 + 500); // Delay after page load
        });
    }

    /**
     * Typing effect
     */
    function initializeTypingEffect() {
        if (!ELEMENTS.typedText) return;

        STATE.typingInstance = new TypingEffect(ELEMENTS.typedText, CONFIG.typingTexts, {
            typeSpeed: CONFIG.typingSpeed,
            deleteSpeed: CONFIG.deletingSpeed,
            pauseTime: CONFIG.pauseTime
        });

        STATE.typingInstance.start();
        console.log('✅ Typing effect initialized');
    }

    class TypingEffect {
        constructor(element, texts, options = {}) {
            this.element = element;
            this.texts = texts;
            this.options = {
                typeSpeed: options.typeSpeed || 100,
                deleteSpeed: options.deleteSpeed || 50,
                pauseTime: options.pauseTime || 2000
            };

            this.currentTextIndex = 0;
            this.currentCharIndex = 0;
            this.isDeleting = false;
            this.timeoutId = null;
        }

        start() {
            this.type();
        }

        stop() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        }

        type() {
            const currentText = this.texts[this.currentTextIndex];
            const displayText = this.isDeleting
                ? currentText.substring(0, this.currentCharIndex - 1)
                : currentText.substring(0, this.currentCharIndex + 1);

            this.element.textContent = displayText;

            let speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

            if (!this.isDeleting && this.currentCharIndex === currentText.length) {
                speed = this.options.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }

            this.currentCharIndex += this.isDeleting ? -1 : 1;

            this.timeoutId = setTimeout(() => this.type(), speed);
        }
    }

    /**
     * Intersection Observer for scroll animations
     */
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        STATE.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const animationClass = target.classList.contains('animate-fade-in-up') ? 'animate-fade-in-up' :
                                         target.classList.contains('animate-slide-in-left') ? 'animate-slide-in-left' :
                                         'animate-fade-in';

                    // Trigger animation
                    target.style.opacity = '1';
                    target.style.transform = 'none';
                    target.classList.add(animationClass);
                }
            });
        }, CONFIG.observerOptions);

        // Observe sections
        ELEMENTS.sections.forEach(section => {
            STATE.intersectionObserver.observe(section);
        });

        console.log('✅ Intersection Observer setup');
    }

    /**
     * Cursor effects (desktop only)
     */
    function initializeCursorEffects() {
        if (!ELEMENTS.cursorCanvas) return;

        const canvas = ELEMENTS.cursorCanvas;
        const ctx = canvas.getContext('2d');

        // Setup canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Cursor particles
        const particles = [];
        const particleCount = 12;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: mouseX,
                y: mouseY,
                vx: 0,
                vy: 0,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                hue: 220 + i * 8
            });
        }

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animation loop
        function animateCursor() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                // Physics
                const targetX = index === 0 ? mouseX : particles[index - 1].x;
                const targetY = index === 0 ? mouseY : particles[index - 1].y;

                particle.vx += (targetX - particle.x) * 0.1;
                particle.vy += (targetY - particle.y) * 0.1;
                particle.vx *= 0.8;
                particle.vy *= 0.8;

                particle.x += particle.vx;
                particle.y += particle.vy;

                // Render
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
                ctx.fill();
            });

            STATE.cursorAnimation = requestAnimationFrame(animateCursor);
        }

        animateCursor();
        console.log('✅ Cursor effects initialized');
    }

    /**
     * Contact form handling
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = ELEMENTS.contactForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Hide loading state
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            submitBtn.disabled = false;

            // Show success message
            showNotification('Message sent successfully! 🎉', 'success');

            // Reset form
            ELEMENTS.contactForm.reset();
        }, 2000);
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-brand text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3500);
    }

    /**
     * Keyboard navigation
     */
    function handleKeyboard(e) {
        // Close mobile menu with Escape
        if (e.key === 'Escape') {
            closeMobileMenu();
        }

        // Toggle theme with T key
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            toggleTheme();
        }

        // Scroll to top with Home
        if (e.key === 'Home') {
            e.preventDefault();
            scrollToTop();
        }
    }

    /**
     * Window resize handling
     */
    function handleResize() {
        CONFIG.isMobile = window.innerWidth <= 1024;

        // Close mobile menu on desktop
        if (!CONFIG.isMobile) {
            closeMobileMenu();
        }

        console.log('🔄 Resize handled, mobile:', CONFIG.isMobile);
    }

    /**
     * Utility functions
     */
    function throttle(func, wait) {
        let timeout;
        let previous = 0;

        return function executedFunction(...args) {
            const now = Date.now();
            const remaining = wait - (now - previous);

            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(this, args);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    previous = Date.now();
                    timeout = null;
                    func.apply(this, args);
                }, remaining);
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
     * Cleanup function
     */
    function cleanup() {
        if (STATE.typingInstance) {
            STATE.typingInstance.stop();
        }

        if (STATE.cursorAnimation) {
            cancelAnimationFrame(STATE.cursorAnimation);
        }

        if (STATE.intersectionObserver) {
            STATE.intersectionObserver.disconnect();
        }

        console.log('🧹 Cleanup completed');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // System theme change detection
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // Debug mode for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.tailwindResumeDebug = {
            state: STATE,
            config: CONFIG,
            elements: ELEMENTS,
            functions: {
                animateCounters,
                animateSkillBars,
                setTheme,
                toggleTheme
            }
        };
        console.log('🐛 Debug mode enabled. Use window.tailwindResumeDebug');
    }

})();

/**
 * ENHANCEMENT SUMMARY:
 * 
 * ✅ Complete Tailwind CSS Integration
 * ✅ Modern Dark/Light Mode Toggle
 * ✅ Smooth Mobile Menu Animation
 * ✅ Enhanced Counter Animations
 * ✅ Advanced Typing Effect
 * ✅ Intersection Observer Scroll Animations
 * ✅ Cursor Particle Effects (Desktop)
 * ✅ Contact Form with Loading States
 * ✅ Keyboard Navigation Support
 * ✅ Responsive Design Optimization
 * ✅ Performance Optimizations
 * ✅ Accessibility Enhancements
 * ✅ Error Handling & Cleanup
 */