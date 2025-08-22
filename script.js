// Simple Student Resume JavaScript
// Basic animations and interactions for a graduating student

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // BASIC CONFIGURATION
    // ========================================

    let isMenuOpen = false;
    let currentTheme = localStorage.getItem('theme') || 'light';

    // ========================================
    // THEME TOGGLE (Simple Light/Dark Mode)
    // ========================================

    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        // Apply saved theme
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }

        // Theme toggle click
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                currentTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', currentTheme);
            });
        }
    }

    // ========================================
    // MOBILE MENU (Simple Toggle)
    // ========================================

    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const menuOverlay = document.getElementById('mobile-menu-overlay');
        const menuClose = document.getElementById('mobile-menu-close');

        // Open menu
        if (menuBtn) {
            menuBtn.addEventListener('click', function() {
                isMenuOpen = true;
                menuOverlay.classList.remove('opacity-0', 'invisible');
                menuOverlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        }

        // Close menu
        function closeMenu() {
            isMenuOpen = false;
            menuOverlay.classList.remove('show');
            setTimeout(function() {
                menuOverlay.classList.add('opacity-0', 'invisible');
                document.body.style.overflow = '';
            }, 300);
        }

        if (menuClose) {
            menuClose.addEventListener('click', closeMenu);
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', function(e) {
                if (e.target === menuOverlay) {
                    closeMenu();
                }
            });
        }

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });
    }

    // ========================================
    // SMOOTH SCROLLING (Simple)
    // ========================================

    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    const headerHeight = 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // SCROLL PROGRESS BAR
    // ========================================

    function initScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');

        if (progressBar) {
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;

                progressBar.style.width = progress + '%';
            });
        }
    }

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================

    function initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');

        if (scrollBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            });

            // Scroll to top when clicked
            scrollBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ========================================
    // SIMPLE TYPING EFFECT
    // ========================================

    function initTypingEffect() {
        const typingElement = document.getElementById('typing-text');

        if (typingElement) {
            const texts = [
                'AI & ML Developer',
                'Full-Stack Engineer',
                'Problem Solver',
                'Tech Enthusiast'
            ];

            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function type() {
                const currentText = texts[textIndex];

                if (isDeleting) {
                    typingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;

                    if (charIndex === 0) {
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                        setTimeout(type, 500);
                        return;
                    }
                } else {
                    typingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;

                    if (charIndex === currentText.length) {
                        setTimeout(function() {
                            isDeleting = true;
                            type();
                        }, 2000);
                        return;
                    }
                }

                setTimeout(type, isDeleting ? 50 : 100);
            }

            type();
        }
    }

    // ========================================
    // COUNTER ANIMATION (Simple)
    // ========================================

    function animateCounters() {
        const counters = document.querySelectorAll('.counter-number');

        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 100; // Animate over ~100 steps

            const timer = setInterval(function() {
                current += increment;
                counter.textContent = Math.floor(current);

                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                }
            }, 20);
        });
    }

    // ========================================
    // SKILL BAR ANIMATION (Simple)
    // ========================================

    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');

        skillBars.forEach(function(bar, index) {
            const progress = bar.getAttribute('data-progress');

            setTimeout(function() {
                bar.style.width = progress + '%';
            }, index * 200);
        });
    }

    // ========================================
    // SCROLL REVEAL (Simple Fade In)
    // ========================================

    function initScrollReveal() {
        const elements = document.querySelectorAll('.fade-in-element');

        function checkScroll() {
            elements.forEach(function(element) {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');

                    // Trigger animations for specific sections
                    if (element.id === 'stats-section' && !element.classList.contains('animated')) {
                        element.classList.add('animated');
                        setTimeout(animateCounters, 500);
                    }

                    if (element.id === 'skills-section' && !element.classList.contains('animated')) {
                        element.classList.add('animated');
                        setTimeout(animateSkillBars, 500);
                    }
                }
            });
        }

        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Check on page load
    }

    // ========================================
    // CONTACT FORM (Simple)
    // ========================================

    function initContactForm() {
        const form = document.getElementById('contact-form');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Simple form validation
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !message) {
                    alert('Please fill in all required fields.');
                    return;
                }

                // Simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }

                // Show success message (simulate sending)
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(function() {
                    alert('Thank you! Your message has been sent. I\'ll get back to you soon.');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            });
        }
    }

    // ========================================
    // LOADING SCREEN (Simple)
    // ========================================

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');

        if (loadingScreen) {
            setTimeout(function() {
                loadingScreen.style.opacity = '0';
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500); // Show loading for 1.5 seconds
        }
    }

    // ========================================
    // SIMPLE PARTICLES (Optional - Very Basic)
    // ========================================

    function createSimpleParticles() {
        const container = document.getElementById('particles-container');

        if (container) {
            // Create only 10 simple particles for performance
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                // Random position and size
                const size = Math.random() * 4 + 2;
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(14, 165, 233, 0.6);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;

                container.appendChild(particle);
            }
        }
    }

    // ========================================
    // INITIALIZE EVERYTHING
    // ========================================

    function init() {
        console.log('🎓 Student Resume Loading...');

        // Initialize all components
        initTheme();
        initMobileMenu();
        initSmoothScroll();
        initScrollProgress();
        initScrollToTop();
        initTypingEffect();
        initScrollReveal();
        initContactForm();

        // Hide loading screen
        hideLoadingScreen();

        // Create simple particles (optional)
        createSimpleParticles();

        console.log('✅ Student Resume Ready!');
    }

    // Start initialization
    init();

    // Update current year in footer
    const yearElements = document.querySelectorAll('#current-year');
    yearElements.forEach(function(element) {
        element.textContent = new Date().getFullYear();
    });

});

// Add some simple CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    /* Simple animations that a student would write */
    .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }

    .fade-in-element.visible {
        opacity: 1;
        transform: translateY(0);
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }

    .particle {
        pointer-events: none;
    }

    #scroll-to-top {
        opacity: 0;
        visibility: hidden;
        transform: translateY(100px);
        transition: all 0.3s ease;
    }

    #scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .skill-bar {
        width: 0%;
        transition: width 1.5s ease-in-out;
    }

    #mobile-menu-overlay {
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    #mobile-menu-overlay.show {
        opacity: 1;
        visibility: visible;
    }

    #mobile-menu-panel {
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }

    #mobile-menu-overlay.show #mobile-menu-panel {
        transform: translateX(0);
    }

    /* Simple hover effects */
    .ultra-card:hover {
        transform: translateY(-5px);
        transition: transform 0.3s ease;
    }

    .social-link:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);