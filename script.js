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
const reviewList = document.querySelector('[data-review-list]');
const reviewCount = document.querySelector('[data-review-count]');
const reviewStatus = document.querySelector('[data-review-status]');
const ratingValue = document.querySelector('[data-rating-value]');
const ratingVotes = document.querySelector('[data-rating-votes]');
const ratingStars = [...document.querySelectorAll('[data-rating-star]')];
const reviewStorageKey = 'casa-calida-reviews';
const ratingStorageKey = 'casa-calida-rating';

const readStoredItems = (key, fallback) => {
    try {
        const stored = window.localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

const reviews = readStoredItems(reviewStorageKey, []);
const rating = readStoredItems(ratingStorageKey, { total: 160, votes: 40 });

const renderRating = () => {
    const average = rating.votes ? rating.total / rating.votes : 0;
    ratingValue.textContent = average.toFixed(1);
    ratingVotes.textContent = rating.votes;
    ratingStars.forEach((star) => {
        const isActive = Number(star.dataset.ratingStar) <= Math.round(average);
        star.classList.toggle('text-[#3194d0]', isActive);
        star.classList.toggle('text-[#d9d2c8]', !isActive);
    });
    ratingStars[0]?.parentElement?.setAttribute('aria-label', `Beoordeling: ${average.toFixed(1)} van 5 sterren`);
};

const renderReviews = () => {
    reviewCount.textContent = reviews.length;
    reviewList.replaceChildren();
    if (!reviews.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'text-sm text-[#6a7071]';
        emptyState.textContent = 'Nog geen reacties geplaatst.';
        reviewList.append(emptyState);
        return;
    }

    reviews.forEach((review) => {
        const item = document.createElement('article');
        item.className = 'border-l-2 border-[#3194d0] pl-4';
        const author = document.createElement('h4');
        author.className = 'font-bold text-[#373f43]';
        author.textContent = review.name;
        const message = document.createElement('p');
        message.className = 'mt-1 text-sm leading-6 text-[#6a7071]';
        message.textContent = review.message;
        item.append(author, message);
        reviewList.append(item);
    });
};

ratingStars.forEach((star) => {
    star.addEventListener('click', () => {
        const score = Number(star.dataset.ratingStar);
        rating.total += score;
        rating.votes += 1;
        window.localStorage.setItem(ratingStorageKey, JSON.stringify(rating));
        renderRating();
    });
});

reviewForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const name = String(formData.get('naam') || '').trim();
    const message = String(formData.get('bericht') || '').trim();
    if (!name || !message) return;

    reviews.push({ name, message });
    window.localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
    reviewForm.reset();
    reviewStatus.textContent = 'Bedankt voor je reactie.';
    renderReviews();
});

if (reviewForm) {
    renderRating();
    renderReviews();
}
