/* ============================================================
   Montbellet Paysage & Piscines — interactions
   Aucune dépendance. Tout dégrade proprement sans JS.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------------------------------------------------------
     1. Photos : bascule vers le fond généré si le fichier manque
     --------------------------------------------------------- */
  $$('img[data-photo]').forEach(function (img) {
    var fail = function () { img.classList.add('is-missing'); };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------------------------------------------------------
     2. Découpage du texte en mots animables
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
     3. Apparitions au scroll + compteurs
     --------------------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      var n = e.target.querySelector ? e.target.querySelector('[data-count]') : null;
      if (e.target.hasAttribute && e.target.hasAttribute('data-count')) n = e.target;
      if (n) countUp(n);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  $$('.reveal, [data-split], [data-split-words]').forEach(function (el) { io.observe(el); });

  function countUp(el) {
    if (el.hasAttribute('data-plain') || reduced) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); return; }
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var t0 = performance.now();
    var dur = 1100;
    (function tick(now) {
      var p = clamp((now - t0) / dur, 0, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------------------------------------------------------
     4. Changement de matière (tone) au fil du scroll
     --------------------------------------------------------- */
  var toneSections = $$('main [data-tone], footer[data-tone]');
  if (toneSections.length) {
    var toneIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var t = e.target.getAttribute('data-tone');
          if (t && document.documentElement.dataset.tone !== t) {
            document.documentElement.dataset.tone = t;
            document.querySelector('meta[name="theme-color"]')
              .setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
            window.dispatchEvent(new CustomEvent('tonechange'));
          }
        }
      });
    }, { rootMargin: '-48% 0px -48% 0px' });
    toneSections.forEach(function (s) { toneIO.observe(s); });
  }

  /* ---------------------------------------------------------
     5. Barre de progression + lien de nav actif + rail
     --------------------------------------------------------- */
  var progress = $('#progress');
  var rail = $('#rail');
  var stepsSec = $('.steps');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? clamp(window.scrollY / h, 0, 1) * 100 : 0) + '%';
      if (rail && stepsSec) {
        var r = stepsSec.getBoundingClientRect();
        var p = clamp((window.innerHeight - r.top) / (r.height + window.innerHeight * 0.3), 0, 1);
        rail.style.width = (p * 100) + '%';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  var navLinks = $$('.dock__links a');
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
     6. Menu plein écran
     --------------------------------------------------------- */
  var burger = $('#burger');
  var overlay = $('#overlay');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    overlay.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    burger.querySelector('.sr-only').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    if (open) { var f = overlay.querySelector('a'); if (f) f.focus(); }
  }
  if (burger && overlay) {
    burger.addEventListener('click', function () { setMenu(overlay.hidden); });
    overlay.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) { setMenu(false); burger.focus(); }
    });
  }

  /* ---------------------------------------------------------
     7. Onglets piscines
     --------------------------------------------------------- */
  var tabs = $$('#poolTabs [role="tab"]');
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

  /* ---------------------------------------------------------
     8. Carte de la zone d'intervention
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
      l.dataset.town = key;
      linkG.appendChild(l);
    });
  }
  function highlight(town, on) {
    $$('[data-town="' + town + '"]').forEach(function (el) {
      el.classList.toggle(el.tagName === 'BUTTON' ? 'is-on' : 'is-on', on);
    });
    var line = linkG && linkG.querySelector('line[data-town="' + town + '"]');
    if (line) line.classList.toggle('is-on', on);
  }
  $$('#towns button, .map__pts .pt').forEach(function (el) {
    var town = el.dataset.town;
    ['mouseenter', 'focus'].forEach(function (ev) { el.addEventListener(ev, function () { highlight(town, true); }); });
    ['mouseleave', 'blur'].forEach(function (ev) { el.addEventListener(ev, function () { highlight(town, false); }); });
  });

  /* ---------------------------------------------------------
     9. Formulaire → e-mail pré-rempli
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
      var href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent('Demande de devis — ' + sujets) +
        '&body=' + encodeURIComponent(body);
      note.textContent = 'Votre messagerie s\'ouvre avec la demande pré-remplie…';
      window.location.href = href;
    });
  }

  /* ---------------------------------------------------------
     10. Curseur & boutons magnétiques
     --------------------------------------------------------- */
  if (fine && !reduced) {
    var dot = $('.cursor__dot'), ring = $('.cursor__ring');
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      document.body.classList.toggle('is-hot', !!e.target.closest('a, button, input, textarea, label'));
    });

    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (dx * 12).toFixed(2) + 'px,' + (dy * 8).toFixed(2) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     11. Fonds animés : relief (hero) & caustiques (piscines)
     --------------------------------------------------------- */
  function setupCanvas(cv) {
    var ctx = cv.getContext('2d');
    var w = 0, h = 0, dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return { ctx: ctx, resize: resize, size: function () { return { w: w, h: h }; } };
  }

  function tone(el) {
    var cs = getComputedStyle(el);
    return {
      bg: cs.getPropertyValue('--bg').trim() || '#08120c',
      accent: cs.getPropertyValue('--accent').trim() || '#c6f24e'
    };
  }

  /* --- relief topographique du hero --- */
  var terrain = $('#terrain');
  if (terrain) {
    var T = setupCanvas(terrain);
    var col = tone(terrain);
    window.addEventListener('tonechange', function () { col = tone(terrain); });
    var pointer = { x: 0.5, y: -1.2, tx: 0.5, ty: -1.2 };
    if (fine) {
      terrain.parentElement.addEventListener('mousemove', function (e) {
        var r = terrain.getBoundingClientRect();
        pointer.tx = (e.clientX - r.left) / r.width;
        pointer.ty = (e.clientY - r.top) / r.height;
      }, { passive: true });
    }

    var t = 0;
    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(terrain);

    function drawTerrain() {
      requestAnimationFrame(drawTerrain);
      if (!visible) return;
      var s = T.size(), ctx = T.ctx, w = s.w, h = s.h;
      var small = w < 760;
      var lines = small ? 22 : 32;
      var step = small ? 14 : 9;
      t += reduced ? 0 : 0.0045;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      ctx.clearRect(0, 0, w, h);
      var top = h * 0.22, span = h * 0.88;

      for (var i = 0; i < lines; i++) {
        var f = i / (lines - 1);
        var baseY = top + f * span;
        var amp = (h * 0.22) * Math.pow(f + 0.08, 2.1) + 3;
        ctx.beginPath();
        for (var x = 0; x <= w + step; x += step) {
          var u = x / w;
          var y = baseY
            + amp * Math.sin(u * 5.2 + t * 1.6 + f * 3.1)
            + amp * 0.55 * Math.sin(u * 11.3 - t * 1.1 + f * 5.4)
            + amp * 0.3 * Math.sin(u * 21.7 + t * 0.7);
          // relief creusé/soulevé sous le curseur
          var dx = u - pointer.x, dy = (baseY / h) - pointer.y;
          y -= Math.exp(-(dx * dx) / 0.012 - (dy * dy) / 0.05) * h * 0.075 * (0.35 + f);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(w + step, h + 10);
        ctx.lineTo(0, h + 10);
        ctx.closePath();
        ctx.fillStyle = col.bg;
        ctx.fill();
        ctx.strokeStyle = col.accent;
        ctx.globalAlpha = 0.12 + f * 0.68;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    drawTerrain();
  }

  /* --- caustiques de la section piscines --- */
  var water = $('#water');
  if (water) {
    var W = setupCanvas(water);
    var wcol = tone(water);
    var wt = 0, wvis = false;
    new IntersectionObserver(function (es) { wvis = es[0].isIntersecting; }).observe(water);

    function drawWater() {
      requestAnimationFrame(drawWater);
      if (!wvis) return;
      var s = W.size(), ctx = W.ctx, w = s.w, h = s.h;
      wt += reduced ? 0 : 0.006;
      ctx.clearRect(0, 0, w, h);

      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, wcol.bg);
      g.addColorStop(1, '#06222a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = wcol.accent;
      ctx.lineWidth = 1.1;
      var rows = h < 700 ? 22 : 34;
      for (var i = 0; i < rows; i++) {
        var f = i / rows;
        ctx.globalAlpha = 0.035 + 0.05 * Math.abs(Math.sin(f * 6 + wt * 2));
        ctx.beginPath();
        for (var x = 0; x <= w + 16; x += 16) {
          var u = x / w;
          var y = f * h
            + Math.sin(u * 7 + wt * 3 + f * 9) * (h * 0.028)
            + Math.sin(u * 15 - wt * 2.2 + f * 4) * (h * 0.014);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    drawWater();
  }
})();
