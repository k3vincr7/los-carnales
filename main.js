/* Los Carnales — main.js */

(() => {
  'use strict';

  // ── NAV: scroll shadow + mobile toggle ──────────────────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // ── MENU TABS ────────────────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });

  // ── SCROLL REVEAL ────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.level-card, .menu-item, .pricing-card, .rules-box, .tournament-card, .event-card, .contact-info, .contact-form-wrap, .stat, .food-callout'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── CONTACT FORM ─────────────────────────────────────────────
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus('Por favor llena todos los campos requeridos.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Por favor ingresa un correo electrónico válido.', 'error');
      return;
    }

    showStatus('Enviando…', '');
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(res => {
      if (res.ok) {
        showStatus('¡Mensaje enviado! Te contactamos pronto.', 'success');
        form.reset();
      } else {
        showStatus('Algo salió mal. Escríbenos directo a loscarnales.sf@gmail.com', 'error');
      }
    }).catch(() => {
      showStatus('Error de conexión. Intenta de nuevo o escríbenos directo.', 'error');
    });
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── FOOTER YEAR ──────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── SMOOTH SCROLL for nav links (fallback for older browsers) ─
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
