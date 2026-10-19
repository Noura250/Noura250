/*
 * Gère les catégories de projets et la fenêtre qui affiche leurs détails.
 * Le contenu des projets reste dans les templates de index.html pour être facile à modifier.
 */

(() => {
  "use strict";

  // Les onglets affichent les projets de la catégorie choisie.
  // Le data-tab du bouton doit correspondre à l’id du bloc à afficher dans index.html.
  // On met à jour le contenu visible et l’état du bouton à chaque clic.
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.toggle("active", content.id === button.dataset.tab);
      });
      document.querySelectorAll("[data-tab]").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
        tab.setAttribute("aria-selected", String(tab === button));
      });
    });
  });

  // On garde en mémoire l’élément sélectionné avant l’ouverture.
  // À la fermeture, le clavier retrouve ainsi sa place dans la page.
  let previousFocus;
  // Cette fonction est accessible depuis les onclick des cartes dans index.html.
  // Par exemple, openModal("bataille") cherche le template nommé modal-bataille.
  window.openModal = function (key) {
    // Une carte sans template correspondant ne doit pas ouvrir de fenêtre vide.
    // Le contrôle juste après permet de quitter la fonction dans ce cas.
    const tmpl = document.getElementById("modal-" + key);
    if (!tmpl) return;
    const box = document.getElementById("modal-content");
    previousFocus = document.activeElement;
    // On enlève le projet précédent puis on copie le contenu du bon template.
    // Le template d’origine reste disponible pour les prochaines ouvertures.
    box.innerHTML = "";
    box.appendChild(tmpl.content.cloneNode(true));
    document.getElementById("modal-overlay").classList.remove("hidden");
    // On empêche la page de défiler derrière le projet et on place le clavier
    // sur le bouton de fermeture pour rendre la fenêtre utilisable tout de suite.
    document.body.style.overflow = "hidden";
    document.querySelector(".modal-close").focus();

    // Ces messages sont facultatifs. Pour en ajouter un, utilise la même clé que celle de la carte.
    const msgs = {
      bataille: "Bataille Navale en PHP, mon tout premier projet !",
      gite: "Modélisation BDD — j'adore le SQL !",
      bubbly: "Bubbly, une app de chat que j'ai codée avec mon groupe !",
      hotel: "Hôtel Neptune, un site PHP complet.",
      python: "Système de réservation en Python orienté objet",
      stage2025: "Mon premier stage ! Une vraie expérience",
      stage2026: "Mon stage de deuxième année.",
    };
    if (msgs[key]) showGuideMsg(msgs[key]);
  };

  window.closeModal = function (event) {
    // Un clic sur le fond ferme la fenêtre, mais un clic dans son contenu la laisse ouverte.
    // Le bouton de fermeture appelle directement la fonction sans lui passer d’événement.
    if (event && event.target !== document.getElementById("modal-overlay"))
      return;
    const overlay = document.getElementById("modal-overlay");
    if (overlay.classList.contains("hidden")) return;
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    // Le point d’interrogation évite une erreur si aucun élément n’a été mémorisé.
    previousFocus?.focus();
  };

  document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("modal-overlay");
    if (overlay.classList.contains("hidden")) return;
    if (e.key === "Escape") closeModal();
    if (e.key !== "Tab") return;

    // Le clavier reste dans la fenêtre tant qu’elle est ouverte.
    const controls = overlay.querySelectorAll(
      'button, a[href], input, textarea, select, [tabindex="0"]',
    );
    // Avec Tab, on passe du dernier lien au premier bouton.
    // Avec Maj + Tab, on fait le chemin inverse pour ne pas sortir derrière la fenêtre.
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
