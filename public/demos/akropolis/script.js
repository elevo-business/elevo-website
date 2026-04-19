/* ============================================
   AKROPOLIS — Consolidated JavaScript v2
   FIX: scrollRestoration + scrollTo for top cutoff
   ============================================ */

/* FIX: Seite startet IMMER oben — verhindert Top-Cutoff nach Refresh */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => { preloader.classList.add('hidden'); }, 1200);
    });
    // Fallback: Preloader nach 3s immer ausblenden
    setTimeout(() => { preloader.classList.add('hidden'); }, 3000);

    // --- Navigation scroll effect ---
    const nav = document.getElementById('nav');
    const handleNavScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll reveal animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.animationDelay;
                if (delay) {
                    const ms = parseFloat(delay) * 1000;
                    setTimeout(() => { entry.target.classList.add('visible'); }, ms);
                } else {
                    entry.target.classList.add('visible');
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Menu Slideshow ---
    const track = document.getElementById('slideshowTrack');
    const slides = document.querySelectorAll('.slideshow-slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const counterCurrent = document.querySelector('.slideshow-current');
    const slideshowEl = document.getElementById('menuSlideshow');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function goToSlide(n) {
        currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        if (counterCurrent) counterCurrent.textContent = currentSlide + 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    dots.forEach(dot => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
    });

    // Touch swipe
    let dragStartX = 0, dragDelta = 0, isDragging = false;

    if (slideshowEl) {
        slideshowEl.addEventListener('touchstart', (e) => {
            dragStartX = e.touches[0].clientX;
            isDragging = true;
            track.style.transition = 'none';
        }, { passive: true });

        slideshowEl.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            dragDelta = e.touches[0].clientX - dragStartX;
            const baseOffset = -currentSlide * 100;
            const dragPercent = (dragDelta / slideshowEl.offsetWidth) * 100;
            track.style.transform = `translateX(${baseOffset + dragPercent}%)`;
        }, { passive: true });

        slideshowEl.addEventListener('touchend', () => {
            isDragging = false;
            track.style.transition = 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            if (Math.abs(dragDelta) > 50) {
                if (dragDelta < 0) goToSlide(currentSlide + 1);
                else goToSlide(currentSlide - 1);
            } else {
                goToSlide(currentSlide);
            }
            dragDelta = 0;
        }, { passive: true });
    }

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
        if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    // --- Hero parallax (Desktop only) ---
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // --- Mobile floating CTA ---
    const mobileFloatCta = document.getElementById('mobileFloatCta');
    if (mobileFloatCta) {
        const handleFloatCta = () => {
            const scrollY = window.scrollY;
            const heroHeight = document.getElementById('hero')?.offsetHeight || 600;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            /* FIX: Mehr Abstand zum Footer-Ende damit Legal-Links sichtbar bleiben */
            const nearBottom = scrollY + winHeight > docHeight - 300;
            mobileFloatCta.classList.toggle('visible', scrollY > heroHeight * 0.7 && !nearBottom);
        };
        window.addEventListener('scroll', handleFloatCta, { passive: true });
        handleFloatCta();
    }

    // --- Active nav link highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--gold)';
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Scroll Progress Bar ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = percent + '%';
        }, { passive: true });
    }

    // ============================================
    // FLYING FOOD — Desktop only
    // ============================================
    if (window.innerWidth > 768) {
        const flyElements = [
            {
                el: document.getElementById('flyOlive'),
                startScroll: 0.08, endScroll: 0.30,
                startX: -200, endX: window.innerWidth + 200,
                startY: 0.25, endY: 0.15,
                rotation: 180, direction: 1
            },
            {
                el: document.getElementById('flyLemon'),
                startScroll: 0.25, endScroll: 0.48,
                startX: window.innerWidth + 160, endX: -200,
                startY: 0.60, endY: 0.35,
                rotation: -270, direction: -1
            },
            {
                el: document.getElementById('flyLaurel'),
                startScroll: 0.45, endScroll: 0.68,
                startX: -180, endX: window.innerWidth + 180,
                startY: 0.40, endY: 0.55,
                rotation: 200, direction: 1
            },
            {
                el: document.getElementById('flyHerb'),
                startScroll: 0.62, endScroll: 0.85,
                startX: window.innerWidth + 140, endX: -160,
                startY: 0.20, endY: 0.50,
                rotation: -240, direction: -1
            }
        ];

        let ticking = false;

        const updateFlyingFood = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            const vh = window.innerHeight;

            flyElements.forEach(item => {
                if (!item.el) return;
                const { startScroll, endScroll, startX, endX, startY, endY, rotation } = item;

                if (scrollPercent < startScroll || scrollPercent > endScroll) {
                    item.el.style.opacity = '0';
                    return;
                }

                const progress = (scrollPercent - startScroll) / (endScroll - startScroll);
                const eased = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                let opacity = 1;
                if (progress < 0.15) opacity = progress / 0.15;
                else if (progress > 0.85) opacity = (1 - progress) / 0.15;
                opacity = Math.min(1, Math.max(0, opacity)) * 0.7;

                const x = startX + (endX - startX) * eased;
                const y = (startY + (endY - startY) * eased) * vh;
                const rot = rotation * eased;
                const scale = 0.8 + 0.4 * Math.sin(progress * Math.PI);

                item.el.style.opacity = opacity;
                item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateFlyingFood);
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            flyElements[0].endX = w + 200;
            flyElements[1].startX = w + 160;
            flyElements[2].endX = w + 180;
            flyElements[3].startX = w + 140;
        });

        updateFlyingFood();
    }

});
