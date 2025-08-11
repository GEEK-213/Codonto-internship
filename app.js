// Cursor spotlight effect
const cursorSpotlight = document.getElementById('cursorSpotlight');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorSpotlight.style.left = mouseX + 'px';
    cursorSpotlight.style.top = mouseY + 'px';
    cursorSpotlight.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorSpotlight.style.opacity = '0';
});

// Smooth spotlight movement
function updateSpotlight() {
    cursorSpotlight.style.left = mouseX + 'px';
    cursorSpotlight.style.top = mouseY + 'px';
    requestAnimationFrame(updateSpotlight);
}
updateSpotlight();

// Navigation functionality
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll spy functionality
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Initialize navigation after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize scroll spy
    updateActiveNavLink();
});

window.addEventListener('scroll', updateActiveNavLink);

// Mobile navigation toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer) {
            navLinksContainer.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    });
}

// Tab switching functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        const targetPane = document.getElementById(tabId);
        if (targetPane) {
            targetPane.classList.add('active');
        }
        
        // Animate tab content
        const activePane = document.getElementById(tabId);
        if (activePane) {
            activePane.style.opacity = '0';
            activePane.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activePane.style.opacity = '1';
                activePane.style.transform = 'translateY(0)';
            }, 100);
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    // Add animation to cards with staggered delays
    const cards = document.querySelectorAll('.project-card, .certificate-card, .tech-card, .stat-card, .education-card, .contact-item, .experience-card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
});

// Button click handlers
function downloadResume() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = '#'; // In a real scenario, this would be the path to the resume file
    link.download = 'Faaris_Khan_Resume.pdf';
    
    // Show notification since we don't have an actual file
    showNotification('Resume download feature would be implemented with an actual PDF file.', 'info');
}

function downloadCV() {
    // Same as resume download
    const link = document.createElement('a');
    link.href = '#'; // In a real scenario, this would be the path to the CV file
    link.download = 'Faaris_Khan_CV.pdf';
    
    // Show notification since we don't have an actual file
    showNotification('CV download feature would be implemented with an actual PDF file.', 'info');
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const offsetTop = contactSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToProjects() {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        const offsetTop = portfolioSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function openDemo(projectType) {
    const demos = {
        chatbot: 'https://example.com/chatbot-demo',
        portfolio: 'https://example.com/portfolio-demo',
        seo: 'https://example.com/seo-dashboard-demo'
    };
    
    if (demos[projectType]) {
        // In a real scenario, this would open the actual demo
        showNotification(`Opening demo for ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} project...`, 'success');
        // window.open(demos[projectType], '_blank');
    }
}

function viewDetails(projectType) {
    const details = {
        chatbot: 'AI Chatbot built with Python, Natural Language Processing, and machine learning algorithms. Features include conversation memory, intent recognition, and response generation.',
        portfolio: 'Responsive portfolio website built with React, featuring modern design, smooth animations, and optimized performance. Includes project showcase, contact forms, and blog functionality.',
        seo: 'SEO Analytics Dashboard built with JavaScript and data visualization libraries. Tracks keyword rankings, website performance, and provides actionable insights for marketing teams.'
    };
    
    if (details[projectType]) {
        showModal(`${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Details`, details[projectType]);
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    const colors = {
        info: 'rgba(6, 182, 212, 0.9)',
        success: 'rgba(34, 197, 94, 0.9)',
        warning: 'rgba(245, 158, 11, 0.9)',
        error: 'rgba(239, 68, 68, 0.9)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function showModal(title, content) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'modal-content';
    modal.style.cssText = `
        background: rgba(24, 1, 52, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        color: white;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="margin: 0; font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${title}</h3>
            <button onclick="closeModal()" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; font-size: 1.2rem; cursor: pointer; padding: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">&times;</button>
        </div>
        <p style="line-height: 1.6; color: rgba(255, 255, 255, 0.8); margin: 0; font-size: 1rem;">${content}</p>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 100);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Store reference for closing
    window.currentModal = overlay;
}

function closeModal() {
    if (window.currentModal) {
        const overlay = window.currentModal;
        const modal = overlay.querySelector('.modal-content');
        
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            window.currentModal = null;
        }, 300);
    }
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.currentModal) {
        closeModal();
    }
});

// Enhanced scroll effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const speed = scrolled * 0.3;
        hero.style.transform = `translateY(${speed}px)`;
    }
    
    // Subtle transform effects to sections while scrolling
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && section.id !== 'hero') {
            const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
            section.style.transform = `translateY(${(1 - progress) * 10}px)`;
            section.style.opacity = Math.max(0.5, progress);
        }
    });
});

// Loading animation
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to my portfolio! 🚀', 'success');
    }, 1500);
});

// Enhanced hover effects for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card, .certificate-card, .tech-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 60px rgba(168, 85, 247, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'none';
        });
    });
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
    
    // Experience cards special hover effect
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.experience-icon');
            if (icon) {
                icon.style.transform = 'rotate(5deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.experience-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
});

// Add smooth scroll behavior for all internal anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Performance optimization: throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll-heavy functions
const throttledScrollHandler = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Faaris Khan Portfolio - Enhanced Version Loaded Successfully!');
    console.log('✨ Features: Smooth Scrolling, Scroll Spy, Mobile Navigation, Animations');
    
    // Add loading class to body for initial animations
    document.body.classList.add('loaded');
});

// Add mobile navigation styles and functionality
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 968px) {
        .nav-links {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: rgba(24, 1, 52, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-links.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);