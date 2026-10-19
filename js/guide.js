/*
 * Dessine le petit personnage et gère ses bulles de dialogue.
 * Les autres fichiers peuvent lui demander d’afficher un message avec showGuideMsg().
 */

(() => {
  "use strict";

  // On garde le dernier délai de fermeture pour pouvoir l’annuler quand un nouveau message arrive.
  let guideTimer;
  (function () {
    const canvas = document.getElementById("characterCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Chaque case du personnage mesure 4 pixels. Les couleurs suivantes
    // correspondent à sa peau, ses cheveux, ses vêtements et son visage.
    const PS = 4;
    const SKIN = "#f5cba7";
    const HAIR = "#1a0a2e";
    const SHIRT = "#9b5de5";
    const PANT = "#3a0ca3";
    const SHOE = "#0d0b1e";
    const EYE = "#0d0b1e";
    const CHEEK = "#f72585";
    const _ = null;
    // Le personnage possède deux dessins : au repos, puis avec le bras levé.
    // Chaque ligne du tableau représente une rangée de pixels ; null laisse une case transparente.
    const frames = [
      [
        [_, _, HAIR, HAIR, HAIR, HAIR, _, _],
        [_, HAIR, SKIN, SKIN, SKIN, SKIN, HAIR, _],
        [HAIR, SKIN, EYE, SKIN, SKIN, EYE, SKIN, HAIR],
        [HAIR, SKIN, SKIN, SKIN, SKIN, SKIN, SKIN, HAIR],
        [_, HAIR, SKIN, CHEEK, CHEEK, SKIN, HAIR, _],
        [_, _, SHIRT, SHIRT, SHIRT, SHIRT, _, _],
        [_, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, _],
        [_, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, _],
        [_, _, PANT, PANT, PANT, PANT, _, _],
        [_, _, PANT, PANT, PANT, PANT, _, _],
        [_, SHOE, SHOE, _, _, SHOE, SHOE, _],
        [_, SHOE, SHOE, _, _, SHOE, SHOE, _],
      ],
      [
        [_, _, HAIR, HAIR, HAIR, HAIR, SHIRT, _],
        [_, HAIR, SKIN, SKIN, SKIN, SKIN, HAIR, SHIRT],
        [HAIR, SKIN, EYE, SKIN, SKIN, EYE, SKIN, SKIN],
        [HAIR, SKIN, SKIN, SKIN, SKIN, SKIN, SKIN, _],
        [_, HAIR, SKIN, CHEEK, CHEEK, SKIN, HAIR, _],
        [_, _, SHIRT, SHIRT, SHIRT, SHIRT, _, _],
        [SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, _],
        [_, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, SHIRT, _],
        [_, _, PANT, PANT, PANT, PANT, _, _],
        [_, _, PANT, PANT, PANT, PANT, _, _],
        [_, SHOE, SHOE, _, _, SHOE, SHOE, _],
        [_, SHOE, SHOE, _, _, SHOE, SHOE, _],
      ],
    ];

    let frame = 0;
    let tick = 0;

    // On efface le dessin précédent avant de peindre la pose demandée.
    // Les décalages de 8 et 4 pixels laissent un peu de marge autour du personnage.
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

    // On alterne les deux dessins toutes les 30 images.
    // La vitesse dépend donc du rythme de rafraîchissement du navigateur.
    function animate() {
      tick++;
      if (tick % 30 === 0) frame = frame === 0 ? 1 : 0;
      drawChar(frame);
      requestAnimationFrame(animate);
    }

    animate();
  })();
  // La clé de chaque message correspond à l’id d’une section dans index.html.
  // navigation.js utilise cette liste quand le visiteur arrive sur une section.
  window.guideMessages = {
    hero: "Bienvenue dans mon portfolio ! Je suis Noura.",
    moi: "Ici tu découvres qui je suis et mes compétences !",
    parcours: "Mon parcours académique, niveau par niveau.",
    projets: "Mes projets... clique sur une carte pour voir les détails !",
    stages: "Mon expérience terrain dans le vrai monde !",
    veilles: "Je reste toujours à jour sur les nouvelles technologies !",
    contact: "Tu veux me contacter ? Je réponds vite !",
  };

  // Cette fonction est partagée avec les projets, la navigation et le formulaire.
  // Un nouveau message remplace le précédent et reste visible pendant cinq secondes.
  window.showGuideMsg = function (msg) {
    const el = document.getElementById("guideText");
    const bubble = document.getElementById("guideBubble");
    if (!el || !bubble) return;
    bubble.classList.remove("hidden");
    el.textContent = msg;
    // On annule l’ancien délai : sinon une bulle récente pourrait être masquée
    // par la fermeture prévue pour le message précédent.
    clearTimeout(guideTimer);
    guideTimer = setTimeout(() => {
      bubble.classList.add("hidden");
    }, 5000);
  };
  // Un clic sur le personnage permet de masquer sa bulle ou de lui faire afficher un petit message d’aide.
  const guide = document.getElementById("guide");
  if (guide) {
    guide.addEventListener("click", () => {
      const bubble = document.getElementById("guideBubble");
      if (bubble.classList.contains("hidden")) {
        showGuideMsg("Salut ! Tu as besoin d'aide ? Clique sur une section !");
      } else {
        bubble.classList.add("hidden");
      }
    });
  }
  // Le texte affiché au survol du menu vient de l’attribut data-msg de chaque lien dans index.html.
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const msg = this.getAttribute("data-msg");
      if (msg) showGuideMsg(msg);
    });
  });
  // Le message de bienvenue est demandé après un court délai de 800 millisecondes.
  setTimeout(() => {
    showGuideMsg(
      "Bienvenue ! Je suis Noura, ton guide pixel. Explore mon portfolio !",
    );
  }, 800);
})();
