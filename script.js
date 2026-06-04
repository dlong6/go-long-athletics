/* ============================================================
   GO LONG ATHLETICS — Main Script
   ============================================================ */

'use strict';

// ── Sticky nav ──────────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger ────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Smooth anchor scroll (accounts for fixed header height) ─
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Footer year ─────────────────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ── Fade-in on scroll ────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

['.about-grid', '.contact-grid', '.section-header'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
});

// ── Hero Carousel ────────────────────────────────────────────
const heroCarouselTrack = document.getElementById('hero-carousel-track');
if (heroCarouselTrack) {
  const heroSlides = Array.from(heroCarouselTrack.querySelectorAll('.carousel-slide'));
  const heroDotsContainer = document.getElementById('hero-carousel-dots');
  const heroDots = heroDotsContainer ? Array.from(heroDotsContainer.querySelectorAll('.carousel-dot')) : [];
  const heroCaptionEl = document.getElementById('hero-carousel-caption');
  const heroCaptions = [
    'Aaron Rodgers',
    'Patrick Mahomes',
    'Drew Brees',
    'Aroldis Chapman',
    'Greg Maddux',
    'Tyler Rogers',
    'Coach Long',
  ];
  let heroCurrent = 0;

  function heroGoTo(index) {
    heroSlides[heroCurrent].classList.remove('active');
    if (heroDots[heroCurrent]) heroDots[heroCurrent].classList.remove('active');
    heroCurrent = (index + heroSlides.length) % heroSlides.length;
    heroSlides[heroCurrent].classList.add('active');
    if (heroDots[heroCurrent]) heroDots[heroCurrent].classList.add('active');
    if (heroCaptionEl) heroCaptionEl.textContent = heroCaptions[heroCurrent] || '';
  }

  const heroPrevBtn = document.getElementById('hero-carousel-prev');
  const heroNextBtn = document.getElementById('hero-carousel-next');

  let heroTimer;
  function resetHeroTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => heroGoTo(heroCurrent + 1), 6000);
  }

  if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => { heroGoTo(heroCurrent - 1); resetHeroTimer(); });
  if (heroNextBtn) heroNextBtn.addEventListener('click', () => { heroGoTo(heroCurrent + 1); resetHeroTimer(); });
  heroDots.forEach((dot, i) => dot.addEventListener('click', () => { heroGoTo(i); resetHeroTimer(); }));

  if (heroSlides.length <= 1) {
    const controls = heroCarouselTrack.closest('.hero-carousel-wrap').querySelector('.carousel-controls');
    if (controls) controls.style.display = 'none';
  } else {
    resetHeroTimer();
  }
}

// ── Photo Carousel ──────────────────────────────────────────
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
  const slides = Array.from(carouselTrack.querySelectorAll('.carousel-slide'));
  const dotsContainer = document.getElementById('carousel-dots');
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];
  const aboutCaptionEl = document.getElementById('about-carousel-caption');
  const aboutCaptions = [
    'Pocket Radar, for velocity tracking',
    'Drone, for aerial film analysis',
    'Lumebox, for portable red-light therapy',
    'J-Bands, for strength and flexibility',
    'Shoulder tube, for stability',
    'Psoas, for hip flexor mobility',
  ];
  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    if (aboutCaptionEl) aboutCaptionEl.textContent = aboutCaptions[current] || '';
  }

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  let aboutTimer;
  function resetAboutTimer() {
    clearInterval(aboutTimer);
    aboutTimer = setInterval(() => goTo(current + 1), 6000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAboutTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAboutTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAboutTimer(); }));

  if (slides.length > 1) {
    resetAboutTimer();
  }
}

// ── Contact Form ─────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');

if (contactForm) contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validateForm(contactForm)) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  try {
    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((val, key) => { data[key] = val; });
    const res  = await fetch(contactForm.getAttribute('action'), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      document.getElementById('contact-success').style.display = 'flex';
      contactForm.reset();
    } else {
      alert('There was a problem sending your message. Please try again.');
    }
  } catch {
    alert('Network error. Please check your connection and try again.');
  }

  submitBtn.disabled    = false;
  submitBtn.textContent = 'Send Message';
});

// ── Helpers ──────────────────────────────────────────────────
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
      field.classList.add('error');
      valid = false;
    }
  });
  if (!valid) {
    const firstError = form.querySelector('.error');
    if (firstError) firstError.focus();
  }
  return valid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showDemoSuccess(form, successId) {
  document.getElementById(successId).style.display = 'flex';
  form.reset();
  setTimeout(() => {
    const el = document.getElementById(successId);
    if (el) el.style.display = 'none';
  }, 6000);
}

document.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});
