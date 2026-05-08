/* ── 1. STICKY NAVBAR on scroll ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ── 2. HAMBURGER MENU ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when any link is clicked
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && !navMobile.contains(e.target)) {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ── 3. SMOOTH SCROLL for anchor links ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 4. SCROLL-TRIGGERED FADE-IN ────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach((el, i) => {
  // Stagger siblings inside the same parent
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});


/* ── 5. ACTIVE NAV LINK on scroll ───────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });


/* ── 6. CONTACT FORM validation & submit ────────────────────────── */
const form     = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', async e => {
  e.preventDefault();
  feedback.className = 'form-feedback';
  feedback.style.display = 'none';

  const nome      = form.nome.value.trim();
  const cognome   = form.cognome.value.trim();
  const email     = form.email.value.trim();
  const messaggio = form.messaggio.value.trim();
  const emailRe   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nome || !cognome || !email || !messaggio) {
    showFeedback('error', 'Per favore compila tutti i campi obbligatori.');
    return;
  }
  if (!emailRe.test(email)) {
    showFeedback('error', 'Inserisci un indirizzo email valido.');
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Invio in corso…';

  try {
    const res = await fetch('https://formspree.io/f/mojrnldr', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });
    if (res.ok) {
      showFeedback('success', 'Messaggio inviato! Ti risponderò al più presto.');
      form.reset();
    } else {
      showFeedback('error', 'Errore nell\'invio. Riprova o scrivimi direttamente via email.');
    }
  } catch {
    showFeedback('error', 'Connessione assente. Riprova tra poco.');
  }

  btn.disabled = false;
  btn.textContent = 'Invia messaggio';
});

function showFeedback(type, message) {
  feedback.textContent = message;
  feedback.className   = 'form-feedback ' + type;
  feedback.style.display = 'block';
  feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


/* ── 7. ACCORDION – Il Metodo & Storia professionale ───────────── */
document.querySelectorAll('.metodo-toggle, .card-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.metodo-item, .storia-card');
    if (!item) return;

    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);

    
  });
});


