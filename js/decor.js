/*
 * Dessine la ville en pixels dans le canvas placé en bas de la page.
 * Le décor reste fixe ; il est seulement recalculé si la fenêtre change de taille.
 */

(() => {
  "use strict";

  const canvas = document.getElementById("cityCanvas");
  if (!canvas) return;
  // Le contexte 2D est l’outil qui permet de dessiner dans le canvas.
  // S’il n’est pas disponible, on laisse simplement le fond de couleur du site.
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // La taille du dessin suit celle du canvas affiché. Modifier ses dimensions
  // efface son contenu, donc on redessine la ville juste après.
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawCity();
  }

  // Les couleurs du décor sont rassemblées ici pour pouvoir changer facilement l’ambiance.
  const COLORS = {
    moon: "#f9c74f",
    moonGlow: "rgba(249,199,79,0.12)",
    cloud1: "#b5838d",
    cloud2: "#c77dff",
    buildingA: ["#1a1640", "#251d6b", "#1e1553", "#2d1b69"],
    buildingB: ["#6b3fa0", "#4361ee", "#480ca8", "#3a0ca3"],
    window: "#f9c74f",
    windowCyan: "#4cc9f0",
    windowPink: "#f72585",
    ground: "#12102a",
  };

  // On choisit les positions des étoiles une seule fois au chargement.
  // Elles gardent ensuite leur place relative dans le ciel, sans scintiller.
  const stars = [];
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    });
  }

  const cloudOffset = 0;

  // Le décor est redessiné uniquement quand la taille de la fenêtre change.
  function drawCity() {
    const W = canvas.width,
      H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // On commence par le ciel, puis on dessine les étoiles, la lune et les bâtiments par-dessus.
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0d0b1e");
    sky.addColorStop(1, "#1a1045");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // Les coordonnées sont des proportions : on les multiplie par la taille actuelle du dessin.
    // L’opérateur | 0 retire la partie décimale pour placer les carrés sur des pixels entiers.
    stars.forEach((s) => {
      // On conserve la luminosité variée du dessin d’origine, sans la faire évoluer.
      const alpha = 0.5 + 0.5 * Math.sin(s.twinkle);
      ctx.fillStyle = `rgba(232,224,255,${alpha})`;
      ctx.fillRect((s.x * W) | 0, (s.y * H * 0.6) | 0, s.r | 0, s.r | 0);
    });
    const moonX = W * 0.82,
      moonY = H * 0.28,
      moonR = Math.min(H * 0.18, 44);
    ctx.fillStyle = COLORS.moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 1.8, 0, Math.PI * 2);
    ctx.fill();
    // La lune est faite de petits carrés pour garder le même style pixel que le reste du décor.
    const PS = (moonR / 5) | 0 || 4;
    for (let py = -5; py <= 5; py++) {
      for (let px = -5; px <= 5; px++) {
        if (px * px + py * py <= 22) {
          ctx.fillStyle = COLORS.moon;
          ctx.fillRect((moonX + px * PS) | 0, (moonY + py * PS) | 0, PS, PS);
        }
      }
    }
    // Dans ce modèle de nuage, 1 dessine un carré et 0 laisse un espace vide.
    function drawCloud(x, y, clr) {
      const ps = 4;
      const pattern = [
        [0, 1, 1, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 0],
      ];
      ctx.fillStyle = clr;
      pattern.forEach((row, ry) => {
        row.forEach((cell, rx) => {
          if (cell)
            ctx.fillRect((x + rx * ps * 2) | 0, (y + ry * ps) | 0, ps * 2, ps);
        });
      });
    }
    drawCloud(
      ((W * 0.15 + cloudOffset) % (W + 160)) - 80,
      H * 0.15,
      COLORS.cloud1,
    );
    drawCloud(
      ((W * 0.55 + cloudOffset * 0.6) % (W + 160)) - 80,
      H * 0.08,
      COLORS.cloud2,
    );
    // Chaque bâtiment utilise une position, une largeur et une hauteur proportionnelles au canvas.
    // Par exemple, x: 0.5 place son bord gauche au milieu de la largeur disponible.
    const buildings = [
      { x: 0.02, w: 0.06, h: 0.72, clr: COLORS.buildingA[0] },
      { x: 0.09, w: 0.05, h: 0.6, clr: COLORS.buildingA[1] },
      { x: 0.15, w: 0.08, h: 0.8, clr: COLORS.buildingB[0] },
      { x: 0.24, w: 0.04, h: 0.55, clr: COLORS.buildingA[2] },
      { x: 0.29, w: 0.06, h: 0.85, clr: COLORS.buildingB[1] },
      { x: 0.36, w: 0.05, h: 0.65, clr: COLORS.buildingA[3] },
      { x: 0.42, w: 0.07, h: 0.9, clr: COLORS.buildingB[2] },
      { x: 0.5, w: 0.04, h: 0.58, clr: COLORS.buildingA[0] },
      { x: 0.55, w: 0.08, h: 0.78, clr: COLORS.buildingB[3] },
      { x: 0.64, w: 0.05, h: 0.68, clr: COLORS.buildingA[1] },
      { x: 0.7, w: 0.06, h: 0.95, clr: COLORS.buildingB[0] },
      { x: 0.77, w: 0.05, h: 0.62, clr: COLORS.buildingA[2] },
      { x: 0.83, w: 0.07, h: 0.75, clr: COLORS.buildingB[1] },
      { x: 0.91, w: 0.04, h: 0.5, clr: COLORS.buildingA[3] },
      { x: 0.96, w: 0.05, h: 0.7, clr: COLORS.buildingB[2] },
    ];

    // On transforme les proportions de chaque bâtiment en dimensions réelles.
    // Le haut du bâtiment est calculé depuis le bas du canvas pour aligner toute la ville au sol.
    buildings.forEach((b) => {
      const bx = (b.x * W) | 0,
        bw = (b.w * W) | 0;
      const bh = (b.h * H) | 0,
        by = H - bh;
      ctx.fillStyle = b.clr;
      ctx.fillRect(bx, by, bw, bh);
      const PS = 4,
        gap = 10;
      // On calcule combien de fenêtres tiennent sur la façade.
      // Le calcul basé sur leur position garde les mêmes fenêtres allumées à chaque dessin.
      const cols = Math.floor((bw - gap) / (PS * 2 + gap));
      const rows = Math.floor((bh * 0.7) / (PS + gap));
      for (let wr = 0; wr < rows; wr++) {
        for (let wc = 0; wc < cols; wc++) {
          const wx = bx + gap + wc * (PS * 2 + gap);
          const wy = by + gap + wr * (PS + gap);
          const roll = Math.sin(wx * 0.3 + wy * 0.7) > 0.1;
          if (roll) {
            const colorPick = (wx + wy) % 5;
            ctx.fillStyle =
              colorPick < 3
                ? COLORS.window
                : colorPick === 3
                  ? COLORS.windowCyan
                  : COLORS.windowPink;
            ctx.fillRect(wx, wy, PS * 2, PS);
          }
        }
      }
    });
    // On termine avec le sol et les petits traits de la rue, au pied des bâtiments.
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, H - 18, W, 18);
    ctx.fillStyle = "#2a2650";
    for (let x = 0; x < W; x += 30) ctx.fillRect(x, H - 9, 18, 2);
  }

  // Un premier appel affiche la ville dès le chargement.
  // Les appels suivants viennent uniquement des changements de taille de la fenêtre.
  window.addEventListener("resize", resize);
  resize();
})();
