document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
    let current = 0;
    let timer;

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('opacity-100', slideIndex === current);
            slide.classList.toggle('opacity-0', slideIndex !== current);
            slide.setAttribute('aria-hidden', slideIndex === current ? 'false' : 'true');
        });
        dots.forEach((dot, dotIndex) => {
            dot.setAttribute('aria-selected', dotIndex === current ? 'true' : 'false');
            dot.classList.toggle('bg-[#e4a17d]', dotIndex === current);
            dot.classList.toggle('bg-white/60', dotIndex !== current);
        });
    };

    const restartAutoplay = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(current + 1), 6000);
    };

    carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
        showSlide(current - 1);
        restartAutoplay();
    });

    carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
        showSlide(current + 1);
        restartAutoplay();
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.carouselDot));
            restartAutoplay();
        });
    });

    carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showSlide(current - 1);
        if (event.key === 'ArrowRight') showSlide(current + 1);
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') restartAutoplay();
    });

    carousel.tabIndex = 0;
    showSlide(0);
    restartAutoplay();
});
