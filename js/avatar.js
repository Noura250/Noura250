/*
 * Prépare un petit portrait de secours si la photo ne se charge pas.
 * Dans index.html, le onerror de la photo masque l’image et affiche ce canvas.
 */

(() => {
  "use strict";

  // Le canvas existe même quand la photo est affichée : on prépare le dessin à l’avance.
  // Il ne devient visible que si le chargement de la photo échoue.
  const avatarCanvas = document.getElementById("avatarPixel");
  if (avatarCanvas) {
    const ctx = avatarCanvas.getContext("2d");
    // On peint d’abord le fond du carré de 120 × 120 pixels, puis le visage,
    // les cheveux et les vêtements. fillRect prend la position x, y, puis la largeur et la hauteur.
    ctx.fillStyle = "#9b5de5";
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = "#f5cba7";
    ctx.fillRect(40, 20, 40, 40);
    // Le rectangle des cheveux passe après le visage pour en recouvrir la partie haute.
    ctx.fillStyle = "#1a0a2e";
    ctx.fillRect(30, 10, 60, 24);
    // Ce rectangle forme le haut du corps, sous le visage.
    ctx.fillStyle = "#6b3fa0";
    ctx.fillRect(30, 60, 60, 40);
    // Les deux derniers petits carrés dessinent les yeux du portrait.
    ctx.fillStyle = "#0d0b1e";
    ctx.fillRect(46, 32, 8, 8);
    ctx.fillRect(66, 32, 8, 8);
  }
})();
