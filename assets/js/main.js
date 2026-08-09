/* ============================================================
   Montbellet Paysage & Piscines — interactions
   Aucune dépendance. Tout dégrade proprement sans JS.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Réalisations : liste des photos de la galerie.
     Déposer les fichiers dans assets/img/realisations/ puis
     ajuster les lignes ci-dessous. Une entrée dont l'image est
     absente disparaît d'elle-même ; si aucune n'existe, toute
     la section reste masquée.
     --------------------------------------------------------- */
  var REALISATIONS = [
    { src: 'assets/img/realisations/01.jpg', legende: 'Terrasse en bois et plage de piscine' },
    { src: 'assets/img/realisations/02.jpg', legende: 'Massif fleuri en bordure de pelouse' },
    { src: 'assets/img/realisations/03.jpg', legende: 'Pavage et murets en pierre' },
    { src: 'assets/img/realisations/04.jpg', legende: 'Bassin bois intégré au talus' },
    { src: 'assets/img/realisations/05.jpg', legende: 'Chalet de jardin en bois' },
    { src: 'assets/img/realisations/06.jpg', legende: 'Haie taillée et allée d\'accès' }
  ];

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------------------------------------------------------
     1. Photos manquantes → repli sur le visuel dessiné
     --------------------------------------------------------- */
  function watchPhoto(img) {
    var fail = function () { img.classList.add('is-missing'); };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  }
  $$('img[data-photo]').forEach(watchPhoto);

  /* ---------------------------------------------------------
     2. Galerie des réalisations
     --------------------------------------------------------- */
  var grid = $('#galleryGrid');
  var gallerySection = $('#realisations');
  if (grid && gallerySection) {
    var pending = REALISATIONS.length;
    var kept = 0;

    var settle = function () {
      if (--pending > 0) return;
      if (kept > 0) {
        gallerySection.hidden = false;
      } else {
        ['.nav__links a[href="#realisations"]', '.menu__nav a[href="#realisations"]']
          .forEach(function (sel) { var l = $(sel); if (l) l.hidden = true; });
      }
    };

    REALISATIONS.forEach(function (item) {
      var fig = document.createElement('figure');
      fig.className = 'shot';
      var img = document.createElement('img');
      img.alt = item.legende;
      var cap = document.createElement('figcaption');
      cap.textContent = item.legende;
      fig.appendChild(img);
      fig.appendChild(cap);
      // Ordre conservé : on pose toutes les cases, on retire celles qui manquent.
      grid.appendChild(fig);

      img.addEventListener('load', function () { kept++; settle(); });
      img.addEventListener('error', function () { fig.remove(); settle(); });
      img.src = item.src;
    });
  }

  /* ---------------------------------------------------------
     3. Découpage du texte en mots animables
     --------------------------------------------------------- */
  function splitText(el) {
    var idx = 0;
    var out = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk.trim()) { out.appendChild(document.createTextNode(chunk)); return; }
          var w = document.createElement('span');
          w.className = 'w';
          var i = document.createElement('i');
          i.textContent = chunk;
          i.style.setProperty('--i', idx++);
          w.appendChild(i);
          out.appendChild(w);
        });
      } else {
        out.appendChild(node.cloneNode(true));
      }
    });
    el.textContent = '';
    el.appendChild(out);
  }
  $$('[data-split], [data-split-words]').forEach(splitText);

  /* ---------------------------------------------------------
     4. Apparitions au scroll
     --------------------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  $$('.reveal, [data-split], [data-split-words]').forEach(function (el) { io.observe(el); });

  /* ---------------------------------------------------------
     5. Matière de la page au fil du scroll
     --------------------------------------------------------- */
  var toneSections = $$('main [data-tone], footer[data-tone]');
  if (toneSections.length) {
    var toneIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target.getAttribute('data-tone');
        if (!t || document.documentElement.dataset.tone === t) return;
        document.documentElement.dataset.tone = t;
        var tc = document.querySelector('meta[name="theme-color"]');
        if (tc) tc.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
      });
    }, { rootMargin: '-48% 0px -48% 0px' });
    toneSections.forEach(function (s) { toneIO.observe(s); });
  }

  /* ---------------------------------------------------------
     6. En-tête : filet au scroll + lien courant
     --------------------------------------------------------- */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      document.body.classList.toggle('scrolled', window.scrollY > 20);
      ticking = false;
    });
  }, { passive: true });

  var navLinks = $$('.nav__links a[data-nav]');
  var navTargets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if (navTargets.some(Boolean)) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = navTargets.indexOf(e.target);
        if (i > -1 && e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('is-current'); });
          navLinks[i].classList.add('is-current');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    navTargets.forEach(function (t) { if (t) navIO.observe(t); });
  }

  /* ---------------------------------------------------------
     7. Menu plein écran
     --------------------------------------------------------- */
  var burger = $('#burger');
  var menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    burger.querySelector('.sr-only').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    if (open) { var f = menu.querySelector('a'); if (f) f.focus(); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); }
    });
  }

  /* ---------------------------------------------------------
     8. Onglets piscines
     --------------------------------------------------------- */
  var tabs = $$('#poolTabs [role="tab"]');
  function activate(n) {
    tabs.forEach(function (t, j) {
      var on = j === n;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      var pane = document.getElementById(t.getAttribute('aria-controls'));
      pane.hidden = !on;
      pane.classList.toggle('is-active', on);
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(i); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
        activate(n); tabs[n].focus();
      }
    });
  });

  /* ---------------------------------------------------------
     9. Carte de la zone
     --------------------------------------------------------- */
  var base = { x: 36.1, y: 40.3 };
  var coords = {
    tournus: [33, 15.3], pontdevaux: [39, 51.9], lugny: [14.6, 48.3],
    vire: [14.4, 55.6], clesse: [16.7, 63.7], macon: [17.5, 87.2]
  };
  var linkG = $('#mapLinks');
  if (linkG) {
    Object.keys(coords).forEach(function (key) {
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', base.x); l.setAttribute('y1', base.y);
      l.setAttribute('x2', coords[key][0]); l.setAttribute('y2', coords[key][1]);
      l.setAttribute('data-town', key);
      linkG.appendChild(l);
    });
  }
  function highlight(town, on) {
    $$('[data-town="' + town + '"]').forEach(function (el) { el.classList.toggle('is-on', on); });
  }
  $$('#towns button, .map__pts .pt').forEach(function (el) {
    var town = el.getAttribute('data-town');
    ['mouseenter', 'focus'].forEach(function (ev) { el.addEventListener(ev, function () { highlight(town, true); }); });
    ['mouseleave', 'blur'].forEach(function (ev) { el.addEventListener(ev, function () { highlight(town, false); }); });
  });

  /* ---------------------------------------------------------
     10. Formulaire → e-mail pré-rempli
     --------------------------------------------------------- */
  var form = $('#form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required], textarea[required]', form).forEach(function (f) {
        var bad = !f.value.trim();
        f.closest('.field').classList.toggle('is-bad', bad);
        if (bad && ok) { f.focus(); ok = false; }
      });
      var note = $('#formNote');
      if (!ok) { note.textContent = 'Merci de compléter les champs manquants.'; return; }

      var d = new FormData(form);
      var sujets = d.getAll('sujet').join(', ') || 'Non précisé';
      var body = [
        'Nom : ' + d.get('name'),
        'Contact : ' + d.get('contact'),
        'Commune : ' + (d.get('city') || 'Non précisée'),
        'Projet : ' + sujets,
        '',
        d.get('message')
      ].join('\n');
      note.textContent = 'Votre messagerie s\'ouvre avec la demande pré-remplie…';
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent('Demande de devis — ' + sujets) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------------------------------------------------------
     11. Boutons magnétiques
     --------------------------------------------------------- */
  if (fine && !reduced) {
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (dx * 10).toFixed(2) + 'px,' + (dy * 6).toFixed(2) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     12. Canvas : lumière filtrée par le feuillage & reflets d'eau
     --------------------------------------------------------- */
  function setupCanvas(cv) {
    var ctx = cv.getContext('2d');
    var w = 0, h = 0;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return { ctx: ctx, size: function () { return { w: w, h: h }; } };
  }

  /* --- taches de soleil à travers les feuilles --- */
  var dapple = $('#dapple');
  if (dapple) {
    var D = setupCanvas(dapple);
    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(dapple);

    var spots = [];
    for (var i = 0; i < 16; i++) {
      spots.push({
        x: Math.random(), y: Math.random() * 0.9,
        r: 0.06 + Math.random() * 0.16,
        sx: (Math.random() - 0.5) * 0.9,
        sy: (Math.random() - 0.5) * 0.5,
        ph: Math.random() * 6.28
      });
    }
    var pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    if (fine) {
      dapple.parentElement.addEventListener('mousemove', function (e) {
        var r = dapple.getBoundingClientRect();
        pointer.tx = (e.clientX - r.left) / r.width;
        pointer.ty = (e.clientY - r.top) / r.height;
      }, { passive: true });
    }

    var t = 0;
    (function drawDapple() {
      requestAnimationFrame(drawDapple);
      if (!visible) return;
      var s = D.size(), ctx = D.ctx, w = s.w, h = s.h;
      t += reduced ? 0 : 0.0022;
      pointer.x += (pointer.tx - pointer.x) * 0.03;
      pointer.y += (pointer.ty - pointer.y) * 0.03;

      ctx.clearRect(0, 0, w, h);
      var px = (pointer.x - 0.5) * 0.06;
      var py = (pointer.y - 0.5) * 0.04;

      spots.forEach(function (sp) {
        var cx = (sp.x + Math.sin(t * sp.sx + sp.ph) * 0.05 + px) * w;
        var cy = (sp.y + Math.cos(t * sp.sy + sp.ph) * 0.035 + py) * h;
        var rad = sp.r * Math.min(w, h) * (1 + Math.sin(t * 1.6 + sp.ph) * 0.12);
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, 'rgba(255, 246, 208, 0.5)');
        g.addColorStop(0.55, 'rgba(255, 240, 190, 0.14)');
        g.addColorStop(1, 'rgba(255, 240, 190, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, 6.2832);
        ctx.fill();
      });
    })();
  }

  /* --- reflets doux sur l'eau du bassin --- */
  var water = $('#water');
  if (water) {
    var W = setupCanvas(water);
    var wt = 0, wvis = false;
    new IntersectionObserver(function (es) { wvis = es[0].isIntersecting; }).observe(water);

    (function drawWater() {
      requestAnimationFrame(drawWater);
      if (!wvis) return;
      var s = W.size(), ctx = W.ctx, w = s.w, h = s.h;
      wt += reduced ? 0 : 0.004;
      ctx.clearRect(0, 0, w, h);

      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#123037');
      g.addColorStop(0.55, '#16414a');
      g.addColorStop(1, '#0f2a31');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      var bands = h < 700 ? 12 : 18;
      for (var i = 0; i < bands; i++) {
        var f = i / bands;
        ctx.beginPath();
        ctx.lineWidth = 6 + 10 * Math.abs(Math.sin(f * 3 + wt));
        ctx.strokeStyle = 'rgba(150, 214, 205, ' + (0.012 + 0.02 * Math.abs(Math.sin(f * 5 + wt * 1.4))) + ')';
        for (var x = 0; x <= w + 24; x += 24) {
          var u = x / w;
          var y = f * h
            + Math.sin(u * 5 + wt * 2.2 + f * 7) * (h * 0.032)
            + Math.sin(u * 11 - wt * 1.6 + f * 3) * (h * 0.016);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    })();
  }
})();
