/*
 * Regroupe ce qui aide à se déplacer dans la page : menu, barre de progression
 * et bouton de retour en haut. Les barres de compétences sont aussi déclenchées ici.
 */

(() => {
  "use strict";

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  // Le navigateur nous prévient quand une section devient visible.
  // À partir de 40 % de visibilité, on marque son lien dans le menu.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle("active", l.getAttribute("href") === "#" + id);
          });

        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => observer.observe(s));
  (function () {
    // Sur petit écran, ce bouton ouvre et ferme les liens.
    // Les attributs aria indiquent aussi l’état du menu aux lecteurs d’écran.
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu",
      );
    });
    // Après avoir choisi une section, on referme le menu pour libérer l’écran.
    links.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  })();
  (function () {
    const fill = document.getElementById("scrollXpFill");
    if (!fill) return;
    // On compare la distance déjà parcourue à la distance totale que l’on peut défiler.
    // Si la page tient dans l’écran, on garde 0 % pour éviter une division par zéro.
    function updateProgress() {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      fill.style.width = pct + "%";
    }
    // L’écoute passive indique que ce traitement ne bloque pas le défilement.
    // On recalcule aussi après un redimensionnement, car la hauteur de la page peut changer.
    document.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    // On fait aussi un premier calcul au démarrage, avant le premier défilement.
    updateProgress();
  })();
  (function () {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    // Le bouton de retour en haut apparaît après 500 pixels de défilement.
    // Tu peux changer ce nombre pour le montrer plus tôt ou plus tard.
    function toggleBtn() {
      btn.classList.toggle("hidden", window.scrollY < 500);
    }
    document.addEventListener("scroll", toggleBtn, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    toggleBtn();
  })();
  const skillFills = document.querySelectorAll(".skill-fill");
  // Chaque barre part de zéro puis rejoint la largeur définie dans index.html.
  // On cesse ensuite de l’observer pour ne pas rejouer l’effet à chaque passage.
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.style.width;
          el.style.width = "0";
          setTimeout(() => {
            el.style.transition = "width 1s ease";
            el.style.width = target;
          }, 100);
          // Cette barre a déjà été montrée : on la retire du suivi,
          // même si le visiteur remonte puis redescend dans la page.
          skillObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  skillFills.forEach((f) => skillObserver.observe(f));
})();
