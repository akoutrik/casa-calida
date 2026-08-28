document.querySelectorAll('[data-hero-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-hero-slide]')];
    let current = 0;
    let timer;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === current);
            slide.setAttribute('aria-hidden', slideIndex === current ? 'false' : 'true');
        });
    };

    const stopAutoplay = () => window.clearInterval(timer);
    const restartAutoplay = () => {
        if (reducedMotion) return;
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(current + 1), 6000);
    };

    carousel.querySelector('[data-hero-prev]')?.addEventListener('click', () => {
        showSlide(current - 1);
        restartAutoplay();
    });

    carousel.querySelector('[data-hero-next]')?.addEventListener('click', () => {
        showSlide(current + 1);
        restartAutoplay();
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', restartAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', restartAutoplay);

    carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showSlide(current - 1);
        if (event.key === 'ArrowRight') showSlide(current + 1);
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') restartAutoplay();
    });

    showSlide(0);
    restartAutoplay();
});

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('#mobile-menu');
menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigatiemenu' : 'Sluit navigatiemenu');
    mobileMenu?.toggleAttribute('hidden', isOpen);
});

document.querySelector('[data-hero-scroll]')?.addEventListener('click', () => {
    document.querySelector('#over')?.scrollIntoView({ behavior: 'smooth' });
});
