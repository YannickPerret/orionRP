const PlayerManager = require("../system/playerManager.js");
//register event for save position player
RegisterCommand(
  "save",
  async (source, args) => {
    const player = PlayerManager.getPlayerBySource(source);
    if (!player) {
      console.log(`Aucun joueur trouvé pour la source : ${source}`);
      return;
    }

    // Ici, vous récupérez les coordonnées du joueur.
    // Notez que cette méthode est simplifiée et dépend de la façon dont vous gérez les données des joueurs.
    const playerPed = GetPlayerPed(source);
    const position = GetEntityCoords(playerPed);

    if (position) {
      player.position = {
        x: position[0],
        y: position[1],
        z: position[2],
      };

      try {
        await player.save(); // Supposons que cette méthode enregistre les données dans votre base de données.

        // Envoyer une confirmation au joueur
        TriggerClientEvent("chat:addMessage", source, {
          args: ["Votre position a été sauvegardée."],
        });
      } catch (erreur) {
        console.error(
          "Erreur lors de la sauvegarde de la position du joueur : ",
          erreur
        );
      }
    }
  },
  false
);
