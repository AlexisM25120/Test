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
// Envoi via FormSubmit (https://formsubmit.co) : aucun compte à créer,
// juste confirmer une fois par e-mail au premier envoi réel vers
// alexo.webdesign@gmail.com. Le champ _honey est un piège anti-spam.
const LEAD_ENDPOINT = 'https://formsubmit.co/ajax/alexo.webdesign@gmail.com';
const leadForm = document.getElementById('leadForm');
const formNote = document.getElementById('formNote');

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitBtn = leadForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  formNote.classList.remove('success', 'error');
  formNote.textContent = 'Envoi en cours...';

  try {
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(leadForm))),
    });
    if (!response.ok) throw new Error('request failed');
    formNote.textContent = 'Merci ! Votre demande a bien été reçue — réponse sous 3 jours ouvrés.';
    formNote.classList.add('success');
    leadForm.reset();
  } catch (err) {
    formNote.textContent = "L'envoi a échoué — écrivez-moi directement à alexo.webdesign@gmail.com.";
    formNote.classList.add('error');
  } finally {
    submitBtn.disabled = false;
  }
});
