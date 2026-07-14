/* ================================================
   NOURA PORTFOLIO — script.js
   City canvas · Character guide · Interactions
   ================================================ */

// ── BOOT / LOADING SCREEN ──────────────────────
(function() {
  const boot = document.getElementById('bootScreen');
  const fill = document.getElementById('bootBarFill');
  const pctEl = document.getElementById('bootPct');
  const tipEl = document.getElementById('bootTip');
  if (!boot) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.style.overflow = 'hidden';

  const tips = [
    'Initialisation...',
    'Compilation des composants...',
    'Chargement des projets...',
    'Connexion à la base de compétences...',
    'Optimisation des pixels...',
    'Presque prêt...'
  ];
  let tipIndex = 0;
  const tipTimer = reduceMotion ? null : setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    tipEl.textContent = tips[tipIndex];
  }, 450);

  let progress = 0;
  const startTime = Date.now();
  const MIN_DURATION = reduceMotion ? 0 : 1300;
  let rafId;

  function tick() {
    progress = Math.min(96, progress + (Math.random() * 10 + 4));
    fill.style.width = progress + '%';
    pctEl.textContent = Math.floor(progress) + '%';
    if (progress < 96) rafId = setTimeout(tick, 90);
  }
  tick();

  function finish() {
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => {
      clearTimeout(rafId);
      if (tipTimer) clearInterval(tipTimer);
      fill.style.width = '100%';
      pctEl.textContent = '100%';
      tipEl.textContent = 'Prêt !';
      setTimeout(() => {
        boot.classList.add('boot-done');
        document.body.style.overflow = '';
        setTimeout(() => boot.remove(), 550);
      }, 200);
    }, wait);
  }

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
  // Sécurité : si le chargement traîne (gros PDF, connexion lente), on force après 5s
  setTimeout(finish, 5000);
})();


// ── PIXEL CITY BACKGROUND ──────────────────────
(function() {
  const canvas = document.getElementById('cityCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawCity();
  }

  const COLORS = {
    sky: '#0d0b1e',
    moon: '#f9c74f',
    moonGlow: 'rgba(249,199,79,0.12)',
    cloud1: '#b5838d',
    cloud2: '#c77dff',
    buildingA: ['#1a1640','#251d6b','#1e1553','#2d1b69'],
    buildingB: ['#6b3fa0','#4361ee','#480ca8','#3a0ca3'],
    window: '#f9c74f',
    windowCyan: '#4cc9f0',
    windowPink: '#f72585',
    ground: '#12102a',
    street: '#0d0b1e'
  };

  let stars = [];
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2
    });
  }

  let cloudOffset = 0;
  let t = 0;

  function drawCity() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0d0b1e');
    sky.addColorStop(1, '#1a1045');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      const alpha = 0.5 + 0.5 * Math.sin(s.twinkle + t * 0.02);
      ctx.fillStyle = `rgba(232,224,255,${alpha})`;
      ctx.fillRect(s.x * W | 0, s.y * H * 0.6 | 0, s.r | 0, s.r | 0);
      s.twinkle += 0.03;
    });

    // Moon
    const moonX = W * 0.82, moonY = H * 0.28, moonR = Math.min(H * 0.18, 44);
    ctx.fillStyle = COLORS.moonGlow;
    ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 1.8, 0, Math.PI * 2); ctx.fill();
    // pixel moon
    const PS = (moonR / 5) | 0 || 4;
    for (let py = -5; py <= 5; py++) {
      for (let px = -5; px <= 5; px++) {
        if (px*px + py*py <= 22) {
          ctx.fillStyle = COLORS.moon;
          ctx.fillRect((moonX + px*PS)|0, (moonY + py*PS)|0, PS, PS);
        }
      }
    }

    // Pixel clouds
    function drawCloud(x, y, w, clr) {
      const ps = 4;
      const pattern = [
        [0,1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,0]
      ];
      ctx.fillStyle = clr;
      pattern.forEach((row, ry) => {
        row.forEach((cell, rx) => {
          if (cell) ctx.fillRect((x + rx * ps * 2)|0, (y + ry * ps)|0, ps * 2, ps);
        });
      });
    }
    drawCloud((W * 0.15 + cloudOffset) % (W + 160) - 80, H * 0.15, 0, COLORS.cloud1);
    drawCloud((W * 0.55 + cloudOffset * 0.6) % (W + 160) - 80, H * 0.08, 0, COLORS.cloud2);

    // Buildings (silhouette layer)
    const buildings = [
      {x:0.02, w:0.06, h:0.72, clr:COLORS.buildingA[0]},
      {x:0.09, w:0.05, h:0.60, clr:COLORS.buildingA[1]},
      {x:0.15, w:0.08, h:0.80, clr:COLORS.buildingB[0]},
      {x:0.24, w:0.04, h:0.55, clr:COLORS.buildingA[2]},
      {x:0.29, w:0.06, h:0.85, clr:COLORS.buildingB[1]},
      {x:0.36, w:0.05, h:0.65, clr:COLORS.buildingA[3]},
      {x:0.42, w:0.07, h:0.90, clr:COLORS.buildingB[2]},
      {x:0.50, w:0.04, h:0.58, clr:COLORS.buildingA[0]},
      {x:0.55, w:0.08, h:0.78, clr:COLORS.buildingB[3]},
      {x:0.64, w:0.05, h:0.68, clr:COLORS.buildingA[1]},
      {x:0.70, w:0.06, h:0.95, clr:COLORS.buildingB[0]},
      {x:0.77, w:0.05, h:0.62, clr:COLORS.buildingA[2]},
      {x:0.83, w:0.07, h:0.75, clr:COLORS.buildingB[1]},
      {x:0.91, w:0.04, h:0.50, clr:COLORS.buildingA[3]},
      {x:0.96, w:0.05, h:0.70, clr:COLORS.buildingB[2]},
    ];

    buildings.forEach(b => {
      const bx = (b.x * W) | 0, bw = (b.w * W) | 0;
      const bh = (b.h * H) | 0, by = H - bh;
      ctx.fillStyle = b.clr;
      ctx.fillRect(bx, by, bw, bh);

      // Windows
      const PS = 4, gap = 10;
      const cols = Math.floor((bw - gap) / (PS * 2 + gap));
      const rows = Math.floor((bh * 0.7) / (PS + gap));
      for (let wr = 0; wr < rows; wr++) {
        for (let wc = 0; wc < cols; wc++) {
          const wx = bx + gap + wc * (PS * 2 + gap);
          const wy = by + gap + wr * (PS + gap);
          const roll = Math.sin(wx * 0.3 + wy * 0.7) > 0.1;
          if (roll) {
            const colorPick = (wx + wy) % 5;
            ctx.fillStyle = colorPick < 3 ? COLORS.window :
                            colorPick === 3 ? COLORS.windowCyan : COLORS.windowPink;
            ctx.fillRect(wx, wy, PS * 2, PS);
          }
        }
      }
    });

    // Ground
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, H - 18, W, 18);
    // Street dashes
    ctx.fillStyle = '#2a2650';
    for (let x = 0; x < W; x += 30) ctx.fillRect(x, H - 9, 18, 2);
  }

  function animate() {
    cloudOffset = (cloudOffset + 0.4) % (canvas.width + 200);
    t++;
    drawCity();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();


// ── PIXEL CHARACTER (NPC Guide) ────────────────
(function() {
  const canvas = document.getElementById('characterCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const PS = 4; // pixel size

  // Sprite palette (girl with dark hair, coding vibe)
  const SKIN  = '#f5cba7';
  const HAIR  = '#1a0a2e';
  const SHIRT = '#9b5de5';
  const PANT  = '#3a0ca3';
  const SHOE  = '#0d0b1e';
  const EYE   = '#0d0b1e';
  const CHEEK = '#f72585';
  const _ = null;

  // Sprite frames [0=idle, 1=wave]
  const frames = [
    // Frame 0: idle
    [
      [_,_,HAIR,HAIR,HAIR,HAIR,_,_],
      [_,HAIR,SKIN,SKIN,SKIN,SKIN,HAIR,_],
      [HAIR,SKIN,EYE,SKIN,SKIN,EYE,SKIN,HAIR],
      [HAIR,SKIN,SKIN,SKIN,SKIN,SKIN,SKIN,HAIR],
      [_,HAIR,SKIN,CHEEK,CHEEK,SKIN,HAIR,_],
      [_,_,SHIRT,SHIRT,SHIRT,SHIRT,_,_],
      [_,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,_],
      [_,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,_],
      [_,_,PANT,PANT,PANT,PANT,_,_],
      [_,_,PANT,PANT,PANT,PANT,_,_],
      [_,SHOE,SHOE,_,_,SHOE,SHOE,_],
      [_,SHOE,SHOE,_,_,SHOE,SHOE,_],
    ],
    // Frame 1: wave arm up
    [
      [_,_,HAIR,HAIR,HAIR,HAIR,SHIRT,_],
      [_,HAIR,SKIN,SKIN,SKIN,SKIN,HAIR,SHIRT],
      [HAIR,SKIN,EYE,SKIN,SKIN,EYE,SKIN,SKIN],
      [HAIR,SKIN,SKIN,SKIN,SKIN,SKIN,SKIN,_],
      [_,HAIR,SKIN,CHEEK,CHEEK,SKIN,HAIR,_],
      [_,_,SHIRT,SHIRT,SHIRT,SHIRT,_,_],
      [SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,_],
      [_,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,SHIRT,_],
      [_,_,PANT,PANT,PANT,PANT,_,_],
      [_,_,PANT,PANT,PANT,PANT,_,_],
      [_,SHOE,SHOE,_,_,SHOE,SHOE,_],
      [_,SHOE,SHOE,_,_,SHOE,SHOE,_],
    ]
  ];

  let frame = 0;
  let tick = 0;

  function drawChar(f) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sprite = frames[f];
    sprite.forEach((row, ry) => {
      row.forEach((clr, rx) => {
        if (clr) {
          ctx.fillStyle = clr;
          ctx.fillRect(rx * PS + 8, ry * PS + 4, PS, PS);
        }
      });
    });
  }

  function animate() {
    tick++;
    if (tick % 30 === 0) frame = frame === 0 ? 1 : 0;
    drawChar(frame);
    requestAnimationFrame(animate);
  }

  animate();
})();


// ── GUIDE MESSAGES ─────────────────────────────
const guideMessages = {
  hero:     "Bienvenue dans mon portfolio ! Je suis Noura.",
  moi:      "Ici tu découvres qui je suis et mes compétences !",
  parcours: "Mon parcours académique, niveau par niveau.",
  projets:  "Mes projets... clique sur une carte pour voir les détails !",
  stages:   "Mon expérience terrain dans le vrai monde !",
  veilles:  "Je reste toujours à jour sur les nouvelles technologies !",
  contact:  "Tu veux me contacter ? Je réponds vite !"
};

function showGuideMsg(msg) {
  const el = document.getElementById('guideText');
  const bubble = document.getElementById('guideBubble');
  if (!el || !bubble) return;
  bubble.classList.remove('hidden');
  el.textContent = msg;
  clearTimeout(window._guideTimer);
  window._guideTimer = setTimeout(() => {
    bubble.classList.add('hidden');
  }, 5000);
}

// Click on guide to show/hide bubble
const guide = document.getElementById('guide');
if (guide) {
  guide.addEventListener('click', () => {
    const bubble = document.getElementById('guideBubble');
    if (bubble.classList.contains('hidden')) {
      showGuideMsg("Salut ! Tu as besoin d'aide ? Clique sur une section !");
    } else {
      bubble.classList.add('hidden');
    }
  });
}

// Nav links trigger guide messages
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', function() {
    const msg = this.getAttribute('data-msg');
    if (msg) showGuideMsg(msg);
  });
});


// ── INTERSECTION OBSERVER (nav highlight + guide) ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
      if (guideMessages[id]) showGuideMsg(guideMessages[id]);
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));


// ── TABS ────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const content = document.getElementById(id);
  if (content) content.classList.add('active');
  event.target.classList.add('active');
}


// ── MODAL ───────────────────────────────────────
function openModal(key) {
  const tmpl = document.getElementById('modal-' + key);
  if (!tmpl) return;
  const box = document.getElementById('modal-content');
  box.innerHTML = '';
  box.appendChild(tmpl.content.cloneNode(true));
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const msgs = {
    bataille: "Bataille Navale en PHP, mon tout premier projet !",
    gite:     "Modélisation BDD — j'adore le SQL !",
    bubbly:   "Bubbly, une app de chat que j'ai codée avec mon groupe !",
    hotel:    "Hôtel Neptune, un site PHP complet.",
    python:   "Système de réservation en Python orienté objet",
    stage1:   "Mon premier stage ! Une vraie expérience"
  };
  if (msgs[key]) showGuideMsg(msgs[key]);
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.body.style.overflow = '';
  }
});


// ── CONTACT FORM ─────────────────────────────────
// URL de l'API backend (Express + PostgreSQL). En local, laisse tel quel :
// il faut que "npm start" tourne dans le dossier backend/ pour que ça marche.
// Si tu déploies le backend en ligne un jour, remplace par son URL publique.
const API_URL = 'http://localhost:3000/api/contact';

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const toast = document.getElementById('form-toast');
    const submitBtn = form.querySelector('button[type="submit"]');

    const payload = {
      nom:     document.getElementById('f-name').value,
      email:   document.getElementById('f-email').value,
      objet:   document.getElementById('f-subject').value,
      message: document.getElementById('f-message').value,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = '▶ ENVOI...';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');

      toast.textContent = 'Message envoyé !';
      toast.classList.remove('error');
      toast.classList.remove('hidden');
      form.reset();
      showGuideMsg("Message envoyé ! Je reviens vers toi très vite.");
    } catch (err) {
      toast.textContent = (err.message === 'Failed to fetch'
        ? "Le serveur backend n'est pas lancé (npm start dans backend/)."
        : err.message);
      toast.classList.add('error');
      toast.classList.remove('hidden');
      showGuideMsg("Oups, le message n'est pas parti. Réessaie !");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '▶ ENVOYER';
      setTimeout(() => toast.classList.add('hidden'), 4000);
    }
  });
}


// ── MOBILE NAV TOGGLE ─────────────────────────────
(function() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
})();


// ── SCROLL PROGRESS (XP BAR) ──────────────────────
(function() {
  const fill = document.getElementById('scrollXpFill');
  if (!fill) return;
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    fill.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();


// ── BACK TO TOP ────────────────────────────────────
(function() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  function toggleBtn() {
    btn.classList.toggle('hidden', window.scrollY < 500);
  }
  document.addEventListener('scroll', toggleBtn, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleBtn();
})();


// ── SKILL BARS ANIMATION ON SCROLL ───────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.style.width;
      el.style.width = '0';
      setTimeout(() => { el.style.transition = 'width 1s ease'; el.style.width = target; }, 100);
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
skillFills.forEach(f => skillObserver.observe(f));


// ── AVATAR PIXEL FALLBACK ────────────────────────
const avatarCanvas = document.getElementById('avatarPixel');
if (avatarCanvas) {
  const ctx = avatarCanvas.getContext('2d');
  ctx.fillStyle = '#9b5de5';
  ctx.fillRect(0, 0, 120, 120);
  ctx.fillStyle = '#f5cba7';
  ctx.fillRect(40, 20, 40, 40);
  ctx.fillStyle = '#1a0a2e';
  ctx.fillRect(30, 10, 60, 24);
  ctx.fillStyle = '#6b3fa0';
  ctx.fillRect(30, 60, 60, 40);
  ctx.fillStyle = '#0d0b1e';
  ctx.fillRect(46, 32, 8, 8);
  ctx.fillRect(66, 32, 8, 8);
}

// ── INTERACTIVE TERMINAL ─────────────────────────
(function() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const inner = document.getElementById('screenInner');
  if (!form || !input || !inner) return;

  function printLine(text, cls) {
    const line = document.createElement('div');
    line.className = 'screen-line ' + (cls || 'term-out');
    line.textContent = text;
    inner.appendChild(line);
    inner.scrollTop = inner.scrollHeight;
  }

  const commands = {
    help: () => [
      'Commandes disponibles :',
      'whoami · skills · projects · contact · cv',
      'stage · veille · sudo hire-me · clear'
    ],
    whoami: () => ['Noura Guello Ibrahim — BTS SIO, option SISR — EPSI Montpellier'],
    skills: () => ['PHP · Python · SQL · HTML/CSS · JavaScript · WordPress · Bash · PowerShell'],
    ls: () => ['moi/  parcours/  projets/  stages/  veilles/  contact/'],
    projects: () => { location.hash = '#projets'; return ['→ direction #projets ...']; },
    stage: () => { location.hash = '#stages'; return ['→ direction #stages ...']; },
    veille: () => { location.hash = '#veilles'; return ['→ direction #veilles ...']; },
    contact: () => { location.hash = '#contact'; return ['→ direction #contact ...']; },
    cv: () => { window.open('docs/CV_INFORMATIQUE_noura.pdf', '_blank'); return ['→ ouverture du CV dans un nouvel onglet']; },
    'sudo hire-me': () => ['Permission accordée.', 'Contacte-moi vite : Nouraguelloibrahim@gmail.com'],
    clear: () => { inner.innerHTML = ''; return null; },
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    printLine('guest@noura:~$ ' + raw, 'term-echo');
    const key = raw.toLowerCase();
    const handler = commands[key];
    if (handler) {
      const out = handler();
      if (out) out.forEach(l => printLine('→ ' + l, 'term-out'));
    } else {
      printLine(`→ commande introuvable : "${raw}" — tape "help"`, 'term-out');
    }
    input.value = '';
  });
})();


// ── WELCOME MESSAGE ──────────────────────────────
setTimeout(() => {
  showGuideMsg("Bienvenue ! Je suis Noura, ton guide pixel. Explore mon portfolio !");
}, 800);
