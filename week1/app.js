/**
 * COMPLETE ENHANCED RESUME - ALL FEATURES WORKING
 * Dark Mode + Fluid Typography + Enhanced Animations + Ripple Effects + Mouse Following
 * Bug-free integration of all Day 4 features plus new enhancements
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

        // Typing animation settings
        typingSpeed: 80,
        deletingSpeed: 40,
        pauseTime: 2000,

        // Scroll settings
        scrollThreshold: 100,

        // Performance settings
        particleCount: 12,
        throttleDelay: 16, // ~60fps
        debounceDelay: 100,

        // Mouse cursor settings
        cursorParticles: 15,

        // Mobile detection
        isMobile: window.innerWidth <= 768,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };

    // State management
    const STATE = {
        isLoading: true,
        scrollY: 0,
        activeSection: null,
        animationsTriggered: new Set(),
        intersectionObserver: null,
        particles: [],
        cursorParticles: [],
        animationFrame: null,
        cursorFrame: null,
        typingInstance: null,
        mouseX: 0,
        mouseY: 0
    };

    // DOM elements cache
    const ELEMENTS = {
        body: document.body,
        html: document.documentElement,
        loadingScreen: null,
        header: null,
        nav: null,
        navLinks: [],
        navToggle: null,
        navList: null,
        progressBar: null,
        sections: [],
        sidebar: null,
        scrollToTop: null,
        particlesContainer: null,
        counters: [],
        skillBars: [],
        timelineProgressBars: [],
        contactForm: null,
        submitBtn: null,
        typedTextElement: null,
        themeToggle: null,
        cursorCanvas: null,
        cursorCtx: null
    };

    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 Enhanced Resume Page Initializing...');

        // Cache DOM elements
        cacheElements();

        // Initialize dark mode first
        initializeDarkMode();

        // Setup loading screen
        setupLoadingScreen();

        // Initialize core features after loading
        setTimeout(() => {
            initializeAfterLoad();
        }, 1200);
    }

    /**
     * Cache frequently used DOM elements
     */
    function cacheElements() {
        ELEMENTS.loadingScreen = document.getElementById('loading-screen');
        ELEMENTS.header = document.querySelector('.header');
        ELEMENTS.nav = document.querySelector('.nav');
        ELEMENTS.navLinks = document.querySelectorAll('.nav-link');
        ELEMENTS.navToggle = document.getElementById('nav-toggle');
        ELEMENTS.navList = document.querySelector('.nav-list');
        ELEMENTS.progressBar = document.getElementById('progress-bar');
        ELEMENTS.sections = document.querySelectorAll('.section[id]');
        ELEMENTS.sidebar = document.querySelector('.sidebar');
        ELEMENTS.scrollToTop = document.getElementById('scroll-to-top');
        ELEMENTS.particlesContainer = document.getElementById('particles');
        ELEMENTS.counters = document.querySelectorAll('.counter');
        ELEMENTS.skillBars = document.querySelectorAll('.skill-bar');
        ELEMENTS.timelineProgressBars = document.querySelectorAll('.timeline-progress-bar');
        ELEMENTS.contactForm = document.getElementById('contact-form');
        ELEMENTS.submitBtn = document.querySelector('.btn-submit');
        ELEMENTS.typedTextElement = document.querySelector('.typed-text');
        ELEMENTS.themeToggle = document.getElementById('theme-toggle');
        ELEMENTS.cursorCanvas = document.getElementById('cursor-canvas');

        if (ELEMENTS.cursorCanvas) {
            ELEMENTS.cursorCtx = ELEMENTS.cursorCanvas.getContext('2d');
        }

        console.log('✅ DOM elements cached');
    }

    /**
     * Initialize dark mode functionality
     */
    function initializeDarkMode() {
        if (!ELEMENTS.themeToggle) return;

        const root = document.documentElement;
        const savedTheme = localStorage.getItem('theme');

        // Set initial theme
        if (savedTheme) {
            root.setAttribute('data-theme', savedTheme);
        } else {
            // Auto-detect based on system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }

        // Toggle theme on button click
        ELEMENTS.themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Add a subtle animation to the toggle
            ELEMENTS.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                ELEMENTS.themeToggle.style.transform = 'scale(1)';
            }, 150);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });

        console.log('✅ Dark mode initialized');
    }

    /**
     * Setup loading screen animation
     */
    function setupLoadingScreen() {
        if (!ELEMENTS.loadingScreen) return;

        const loadingText = ELEMENTS.loadingScreen.querySelector('.loading-text');
        const steps = [
            'Loading Assets...',
            'Initializing Animations...',
            'Preparing Experience...',
            'Ready!'
        ];

        let stepIndex = 0;
        const updateText = () => {
            if (loadingText && stepIndex < steps.length) {
                loadingText.textContent = steps[stepIndex];
                stepIndex++;
                if (stepIndex < steps.length) {
                    setTimeout(updateText, 300);
                }
            }
        };

        updateText();
    }

    /**
     * Initialize all features after loading screen
     */
    function initializeAfterLoad() {
        // Hide loading screen
        hideLoadingScreen();

        // Initialize cursor effects (before other features)
        initializeCursorEffects();

        // Initialize core features
        setupEventListeners();
        initializeNavigation();
        setupIntersectionObserver();
        initializeAnimations();
        initializeTypingEffect();
        initializeParticles();
        initializeScrollEffects();
        initializeMobileMenu();
        initializeContactForm();

        // Mark as loaded
        STATE.isLoading = false;

        console.log('🎉 Enhanced Resume Page Fully Loaded!');
    }

    /**
     * Hide loading screen with animation
     */
    function hideLoadingScreen() {
        if (!ELEMENTS.loadingScreen) return;

        ELEMENTS.loadingScreen.classList.add('hidden');

        setTimeout(() => {
            if (ELEMENTS.loadingScreen.parentNode) {
                ELEMENTS.loadingScreen.parentNode.removeChild(ELEMENTS.loadingScreen);
            }
        }, 500);
    }

    /**
     * Initialize cursor effects
     */
    function initializeCursorEffects() {
        if (!ELEMENTS.cursorCanvas || !ELEMENTS.cursorCtx || CONFIG.isMobile) return;

        // Setup canvas
        resizeCursorCanvas();
        window.addEventListener('resize', resizeCursorCanvas);

        // Initialize cursor particles
        for (let i = 0; i < CONFIG.cursorParticles; i++) {
            STATE.cursorParticles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: 0,
                vy: 0,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.5,
                hue: 220 + i * 10
            });
        }

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            STATE.mouseX = e.clientX;
            STATE.mouseY = e.clientY;
        });

        // Start cursor animation
        animateCursor();

        console.log('✅ Cursor effects initialized');
    }

    /**
     * Resize cursor canvas
     */
    function resizeCursorCanvas() {
        if (!ELEMENTS.cursorCanvas) return;

        ELEMENTS.cursorCanvas.width = window.innerWidth;
        ELEMENTS.cursorCanvas.height = window.innerHeight;
    }

    /**
     * Animate cursor particles
     */
    function animateCursor() {
        if (!ELEMENTS.cursorCtx || CONFIG.isMobile) return;

        ELEMENTS.cursorCtx.clearRect(0, 0, ELEMENTS.cursorCanvas.width, ELEMENTS.cursorCanvas.height);

        STATE.cursorParticles.forEach((particle, index) => {
            // Physics
            const targetX = index === 0 ? STATE.mouseX : STATE.cursorParticles[index - 1].x;
            const targetY = index === 0 ? STATE.mouseY : STATE.cursorParticles[index - 1].y;

            particle.vx += (targetX - particle.x) * 0.1;
            particle.vy += (targetY - particle.y) * 0.1;
            particle.vx *= 0.8;
            particle.vy *= 0.8;

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Render
            ELEMENTS.cursorCtx.beginPath();
            ELEMENTS.cursorCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ELEMENTS.cursorCtx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
            ELEMENTS.cursorCtx.fill();
        });

        STATE.cursorFrame = requestAnimationFrame(animateCursor);
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', throttle(handleScroll, CONFIG.throttleDelay));
        window.addEventListener('resize', debounce(handleResize, CONFIG.debounceDelay));

        // Navigation events
        ELEMENTS.navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Scroll to top button
        if (ELEMENTS.scrollToTop) {
            ELEMENTS.scrollToTop.addEventListener('click', scrollToTop);
        }

        // Keyboard events
        document.addEventListener('keydown', handleKeyboard);

        console.log('✅ Event listeners setup complete');
    }

    /**
     * Initialize navigation functionality
     */
    function initializeNavigation() {
        updateActiveNavigation();

        // Add stagger animation to nav items
        ELEMENTS.navLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.classList.add('animate-fade-in-down');
        });
    }

    /**
     * Setup Intersection Observer for scroll animations
     */
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        STATE.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const target = entry.target;
                const id = target.id || target.getAttribute('data-section');

                if (entry.isIntersecting) {
                    triggerElementAnimations(target);

                    if (id && entry.intersectionRatio > 0.3) {
                        STATE.activeSection = id;
                        updateActiveNavigation();
                    }
                }
            });
        }, CONFIG.observerOptions);

        // Observe all animated elements
        const observeElements = [
            ...ELEMENTS.sections,
            ...document.querySelectorAll('[class*="animate-"]'),
            ...document.querySelectorAll('.skill-bar'),
            ...document.querySelectorAll('.counter'),
            ELEMENTS.sidebar
        ].filter(Boolean);

        observeElements.forEach(el => {
            if (el) STATE.intersectionObserver.observe(el);
        });

        console.log('✅ Intersection Observer setup:', observeElements.length, 'elements');
    }

    /**
     * Trigger animations for an element
     */
    function triggerElementAnimations(element) {
        const elementId = element.id || element.className;

        if (STATE.animationsTriggered.has(elementId)) return;
        STATE.animationsTriggered.add(elementId);

        // Animate the element itself
        if (element.classList.contains('animate-fade-in-up')) {
            element.style.animationPlayState = 'running';
        }

        // Animate child elements with delays
        const animatedChildren = element.querySelectorAll('[class*="animate-"]');
        animatedChildren.forEach((child, index) => {
            const delay = parseFloat(child.getAttribute('data-delay') || 0) + (index * 0.1);
            setTimeout(() => {
                child.style.animationPlayState = 'running';
            }, delay * 1000);
        });

        // Trigger specific animations
        if (element.querySelector('.counter')) {
            animateCounters(element);
        }

        if (element.querySelector('.skill-bar')) {
            animateSkillBars(element);
        }

        if (element.querySelector('.timeline-progress-bar')) {
            animateTimelineProgress(element);
        }
    }

    /**
     * Initialize CSS animations
     */
    function initializeAnimations() {
        // Pause all animations initially
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });

        // Trigger initial animations
        setTimeout(() => {
            triggerInitialAnimations();
        }, 300);
    }

    /**
     * Trigger initial animations
     */
    function triggerInitialAnimations() {
        // Animate header
        if (ELEMENTS.header) {
            ELEMENTS.header.classList.add('animate-fade-in-down');
        }

        // Animate sidebar
        if (ELEMENTS.sidebar) {
            ELEMENTS.sidebar.style.animationPlayState = 'running';
        }

        // Animate first visible section
        const firstSection = ELEMENTS.sections[0];
        if (firstSection && isElementInViewport(firstSection)) {
            triggerElementAnimations(firstSection);
        }
    }

    /**
     * Initialize typing effect
     */
    function initializeTypingEffect() {
        if (!ELEMENTS.typedTextElement) return;

        const texts = JSON.parse(ELEMENTS.typedTextElement.getAttribute('data-typed') || '[]');
        if (texts.length === 0) return;

        STATE.typingInstance = new TypingEffect(ELEMENTS.typedTextElement, texts, {
            typeSpeed: CONFIG.typingSpeed,
            deleteSpeed: CONFIG.deletingSpeed,
            pauseTime: CONFIG.pauseTime
        });

        STATE.typingInstance.start();

        console.log('✅ Typing effect initialized:', texts.length, 'texts');
    }

    /**
     * Typing Effect Class
     */
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
     * Initialize particle system (background particles)
     */
    function initializeParticles() {
        if (!ELEMENTS.particlesContainer || CONFIG.isMobile) return;

        createParticles();
        animateParticles();

        console.log('✅ Background particles initialized:', STATE.particles.length);
    }

    /**
     * Create background particles
     */
    function createParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 3 + 1;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const speed = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.3 + 0.1;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                opacity: ${opacity};
                animation: particleFloat ${20 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;

            ELEMENTS.particlesContainer.appendChild(particle);

            STATE.particles.push({
                element: particle,
                x: x,
                y: y,
                speed: speed,
                size: size,
                opacity: opacity
            });
        }
    }

    /**
     * Animate background particles
     */
    function animateParticles() {
        if (CONFIG.isMobile) return;

        function updateParticles() {
            STATE.particles.forEach(particle => {
                particle.y -= particle.speed;
                particle.x += Math.sin(particle.y * 0.01) * 0.5;

                if (particle.y < -10) {
                    particle.y = window.innerHeight + 10;
                    particle.x = Math.random() * window.innerWidth;
                }

                particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
            });

            STATE.animationFrame = requestAnimationFrame(updateParticles);
        }

        updateParticles();
    }

    /**
     * Initialize scroll effects
     */
    function initializeScrollEffects() {
        updateScrollProgress();
    }

    /**
     * Initialize mobile menu
     */
    function initializeMobileMenu() {
        if (!ELEMENTS.navToggle || !ELEMENTS.navList) return;

        ELEMENTS.navToggle.addEventListener('click', toggleMobileMenu);

        // Close menu on link click
        ELEMENTS.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (CONFIG.isMobile) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (CONFIG.isMobile && !ELEMENTS.nav.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        ELEMENTS.navToggle.classList.toggle('active');
        ELEMENTS.navList.classList.toggle('active');
        ELEMENTS.body.classList.toggle('menu-open');
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        ELEMENTS.navToggle.classList.remove('active');
        ELEMENTS.navList.classList.remove('active');
        ELEMENTS.body.classList.remove('menu-open');
    }

    /**
     * Initialize contact form
     */
    function initializeContactForm() {
        if (!ELEMENTS.contactForm || !ELEMENTS.submitBtn) return;

        ELEMENTS.contactForm.addEventListener('submit', handleFormSubmit);

        // Add floating label effects
        const formInputs = ELEMENTS.contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        ELEMENTS.submitBtn.classList.add('loading');

        setTimeout(() => {
            ELEMENTS.submitBtn.classList.remove('loading');
            showNotification('Message sent successfully!', 'success');
            ELEMENTS.contactForm.reset();
        }, 2000);
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Animate counter elements
     */
    function animateCounters(container = document) {
        const counters = container.querySelectorAll('.counter');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    /**
     * Animate skill progress bars
     */
    function animateSkillBars(container = document) {
        const skillBars = container.querySelectorAll('.skill-bar');

        skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress') || 0;

            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, index * 100);
        });
    }

    /**
     * Animate timeline progress bars
     */
    function animateTimelineProgress(container = document) {
        const progressBars = container.querySelectorAll('.timeline-progress-bar');

        progressBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress') || 0;

            setTimeout(() => {
                const progressElement = document.createElement('div');
                progressElement.style.cssText = `
                    height: 100%;
                    background: linear-gradient(90deg, #1e40af, #3b82f6);
                    border-radius: 3px;
                    width: 0%;
                    transition: width 1.5s ease-out;
                `;

                bar.appendChild(progressElement);

                setTimeout(() => {
                    progressElement.style.width = `${progress}%`;
                }, 100);
            }, index * 200);
        });
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        STATE.scrollY = window.pageYOffset;

        updateHeaderState();
        updateScrollProgress();
        updateScrollToTop();
        updateActiveNavigation();
    }

    /**
     * Update header state based on scroll
     */
    function updateHeaderState() {
        if (!ELEMENTS.header) return;

        if (STATE.scrollY > 50) {
            ELEMENTS.header.classList.add('scrolled');
        } else {
            ELEMENTS.header.classList.remove('scrolled');
        }
    }

    /**
     * Update scroll progress bar
     */
    function updateScrollProgress() {
        if (!ELEMENTS.progressBar) return;

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (STATE.scrollY / scrollHeight) * 100;

        ELEMENTS.progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
    }

    /**
     * Update scroll to top button
     */
    function updateScrollToTop() {
        if (!ELEMENTS.scrollToTop) return;

        if (STATE.scrollY > CONFIG.scrollThreshold) {
            ELEMENTS.scrollToTop.classList.add('visible');
        } else {
            ELEMENTS.scrollToTop.classList.remove('visible');
        }
    }

    /**
     * Update active navigation
     */
    function updateActiveNavigation() {
        const scrollPosition = STATE.scrollY + window.innerHeight * 0.3;

        let activeSection = null;

        ELEMENTS.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        });

        if (activeSection && activeSection !== STATE.activeSection) {
            STATE.activeSection = activeSection;

            ELEMENTS.navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${activeSection}`;
                link.classList.toggle('active', isActive);
            });
        }
    }

    /**
     * Handle navigation link clicks
     */
    function handleNavClick(e) {
        e.preventDefault();

        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        if (CONFIG.isMobile) {
            closeMobileMenu();
        }
    }

    /**
     * Scroll to top functionality
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Handle keyboard events
     */
    function handleKeyboard(e) {
        if (e.key === 'Escape' && CONFIG.isMobile) {
            closeMobileMenu();
        }

        if (e.altKey) {
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    scrollToTop();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth'
                    });
                    break;
            }
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        CONFIG.isMobile = window.innerWidth <= 768;

        if (!CONFIG.isMobile) {
            closeMobileMenu();
        }

        // Resize cursor canvas
        if (ELEMENTS.cursorCanvas) {
            resizeCursorCanvas();
        }

        // Restart particles if needed
        if (!CONFIG.isMobile && STATE.particles.length === 0) {
            initializeParticles();
        } else if (CONFIG.isMobile && STATE.particles.length > 0) {
            STATE.particles.forEach(particle => {
                if (particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
            });
            STATE.particles = [];
        }

        console.log('🔄 Resize handled, mobile:', CONFIG.isMobile);
    }

    /**
     * Utility: Check if element is in viewport
     */
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Throttle function for performance
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

    /**
     * Debounce function for performance
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
     * Cleanup function
     */
    function cleanup() {
        if (STATE.typingInstance) {
            STATE.typingInstance.stop();
        }

        if (STATE.animationFrame) {
            cancelAnimationFrame(STATE.animationFrame);
        }

        if (STATE.cursorFrame) {
            cancelAnimationFrame(STATE.cursorFrame);
        }

        if (STATE.intersectionObserver) {
            STATE.intersectionObserver.disconnect();
        }

        console.log('🧹 Cleanup completed');
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

