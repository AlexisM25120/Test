/* ═══════════════════════════════════════════════════════════════
   Cabinet Aria — interactions
   Aucune dépendance. Tout est encapsulé dans une IIFE.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ── En-tête : état « collé » au défilement ─────────────────── */
  var topbar = $('#topbar');
  var stuckTicking = false;
  function syncTopbar() {
    topbar.classList.toggle('is-stuck', window.scrollY > 12);
    stuckTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!stuckTicking) { requestAnimationFrame(syncTopbar); stuckTicking = true; }
  }, { passive: true });
  syncTopbar();

  /* ── Menu mobile ────────────────────────────────────────────── */
  var burger = $('#burger');
  var menu = $('#mobileMenu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', menu).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && !menu.hidden) setMenu(false);
  });

  /* ── Révélation des blocs au défilement ─────────────────────── */
  var revealables = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.slice.call(entry.target.parentNode.children)
          .filter(function (n) { return n.classList.contains('reveal'); });
        var rank = Math.min(siblings.indexOf(entry.target), 5);
        entry.target.style.transitionDelay = (rank * 70) + 'ms';
        entry.target.classList.add('is-in');
        revealObs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { revealObs.observe(el); });
  }

  /* ── Navigation : lien actif selon la section visible ────────── */
  var navLinks = $$('.nav-link');
  var watched = navLinks.map(function (l) {
    return { link: l, el: document.getElementById(l.dataset.section) };
  }).filter(function (w) { return w.el; });

  var spyTicking = false;
  function syncSpy() {
    var probe = window.scrollY + (parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--bar-h'), 10) || 76) + 120;
    var current = null;
    watched.forEach(function (w) {
      if (w.el.offsetTop <= probe) current = w;
    });
    // Dernière section quand on atteint le bas de page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = watched[watched.length - 1];
    }
    navLinks.forEach(function (l) { l.classList.remove('is-active'); });
    if (current) current.link.classList.add('is-active');
    spyTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!spyTicking) { requestAnimationFrame(syncSpy); spyTicking = true; }
  }, { passive: true });
  syncSpy();

  /* ── Compteurs animés ───────────────────────────────────────── */
  function formatCount(value, el) {
    if (el.dataset.divide) {
      var decimals = parseInt(el.dataset.decimals || '1', 10);
      return (value / parseFloat(el.dataset.divide)).toFixed(decimals).replace('.', ',');
    }
    var whole = String(Math.round(value));
    if (el.dataset.format === 'plain') return whole;
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    if (reduced) { el.textContent = formatCount(target, el); return; }
    var start = null;
    var duration = 1400;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(target * eased, el);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = formatCount(target, el);
    }
    requestAnimationFrame(frame);
  }
  var counters = $$('.count');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCount);
  } else {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        countObs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObs.observe(el); });
  }

  /* ── Carte « prochaines disponibilités » ────────────────────── */
  var slots = $$('.slot');
  var confirmBtn = $('#slotConfirm');
  var chosenSlot = null;

  slots.forEach(function (slot) {
    slot.addEventListener('click', function () {
      slots.forEach(function (s) {
        s.classList.remove('is-selected');
        s.setAttribute('aria-checked', 'false');
      });
      slot.classList.add('is-selected');
      slot.setAttribute('aria-checked', 'true');
      chosenSlot = {
        day: slot.dataset.day,
        time: slot.dataset.time,
        prat: slot.dataset.prat
      };
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Réserver ' + chosenSlot.day.toLowerCase() + ' à ' + chosenSlot.time;
    });
  });

  confirmBtn.addEventListener('click', function () {
    if (!chosenSlot) return;
    var creneau = $('#f-creneau');
    var prat = $('#f-prat');
    creneau.value = chosenSlot.day + ' à ' + chosenSlot.time;
    for (var i = 0; i < prat.options.length; i++) {
      if (prat.options[i].text === chosenSlot.prat) { prat.selectedIndex = i; break; }
    }
    document.getElementById('rdv').scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth', block: 'start'
    });
    window.setTimeout(function () { $('#f-nom').focus({ preventScroll: true }); }, reduced ? 0 : 620);
  });

  /* ── Schéma dentaire interactif ─────────────────────────────── */
  var NAMES = {
    1: 'Incisive centrale', 2: 'Incisive latérale', 3: 'Canine',
    4: 'Première prémolaire', 5: 'Deuxième prémolaire',
    6: 'Première molaire', 7: 'Deuxième molaire', 8: 'Dent de sagesse'
  };
  var FAMILY = {
    1: 'Incisive', 2: 'Incisive', 3: 'Canine', 4: 'Prémolaire',
    5: 'Prémolaire', 6: 'Molaire', 7: 'Molaire', 8: 'Molaire'
  };
  var SHAPE = {
    1: { w: 19, h: 27, r: 6, fill: '#dcedf1' },
    2: { w: 16, h: 25, r: 6, fill: '#dcedf1' },
    3: { w: 17, h: 30, r: 8, fill: '#f6e2ce' },
    4: { w: 20, h: 25, r: 8, fill: '#c5e2e8' },
    5: { w: 20, h: 25, r: 8, fill: '#c5e2e8' },
    6: { w: 27, h: 27, r: 9, fill: '#a5d3dc' },
    7: { w: 26, h: 26, r: 9, fill: '#a5d3dc' },
    8: { w: 23, h: 23, r: 9, fill: '#a5d3dc' }
  };
  var CARE = {
    1: 'Composite esthétique, facette céramique, éclaircissement. C’est la zone la plus exposée du sourire.',
    2: 'Composite esthétique, facette céramique, éclaircissement. C’est la zone la plus exposée du sourire.',
    3: 'Composite, traitement de la racine, alignement. La canine guide l’ensemble de l’occlusion.',
    4: 'Inlay ou onlay céramique, composite, couronne. Souvent fragilisée par d’anciens amalgames.',
    5: 'Inlay ou onlay céramique, composite, couronne. Souvent fragilisée par d’anciens amalgames.',
    6: 'Scellement des sillons chez l’enfant, couronne céramique, traitement endodontique. La molaire de 6 ans est la plus cariée de la bouche.',
    7: 'Scellement des sillons chez l’enfant, couronne céramique, traitement endodontique.',
    8: 'Surveillance radiologique, extraction lorsqu’elle pousse de travers ou abîme la dent voisine.'
  };

  var UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  var LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  var arch = $('#arch');
  var toothInfo = $('#toothInfo');
  var teeth = [];

  function svgEl(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function describe(fdi) {
    var quadrant = Math.floor(fdi / 10);
    var position = fdi % 10;
    return {
      fdi: fdi,
      name: NAMES[position],
      family: FAMILY[position],
      arcade: (quadrant === 1 || quadrant === 2) ? 'supérieure' : 'inférieure',
      // Deux formes : « incisive droite » (accord avec la dent) et « côté droit »
      side: (quadrant === 1 || quadrant === 4) ? 'droite' : 'gauche',
      sideM: (quadrant === 1 || quadrant === 4) ? 'droit' : 'gauche',
      care: CARE[position],
      shape: SHAPE[position]
    };
  }

  function buildArch(list, isUpper) {
    var cx = 260, rx = 205;
    var cy = isUpper ? 170 : 210;
    var ry = 120;

    list.forEach(function (fdi, i) {
      var info = describe(fdi);
      var deg = 180 - (i + 0.5) * (180 / list.length);
      var rad = deg * Math.PI / 180;
      var x = cx + rx * Math.cos(rad);
      var y = isUpper ? cy - ry * Math.sin(rad) : cy + ry * Math.sin(rad);
      var rot = isUpper ? (90 - deg) : (deg + 90);

      var g = svgEl('g', {
        'class': 'tooth',
        transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')',
        role: 'button',
        tabindex: '-1',
        'aria-label': info.name + ' ' + info.arcade + ' ' + info.side + ', dent ' + fdi
      });
      g.appendChild(svgEl('rect', {
        x: (-info.shape.w / 2).toFixed(1), y: (-info.shape.h / 2).toFixed(1),
        width: info.shape.w, height: info.shape.h, rx: info.shape.r,
        fill: info.shape.fill,
        transform: 'rotate(' + rot.toFixed(1) + ')'
      }));
      g.appendChild(Object.assign(svgEl('text', { y: '3.4' }), { textContent: String(fdi) }));

      g.addEventListener('pointerenter', function () { select(g); });
      g.addEventListener('click', function () { select(g, true); });
      g.addEventListener('focus', function () { select(g); });
      g._info = info;

      arch.appendChild(g);
      teeth.push(g);
    });
  }

  function select(g, focusIt) {
    teeth.forEach(function (t) {
      t.classList.remove('is-on');
      t.setAttribute('tabindex', '-1');
    });
    g.classList.add('is-on');
    g.setAttribute('tabindex', '0');
    if (focusIt) g.focus();

    var info = g._info;
    toothInfo.classList.remove('is-empty');
    toothInfo.innerHTML =
      '<p class="tooth-fdi">Dent ' + info.fdi + ' · notation FDI</p>' +
      '<h3>' + info.name + '</h3>' +
      '<p class="tooth-type">Arcade ' + info.arcade + ' · côté ' + info.sideM +
        ' · ' + info.family + '</p>' +
      '<div class="tooth-care"><b>Soins les plus fréquents</b>' + info.care + '</div>';
  }

  if (arch) {
    arch.appendChild(svgEl('line', { 'class': 'arch-mid', x1: 260, y1: 24, x2: 260, y2: 356 }));
    buildArch(UPPER, true);
    buildArch(LOWER, false);
    teeth[0].setAttribute('tabindex', '0');

    // Sur petit écran le schéma déborde et défile : on l'ouvre centré sur l'axe médian
    var canvas = arch.parentNode;
    function centerArch() {
      var extra = canvas.scrollWidth - canvas.clientWidth;
      if (extra > 0) canvas.scrollLeft = extra / 2;
    }
    centerArch();
    window.addEventListener('resize', centerArch);

    // Navigation au clavier : flèches horizontales dans une arcade, verticales entre arcades
    arch.addEventListener('keydown', function (e) {
      var idx = teeth.indexOf(document.activeElement);
      if (idx === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = idx + 1;
      else if (e.key === 'ArrowLeft') next = idx - 1;
      else if (e.key === 'ArrowDown') next = idx + 16;
      else if (e.key === 'ArrowUp') next = idx - 16;
      else if (e.key === 'Home') next = idx < 16 ? 0 : 16;
      else if (e.key === 'End') next = idx < 16 ? 15 : 31;
      else if (e.key === 'Enter' || e.key === ' ') { select(teeth[idx], true); e.preventDefault(); return; }
      if (next === null) return;
      e.preventDefault();
      if (next < 0 || next >= teeth.length) return;
      select(teeth[next], true);
    });
  }

  /* ── Carrousel d'avis ───────────────────────────────────────── */
  var track = $('#qTrack');
  if (track) {
    var quotes = $$('.quote', track);
    var dotsBox = $('#qDots');
    var wide = window.matchMedia('(min-width: 941px)');
    var index = 0;
    var timer = null;
    var perView = 1;
    var pages = 1;
    var dots = [];

    // Deux avis côte à côte au-delà de 940px, un seul en dessous : le nombre de
    // positions — et donc de puces — change avec la largeur.
    function layout() {
      perView = wide.matches ? 2 : 1;
      pages = Math.max(quotes.length - perView + 1, 1);
      dotsBox.innerHTML = '';
      dots = [];
      for (var i = 0; i < pages; i++) {
        (function (n) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Avis ' + (n + 1) + ' sur ' + pages);
          dot.addEventListener('click', function () { go(n); restart(); });
          dotsBox.appendChild(dot);
          dots.push(dot);
        })(i);
      }
      go(Math.min(index, pages - 1));
    }

    function go(i) {
      index = (i + pages) % pages;
      track.style.transform = 'translateX(' + (-index * (100 / perView)) + '%)';
      dots.forEach(function (d, n) {
        d.classList.toggle('is-on', n === index);
        d.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
      quotes.forEach(function (q, n) {
        var visible = n >= index && n < index + perView;
        q.setAttribute('aria-hidden', visible ? 'false' : 'true');
      });
    }
    function restart() {
      if (reduced) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () { go(index + 1); }, 7000);
    }

    $('.q-next').addEventListener('click', function () { go(index + 1); restart(); });
    $('.q-prev').addEventListener('click', function () { go(index - 1); restart(); });

    var quotesBox = $('.quotes');
    quotesBox.addEventListener('mouseenter', function () { window.clearInterval(timer); });
    quotesBox.addEventListener('mouseleave', restart);
    quotesBox.addEventListener('focusin', function () { window.clearInterval(timer); });

    // Glissement tactile
    var startX = null;
    track.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    track.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var delta = e.clientX - startX;
      if (Math.abs(delta) > 45) { go(index + (delta < 0 ? 1 : -1)); restart(); }
      startX = null;
    });
    track.addEventListener('pointercancel', function () { startX = null; });

    if (wide.addEventListener) wide.addEventListener('change', layout);
    else wide.addListener(layout);

    layout();
    restart();
  }

  /* ── Formulaire de rendez-vous ──────────────────────────────── */
  var form = $('#rdvForm');
  var done = $('#formDone');

  function setError(field, message) {
    var box = $('.err[data-for="' + field.id + '"]');
    if (box) box.textContent = message || '';
    field.classList.toggle('is-bad', Boolean(message));
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validate() {
    var problems = [];
    var nom = $('#f-nom'), tel = $('#f-tel'), mail = $('#f-mail');
    var motif = $('#f-motif'), rgpd = $('#f-rgpd');

    setError(nom, nom.value.trim().length < 2 ? 'Merci d’indiquer votre nom.' : '');
    if (nom.value.trim().length < 2) problems.push(nom);

    var digits = tel.value.replace(/\D/g, '');
    var telBad = digits.length < 9;
    setError(tel, telBad ? 'Un numéro à 10 chiffres est attendu.' : '');
    if (telBad) problems.push(tel);

    var mailBad = mail.value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
    setError(mail, mailBad ? 'Cette adresse e-mail semble incomplète.' : '');
    if (mailBad) problems.push(mail);

    setError(motif, motif.value === '' ? 'Choisissez un motif de consultation.' : '');
    if (motif.value === '') problems.push(motif);

    var rgpdBox = $('.err[data-for="f-rgpd"]');
    rgpdBox.textContent = rgpd.checked ? '' : 'Votre accord est nécessaire pour vous recontacter.';
    if (!rgpd.checked) problems.push(rgpd);

    return problems;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problems = validate();
      if (problems.length) { problems[0].focus(); return; }

      var creneau = $('#f-creneau').value.trim();
      var praticien = $('#f-prat').value;
      var detail = 'Le secrétariat vous rappelle sous 24 h ouvrées pour confirmer le rendez-vous';
      if (praticien.indexOf('Dr') === 0) detail += ' avec ' + praticien;
      detail += '.';
      if (creneau) detail += ' Créneau souhaité : ' + creneau + '.';
      $('#doneDetail').textContent = detail;

      form.hidden = true;
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus({ preventScroll: true });
    });

    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.classList.contains('is-bad')) setError(field, '');
      });
    });

    $('#formReset').addEventListener('click', function () {
      form.reset();
      $$('.err', form.parentNode).forEach(function (b) { b.textContent = ''; });
      $$('.is-bad', form).forEach(function (f) { f.classList.remove('is-bad'); });
      done.hidden = true;
      form.hidden = false;
      $('#f-nom').focus();
    });
  }

  /* ── Année courante dans le pied de page ────────────────────── */
  $$('.foot-legal li').forEach(function (li) {
    if (/^©/.test(li.textContent)) li.textContent = '© ' + new Date().getFullYear() + ' Cabinet Aria';
  });

})();
