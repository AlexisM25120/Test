/* =============================================================
   Rouage — améliorations progressives.
   Le site est entièrement lisible et navigable sans ce fichier :
   rien ici n'est nécessaire à l'affichage du contenu.
   ============================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- filet sous l'en-tête au défilement ---- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      document.body.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- menu mobile ---- */
  var burger = $('#burger');
  var drawer = $('#drawer');
  if (burger && drawer) {
    var setDrawer = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      drawer.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      $('.sr-only', burger).textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
      if (open) { var f = $('a', drawer); if (f) f.focus(); }
    };
    burger.addEventListener('click', function () { setDrawer(drawer.hidden); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 832 && !drawer.hidden) setDrawer(false);
    });
  }

  /* ---- apparitions au défilement ---- */
  var reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- formulaire de contact ----
     Pas de serveur sur un site statique : on compose un e-mail
     pré-rempli. La validation native reste le filet de sécurité
     si ce script ne s'exécute pas. */
  var form = $('#devis');
  if (form) {
    var note = $('#formNote');
    // La validation native reste active tant que ce script n'a pas tourné :
    // on ne la débranche qu'une fois prêts à la remplacer.
    form.noValidate = true;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !f.checkValidity());
        f.closest('.field').classList.toggle('is-bad', bad);
        f.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) {
        note.textContent = 'Merci de compléter les champs signalés.';
        return;
      }
      var d = new FormData(form);
      var corps = [
        'Entreprise : ' + d.get('entreprise'),
        'Nom : ' + d.get('nom'),
        'E-mail : ' + d.get('email'),
        'Téléphone : ' + (d.get('telephone') || 'non communiqué'),
        'Commune : ' + (d.get('commune') || 'non communiquée'),
        'Secteur : ' + (d.get('secteur') || 'non précisé'),
        '',
        'Ce qui prend le plus de temps aujourd’hui :',
        d.get('besoin')
      ].join('\n');
      note.textContent = 'Votre messagerie s’ouvre avec la demande pré-remplie.';
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent('Demande de diagnostic — ' + d.get('entreprise')) +
        '&body=' + encodeURIComponent(corps);
    });
  }
})();
