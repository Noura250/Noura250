/*
 * Gère le petit écran de démarrage avant de laisser la place au portfolio.
 * La barre sert à accompagner l’attente : elle ne mesure pas le poids des fichiers chargés.
 */

(() => {
  "use strict";

  // On récupère les éléments du chargement. Si l’un manque dans le HTML,
  // on arrête ici pour éviter de bloquer le reste de la page.
  const boot = document.getElementById("bootScreen");
  const fill = document.getElementById("bootBarFill");
  const pctEl = document.getElementById("bootPct");
  const tipEl = document.getElementById("bootTip");
  if (!boot || !fill || !pctEl || !tipEl) return;

  // On tient compte du réglage du visiteur qui demande moins d’animations.
  // Le défilement est bloqué le temps que l’écran de démarrage soit visible.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  document.body.style.overflow = "hidden";

  // Ces petits textes changent pendant l’attente. Tu peux les remplacer
  // ou en ajouter dans cette liste sans toucher au reste du chargement.
  const tips = [
    "Initialisation...",
    "Compilation des composants...",
    "Chargement des projets...",
    "Connexion à la base de compétences...",
    "Optimisation des pixels...",
    "Presque prêt...",
  ];
  let tipIndex = 0;
  const tipTimer = reduceMotion
    ? null
    : setInterval(() => {
        tipIndex = (tipIndex + 1) % tips.length;
        tipEl.textContent = tips[tipIndex];
      }, 450);

  let progress = 0;
  const startTime = Date.now();
  const MIN_DURATION = reduceMotion ? 0 : 1300;
  let rafId;

  // La barre avance par petits sauts et attend à 96 %.
  // Seule finish() la fait passer à 100 % quand on peut afficher la page.
  function tick() {
    progress = Math.min(96, progress + (Math.random() * 10 + 4));
    fill.style.width = progress + "%";
    pctEl.textContent = Math.floor(progress) + "%";
    if (progress < 96) rafId = setTimeout(tick, 90);
  }
  tick();

  // La fin peut être demandée par le chargement de la page ou par le délai de secours.
  // Ce booléen évite de lancer deux fois les mêmes temporisations.
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    // On laisse le démarrage visible au moins 1,3 seconde, sauf si le visiteur
    // a demandé moins d’animations. Si ce temps est déjà passé, on continue tout de suite.
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => {
      clearTimeout(rafId);
      if (tipTimer) clearInterval(tipTimer);
      fill.style.width = "100%";
      pctEl.textContent = "100%";
      tipEl.textContent = "Prêt !";
      setTimeout(() => {
        boot.classList.add("boot-done");
        // On rétablit le défilement seulement si aucune fenêtre de projet n’est ouverte.
        if (
          document.getElementById("modal-overlay")?.classList.contains("hidden")
        ) {
          document.body.style.overflow = "";
        }
        setTimeout(() => boot.remove(), 550);
      }, 200);
    }, wait);
  }

  // Normalement, on attend que la page soit chargée. Le délai de 5 secondes
  // permet quand même de quitter cet écran si une ressource met trop longtemps à répondre.
  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish);
  setTimeout(finish, 5000);
})();
