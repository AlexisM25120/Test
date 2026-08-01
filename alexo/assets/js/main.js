// Menu mobile
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Reveal au scroll
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Formulaire "maquette gratuite"
// NOTE: mockup front-end uniquement. Pour capter les leads en prod,
// brancher ce formulaire sur un service comme Formspree / Netlify Forms
// (remplacer le bloc ci-dessous par un fetch() vers l'endpoint choisi).
const leadForm = document.getElementById('leadForm');
const formNote = document.getElementById('formNote');
leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formNote.textContent = 'Merci ! Votre demande a bien été reçue — réponse sous 3 jours ouvrés.';
  formNote.classList.add('success');
  leadForm.reset();
});
