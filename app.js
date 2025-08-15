/**
 * RESUME PAGE - DAY 4 ADVANCED JAVASCRIPT
 * Date: August 15, 2025 (Day 4 Complete - Advanced Animations & Interactions)
 * Student: Faaris Khan
 * Focus: Scroll animations, typed effects, particle system, micro-interactions
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Animation settings
        observerOptions: {
            threshold: [0.1, 0.3, 0.5, 0.7],
            rootMargin: '-50px 0px -50px 0px'
        },

        // Typing animation settings
        typingSpeed: 80,
        deletingSpeed: 40,
        pauseTime: 2000,

        // Scroll settings
        scrollThreshold: 100,
        progressThreshold: 0.1,

        // Performance settings
        particleCount: 15,
        throttleDelay: 16, // ~60fps
        debounceDelay: 100,

        // Mobile detection
        isMobile: window.innerWidth <= 768,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };

    // State management
    const STATE = {
        isLoading: true,
        scrollY: 0,
        isScrolling: false,
        activeSection: null,
        animationsTriggered: new Set(),
        intersectionObserver: null,
        particles: [],
        animationFrame: null,
        typingInstance: null
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
        typedTextElement: null
    };

    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 Day 4 Advanced Resume Page Initializing...');

        // Cache DOM elements
        cacheElements();

        // Setup loading screen
        setupLoadingScreen();

        // Initialize core features after loading
        setTimeout(() => {
            initializeAfterLoad();
        }, 1500);
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

        console.log('✅ DOM elements cached:', {
            sections: ELEMENTS.sections.length,
            navLinks: ELEMENTS.navLinks.length,
            counters: ELEMENTS.counters.length,
            skillBars: ELEMENTS.skillBars.length
        });
    }

    /**
     * Setup loading screen animation
     */
    function setupLoadingScreen() {
        if (!ELEMENTS.loadingScreen) return;

        // Simulate loading progress
        const loadingSteps = [
            { text: 'Loading Assets...', delay: 0 },
            { text: 'Initializing Animations...', delay: 500 },
            { text: 'Preparing Experience...', delay: 1000 },
            { text: 'Ready!', delay: 1400 }
        ];

        const loadingText = ELEMENTS.loadingScreen.querySelector('.loading-text');

        loadingSteps.forEach(step => {
            setTimeout(() => {
                if (loadingText) loadingText.textContent = step.text;
            }, step.delay);
        });
    }

    /**
     * Initialize all features after loading screen
     */
    function initializeAfterLoad() {
        // Hide loading screen
        hideLoadingScreen();

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

        console.log('🎉 Day 4 Resume Page Fully Loaded!');
        console.log('📊 Features initialized:', {
            animations: true,
            particles: !CONFIG.isMobile,
            typing: true,
            intersectionObserver: true,
            mobileMenu: CONFIG.isMobile
        });
    }

    /**
     * Hide loading screen with animation
     */
    function hideLoadingScreen() {
        if (!ELEMENTS.loadingScreen) return;

        ELEMENTS.loadingScreen.classList.add('hidden');

        // Remove from DOM after animation
        setTimeout(() => {
            if (ELEMENTS.loadingScreen.parentNode) {
                ELEMENTS.loadingScreen.parentNode.removeChild(ELEMENTS.loadingScreen);
            }
        }, 500);
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
        // Set initial active state
        updateActiveNavigation();

        // Add animation classes to nav items
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
                    // Trigger animations
                    triggerElementAnimations(target);

                    // Update active section
                    if (id && entry.intersectionRatio > 0.3) {
                        STATE.activeSection = id;
                        updateActiveNavigation();
                    }

                    // Trigger specific section animations
                    handleSectionIntersection(target, true);
                } else {
                    handleSectionIntersection(target, false);
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
     * Trigger animations for an element and its children
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

        // Trigger specific animations based on element type
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
     * Handle section-specific intersection events
     */
    function handleSectionIntersection(section, isEntering) {
        const sectionId = section.id;

        if (isEntering) {
            section.classList.add('section-active');

            // Section-specific animations
            switch (sectionId) {
                case 'about':
                    animateAboutStats();
                    break;
                case 'skills':
                    animateSkillTags();
                    break;
                case 'experience':
                    animateExperienceBadges();
                    break;
                case 'contact':
                    animateContactElements();
                    break;
            }
        } else {
            section.classList.remove('section-active');
        }
    }

    /**
     * Initialize CSS animations with JavaScript control
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
        }, 200);
    }

    /**
     * Trigger initial page load animations
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

        // Animate first section if visible
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
                // Finished typing, pause then start deleting
                speed = this.options.pauseTime;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                // Finished deleting, move to next text
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }

            this.currentCharIndex += this.isDeleting ? -1 : 1;

            this.timeoutId = setTimeout(() => this.type(), speed);
        }
    }

    /**
     * Initialize particle system
     */
    function initializeParticles() {
        if (!ELEMENTS.particlesContainer || CONFIG.isMobile) return;

        createParticles();
        animateParticles();

        console.log('✅ Particle system initialized:', STATE.particles.length, 'particles');
    }

    /**
     * Create particle elements
     */
    function createParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 3 + 1;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const speed = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.5 + 0.1;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                opacity: ${opacity};
                animation-duration: ${20 + Math.random() * 10}s;
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
     * Animate particles
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
        // Initialize progress bar
        updateScrollProgress();

        // Initialize parallax effects for non-mobile
        if (!CONFIG.isMobile) {
            initializeParallax();
        }
    }

    /**
     * Initialize parallax effects
     */
    function initializeParallax() {
        const parallaxElements = document.querySelectorAll('.card, .sidebar');

        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        }, CONFIG.throttleDelay));
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

        // Add loading state
        ELEMENTS.submitBtn.classList.add('loading');

        // Simulate form submission
        setTimeout(() => {
            ELEMENTS.submitBtn.classList.remove('loading');

            // Show success message
            showNotification('Message sent successfully!', 'success');

            // Reset form
            ELEMENTS.contactForm.reset();
        }, 2000);
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-${type === 'success' ? 'success' : 'primary'});
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
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
                bar.style.setProperty('--progress', `${progress}%`);
            }, index * 200);
        });
    }

    /**
     * Animate about section stats
     */
    function animateAboutStats() {
        const stats = document.querySelectorAll('.stat-item');

        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = 'translateY(0)';
                stat.style.opacity = '1';
            }, index * 200);
        });
    }

    /**
     * Animate skill tags
     */
    function animateSkillTags() {
        const skillTags = document.querySelectorAll('.skill-tag');

        skillTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(0)';
                tag.style.opacity = '1';
            }, index * 50);
        });
    }

    /**
     * Animate experience badges
     */
    function animateExperienceBadges() {
        const badges = document.querySelectorAll('.skill-badge');

        badges.forEach((badge, index) => {
            const delay = parseFloat(badge.getAttribute('data-delay') || 0) * 1000;

            setTimeout(() => {
                badge.style.animationPlayState = 'running';
            }, delay);
        });
    }

    /**
     * Animate contact elements
     */
    function animateContactElements() {
        const contactLinks = document.querySelectorAll('.contact-link.floating');

        contactLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.animationPlayState = 'running';
            }, index * 200);
        });
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        STATE.scrollY = window.pageYOffset;

        // Update header state
        updateHeaderState();

        // Update scroll progress
        updateScrollProgress();

        // Update scroll to top button
        updateScrollToTop();

        // Update active navigation
        updateActiveNavigation();

        // Handle scroll-based animations
        handleScrollAnimations();
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
     * Update scroll to top button visibility
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
     * Update active navigation based on scroll position
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
     * Handle scroll-based animations
     */
    function handleScrollAnimations() {
        // Add any scroll-based animation logic here
        if (!CONFIG.isMobile) {
            // Parallax effects are handled in initializeParallax
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

        // Close mobile menu if open
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
        // ESC key to close mobile menu
        if (e.key === 'Escape' && CONFIG.isMobile) {
            closeMobileMenu();
        }

        // Arrow key navigation
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
        // Update mobile detection
        CONFIG.isMobile = window.innerWidth <= 768;

        // Close mobile menu on desktop
        if (!CONFIG.isMobile) {
            closeMobileMenu();
        }

        // Restart particles if needed
        if (!CONFIG.isMobile && STATE.particles.length === 0) {
            initializeParticles();
        } else if (CONFIG.isMobile && STATE.particles.length > 0) {
            // Clear particles on mobile
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
     * Utility function to check if element is in viewport
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
        // Stop typing effect
        if (STATE.typingInstance) {
            STATE.typingInstance.stop();
        }

        // Stop particles animation
        if (STATE.animationFrame) {
            cancelAnimationFrame(STATE.animationFrame);
        }

        // Disconnect intersection observer
        if (STATE.intersectionObserver) {
            STATE.intersectionObserver.disconnect();
        }

        console.log('🧹 Cleanup completed');
    }

    /**
     * Debug utility (removed in production)
     */
    function enableDebugMode() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.resumeDebug = {
                state: STATE,
                config: CONFIG,
                elements: ELEMENTS,
                triggerElementAnimations,
                animateCounters,
                animateSkillBars,
                cleanup
            };

            console.log('🐛 Debug mode enabled. Use window.resumeDebug');
        }
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Enable debug mode in development
    enableDebugMode();

})();
