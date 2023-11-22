const TEAMSPEAK_API_URL = "http://adresse_du_plugin_teamspeak";

// Lorsqu'un joueur se connecte
on("playerConnecting", async (name, setKickReason, deferrals) => {
  let playerID = source; // ou toute autre méthode pour identifier le joueur

  // Vérifier la connexion TeamSpeak
  await fetch(`${TEAMSPEAK_API_URL}/checkConnection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerID }),
  })
    .then((response) => {
      if (!response.data.isConnected) {
        // Si l'utilisateur n'est pas connecté à TeamSpeak
        setKickReason(
          "Veuillez vous connecter à TeamSpeak. Déconnexion dans 1 minute."
        );
        setTimeout(() => {
          // Code pour déconnecter le joueur après 1 minute
        }, 60000);
      }
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la vérification de la connexion TeamSpeak:",
        error
      );
    });
});

// Lorsqu'un joueur se déconnecte
on("playerDropped", (reason) => {
  // Gérer la déconnexion ici
});
