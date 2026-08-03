const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// Reveal au scroll, en cascade dans chaque groupe
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll(':scope > .reveal')];
      entry.target.style.setProperty('--reveal-delay', `${siblings.indexOf(entry.target) * 0.08}s`);
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Barre de progression de lecture
const progressFill = document.getElementById('progressFill');
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressFill.style.width = `${Math.min(ratio, 1) * 100}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Compteur du prix, déclenché quand la carte entre à l'écran
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.value);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '&nbsp;€';
      const render = (n) => { el.innerHTML = `${prefix}${n}${suffix}`; };
      if (reducedMotion) {
        render(target);
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1100, 1);
        render(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-value]').forEach((el) => countObserver.observe(el));

if (!reducedMotion) {
  // Grille de points du hero : les points se soulèvent autour du curseur
  const canvas = document.getElementById('heroGrid');
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  const SPACING = 34;
  const RADIUS = 130;
  let points = [];
  let pointer = { x: -9999, y: -9999 };

  const buildGrid = () => {
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = hero.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    for (let y = SPACING / 2; y < height; y += SPACING) {
      for (let x = SPACING / 2; x < width; x += SPACING) {
        points.push({ x, y });
      }
    }
  };

  const draw = () => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    points.forEach((p) => {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const dist = Math.hypot(dx, dy);
      const pull = dist < RADIUS ? (1 - dist / RADIUS) : 0;
      const size = 1 + pull * 2.4;
      ctx.fillStyle = `rgba(237, 237, 234, ${0.07 + pull * 0.45})`;
      ctx.beginPath();
      ctx.arc(p.x - dx * pull * 0.18, p.y - dy * pull * 0.18, size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  });
  hero.addEventListener('pointerleave', () => {
    pointer = { x: -9999, y: -9999 };
  });
  window.addEventListener('resize', buildGrid);
  buildGrid();
  draw();

  // Curseur personnalisé, grossit sur les éléments cliquables
  const cursor = document.getElementById('cursor');
  window.addEventListener('pointermove', (event) => {
    cursor.classList.add('visible');
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('a, button, input, textarea').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('grow'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('grow'));
  });

  // Boutons magnétiques
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const mx = (event.clientX - rect.left - rect.width / 2) * 0.28;
      const my = (event.clientY - rect.top - rect.height / 2) * 0.28;
      el.style.setProperty('--mx', `${mx}px`);
      el.style.setProperty('--my', `${my}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });

  // La fenêtre du hero s'incline selon la position du curseur
  const heroMark = document.getElementById('heroMark');
  const browser = heroMark.querySelector('.browser');
  heroMark.addEventListener('pointermove', (event) => {
    const rect = heroMark.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    browser.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  heroMark.addEventListener('pointerleave', () => {
    browser.style.transform = 'rotateX(0) rotateY(0)';
  });

  // Inclinaison 3D d'un élément selon la position du curseur
  const tilt3d = (el, maxDeg = 10, lift = 0) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -maxDeg;
      const ry = ((event.clientX - rect.left) / rect.width - 0.5) * maxDeg;
      el.style.transform =
        `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${lift}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  };

  // Le tilt reste réservé aux objets (écrans, fenêtres) : faire pivoter des
  // blocs de texte nuit à la lecture et fait « gadget ».

  // Parallaxe douce : chaque section légèrement décalée selon sa position
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    let ticking = false;
    const applyParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const strength = Number(el.dataset.parallax) || 1;
        el.style.transform = `translate3d(0, ${-progress * 22 * strength}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyParallax);
    }, { passive: true });
    applyParallax();
  }

  // Galerie de réalisations : carrousel 3D, glisser + molette
  const rail = document.getElementById('workRail');
  if (rail) {
    const cards = [...rail.querySelectorAll('.work-card')];

    // Chaque carte pivote et recule selon sa distance au centre du rail
    const project = () => {
      const railCenter = rail.scrollLeft + rail.clientWidth / 2;
      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const offset = (cardCenter - railCenter) / rail.clientWidth;
        const clamped = Math.max(-1, Math.min(1, offset));
        card.style.setProperty('--rot', `${clamped * -26}deg`);
        card.style.setProperty('--depth', `${-Math.abs(clamped) * 180}px`);
      });
    };

    rail.addEventListener('scroll', project, { passive: true });
    window.addEventListener('resize', project);
    project();

    // Les écrans s'inclinent aussi sous le curseur, en plus du carrousel
    cards.forEach((card) => tilt3d(card.querySelector('.wc-screen'), 12, 30));

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    rail.addEventListener('pointerdown', (event) => {
      dragging = true;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add('dragging');
      rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      rail.scrollLeft = startScroll - (event.clientX - startX) * 1.4;
    });
    const stop = () => { dragging = false; rail.classList.remove('dragging'); };
    rail.addEventListener('pointerup', stop);
    rail.addEventListener('pointercancel', stop);
    // La molette verticale fait défiler la galerie horizontalement
    rail.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaY;
    }, { passive: false });
  }
}

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
