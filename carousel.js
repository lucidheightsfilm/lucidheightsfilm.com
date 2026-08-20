/*
  ================================================================
  HERO CAROUSEL — shared by every page that shows a hero slideshow.

  Styles live in style.css under "HERO CAROUSEL".

  To use it on a page:
    1. Give the hero <div class="page-hero has-carousel">
    2. Drop in the carousel + lightbox markup (copy from an existing page)
    3. Call initHeroCarousel() with that page's photos:

       initHeroCarousel({
         photos:   [ '../assets/images/photo-1.jpg', ... ],
         altPrefix: 'Lucid Heights Film wedding photograph',
         interval:  5000   // optional, autoplay speed in milliseconds
       });
  ================================================================
*/

function initHeroCarousel(options) {
  const photos = options.photos || [];
  const altPrefix = options.altPrefix || 'Lucid Heights Film photograph';
  const interval = options.interval || 5000;

  const carousel = document.querySelector(options.carousel || '.hero-carousel');
  const lightbox = document.querySelector(options.lightbox || '.hero-lightbox');
  if (!carousel) return;

  const track = carousel.querySelector('.hero-carousel-track');
  const prevButton = carousel.querySelector('.hero-carousel-prev');
  const nextButton = carousel.querySelector('.hero-carousel-next');
  const toggleButton = carousel.querySelector('.hero-carousel-toggle');
  const pauseIcon = toggleButton.querySelector('.pause-icon');
  const playIcon = toggleButton.querySelector('.play-icon');
  const count = carousel.querySelector('.hero-carousel-count');
  const status = carousel.querySelector('.hero-carousel-status');

  const lightboxImage = lightbox.querySelector('.hero-lightbox-image');
  const lightboxClose = lightbox.querySelector('.hero-lightbox-close');
  const lightboxPrev = lightbox.querySelector('.hero-lightbox-prev');
  const lightboxNext = lightbox.querySelector('.hero-lightbox-next');

  if (!photos.length) {
    carousel.hidden = true;
    return;
  }

  let currentIndex = 0;
  let timer = null;
  let isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lightboxIndex = 0;
  let focusedBeforeLightbox = null;

  const slides = photos.map((src, index) => {
    const slide = document.createElement('figure');
    slide.className = `hero-slide${index === 0 ? ' is-active' : ''}`;
    slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

    const image = document.createElement('img');
    image.src = src;
    image.alt = `${altPrefix} ${index + 1}`;
    image.decoding = 'async';
    image.draggable = false;

    image.addEventListener('click', () => openLightbox(index));

    // Load the first image immediately; defer the rest until needed.
    if (index === 0) {
      image.fetchPriority = 'high';
      image.loading = 'eager';
    } else {
      image.loading = 'lazy';
    }

    image.addEventListener('error', () => {
      console.warn(`Carousel image could not be loaded: ${src}`);
    }, { once: true });

    slide.appendChild(image);
    track.appendChild(slide);
    return slide;
  });

  const preloadNext = () => {
    const nextImage = slides[(currentIndex + 1) % slides.length].querySelector('img');
    if (nextImage && !nextImage.complete) nextImage.loading = 'eager';
  };

  const updateControls = () => {
    count.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    status.textContent = `Showing photo ${currentIndex + 1} of ${slides.length}`;
    toggleButton.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
    toggleButton.setAttribute('aria-pressed', String(isPaused));
    pauseIcon.hidden = isPaused;
    playIcon.hidden = !isPaused;
  };

  const showSlide = (newIndex, restartAutoplay = true) => {
    slides[currentIndex].classList.remove('is-active');
    slides[currentIndex].setAttribute('aria-hidden', 'true');

    currentIndex = (newIndex + slides.length) % slides.length;

    slides[currentIndex].classList.add('is-active');
    slides[currentIndex].setAttribute('aria-hidden', 'false');
    updateControls();
    preloadNext();

    if (restartAutoplay && !isPaused) startAutoplay();
  };

  const stopAutoplay = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!isPaused && slides.length > 1 && !document.hidden) {
      timer = window.setInterval(() => showSlide(currentIndex + 1, false), interval);
    }
  };

  const updateLightboxImage = () => {
    lightboxImage.src = photos[lightboxIndex];
    lightboxImage.alt = `${altPrefix} ${lightboxIndex + 1}`;
  };

  const openLightbox = index => {
    lightboxIndex = index;
    focusedBeforeLightbox = document.activeElement;
    updateLightboxImage();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    stopAutoplay();
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');

    if (!isPaused) startAutoplay();
    focusedBeforeLightbox?.focus();
  };

  const showPreviousLightboxPhoto = () => {
    lightboxIndex = (lightboxIndex - 1 + photos.length) % photos.length;
    updateLightboxImage();
  };

  const showNextLightboxPhoto = () => {
    lightboxIndex = (lightboxIndex + 1) % photos.length;
    updateLightboxImage();
  };

  prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
  toggleButton.addEventListener('click', () => {
    isPaused = !isPaused;
    updateControls();
    isPaused ? stopAutoplay() : startAutoplay();
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPreviousLightboxPhoto);
  lightboxNext.addEventListener('click', showNextLightboxPhoto);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (event.key === 'ArrowRight') showSlide(currentIndex + 1);
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPreviousLightboxPhoto();
    if (event.key === 'ArrowRight') showNextLightboxPhoto();
  });

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  updateControls();
  preloadNext();
  startAutoplay();
}
