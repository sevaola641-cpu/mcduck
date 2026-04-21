const splash = document.getElementById('splash');
const enterBtn = document.getElementById('enterBtn');
const solanaSky = document.getElementById('solanaSky');
const isHandheld = () => window.matchMedia('(max-width: 900px)').matches;

/* -------------------- Copy CA -------------------- */
(() => {
  const copyBtn = document.getElementById('copyCA');
  const caField = document.getElementById('caField');
  if (!copyBtn || !caField) return;

  const ORIGINAL = copyBtn.textContent || 'Copy';
  const showCopied = () => {
    copyBtn.disabled = true;
    copyBtn.textContent = 'Copied';
    copyBtn.classList.add('is-copied');
    setTimeout(() => {
      copyBtn.disabled = false;
      copyBtn.textContent = ORIGINAL;
      copyBtn.classList.remove('is-copied');
    }, 1600);
  };

  async function doCopy(str) {
    try {
      await navigator.clipboard.writeText(str);
      showCopied();
    } catch {
      const ta = document.createElement('textarea');
      ta.value = str;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); showCopied(); } finally { ta.remove(); }
    }
  }

  const getText = () => (caField.value ?? '').toString();

  copyBtn.addEventListener('click', () => doCopy(getText()));
  copyBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCopy(getText()); }
  });
  caField.addEventListener('click', () => doCopy(getText()));
  caField.addEventListener('focus', () => caField.select());
})();

/* -------------------- Header / burger -------------------- */
(function () {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    header.classList.toggle('site-header--open');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });

  document.querySelectorAll('.site-header .nav__link').forEach(a => {
    a.addEventListener('click', () => {
      header.classList.remove('site-header--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* -------------------- Splash enter -------------------- */
function enterSite() {
  splash?.classList.add('is-hidden');
  startSolanaStorm();
  warmNavLinks();
}
if (enterBtn) {
  enterBtn.addEventListener('click', enterSite);
  enterBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterSite(); }
  });
}

/* -------------------- Global coins -------------------- */
const COIN_COUNT = 40;
const VIEW_W = () => window.innerWidth;

function createCoin(i) {
  const c = document.createElement('div');
  c.className = 'solana-sky__coin';
  const sx = Math.random() * VIEW_W();
  const ex = sx + (Math.random() * 260 - 130);
  const dur = 6 + Math.random() * 10;

  c.style.setProperty('--scale', 0.7 + Math.random() * 1.2);
  c.style.setProperty('--hue', `${Math.floor(Math.random() * 40 - 20)}deg`);
  c.style.left = `${sx}px`;
  c.style.top = `-30px`;
  c.style.setProperty('--x-start', `${sx}px`);
  c.style.setProperty('--x-end', `${ex}px`);
  c.style.animationDuration = `${dur}s`;
  c.style.animationDelay = `${Math.random() * 8}s`;

  solanaSky.appendChild(c);
  c.addEventListener('animationend', () => { c.remove(); if (!document.hidden) createCoin(i); });
}
function startSolanaStorm() {
  for (let i = 0; i < COIN_COUNT; i++) setTimeout(() => createCoin(i), i * 90);
}
function warmNavLinks() {
  document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => burstCoins(10)));
}
function burstCoins(n = 14) {
  const cx = VIEW_W() / 2;
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'solana-sky__coin';
    const sx = cx + (Math.random() * 220 - 110);
    const ex = sx + (Math.random() * 320 - 160);
    const dur = 3 + Math.random() * 6;

    c.style.setProperty('--scale', 0.8 + Math.random() * 1.1);
    c.style.setProperty('--hue', `${Math.floor(Math.random() * 40 - 20)}deg`);
    c.style.left = `${sx}px`;
    c.style.top = `-30px`;
    c.style.setProperty('--x-start', `${sx}px`);
    c.style.setProperty('--x-end', `${ex}px`);
    c.style.animationDuration = `${dur}s`;
    c.style.animationDelay = `${Math.random() * 1.2}s`;

    solanaSky.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.querySelectorAll('.solana-sky__coin').forEach(n => n.remove());
    startSolanaStorm();
  }, 250);
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && splash?.classList.contains('is-hidden')) startSolanaStorm();
});

/* -------------------- Hero block -------------------- */
(() => {
  const hero  = document.getElementById('hero');
  const duck  = document.getElementById('duck');
  const coins = document.getElementById('heroCoins');
  const trail = document.getElementById('heroTrail');
  const burst = document.getElementById('heroBurst');
  if (!hero || !duck || !coins || !trail || !burst) return;

  const GIF_URL = '/images/my.gif';
  let gifShown = false;

  function showHeroGif() {
    if (gifShown) return;
    gifShown = true;

    const img = document.createElement('img');
    img.src = GIF_URL;
    img.alt = '';
    img.className = 'hero-v2__gif';
    hero.appendChild(img);

    const reveal = () => requestAnimationFrame(() => img.classList.add('is-in'));
    if (img.decode) img.decode().then(reveal).catch(reveal);
    else img.addEventListener('load', reveal, { once: true });
  }

  const MAX_COINS = window.innerWidth >= 1200 ? 90 :
                    window.innerWidth >= 768  ? 60 : 36;

  function spawnCoin() {
    const c = document.createElement('div');
    c.className = 'hero-v2__coin';
    const vw = hero.clientWidth;
    const sx = Math.random() * vw;
    const drift = (Math.random() * 280 - 140);
    const dur = 6 + Math.random() * 10;

    c.style.setProperty('--scale', 0.8 + Math.random() * 1.4);
    c.style.setProperty('--hue', `${Math.floor(Math.random() * 40 - 20)}deg`);
    c.style.left = `${sx}px`;
    c.style.setProperty('--x', `${sx}px`);
    c.style.setProperty('--dx', `${drift}px`);
    c.style.animationDuration = `${dur}s`;
    c.style.animationDelay = `${Math.random() * 5}s`;

    coins.appendChild(c);
    c.addEventListener('animationend', () => { c.remove(); if (!document.hidden) spawnCoin(); });
  }
  for (let i = 0; i < MAX_COINS; i++) setTimeout(spawnCoin, i * 80);

 

  function pathPoints() {
    const w = hero.clientWidth, h = hero.clientHeight;

    const start = { x: w * 0.78, y: -h * 0.18 };
    const ctrl  = { x: w * 0.50, y:  h * 0.12 };

    let end = { x: 8, y: h * 0.72 };

    if (isHandheld()) {
      end = { x: -w * 0.45, y: h * 1.25 };
    } else if (w < 900) {
      end.y = h * 0.62;
    }
    return { start, ctrl, end };
  }

  const bezier = (p0, p1, p2, t) => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y
  });
  const tangent = (p0, p1, p2, t) => {
    const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    return Math.atan2(dy, dx);
  };

  const SPLASH_TRIGGER_PX = 700;
  const SPLASH_COUNT = 42;

  function hideDuckNow() {
    duck.style.transition = 'opacity 220ms ease';
    duck.style.opacity = '0';
    duck.style.pointerEvents = 'none';
    setTimeout(() => duck.remove(), 260);
  }

  let landed = false;
  let duckHidden = false;
  let hideTimer = null;

  function runDive() {
    if (landed) return;
    const { start, ctrl, end } = pathPoints();

    const duration = 1200;
    const t0 = performance.now();
    let lastTrail = 0;
    let splashed = false;

    function frame(now) {
      const t = Math.min((now - t0) / duration, 1);
      const pos = bezier(start, ctrl, end, t);
      const ang = tangent(start, ctrl, end, t) + Math.PI * 1.05;

      if (!duckHidden) {
        duck.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${ang * 180 / Math.PI}deg)`;
      }

      if (!splashed) {
        const dx = end.x - pos.x, dy = end.y - pos.y;
        if ((dx * dx + dy * dy) <= SPLASH_TRIGGER_PX * SPLASH_TRIGGER_PX) {
          splashed = true;
          splashAt(pos.x, pos.y, SPLASH_COUNT);

          hideTimer = setTimeout(() => {
            if (!duckHidden) {
              hideDuckNow();
              duckHidden = true;
              showHeroGif();
            }
          }, 1000);
        }
      }

      if (now - lastTrail > 40 && t < 0.98 && !duckHidden) {
        lastTrail = now;
        const tc = document.createElement('div');
        tc.className = 'trail-coin';
        tc.style.left = `${pos.x}px`;
        tc.style.top  = `${pos.y}px`;
        trail.appendChild(tc);
        tc.addEventListener('animationend', () => tc.remove());
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        landed = true;

        if (splashed && !duckHidden) return;

        duck.style.transform = `translate(${end.x}px, ${end.y}px) rotate(-18deg)`;
        if (isHandheld()) {
          hideDuckNow();
          showHeroGif();
        } else {
          duck.classList.add('hero-v2__duck--landed');
          const onSettleEnd = () => {
            duck.removeEventListener('animationend', onSettleEnd);
            duck.classList.remove('hero-v2__duck--landed');
            duck.classList.add('hero-v2__duck--rock');
            showHeroGif();
            hideDuckNow();
            duckHidden = true;
          };
          duck.addEventListener('animationend', onSettleEnd, { once: true });
          setTimeout(() => {
            if (!gifShown) { showHeroGif(); hideDuckNow(); duckHidden = true; }
          }, 900);
        }
      }
    }
    requestAnimationFrame(frame);
  }

  function splashAt(x, y, n = 32) {
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'splash-coin';
      c.style.left = `${x}px`;
      c.style.top  = `${y}px`;
      const a = Math.random() * Math.PI * 2;
      const power = 90 + Math.random() * 170;
      c.style.setProperty('--ex', `${Math.cos(a) * power}px`);
      c.style.setProperty('--ey', `${Math.sin(a) * power}px`);
      c.style.setProperty('--rr', `${Math.floor(Math.random() * 540)}deg`);
      c.style.setProperty('--dur', `${1 + Math.random() * 1.2}s`);
      burst.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }
  }

  const cta = hero.querySelector('.hero-v2__button.button--primary');
  const io = new IntersectionObserver(
    (entries) => { entries.forEach(e => { if (e.isIntersecting) runDive(); }); },
    { threshold: .55 }
  );
  io.observe(hero);
  cta?.addEventListener('click', (e) => { e.preventDefault(); runDive(); });
})();

/* -------------------- Reveal-on-scroll -------------------- */
(function () {
  const add = (sel, cls) => document.querySelectorAll(sel).forEach(el => el.classList.add('reveal', cls));

  add('.page__section:not(#hero)', 'reveal-up');
  add('.tokenomics__card', 'reveal-zoom');
  add('.howto__duck', 'reveal-right');
  add('.history__card', 'reveal-left');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        if (!el.dataset.staggered && el.parentElement) {
          const siblings = [...el.parentElement.children].filter(n => n.classList.contains('reveal'));
          siblings.forEach((n, i) => {
            if (!n.dataset.staggered) {
              n.style.animationDelay = `${0.12 * i}s`;
              n.dataset.staggered = '1';
            }
          });
        }
        el.classList.add('inview');
        io.unobserve(el);
      }
    });
  }, { threshold: .2, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
(() => {
  const test = CSS.supports('height', '1svh');
  if (test) return;
  const set = () =>
    document.documentElement.style.setProperty('--vh-fix', (window.innerHeight * 0.01) + 'px');
  set();
  window.addEventListener('resize', set);
  // и подменим peek на фиксированные px
  const style = document.createElement('style');
  style.textContent = `.hero-v2{ --gif-peek: calc(var(--vh-fix) * 50) !important; }`;
  document.head.appendChild(style);
})();