console.log("🎂 Birthday Script Initializing...");

/* ── CONFIG: set Chhavi's birthday ── */
const BIRTHDAY_MONTH = 5;   // 1=Jan…12=Dec
const BIRTHDAY_DAY   = 14;  // day

/* ══════════════════════════════════════
   PRELOADER
══════════════════════════════════════ */
/* Hard cap: always dismiss preloader within 3s, even if assets are still loading */
let preloaderDone = false;
function dismissPreloader() {
  if (preloaderDone) return;
  preloaderDone = true;
  const pl = document.getElementById('preloader');
  if (pl) pl.classList.add('done');
  startHero();
}

window.addEventListener('load', () => setTimeout(dismissPreloader, 1600));
setTimeout(dismissPreloader, 3000); // fallback: never stuck beyond 3s

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0;
let tx = 0, ty = 0;          // trail position
let trail2x = 0, trail2y = 0; // secondary trail dots
const trailDots = [];
const MAX_TRAIL = 8;

/* build fading trail dots */
for (let i = 0; i < MAX_TRAIL; i++) {
  const d = document.createElement('div');
  d.className = 'cursor-trail';
  const scale = 1 - i / MAX_TRAIL;
  d.style.opacity = (scale * 0.5).toFixed(2);
  d.style.width  = (6 * scale) + 'px';
  d.style.height = (6 * scale) + 'px';
  document.body.appendChild(d);
  trailDots.push({ el: d, x: 0, y: 0 });
}

/* remove the original single trail element */
cursorTrail.remove();

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

/* mousedown / up click squish */
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

/* sparkle on move — throttled */
let lastSparkle = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSparkle < 80) return;
  lastSparkle = now;

  const sp = document.createElement('div');
  sp.className = 'cursor-sparkle';
  const size = 3 + Math.random() * 4;
  const angle = Math.random() * Math.PI * 2;
  const dist  = 10 + Math.random() * 18;
  sp.style.cssText = `
    left: ${e.clientX}px; top: ${e.clientY}px;
    width: ${size}px; height: ${size}px;
    background: ${Math.random() > 0.5 ? '#e8c17a' : '#f5dfa0'};
    --dx: ${(Math.cos(angle) * dist).toFixed(1)}px;
    --dy: ${(Math.sin(angle) * dist).toFixed(1)}px;
    box-shadow: 0 0 ${size * 2}px rgba(232,193,122,0.8);
  `;
  document.body.appendChild(sp);
  setTimeout(() => sp.remove(), 620);
});

/* animation loop — cursor snaps, trail lags */
function animateCursor() {
  /* main dot snaps instantly via mousemove, just position it */
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';

  /* each trail dot chases the one ahead */
  let prevX = mx, prevY = my;
  trailDots.forEach((dot, i) => {
    const lag = 0.12 + i * 0.03;
    dot.x += (prevX - dot.x) * lag;
    dot.y += (prevY - dot.y) * lag;
    dot.el.style.left = dot.x + 'px';
    dot.el.style.top  = dot.y + 'px';
    prevX = dot.x; prevY = dot.y;
  });

  requestAnimationFrame(animateCursor);
}
animateCursor();

/* hover state on interactive elements */
const interactiveEls = 'a, button, .gallery-card, .candle, .gnav-btn, .gnav-dot, .music-btn';
document.querySelectorAll(interactiveEls).forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

/* ══════════════════════════════════════
   STAR CANVAS BACKGROUND
══════════════════════════════════════ */
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.006,
      speed: Math.random() * 0.00004 + 0.00002
    });
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a = Math.max(0.05, Math.min(0.9, s.a + s.da));
      if (s.a >= 0.9 || s.a <= 0.05) s.da *= -1;
      s.y -= s.speed;
      if (s.y < -0.01) s.y = 1.01;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 193, 122, ${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  requestAnimationFrame(drawStars);
}
initStarCanvas();

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
function startHero() {
  // Date badge
  const badge = document.getElementById('todayDate');
  if (badge) {
    badge.textContent = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }).toUpperCase();
  }
  // Footer year
  const fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  // Typewriter for name
  typewriterEffect('heroName', 'Chhavi', 120);
}

function typewriterEffect(elId, text, speed) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = '';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 500 : speed);
    }
  }
  setTimeout(type, 200);
}

/* CONFETTI */
function launchConfetti() {
  const colors = ['#e8c17a','#f5dfa0','#c77dff','#ffffff','#b8924a'];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors, shapes: ['circle','square'] });
  setTimeout(() => confetti({ particleCount: 60, angle: 60,  spread: 65, origin: { x: 0, y: 0.6 }, colors }), 350);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 65, origin: { x: 1, y: 0.6 }, colors }), 600);
}

document.getElementById('heroCelebrate').addEventListener('click', launchConfetti);

/* ══════════════════════════════════════
   SCROLL ANIMATIONS
══════════════════════════════════════ */

/* ── Section reveal with staggered children ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');

    /* stagger direct animatable children */
    const children = e.target.querySelectorAll(
      '.section-label, .section-heading, .section-body, ' +
      '.timer-box, .gallery-card, .letter-container, ' +
      '.countdown-today, .countdown-timer, .wish-progress-wrap'
    );
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
      child.classList.add('child-reveal');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => child.classList.add('child-visible'));
      });
    });

    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Hero parallax on scroll ── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroScroll  = document.querySelector('.hero-scroll');
  const starCanvas  = document.getElementById('starCanvas');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const heroH = document.getElementById('hero').offsetHeight;
      if (y > heroH) { ticking = false; return; }

      const progress = y / heroH; // 0 → 1

      /* content drifts up and fades */
      if (heroContent) {
        heroContent.style.transform = `translateY(${y * 0.35}px)`;
        heroContent.style.opacity   = `${1 - progress * 1.6}`;
      }
      /* scroll indicator fades faster */
      if (heroScroll) {
        heroScroll.style.opacity = `${1 - progress * 4}`;
      }
      /* stars drift at slower rate */
      if (starCanvas) {
        starCanvas.style.transform = `translateY(${y * 0.15}px)`;
      }

      ticking = false;
    });
  }, { passive: true });
})();

/* ── Scroll progress bar ── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  Object.assign(bar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    height:     '2px',
    width:      '0%',
    background: 'linear-gradient(90deg, #b8924a, #e8c17a, #f5dfa0)',
    zIndex:     '10001',
    transition: 'width 0.1s linear',
    boxShadow:  '0 0 8px rgba(232,193,122,0.6)',
    pointerEvents: 'none',
  });
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
})();

/* ── Section heading split-letter animation ── */
(function initHeadingSplits() {
  document.querySelectorAll('.section-heading').forEach(heading => {
    /* walk only text nodes so we don't mangle HTML tags like <br> <em> */
    function wrapTextNode(node) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(part => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part) {
          const outer = document.createElement('span');
          outer.className = 'word-wrap';
          const inner = document.createElement('span');
          inner.className = 'word';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      node.parentNode.replaceChild(frag, node);
    }

    /* collect text nodes first, then process (avoid live mutation issues) */
    const textNodes = [];
    (function collect(el) {
      el.childNodes.forEach(n => {
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) textNodes.push(n);
        else if (n.nodeType === Node.ELEMENT_NODE) collect(n);
      });
    })(heading);
    textNodes.forEach(wrapTextNode);
  });

  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.word').forEach((word, i) => {
        word.style.transitionDelay = `${i * 0.06}s`;
        word.classList.add('word-in');
      });
      headingObserver.unobserve(e.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-heading').forEach(h => headingObserver.observe(h));
})();

/* ── Counter number roll-up animation ── */
(function initCounterRoll() {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.num').forEach(numEl => {
        const target = parseInt(numEl.textContent, 10);
        if (isNaN(target)) return;
        let start = 0;
        const dur = 1200;
        const startTime = performance.now();
        function roll(now) {
          const p = Math.min((now - startTime) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          numEl.textContent = String(Math.round(ease * target)).padStart(2, '0');
          if (p < 1) requestAnimationFrame(roll);
        }
        requestAnimationFrame(roll);
      });
      counterObserver.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  const timerBoxes = document.querySelector('.timer-boxes');
  if (timerBoxes) counterObserver.observe(timerBoxes);
})();

/* ══════════════════════════════════════
   COUNTDOWN
══════════════════════════════════════ */
(function initCountdown() {
  const inner = document.getElementById('countdownInner');
  const now = new Date();
  const isToday = now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;

  if (isToday) {
    inner.innerHTML = `
      <div class="countdown-today">
        <span class="cd-firework">🎆</span>
        <h2>It's Your Day, Chhavi</h2>
        <p>Today belongs entirely to you — celebrate every second of it.</p>
      </div>`;
    setTimeout(launchConfetti, 400);
    return;
  }

  const year = now.getFullYear();
  let bday = new Date(year, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
  if (bday < now) bday = new Date(year + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);

  inner.innerHTML = `
    <div class="countdown-timer">
      <h2>The countdown to <em>her</em> day</h2>
      <div class="timer-boxes">
        <div class="timer-box"><span class="num" id="cd-days">--</span><span class="lbl">Days</span></div>
        <div class="timer-box"><span class="num" id="cd-hrs">--</span><span class="lbl">Hours</span></div>
        <div class="timer-box"><span class="num" id="cd-min">--</span><span class="lbl">Minutes</span></div>
        <div class="timer-box"><span class="num" id="cd-sec">--</span><span class="lbl">Seconds</span></div>
      </div>
    </div>`;

  function tick() {
    const diff = bday - new Date();
    if (diff <= 0) { location.reload(); return; }
    document.getElementById('cd-days').textContent = String(Math.floor(diff / 86400000)).padStart(2,'0');
    document.getElementById('cd-hrs').textContent  = String(Math.floor(diff % 86400000 / 3600000)).padStart(2,'0');
    document.getElementById('cd-min').textContent  = String(Math.floor(diff % 3600000 / 60000)).padStart(2,'0');
    document.getElementById('cd-sec').textContent  = String(Math.floor(diff % 60000 / 1000)).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
})();

/* ══════════════════════════════════════
   BIRTHDAY CAKE CANDLES
══════════════════════════════════════ */
(function initCake() {
  const candlesRow   = document.getElementById('candlesRow');
  const sparklesWrap = document.getElementById('cakeSparkles');
  const overlay      = document.getElementById('wishOverlay');
  const modalNum     = document.getElementById('wishModalNum');
  const modalText    = document.getElementById('wishModalText');
  const closeBtn     = document.getElementById('wishModalClose');
  const wishCountEl  = document.getElementById('wishCount');
  const progressFill = document.getElementById('wishProgressFill');

  if (!candlesRow) return;

  const wishes = [
    "Happy birthday! I hope you achieve everything you are working for and never lose confidence in your own abilities.",
    "Wishing you strength to handle every challenge, wisdom to make the right decisions, and peace in every phase of life.",
    "May your future bring good health, genuine people, and success that comes from your own hard work",
    "Hamesha Khush rho hasti rho Chill rho  and hope you miss me😂🤝",
    "At last, Happy Birthday 🎉!! While my college chapter is coming to an end, I just wanted to wish you a really good journey ahead,may your college life, career, and future be filled with success, peace, and good people ✨aur mujhe yaad krte rehna 😂😂😂"
  ];

  /* Candle color palette — rich, varied */
  const candleColors = [
    { body: '#c77dff', drip: '#a855f7' },
    { body: '#60a5fa', drip: '#3b82f6' },
    { body: '#f472b6', drip: '#ec4899' },
    { body: '#34d399', drip: '#10b981' },
    { body: '#fbbf24', drip: '#f59e0b' },
    { body: '#f87171', drip: '#ef4444' },
    { body: '#a78bfa', drip: '#8b5cf6' },
    { body: '#fb923c', drip: '#f97316' },
    { body: '#38bdf8', drip: '#0ea5e9' },
    { body: '#e879f9', drip: '#d946ef' },
  ];

  let litCount = 0;

  /* ── Ambient floating sparkles ── */
  for (let s = 0; s < 28; s++) {
    const sp = document.createElement('div');
    sp.className = 'cake-sparkle';
    sp.style.cssText = `
      left: ${8 + Math.random() * 84}%;
      top:  ${10 + Math.random() * 60}%;
      --dur: ${2.5 + Math.random() * 3}s;
      --del: ${Math.random() * 4}s;
      background: ${Math.random() > 0.5 ? '#e8c17a' : '#fff'};
      width:  ${1.5 + Math.random() * 2.5}px;
      height: ${1.5 + Math.random() * 2.5}px;
    `;
    sparklesWrap.appendChild(sp);
  }

  /* ── Build candles ── */
  wishes.forEach((wish, i) => {
    const c = candleColors[i];

    const candle = document.createElement('div');
    candle.className = 'candle';

    candle.innerHTML = `
      <div class="candle-flame-wrap">
        <div class="candle-flame">
          <div class="flame-halo"></div>
          <div class="flame-outer"></div>
          <div class="flame-inner"></div>
          <div class="flame-core"></div>
        </div>
        <div class="candle-wick"></div>
      </div>
      <div class="candle-body" style="background: linear-gradient(160deg, ${c.body}dd, ${c.body}88);">
        <div class="candle-drip" style="background:${c.drip};"></div>
        <span class="candle-num">${i + 1}</span>
      </div>
    `;

    /* staggered entrance */
    candle.style.opacity = '0';
    candle.style.transform = 'translateY(20px)';
    candle.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(() => {
      candle.style.opacity = '1';
      candle.style.transform = '';
    }, 200 + i * 80);

    candle.addEventListener('click', () => {
      if (candle.classList.contains('lit')) return;

      /* Light it */
      candle.classList.add('lit');
      lightCandle(candle, c);

      litCount++;
      wishCountEl.textContent = litCount;
      progressFill.style.width = (litCount / 5 * 100) + '%';

      /* Show wish modal with slight delay for the light-up animation */
      setTimeout(() => {
        modalNum.textContent  = `Wish ${i + 1} of 5`;
        modalText.textContent = wish;
        overlay.classList.add('open');
      }, 350);

      if (litCount === 5) {
        setTimeout(() => {
          launchConfetti();
          launchFireworks();
        }, 900);
      }
    });

    candlesRow.appendChild(candle);
  });

  /* Close modal */
  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.classList.remove('open'); });
})();

/* ── Light-up effect: ember particles float up from flame ── */
function lightCandle(candle, colors) {
  const flameWrap = candle.querySelector('.candle-flame-wrap');
  const rect = flameWrap.getBoundingClientRect();

  /* Spawn rising embers */
  for (let e = 0; e < 18; e++) {
    setTimeout(() => {
      const ember = document.createElement('div');
      const size = 2 + Math.random() * 3;
      const xDrift = (Math.random() - 0.5) * 60;
      const rise   = 60 + Math.random() * 80;
      const dur    = 0.7 + Math.random() * 0.6;
      Object.assign(ember.style, {
        position:    'fixed',
        left:        (rect.left + rect.width / 2 + (Math.random()-0.5)*10) + 'px',
        top:         (rect.top + rect.height / 2) + 'px',
        width:       size + 'px',
        height:      size + 'px',
        borderRadius:'50%',
        background:  Math.random() > 0.5 ? '#ffcc44' : '#ff8800',
        pointerEvents:'none',
        zIndex:      999,
        transition:  `transform ${dur}s cubic-bezier(0.19,1,0.22,1), opacity ${dur}s ease`,
        boxShadow:   `0 0 ${size*2}px rgba(255,160,0,0.8)`,
      });
      document.body.appendChild(ember);
      requestAnimationFrame(() => {
        ember.style.transform = `translate(${xDrift}px, -${rise}px) scale(0)`;
        ember.style.opacity   = '0';
      });
      setTimeout(() => ember.remove(), dur * 1000 + 100);
    }, e * 35);
  }
}

/* Fireworks for all candles lit */
function launchFireworks() {
  const colors = ['#e8c17a','#c77dff','#f472b6','#60a5fa','#34d399','#fbbf24'];
  [0.2, 0.5, 0.8].forEach((x, i) => {
    setTimeout(() => {
      confetti({ particleCount: 70, angle: 90, spread: 70,
        origin: { x, y: 0.5 }, colors,
        shapes: ['circle', 'square'], scalar: 1.1 });
    }, i * 250);
  });
}

/* ══════════════════════════════════════
   GALLERY SLIDER
══════════════════════════════════════ */
(function initGallery() {
  const inner = document.getElementById('galleryInner');
  const track = document.getElementById('galleryTrack');
  const dotsWrap = document.getElementById('gnavDots');
  const prevBtn = document.getElementById('gnavPrev');
  const nextBtn = document.getElementById('gnavNext');

  if (!inner) return;

  const cards = inner.querySelectorAll('.gallery-card');
  const total = cards.length;
  let current = 0;
  let isDragging = false, startX = 0, startScroll = 0;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'gnav-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateNav() {
    prevBtn.style.opacity = current === 0 ? '0.3' : '1';
    prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = current === total - 1 ? '0.3' : '1';
    nextBtn.style.pointerEvents = current === total - 1 ? 'none' : 'auto';
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(total - 1, idx));
    const cardW = cards[0].offsetWidth + 24;
    inner.style.transform = `translateX(-${current * cardW}px)`;
    dotsWrap.querySelectorAll('.gnav-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
    updateNav();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Drag / swipe
  track.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; startScroll = current; track.style.cursor = 'grabbing'; });
  document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; track.style.cursor = 'grab'; } });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const cardW = cards[0].offsetWidth + 24;
    if (Math.abs(dx) > cardW / 3) {
      isDragging = false;
      track.style.cursor = 'grab';
      goTo(startScroll + (dx < 0 ? 1 : -1));
    }
  });

  // Touch
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const cardW = cards[0].offsetWidth + 24;
    if (Math.abs(dx) > cardW / 4) goTo(current + (dx < 0 ? 1 : -1));
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (document.getElementById('wishOverlay').classList.contains('open')) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  updateNav();
})();

/* ══════════════════════════════════════
   QUOTES MARQUEE — duplicate for seamless loop
══════════════════════════════════════ */
(function initMarquee() {
  const marquee = document.getElementById('quotesMarquee');
  if (!marquee) return;
  const clone = marquee.innerHTML;
  marquee.innerHTML = clone + clone; // seamless infinite scroll
})();

/* ══════════════════════════════════════
   MUSIC TOGGLE
══════════════════════════════════════ */
(function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  function startMusic() {
    audio.play().then(() => {
      playing = true;
      btn.classList.add('playing');
    }).catch(() => {});
  }

  /* try autoplay immediately — works if browser allows it */
  startMusic();

  /* fallback: play on first user interaction */
  function onFirstInteraction() {
    if (!playing) startMusic();
    ['click','scroll','keydown','touchstart'].forEach(ev =>
      document.removeEventListener(ev, onFirstInteraction));
  }
  ['click','scroll','keydown','touchstart'].forEach(ev =>
    document.addEventListener(ev, onFirstInteraction, { once: true, passive: true }));

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
    }
    playing = !playing;
  });
})();