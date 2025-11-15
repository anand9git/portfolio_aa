'use strict';
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const sections = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function debounce(func, wait = 20) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        toggleMobileMenu();
    }
});

function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

function handleScrollTopButton() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}

window.addEventListener('scroll', debounce(handleScrollTopButton, 10));

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Trigger counter animation
            if (entry.target.classList.contains('about-stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateCounter(stat, target);
                });
            }
            
            // Trigger skill progress animation
            if (entry.target.classList.contains('skill-card')) {
                entry.target.classList.add('animate');
                entry.target.querySelectorAll('.skill-progress').forEach(bar => {
                    bar.style.width = bar.style.getPropertyValue('--width');
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos], .about-stats, .skill-card').forEach(el => {
    observer.observe(el);
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
    }
    
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    
    try {
        const mailtoLink = `mailto:aggarwalanand9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;
        
        window.location.href = mailtoLink;
        showFormStatus('Your email client has been opened! Thank you for reaching out.', 'success');
        contactForm.reset();
        
    } catch (error) {
        showFormStatus('Something went wrong. Please try again or email directly.', 'error');
    } finally {
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 1000);
    }
});

document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', function(e) {
        fetch(this.getAttribute('href'), { method: 'HEAD' })
            .catch(() => {
                e.preventDefault();
                alert('CV file not found. Please ensure the PDF file exists.');
            });
    });
});

let ticking = false;

function updateParallax() {
    const scrolled = window.scrollY;
    const decorations = document.querySelectorAll('.decoration-circle');
    
    decorations.forEach((decoration, index) => {
        const speed = 0.1 + (index * 0.05);
        decoration.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

function trapFocus(element) {
    const focusable = element.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

trapFocus(navMenu);

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log(
    '%c👋 Welcome to my portfolio! ',
    'background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;'
);

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    updateActiveNavLink();
    handleNavbarScroll();
    handleScrollTopButton();
    console.log('✅ Portfolio loaded successfully!');
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('scroll-behavior', 'auto');
    document.querySelectorAll('[data-aos]').forEach(el => el.removeAttribute('data-aos'));
}

async function updateVisitorCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/anandaggarwal-portfolio/visits');
        const data = await response.json();
        document.getElementById('visitorCount').textContent = data.value;
    } catch (error) {
        document.getElementById('visitorCount').textContent = '---';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Portfolio initialized');
    updateActiveNavLink();
    updateVisitorCount();
});
