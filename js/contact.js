/*
 * Récupère le message du formulaire et l’envoie au serveur de contact.
 * Le serveur doit être accessible pour que l’envoi fonctionne réellement.
 */

(() => {
  "use strict";

  // Adresse du serveur qui reçoit les messages. À adapter au déploiement.
  // En local, cette adresse pointe vers un serveur sur le port 3000.
  // Pour publier le site, remplace-la par l’adresse de ton serveur de contact.
  const API_URL = "http://localhost:3000/api/contact";

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      // On garde le visiteur sur la page pendant l’envoi, sans recharger le site.
      e.preventDefault();
      const toast = document.getElementById("form-toast");
      const submitBtn = form.querySelector('button[type="submit"]');

      // Les noms à gauche sont ceux attendus par le serveur.
      // Les valeurs viennent des quatre champs remplis par le visiteur.
      const payload = {
        nom: document.getElementById("f-name").value,
        email: document.getElementById("f-email").value,
        objet: document.getElementById("f-subject").value,
        message: document.getElementById("f-message").value,
      };

      // On bloque le bouton pendant la requête pour éviter plusieurs envois par double-clic.
      submitBtn.disabled = true;
      submitBtn.textContent = "▶ ENVOI...";

      try {
        // On envoie les données au format JSON. Une réponse HTTP en erreur
        // ne fait pas échouer fetch toute seule : le contrôle de res.ok s’en charge ensuite.
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // Si le serveur ne renvoie pas de JSON lisible, on utilise un objet vide.
        // Cela permet quand même de vérifier le statut HTTP et d’afficher une erreur compréhensible.
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Erreur inconnue");

        toast.textContent = "Message envoyé !";
        toast.classList.remove("error");
        toast.classList.remove("hidden");
        // On vide les champs seulement après un envoi réussi.
        // En cas d’erreur, le texte reste en place pour permettre de réessayer.
        form.reset();
        showGuideMsg("Message envoyé ! Je reviens vers toi très vite.");
      // Une panne réseau ou une réponse refusée arrive ici.
      // Le visiteur reçoit un retour visible et peut garder son message pour un nouvel essai.
      } catch (err) {
        toast.textContent =
          err.message === "Failed to fetch"
            ? "Envoi indisponible pour le moment. Contacte-moi par e-mail."
            : err.message;
        toast.classList.add("error");
        toast.classList.remove("hidden");
        showGuideMsg("Oups, le message n'est pas parti. Réessaie !");
      // Ce bloc tourne dans les deux cas : réussite ou erreur.
      // Il réactive le bouton et masque le message de retour après quatre secondes.
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "▶ ENVOYER";
        setTimeout(() => toast.classList.add("hidden"), 4000);
      }
    });
  }
})();
