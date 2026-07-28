/* ============================================================
   GO LONG ATHLETICS — Main Script
   ============================================================ */

'use strict';

// ── Sticky nav ──────────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Highlight Contact in nav when the contact section is in view.
const navContactLink = document.querySelector('.nav-links a[href="#contact"], .nav-cta[href="#contact"]');
const navHomeLink = document.querySelector('.nav-links a[href="#home"]');
const contactSection = document.getElementById('contact');

if (navContactLink && contactSection) {
  const contactNavObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      navContactLink.classList.toggle('active', entry.isIntersecting);
      if (navHomeLink) {
        navHomeLink.classList.toggle('active', !entry.isIntersecting);
      }
    });
  }, {
    root: null,
    threshold: 0.35,
    rootMargin: '-80px 0px -45% 0px'
  });

  contactNavObserver.observe(contactSection);
}

// ── Mobile hamburger ────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
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
}

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

// Resources page CTA should always navigate to Home contact (not local scroll behavior).
const resourceBookSessionBtn = document.getElementById('resource-book-session-btn');
if (resourceBookSessionBtn) {
  resourceBookSessionBtn.addEventListener('click', e => {
    e.preventDefault();
    window.location.assign('index.html#contact');
  });
}

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
    'Coach Long',
    'Greg Maddux',
    'Tyler Rogers',
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

// ── Resources tables (filter + sort) ──────────────────────
function initResourceTable(resourceBlock) {
  const resourceTable = resourceBlock.querySelector('.resource-table');
  if (!resourceTable) return;

  const resourceSearchInput = resourceBlock.querySelector('.resource-search-input');
  const sportFilterTrigger = resourceBlock.querySelector('.resource-sport-filter-trigger');
  const sourceFilterTrigger = resourceBlock.querySelector('.resource-source-filter-trigger');
  const keywordFilterTrigger = resourceBlock.querySelector('.resource-keyword-filter-trigger');
  const sportFilterModal = resourceBlock.querySelector('#sport-filter-modal');
  const sourceFilterModal = resourceBlock.querySelector('#source-filter-modal');
  const keywordFilterModal = resourceBlock.querySelector('#keyword-filter-modal');
  const sportFilterDone = resourceBlock.querySelector('.resource-sport-filter-done');
  const sourceFilterDone = resourceBlock.querySelector('.resource-source-filter-done');
  const keywordFilterDone = resourceBlock.querySelector('.resource-keyword-filter-done');
  const sportFilterClear = resourceBlock.querySelector('.resource-sport-filter-clear');
  const sourceFilterClear = resourceBlock.querySelector('.resource-source-filter-clear');
  const keywordFilterClear = resourceBlock.querySelector('.resource-keyword-filter-clear');
  const resourceTbody = resourceTable.querySelector('tbody');
  const dateSortHeader = resourceTable.querySelector('.resource-sort-header[data-sort-key="date"]');
  const sportSortHeader = resourceTable.querySelector('.resource-sort-header[data-sort-key="sport"]');
  const sourceSortHeader = resourceTable.querySelector('.resource-sort-header[data-sort-key="source"]');
  const keywordSortHeader = resourceTable.querySelector('.resource-sort-header[data-sort-key="keywords"]');
  const sortableHeaders = Array.from(resourceTable.querySelectorAll('.resource-sort-header[data-sort-key]'));
  const sportFilterCard = sportFilterModal ? sportFilterModal.querySelector('.resource-filter-modal-card') : null;
  const sourceFilterCard = sourceFilterModal ? sourceFilterModal.querySelector('.resource-filter-modal-card') : null;
  const keywordFilterCard = keywordFilterModal ? keywordFilterModal.querySelector('.resource-filter-modal-card') : null;
  const sportCheckboxes = Array.from(resourceBlock.querySelectorAll('.sport-filter-checkbox'));
  const sourceCheckboxes = Array.from(resourceBlock.querySelectorAll('.source-filter-checkbox'));
  const keywordFilterOptions = keywordFilterModal ? keywordFilterModal.querySelector('.resource-keyword-filter-options') : null;
  const selectedSports = new Set(
    sportCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
  );
  const selectedSources = new Set(
    sourceCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
  );
  const selectedKeywords = new Set();
  let keywordCheckboxes = [];
  let keywordOptions = [];
  let currentSort = { key: 'date', direction: 'desc' };

  function parseDate(dateText) {
    const timestamp = Date.parse(dateText);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function parseKeywords(value) {
    return value
      .split(',')
      .map(keyword => keyword.trim())
      .filter(Boolean);
  }

  function rowKeywords(row) {
    const sourceValue = row.dataset.keywords || (row.cells[4] ? row.cells[4].textContent : '') || '';
    return parseKeywords(sourceValue);
  }

  function buildKeywordFilterOptions() {
    if (!keywordFilterOptions) return;

    const keywordSet = new Set();
    Array.from(resourceTbody.rows).forEach(row => {
      rowKeywords(row).forEach(keyword => keywordSet.add(keyword));
    });

    keywordOptions = Array.from(keywordSet).sort((a, b) => a.localeCompare(b));
    keywordFilterOptions.innerHTML = '';

    keywordOptions.forEach(keyword => {
      const label = document.createElement('label');
      label.className = 'resource-checkbox-row';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'keyword-filter-checkbox';
      checkbox.value = keyword;
      checkbox.checked = true;

      const text = document.createElement('span');
      text.textContent = keyword;

      label.appendChild(checkbox);
      label.appendChild(text);
      keywordFilterOptions.appendChild(label);
    });

    keywordCheckboxes = Array.from(resourceBlock.querySelectorAll('.keyword-filter-checkbox'));
    selectedKeywords.clear();
    keywordOptions.forEach(keyword => selectedKeywords.add(keyword));
  }

  function applyFilters() {
    const searchValue = resourceSearchInput ? resourceSearchInput.value.trim().toLowerCase() : '';

    Array.from(resourceTbody.rows).forEach(row => {
      const rowSport = row.dataset.sport || '';
      const rowSource = row.dataset.source || '';
      const rowKeywordValues = rowKeywords(row);
      const sportMatch = selectedSports.has(rowSport);
      const sourceMatch = selectedSources.has(rowSource);
      const keywordMatch = selectedKeywords.size === 0
        ? rowKeywordValues.length === 0
        : rowKeywordValues.some(keyword => selectedKeywords.has(keyword));
      const textMatch = !searchValue || row.textContent.toLowerCase().includes(searchValue);
      row.style.display = sportMatch && sourceMatch && keywordMatch && textMatch ? '' : 'none';
    });
  }

  function setFilterIndicator(trigger, selectedSet, optionsLength, labelBase) {
    if (!trigger) return;
    const activeCount = selectedSet.size;
    const isFiltered = activeCount > 0 && activeCount < optionsLength;
    trigger.classList.toggle('active', isFiltered);
    trigger.setAttribute('aria-label', isFiltered
      ? `${labelBase} (${activeCount} selected)`
      : labelBase);
  }

  function syncSelectionFromCheckboxes() {
    selectedSports.clear();
    sportCheckboxes.forEach(checkbox => {
      if (checkbox.checked) selectedSports.add(checkbox.value);
    });

    selectedSources.clear();
    sourceCheckboxes.forEach(checkbox => {
      if (checkbox.checked) selectedSources.add(checkbox.value);
    });

    selectedKeywords.clear();
    keywordCheckboxes.forEach(checkbox => {
      if (checkbox.checked) selectedKeywords.add(checkbox.value);
    });

    setFilterIndicator(sportFilterTrigger, selectedSports, sportCheckboxes.length, 'Open sport filter');
    setFilterIndicator(sourceFilterTrigger, selectedSources, sourceCheckboxes.length, 'Open source filter');
    setFilterIndicator(keywordFilterTrigger, selectedKeywords, keywordOptions.length, 'Open keyword filter');
    applyFilters();
  }

  function positionFilterModal(modalEl, triggerEl, cardEl) {
    if (!modalEl || !triggerEl || !cardEl) return;
    const triggerRect = triggerEl.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();
    const cardWidth = cardRect.width || 280;
    const cardHeight = cardRect.height || 210;
    const top = Math.max(88, triggerRect.top - cardHeight - 10);
    const left = Math.min(
      window.innerWidth - cardWidth - 12,
      Math.max(12, triggerRect.left + (triggerRect.width / 2) - (cardWidth / 2))
    );

    modalEl.style.top = `${Math.round(top)}px`;
    modalEl.style.left = `${Math.round(left)}px`;
  }

  function openSportModal() {
    if (!sportFilterModal || !sportFilterTrigger) return;
    sportFilterModal.hidden = false;
    sportFilterTrigger.setAttribute('aria-expanded', 'true');
    positionFilterModal(sportFilterModal, sportFilterTrigger, sportFilterCard);
  }

  function closeSportModal() {
    if (!sportFilterModal || !sportFilterTrigger) return;
    sportFilterModal.hidden = true;
    sportFilterTrigger.setAttribute('aria-expanded', 'false');
  }

  function openSourceModal() {
    if (!sourceFilterModal || !sourceFilterTrigger) return;
    sourceFilterModal.hidden = false;
    sourceFilterTrigger.setAttribute('aria-expanded', 'true');
    positionFilterModal(sourceFilterModal, sourceFilterTrigger, sourceFilterCard);
  }

  function closeSourceModal() {
    if (!sourceFilterModal || !sourceFilterTrigger) return;
    sourceFilterModal.hidden = true;
    sourceFilterTrigger.setAttribute('aria-expanded', 'false');
  }

  function openKeywordModal() {
    if (!keywordFilterModal || !keywordFilterTrigger) return;
    keywordFilterModal.hidden = false;
    keywordFilterTrigger.setAttribute('aria-expanded', 'true');
    positionFilterModal(keywordFilterModal, keywordFilterTrigger, keywordFilterCard);
  }

  function closeKeywordModal() {
    if (!keywordFilterModal || !keywordFilterTrigger) return;
    keywordFilterModal.hidden = true;
    keywordFilterTrigger.setAttribute('aria-expanded', 'false');
  }

  function setSortIndicator(key, direction) {
    sortableHeaders.forEach(header => {
      header.removeAttribute('data-sort-direction');
    });
    const target = resourceTable.querySelector(`.resource-sort-header[data-sort-key="${key}"]`);
    if (target) target.setAttribute('data-sort-direction', direction);
  }

  function sortRows(key, direction) {
    const rows = Array.from(resourceTbody.rows);
    rows.sort((a, b) => {
      if (key === 'sport') {
        const sportA = (a.dataset.sport || '').toLowerCase();
        const sportB = (b.dataset.sport || '').toLowerCase();
        const compare = sportA.localeCompare(sportB);
        if (compare !== 0) return direction === 'asc' ? compare : -compare;

        const dateA = parseDate(a.dataset.date || '');
        const dateB = parseDate(b.dataset.date || '');
        return dateB - dateA;
      }

      if (key === 'source') {
        const sourceA = (a.dataset.source || '').toLowerCase();
        const sourceB = (b.dataset.source || '').toLowerCase();
        const compare = sourceA.localeCompare(sourceB);
        if (compare !== 0) return direction === 'asc' ? compare : -compare;

        const dateA = parseDate(a.dataset.date || '');
        const dateB = parseDate(b.dataset.date || '');
        return dateB - dateA;
      }

      if (key === 'keywords') {
        const keywordsA = rowKeywords(a).join(', ').toLowerCase();
        const keywordsB = rowKeywords(b).join(', ').toLowerCase();
        const compare = keywordsA.localeCompare(keywordsB);
        if (compare !== 0) return direction === 'asc' ? compare : -compare;

        const dateA = parseDate(a.dataset.date || '');
        const dateB = parseDate(b.dataset.date || '');
        return dateB - dateA;
      }

      const dateA = parseDate(a.dataset.date || '');
      const dateB = parseDate(b.dataset.date || '');
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });

    rows.forEach(row => resourceTbody.appendChild(row));
    applyFilters();
  }

  if (dateSortHeader) {
    dateSortHeader.addEventListener('click', () => {
      const nextDirection = currentSort.key === 'date' && currentSort.direction === 'asc' ? 'desc' : 'asc';
      currentSort = { key: 'date', direction: nextDirection };
      setSortIndicator('date', nextDirection);
      sortRows('date', nextDirection);
    });
  }

  if (sportSortHeader) {
    sportSortHeader.addEventListener('click', () => {
      const nextDirection = currentSort.key === 'sport' && currentSort.direction === 'asc' ? 'desc' : 'asc';
      currentSort = { key: 'sport', direction: nextDirection };
      setSortIndicator('sport', nextDirection);
      sortRows('sport', nextDirection);
    });
  }

  if (sourceSortHeader) {
    sourceSortHeader.addEventListener('click', () => {
      const nextDirection = currentSort.key === 'source' && currentSort.direction === 'asc' ? 'desc' : 'asc';
      currentSort = { key: 'source', direction: nextDirection };
      setSortIndicator('source', nextDirection);
      sortRows('source', nextDirection);
    });
  }

  if (keywordSortHeader) {
    keywordSortHeader.addEventListener('click', () => {
      const nextDirection = currentSort.key === 'keywords' && currentSort.direction === 'asc' ? 'desc' : 'asc';
      currentSort = { key: 'keywords', direction: nextDirection };
      setSortIndicator('keywords', nextDirection);
      sortRows('keywords', nextDirection);
    });
  }

  if (resourceSearchInput) {
    resourceSearchInput.addEventListener('input', applyFilters);
  }

  if (sportFilterTrigger) {
    sportFilterTrigger.addEventListener('click', openSportModal);
  }

  if (sourceFilterTrigger) {
    sourceFilterTrigger.addEventListener('click', openSourceModal);
  }

  if (keywordFilterTrigger) {
    keywordFilterTrigger.addEventListener('click', openKeywordModal);
  }

  if (sportFilterDone) {
    sportFilterDone.addEventListener('click', closeSportModal);
  }

  if (sourceFilterDone) {
    sourceFilterDone.addEventListener('click', closeSourceModal);
  }

  if (keywordFilterDone) {
    keywordFilterDone.addEventListener('click', closeKeywordModal);
  }

  if (sportFilterClear) {
    sportFilterClear.addEventListener('click', () => {
      sportCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
      syncSelectionFromCheckboxes();
    });
  }

  if (sourceFilterClear) {
    sourceFilterClear.addEventListener('click', () => {
      sourceCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
      syncSelectionFromCheckboxes();
    });
  }

  if (keywordFilterClear) {
    keywordFilterClear.addEventListener('click', () => {
      keywordCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
      syncSelectionFromCheckboxes();
    });
  }

  sportCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', syncSelectionFromCheckboxes);
  });

  sourceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', syncSelectionFromCheckboxes);
  });

  function bindKeywordCheckboxEvents() {
    keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', syncSelectionFromCheckboxes);
    });
  }

  buildKeywordFilterOptions();
  bindKeywordCheckboxEvents();

  window.addEventListener('resize', () => {
    if (sportFilterModal && !sportFilterModal.hidden) {
      positionFilterModal(sportFilterModal, sportFilterTrigger, sportFilterCard);
    }
    if (sourceFilterModal && !sourceFilterModal.hidden) {
      positionFilterModal(sourceFilterModal, sourceFilterTrigger, sourceFilterCard);
    }
    if (keywordFilterModal && !keywordFilterModal.hidden) {
      positionFilterModal(keywordFilterModal, keywordFilterTrigger, keywordFilterCard);
    }
  });

  document.addEventListener('click', e => {
    if (sportFilterModal && !sportFilterModal.hidden) {
      if (!(sportFilterModal.contains(e.target) || (sportFilterTrigger && sportFilterTrigger.contains(e.target)))) {
        closeSportModal();
      }
    }
    if (sourceFilterModal && !sourceFilterModal.hidden) {
      if (!(sourceFilterModal.contains(e.target) || (sourceFilterTrigger && sourceFilterTrigger.contains(e.target)))) {
        closeSourceModal();
      }
    }
    if (keywordFilterModal && !keywordFilterModal.hidden) {
      if (!(keywordFilterModal.contains(e.target) || (keywordFilterTrigger && keywordFilterTrigger.contains(e.target)))) {
        closeKeywordModal();
      }
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (sportFilterModal && !sportFilterModal.hidden) closeSportModal();
      if (sourceFilterModal && !sourceFilterModal.hidden) closeSourceModal();
      if (keywordFilterModal && !keywordFilterModal.hidden) closeKeywordModal();
    }
  });

  setSortIndicator('date', 'desc');
  syncSelectionFromCheckboxes();
  sortRows('date', 'desc');
}

document.querySelectorAll('.resource-table-block').forEach(initResourceTable);

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
