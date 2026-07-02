// Mobile menu toggle
const burger = document.getElementById('burger');
const navbar = document.getElementById('navbar');

burger.addEventListener('click', () => {
  navbar.classList.toggle('nav-open');
  burger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('nav-open');
    burger.classList.remove('active');
  });
});

// Navbar border/shadow on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Language toggle (EL / EN)
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('cutsformen-lang') || 'el';

function applyLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    if (!el.dataset.el) el.dataset.el = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.el;
  });
  document.documentElement.lang = lang;
  langToggle.textContent = lang === 'en' ? 'ΕΛ' : 'EN';
  localStorage.setItem('cutsformen-lang', lang);
  currentLang = lang;
}

langToggle.addEventListener('click', () => applyLang(currentLang === 'en' ? 'el' : 'en'));
applyLang(currentLang);

// Scroll-reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));

// Active nav-link highlighting based on scroll position
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = Array.from(navAnchors)
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(section => navObserver.observe(section));

// Parallax on hero background
const heroBg = document.querySelector('.hero__bg');
const heroSection = document.querySelector('.hero');
if (heroBg && heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY, heroSection.offsetHeight);
    heroBg.style.transform = `translateY(${offset * 0.25}px)`;
  }, { passive: true });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Custom cursor (desktop, fine-pointer devices only) — single ring, tight follow
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(ring);
  document.documentElement.classList.add('cursor-active');

  let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
  let targetX = ringX, targetY = ringY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateRing() {
    ringX += (targetX - ringX) * 0.45;
    ringY += (targetY - ringY) * 0.45;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--hover'));
  });
}

