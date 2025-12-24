/**
 * Sobin E S - iOS Glassmorphism Portfolio
 * Enhanced scroll animations with left/right transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTimelineAnimations();
    initCardAnimations();
    initCounterAnimations();
    initParallaxEffect();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggle.querySelector('.material-icons-round');
            icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle?.querySelector('.material-icons-round');
            if (icon) icon.textContent = 'menu';

            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Timeline animations - Left/Right to Center
 * Experiences slide in from alternating sides in chronological order
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with a slight delay for staggered effect
                const item = entry.target;
                const index = Array.from(timelineItems).indexOf(item);

                setTimeout(() => {
                    item.classList.add('visible');

                    // Animate tech pills after card is visible
                    setTimeout(() => {
                        animateTechPills(item);
                    }, 400);
                }, index * 100); // Staggered delay based on position
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

/**
 * Animate tech pills from left and right
 */
function animateTechPills(container) {
    const pills = container.querySelectorAll('.tech-pill');

    pills.forEach((pill, index) => {
        setTimeout(() => {
            pill.classList.add('visible');
        }, index * 80);
    });
}

/**
 * Card animations for other sections
 */
function initCardAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-card, .skill-category, .cert-card, .contact-card, .stat-card'
    );

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const parent = el.parentElement;
                const siblings = parent ? Array.from(parent.children) : [el];
                const index = siblings.indexOf(el);

                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        cardObserver.observe(el);
    });
}

/**
 * Counter animations for stats
 */
function initCounterAnimations() {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValues = entry.target.querySelectorAll('.stat-value');
                statValues.forEach((stat, index) => {
                    if (!stat.dataset.animated) {
                        const target = parseInt(stat.dataset.target);
                        setTimeout(() => {
                            animateCounter(stat, target);
                        }, index * 200);
                        stat.dataset.animated = 'true';
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats').forEach(stats => {
        statObserver.observe(stats);
    });
}

/**
 * Animate a single counter with easing
 */
function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/**
 * Parallax effect for gradient orbs
 */
function initParallaxEffect() {
    const orbs = document.querySelectorAll('.gradient-orb');

    // Mouse parallax
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const x = mouseX * speed;
            const y = mouseY * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Scroll parallax for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.05;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/**
 * Add hover tilt effect to glass cards
 */
document.querySelectorAll('.timeline-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

/**
 * Typing effect for code block
 */
function initTypingEffect() {
    const codeBlock = document.querySelector('.code-block code');
    if (!codeBlock) return;

    const originalHTML = codeBlock.innerHTML;

    const contactObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            codeBlock.innerHTML = '';
            let i = 0;
            const speed = 15;

            function type() {
                if (i < originalHTML.length) {
                    codeBlock.innerHTML = originalHTML.substring(0, i + 1);
                    i++;
                    setTimeout(type, speed);
                }
            }

            setTimeout(type, 500);
            contactObserver.disconnect();
        }
    }, { threshold: 0.3 });

    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactObserver.observe(contactSection);
    }
}

// Initialize typing effect
initTypingEffect();

// Add glass shimmer effect on scroll
window.addEventListener('scroll', () => {
    const glassElements = document.querySelectorAll('.glass, .glass-strong, .timeline-card, .about-card');

    glassElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const shimmerPosition = scrollProgress * 100;
            el.style.setProperty('--shimmer-position', `${shimmerPosition}%`);
        }
    });
});

console.log('%c✨ iOS Glassmorphism Portfolio Loaded!', 'color: #7c3aed; font-weight: bold; font-size: 16px;');
console.log('%c🚀 Built by Sobin E S', 'color: #06b6d4; font-size: 12px;');
