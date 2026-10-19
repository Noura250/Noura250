/*
 * Fait fonctionner le faux terminal de la page d’accueil.
 * Les commandes donnent des informations ou ouvrent une section du portfolio ; aucun programme système n’est exécuté.
 */

(() => {
  "use strict";

  const form = document.getElementById("terminalForm");
  const input = document.getElementById("terminalInput");
  const inner = document.getElementById("screenInner");
  if (!form || !input || !inner) return;

  // On ajoute une ligne puis on fait défiler le terminal pour qu’elle reste visible.
  // textContent affiche la saisie comme du texte, même si elle contient des balises HTML.
  function printLine(text, cls) {
    const line = document.createElement("div");
    line.className = "screen-line " + (cls || "term-out");
    line.textContent = text;
    inner.appendChild(line);
    inner.scrollTop = inner.scrollHeight;
  }

  // Pour ajouter une commande, ajoute son nom dans cet objet avec une fonction
  // qui renvoie une liste de lignes à afficher. Une action sans réponse peut renvoyer null.
  const commands = {
    help: () => [
      "Commandes disponibles :",
      "whoami · skills · projects · contact · cv",
      "stage · veille · sudo hire-me · clear",
    ],
    whoami: () => [
      "Noura Guello Ibrahim — BTS SIO, option SLAM — EPSI Montpellier",
    ],
    skills: () => [
      "PHP · Python · SQL · HTML/CSS · JavaScript · WordPress · Bash · PowerShell",
    ],
    ls: () => ["moi/  parcours/  projets/  stages/  veilles/  contact/"],
    projects: () => {
      location.hash = "#projets";
      return ["→ direction #projets ..."];
    },
    stage: () => {
      location.hash = "#stages";
      return ["→ direction #stages ..."];
    },
    veille: () => {
      location.hash = "#veilles";
      return ["→ direction #veilles ..."];
    },
    contact: () => {
      location.hash = "#contact";
      return ["→ direction #contact ..."];
    },
    cv: () => {
      window.open(
        "docs/CV_INFORMATIQUE_noura.pdf",
        "_blank",
        "noopener,noreferrer",
      );
      return ["→ ouverture du CV dans un nouvel onglet"];
    },
    "sudo hire-me": () => [
      "Permission accordée.",
      "Contacte-moi vite : Nouraguelloibrahim@gmail.com",
    ],
    // Cette commande efface seulement les lignes du terminal ; les autres éléments de la page restent en place.
    clear: () => {
      inner.innerHTML = "";
      return null;
    },
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // On retire les espaces autour de la saisie. Une ligne vide ne lance rien.
    const raw = input.value.trim();
    if (!raw) return;
    printLine("guest@noura:~$ " + raw, "term-echo");
    // Les commandes sont reconnues même si elles sont tapées en majuscules.
    // Object.hasOwn limite la recherche aux commandes que l’on a vraiment définies ici.
    const key = raw.toLowerCase();
    const handler = Object.hasOwn(commands, key) ? commands[key] : null;
    if (handler) {
      // La commande peut renvoyer plusieurs lignes. On les ajoute dans l’ordre,
      // ou on n’affiche rien si elle renvoie null, comme la commande clear.
      const out = handler();
      if (out) out.forEach((l) => printLine("→ " + l, "term-out"));
    // Si le nom ne correspond à aucune commande, on affiche une aide courte
    // pour permettre au visiteur de retrouver la liste avec help.
    } else {
      printLine(`→ commande introuvable : "${raw}" — tape "help"`, "term-out");
    }
    // On libère le champ pour la prochaine commande en gardant l’historique affiché au-dessus.
    input.value = "";
  });
})();
