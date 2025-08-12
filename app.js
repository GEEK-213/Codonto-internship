// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize intersection observer for fade-in animations
    initializeFadeInAnimations();
    
    // Add smooth scrolling to navigation links
    initializeSmoothScrolling();
    
    // Add active link highlighting
    initializeActiveNavigation();
});

/**
 * Initialize fade-in animations using Intersection Observer
 */
function initializeFadeInAnimations() {
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    
    // Configuration for intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    // Callback function for intersection observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Optionally unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create and start observing
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    fadeInSections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(this);
            }
        });
    });
}

/**
 * Initialize active navigation highlighting
 */
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    updateActiveNavigation(activeLink);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        navObserver.observe(section);
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavigation(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.style.color = '#666';
        link.style.fontWeight = '500';
    });
    
    activeLink.style.color = '#1e40af';
    activeLink.style.fontWeight = '700';
}

/**
 * Add hover effects to skill tags
 */
document.addEventListener('DOMContentLoaded', function() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.15)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

/**
 * Add subtle hover effects to experience and education items
 */
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.experience-item, .education-item');
    
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
});

/**
 * Handle mobile menu responsiveness
 */
function handleMobileNavigation() {
    const headerContent = document.querySelector('.header-content');
    const headerNav = document.querySelector('.header-nav');
    
    // Check if we need to adjust navigation based on screen size
    function adjustNavigation() {
        if (window.innerWidth <= 768) {
            headerContent.style.textAlign = 'center';
            headerNav.style.justifyContent = 'center';
        } else {
            headerContent.style.textAlign = '';
            headerNav.style.justifyContent = '';
        }
    }
    
    // Call on load and resize
    adjustNavigation();
    window.addEventListener('resize', adjustNavigation);
}

// Initialize mobile navigation handling
document.addEventListener('DOMContentLoaded', handleMobileNavigation);

/**
 * Add typing effect to the name in header (subtle enhancement)
 */
document.addEventListener('DOMContentLoaded', function() {
    const nameElement = document.querySelector('.header-name');
    const originalText = nameElement.textContent;
    
    // Add a subtle fade-in effect on page load
    nameElement.style.opacity = '0';
    nameElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        nameElement.style.transition = 'all 0.6s ease';
        nameElement.style.opacity = '1';
        nameElement.style.transform = 'translateY(0)';
    }, 100);
});

/**
 * Add scroll-to-top functionality (hidden by default, shows on scroll)
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll-to-top button
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.className = 'scroll-top-btn';
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1e40af;
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
    `;
    
    document.body.appendChild(scrollTopButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect
    scrollTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 16px rgba(30, 64, 175, 0.4)';
    });
    
    scrollTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.3)';
    });
});