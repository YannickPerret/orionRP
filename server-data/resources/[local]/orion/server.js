import PlayerManager from "./playerManager.js";
import Player from "./player/player.js";
import db from "./database.js";

on("playerConnecting", async (nomJoueur, setKickReason, deferrals) => {
  let steamId = null;
  for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
    let identifier = GetPlayerIdentifier(source, i);
    if (identifier.includes("steam:")) {
      steamId = identifier;
      break;
    }
  }

  if (steamId) {
    try {
      const playerData = await db
        .getConnection()
        .table("players")
        .filter({ steamId: steamId })
        .run();

      if (playerData.length > 0) {
        // Joueur existant, récupérez ses informations et créez une instance de Player
        const player = new Player(
          playerData[0].id,
          playerData[0].source,
          steamId,
          playerData[0].firstname,
          playerData[0].lastname,
          playerData[0].phone,
          playerData[0].money,
          playerData[0].bank,
          playerData[0].position
        );
        // Vous pouvez ajouter ici des logiques supplémentaires pour initialiser le joueur
        PlayerManager.addPlayer(player.source, player);
      } else {
        // Nouveau joueur, créez un enregistrement dans la base de données
        const newDatabasePlayer = await db
          .getConnection()
          .table("joueurs")
          .insert({
            steamId: steamId,

            // Ajoutez ici d'autres informations initiales du joueur
          })
          .run();

        const newPlayer = new Player(
          newDatabasePlayer.id,
          getSource(),
          steamId,
          newDatabasePlayer.firstname,
          newDatabasePlayer.lastname,
          newDatabasePlayer.phone,
          newDatabasePlayer.money,
          newDatabasePlayer.bank,
          newDatabasePlayer.position
        );

        PlayerManager.addPlayer(newPlayer.source, newPlayer);
      }
    } catch (erreur) {
      console.error(
        "Erreur lors de la récupération/création du joueur : ",
        erreur
      );
    }
  } else {
    // Gestion des joueurs sans Steam ID
  }
});

on("playerDropped", (reason) => {
  let sourceId = getSource(); // Obtenez l'ID unique du joueur
  // Retirer le joueur de la liste
  PlayerManager.delete(sourceId);
});
