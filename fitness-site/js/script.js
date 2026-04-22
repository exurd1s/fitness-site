// ===== PARTICLES SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 51, 102, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[j].x - p.x;
            const dy = particles[j].y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 51, 102, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    animationId = requestAnimationFrame(drawParticles);
}

// ===== PRELOADER =====
window.addEventListener('load', () => {
    resizeCanvas();
    createParticles();
    drawParticles();

    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1200);
});

window.addEventListener('resize', () => {
    resizeCanvas();
    // Сохраняем текущие частицы, только обновляем позиции за пределами экрана
    particles.forEach(p => {
        if (p.x > canvas.width) p.x = canvas.width - 10;
        if (p.y > canvas.height) p.y = canvas.height - 10;
    });
});

// ===== CUSTOM CURSOR (только на десктопе) =====
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursor.style.left = cursorX - 4 + 'px';
            cursor.style.top = cursorY - 4 + 'px';
            cursorFollower.style.left = followerX - 20 + 'px';
            cursorFollower.style.top = followerY - 20 + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover effects
        document.querySelectorAll('a, button, .magnetic, .magnetic-btn, .magnetic-social').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.width = '60px';
                cursorFollower.style.height = '60px';
                cursorFollower.style.opacity = '0.8';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
                cursorFollower.style.opacity = '0.5';
            });
        });
    }
}

// ===== MAGNETIC EFFECT =====
document.querySelectorAll('.magnetic, .magnetic-btn, .magnetic-social').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
});

// ===== RIPPLE EFFECT =====
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== АНИМАЦИЯ ЦИФР =====
function animateNumbers() {
    const numberElements = document.querySelectorAll('.stat-number, .achievement-number');

    numberElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        if (!target || el.classList.contains('animated')) return;

        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 60;
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                el.innerText = target + suffix;
                el.classList.add('animated');
            }
        };
        updateNumber();
    });
}

let numbersAnimated = false;
const achievementsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !numbersAnimated) {
            numbersAnimated = true;
            animateNumbers();
            achievementsObserver.unobserve(entry.target); // Исправление: убираем наблюдение
        }
    });
}, { threshold: 0.3 });

const achievementsSection = document.querySelector('.achievements');
if (achievementsSection) {
    achievementsObserver.observe(achievementsSection);
}

// Also animate hero stats immediately
setTimeout(() => {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        if (!target) return;
        let current = 0;
        const increment = target / 40;
        const update = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        update();
    });
}, 1500);

// ===== HEADER SCROLL =====
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU =====
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

// ===== MODAL =====
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close');

if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
}

if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
}

if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// ===== SMOOTH SCROLL =====
const scrollToProgramsBtn = document.getElementById('scrollToProgramsBtn');
if (scrollToProgramsBtn) {
    scrollToProgramsBtn.addEventListener('click', () => {
        document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
    });
}

const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
}

document.querySelectorAll('nav a, .footer-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===== PROGRAM & PRICE BUTTONS =====
document.querySelectorAll('.btn-card, .price-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
});

// ===== FORM HANDLING =====
document.querySelectorAll('#leadForm, #modalForm').forEach(form => {
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #ff3366, #ff6b35);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.4s ease;
            box-shadow: 0 8px 30px rgba(255, 51, 102, 0.4);
        `;
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Спасибо! Мы свяжемся с вами в ближайшее время.';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3000);

        form.reset();
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target); // Исправление: убираем наблюдение
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.about-card, .program-card, .price-card, .achievement-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(card);
});

// Stagger delay for cards
document.querySelectorAll('.about-grid, .programs-grid, .prices-grid, .achievements-grid').forEach(grid => {
    const cards = grid.children;
    Array.from(cards).forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
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

// ===== PARALLAX =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax'));
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});

// ===== TILT EFFECT (единая реализация через VanillaTilt) =====
class VanillaTilt {
    constructor(element, settings = {}) {
        this.element = element;
        this.settings = {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
            ...settings
        };
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.onMouseLeave());
        this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (this.settings.max / 2 - x * this.settings.max).toFixed(2);
        const tiltY = (y * this.settings.max - this.settings.max / 2).toFixed(2);

        this.element.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(1.02, 1.02, 1.02)`;
        this.element.style.transition = 'transform 0.1s ease';

        // Update shine position
        const shine = this.element.querySelector('.card-shine');
        if (shine) {
            shine.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.15) 0%, transparent 60%)`;
        }
    }

    onMouseLeave() {
        this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        this.element.style.transition = 'transform 0.5s ease';

        const shine = this.element.querySelector('.card-shine');
        if (shine) {
            shine.style.background = '';
        }
    }

    onMouseEnter() {
        this.element.style.transition = 'transform 0.1s ease';
    }
}

// Initialize tilt on cards (единая инициализация)
document.querySelectorAll('[data-tilt]').forEach(el => {
    new VanillaTilt(el);
});

// ===== TYPEWRITER EFFECT =====
const typewriterElement = document.querySelector('.typewriter');
if (typewriterElement) {
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            typewriterElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    setTimeout(type, 2000);
}

// ===== GLITCH TEXT EFFECT =====
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    const originalText = glitchText.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    glitchText.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            glitchText.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) return originalText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1/3;
        }, 30);
    });

    glitchText.addEventListener('mouseleave', () => {
        glitchText.textContent = originalText;
    });
}

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff3366, #ff6b35);
    z-index: 10001;
    transition: width 0.1s;
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    progressBar.style.width = progress + '%';
});

// ===== TEXT SCRAMBLE ON SCROLL =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span style="color: #ff3366">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble to section titles on scroll
document.querySelectorAll('.section-title').forEach(title => {
    const fx = new TextScramble(title);
    const originalText = title.innerText;
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                fx.setText(originalText);
                observer.unobserve(entry.target); // Исправление: убираем наблюдение
            }
        });
    }, { threshold: 0.5 });

    observer.observe(title);
});

// ===== SMOOTH REVEAL FOR HERO ELEMENTS =====
window.addEventListener('load', () => {
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-text, .hero-buttons, .hero-stats');
    heroElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 400 + i * 200);
    });
});

// ===== KEN BURNS EFFECT FOR HERO =====
const heroSection = document.querySelector('.hero');
if (heroSection) {
    let heroMouseX = 0;
    let heroMouseY = 0;
    let currentHeroX = 0;
    let currentHeroY = 0;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        heroMouseX = (e.clientX - rect.left) / rect.width - 0.5;
        heroMouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    function animateHeroParallax() {
        currentHeroX += (heroMouseX - currentHeroX) * 0.05;
        currentHeroY += (heroMouseY - currentHeroY) * 0.05;

        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, i) => {
            const speed = (i + 1) * 20;
            shape.style.transform = `translate(${currentHeroX * speed}px, ${currentHeroY * speed}px) scale(${1 + Math.abs(currentHeroX) * 0.1})`;
        });

        requestAnimationFrame(animateHeroParallax);
    }
    animateHeroParallax();
}

// ===== COUNTER ANIMATION WITH EASING =====
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const suffix = el.getAttribute('data-suffix') || '';

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.floor(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(update);
}

// ===== NEON FLICKER EFFECT =====
function addNeonFlicker() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes neonFlicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.95; }
            52% { opacity: 0.5; }
            54% { opacity: 0.95; }
            56% { opacity: 1; }
        }
        .neon-flicker {
            animation: neonFlicker 4s infinite;
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.gradient-text').forEach(el => {
        el.classList.add('neon-flicker');
    });
}
addNeonFlicker();

// ===== SOUND WAVE VISUALIZATION (CSS only trigger) =====
document.querySelectorAll('.program-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        const bars = card.querySelectorAll('.program-icon');
        bars.forEach((bar, i) => {
            bar.style.animation = `pulse-glow 1s ease ${i * 0.1}s infinite`;
        });
    });
});

// ===== INTERSECTION OBSERVER FOR STAGGERED ANIMATIONS =====
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, i) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, i * 100);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.about-grid, .programs-grid, .prices-grid').forEach(grid => {
    Array.from(grid.children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    staggerObserver.observe(grid);
});

// ===== HORIZONTAL SCROLL SNAP FOR MOBILE =====
if (window.innerWidth < 768) {
    document.querySelectorAll('.programs-grid, .prices-grid').forEach(grid => {
        grid.style.display = 'flex';
        grid.style.overflowX = 'auto';
        grid.style.scrollSnapType = 'x mandatory';
        grid.style.scrollbarWidth = 'none';
        grid.style.msOverflowStyle = 'none';

        grid.querySelectorAll('.program-card, .price-card').forEach(card => {
            card.style.flex = '0 0 85%';
            card.style.scrollSnapAlign = 'center';
        });
    });
}

// ===== LAZY LOAD IMAGES (if any added later) =====
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
    }, 250);
});

// Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        drawParticles();
    }
});

// ===== EXPORT FOR MODULE SUPPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VanillaTilt, TextScramble };
}