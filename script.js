/* NEXUS — script.js | Sticky Navbar + Smooth Scroll + Active Links */
(function () {
  'use strict';

  const navbar   = document.getElementById('navbar');
  const hb       = document.getElementById('hamburger');
  const mo       = document.getElementById('mobileOverlay');
  const sp       = document.getElementById('scrollProgress');
  const dLinks   = document.querySelectorAll('.nav-link');
  const mLinks   = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');
  let tick = false;

  /* ── Scroll Progress ── */
  function updateProgress() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    sp.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }

  /* ── Navbar Sticky Style ── */
  navbar.classList.add('transparent');
  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.replace('transparent', 'scrolled');
    } else {
      navbar.classList.replace('scrolled', 'transparent');
    }
  }

  /* ── Active Link (IntersectionObserver) ── */
  function setActive(id) {
    [...dLinks, ...mLinks].forEach(l => {
      l.dataset.section === id ? l.classList.add('active') : l.classList.remove('active');
    });
  }

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
  sections.forEach(s => secObs.observe(s));

  /* ── Smooth Scroll ── */
  function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
  }

  [...dLinks, ...mLinks].forEach(l => {
    l.addEventListener('click', e => {
      e.preventDefault();
      const id = l.dataset.section;
      if (mo.classList.contains('open')) {
        closeMobile();
        setTimeout(() => smoothScrollTo(id), 350);
      } else { smoothScrollTo(id); }
    });
  });

  document.querySelector('.nav-logo').addEventListener('click', e => { e.preventDefault(); smoothScrollTo('home'); });
  document.querySelector('.cta-btn')?.addEventListener('click', e => { e.preventDefault(); smoothScrollTo('about'); });

  /* ── Hamburger Menu ── */
  function openMobile()  { hb.classList.add('open');  mo.classList.add('open');  document.body.style.overflow = 'hidden'; }
  function closeMobile() { hb.classList.remove('open'); mo.classList.remove('open'); document.body.style.overflow = ''; }
  hb.addEventListener('click', () => hb.classList.contains('open') ? closeMobile() : openMobile());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });

  /* ── Debounced Scroll (rAF) ── */
  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(() => { updateNavbar(); updateProgress(); tick = false; });
      tick = true;
    }
  }, { passive: true });

  /* ── Scroll Reveal ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 55);
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* Init */
  updateNavbar();
  updateProgress();
})();
