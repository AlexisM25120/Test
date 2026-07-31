(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  var progressFill = document.getElementById('progressFill');
  var ticking = false;
  function updateProgress(){
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressFill.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(updateProgress); ticking = true; }
  });
  updateProgress();

  // Build a skyline layer
  function buildSkyline(container, count, opts){
    var w = container.clientWidth || 1200;
    var cursor = -2;
    for(var i=0;i<count;i++){
      var bw = opts.minW + Math.random()*(opts.maxW-opts.minW);
      var bh = opts.minH + Math.random()*(opts.maxH-opts.minH);
      var gap = opts.gap[0] + Math.random()*(opts.gap[1]-opts.gap[0]);
      var el = document.createElement('div');
      el.className = 'bldg';
      el.style.left = cursor + 'px';
      el.style.width = bw + 'px';
      el.style.height = bh + '%';
      el.style.background = 'linear-gradient(180deg,' + opts.c1 + ',' + opts.c2 + ')';
      el.style.setProperty('--glow', (0.25 + Math.random()*0.5).toFixed(2));
      el.style.setProperty('--fd', (Math.random()*6).toFixed(2) + 's');
      container.appendChild(el);
      cursor += bw + gap;
      if(cursor > w + 40 && i > 4) break;
    }
    return w;
  }

  buildSkyline(document.getElementById('riseFar'), 26, { minW:26, maxW:52, minH:22, maxH:46, gap:[2,10], c1:'#233349', c2:'#131f30' });
  buildSkyline(document.getElementById('riseMid'), 18, { minW:38, maxW:78, minH:32, maxH:64, gap:[6,18], c1:'#2c3f57', c2:'#16233a' });
  var nearContainer = document.getElementById('riseNear');
  var nearWidth = buildSkyline(nearContainer, 11, { minW:56, maxW:118, minH:44, maxH:88, gap:[14,34], c1:'#374d68', c2:'#182236' });

  // Burj Khalifa — the recognizable centerpiece of the skyline
  var khalifa = document.createElement('div');
  khalifa.className = 'bldg landmark-khalifa';
  khalifa.style.left = (nearWidth * 0.44) + 'px';
  khalifa.style.width = '48px';
  khalifa.style.height = '94%';
  khalifa.style.setProperty('--glow', '0.55');
  var spire = document.createElement('div');
  spire.className = 'khalifa-spire';
  khalifa.appendChild(spire);
  nearContainer.appendChild(khalifa);

  requestAnimationFrame(function(){
    document.documentElement.classList.add('js-ready');
  });

  // Mouse parallax on the 3D scene
  var scene = document.getElementById('scene');
  if(!reduced){
    var hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      scene.style.transform = 'rotateX(' + (3 - py*4) + 'deg) rotateY(' + (px*5) + 'deg)';
    });
    hero.addEventListener('mouseleave', function(){
      scene.style.transform = 'rotateX(3deg) rotateY(0deg)';
    });
  }

  // Stars
  var starCanvas = document.getElementById('starCanvas');
  var sctx = starCanvas.getContext('2d');
  var stars = [];
  function sizeCanvas(cv){
    var r = cv.parentElement.getBoundingClientRect();
    cv.width = r.width; cv.height = r.height;
    return r;
  }
  var sr = sizeCanvas(starCanvas);
  for(var s=0; s<70; s++){
    stars.push({ x: Math.random()*sr.width, y: Math.random()*sr.height*0.6, r: Math.random()*1.4+0.3, p: Math.random()*Math.PI*2 });
  }
  function drawStars(t){
    sctx.clearRect(0,0,starCanvas.width, starCanvas.height);
    stars.forEach(function(st){
      var a = reduced ? 0.5 : 0.35 + 0.35*Math.sin(t/1200 + st.p);
      sctx.fillStyle = 'rgba(237,230,214,' + a.toFixed(2) + ')';
      sctx.beginPath();
      sctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      sctx.fill();
    });
    if(!reduced) requestAnimationFrame(drawStars);
  }
  requestAnimationFrame(drawStars);

  // Drifting dust / light motes
  var dustCanvas = document.getElementById('dustCanvas');
  var dctx = dustCanvas.getContext('2d');
  var dr = sizeCanvas(dustCanvas);
  var motes = [];
  for(var m=0; m<36; m++){
    motes.push({
      x: Math.random()*dr.width,
      y: Math.random()*dr.height,
      r: Math.random()*1.6+0.4,
      vy: -(0.06 + Math.random()*0.14),
      vx: (Math.random()-0.5)*0.05,
      a: Math.random()*0.5+0.15
    });
  }
  function drawDust(){
    dctx.clearRect(0,0,dustCanvas.width, dustCanvas.height);
    motes.forEach(function(mt){
      mt.y += mt.vy; mt.x += mt.vx;
      if(mt.y < -4) mt.y = dr.height + 4;
      dctx.fillStyle = 'rgba(230,205,147,' + mt.a + ')';
      dctx.beginPath();
      dctx.arc(mt.x, mt.y, mt.r, 0, Math.PI*2);
      dctx.fill();
    });
    if(!reduced) requestAnimationFrame(drawDust);
  }
  if(!reduced){ requestAnimationFrame(drawDust); } else { drawDust(); }

  // Filmstrip controls
  var strip = document.getElementById('filmstrip');
  var prevBtn = document.querySelector('.fs-prev');
  var nextBtn = document.querySelector('.fs-next');
  if(strip && prevBtn && nextBtn){
    prevBtn.addEventListener('click', function(){
      strip.scrollBy({ left: -364, behavior: reduced ? 'auto' : 'smooth' });
    });
    nextBtn.addEventListener('click', function(){
      strip.scrollBy({ left: 364, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  // Rail scrollspy
  var railLinks = document.querySelectorAll('.rail-link');
  var sections = document.querySelectorAll('#top, #biens, #agence, #avis, #contact');
  if('IntersectionObserver' in window && railLinks.length){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          railLinks.forEach(function(l){ l.classList.toggle('active', l.dataset.section === en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(function(sec){ spy.observe(sec); });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function(it){ io.observe(it); });
  } else {
    items.forEach(function(it){ it.classList.add('is-visible'); });
  }
})();
