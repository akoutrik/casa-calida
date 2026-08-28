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

const reviewForm = document.querySelector('[data-review-form]');
const reviewStatus = document.querySelector('[data-review-status]');
const ratingValue = document.querySelector('[data-rating-value]');
const ratingVotes = document.querySelector('[data-rating-votes]');
const ratingStars = [...document.querySelectorAll('[data-rating-star]')];
const ratingStorageKey = 'casa-calida-rating';
const ratingSessionKey = 'casa-calida-rating-submitted';

const readStoredItems = (key, fallback) => {
    try {
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

const rating = readStoredItems(ratingStorageKey, { total: 180, votes: 40 });
const hasRatedThisSession = window.sessionStorage.getItem(ratingSessionKey) === 'true';

const renderRating = () => {
    const average = rating.votes ? rating.total / rating.votes : 0;
    ratingValue.textContent = average.toFixed(1);
    ratingVotes.textContent = rating.votes;
    ratingStars.forEach((star) => {
        const starNumber = Number(star.dataset.ratingStar);
        const isFull = starNumber <= Math.floor(average);
        const isHalf = !isFull && starNumber === Math.ceil(average) && average % 1 >= 0.5;
        star.classList.toggle('text-[#3194d0]', isFull);
        star.classList.toggle('text-[#d9d2c8]', !isFull && !isHalf);
        star.classList.toggle('rating-star-half', isHalf);
    });
    ratingStars[0]?.parentElement?.setAttribute('aria-label', `Beoordeling: ${average.toFixed(1)} van 5 sterren`);
};

ratingStars.forEach((star) => {
    star.addEventListener('click', () => {
        if (window.sessionStorage.getItem(ratingSessionKey) === 'true') {
            reviewStatus.textContent = 'Je hebt in deze browsersessie al gestemd.';
            return;
        }
        const score = Number(star.dataset.ratingStar);
        rating.total += score;
        rating.votes += 1;
        window.localStorage.setItem(ratingStorageKey, JSON.stringify(rating));
        window.sessionStorage.setItem(ratingSessionKey, 'true');
        ratingStars.forEach((ratingStar) => {
            ratingStar.disabled = true;
            ratingStar.setAttribute('aria-disabled', 'true');
        });
        renderRating();
    });
});

reviewForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const name = String(formData.get('naam') || '').trim();
    const message = String(formData.get('bericht') || '').trim();
    if (!name || !message) return;

    reviewForm.reset();
    reviewStatus.textContent = 'Bedankt voor je reactie. Reacties worden zichtbaar zodra de backend is gekoppeld.';
});

if (reviewForm) {
    renderRating();
    if (hasRatedThisSession) {
        ratingStars.forEach((star) => {
            star.disabled = true;
            star.setAttribute('aria-disabled', 'true');
        });
    }
}
