const PlayerManager = require("./playerManager.js");
const Player = require("./player/player.js");
const db = require("./database.js");

on("playerConnecting", async (nomJoueur, setKickReason, deferrals) => {
  let steamId = null;
  let license = null;
  let source = global.source;
  for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
    let identifier = GetPlayerIdentifier(source, i);
    if (identifier.includes("steam:")) {
      steamId = identifier;
      break;
    } else if (identifier.includes("license:")) {
      license = identifier;
      break;
    }
  }
  console.log(
    `[Orion] ${nomJoueur}, ${
      steamId ? steamId : license
    } se connecte au serveur`
  );

  if (steamId || license) {
    try {
      const playerData = await db
        .getConnection()
        .table("players")
        .filter(r.row("steamId").eq(steamId).or(r.row("license").eq(licenseId)))
        .run();

      if (playerData.length > 0) {
        // Joueur existant, récupérez ses informations et créez une instance de Player
        const player = new Player(
          playerData[0].id,
          source,
          steamId,
          playerData[0].firstname,
          playerData[0].lastname,
          playerData[0].phone,
          playerData[0].money,
          playerData[0].bank,
          playerData[0].position,
          playerData[0].license,
          playerData[0].discord
        );
        // Vous pouvez ajouter ici des logiques supplémentaires pour initialiser le joueur
        PlayerManager.addPlayer(player.source, player);

        console.log("[Orion] Joueur existant récupéré : ", player);
      } else {
        // Nouveau joueur, créez un enregistrement dans la base de données
        const newDatabasePlayer = await db
          .getConnection()
          .table("joueurs")
          .insert({
            steamId: steamId,
            license: license,
            firstname: "John",
            lastname: "Doe",
            phone: "5552727",
            money: 500,
            bank: 0,
            position: {
              x: -275.522,
              y: 6635.835,
              z: 7.425,
            },
            discord: null,
          })
          .run();

        const newPlayer = new Player(
          newDatabasePlayer.id,
          source,
          newDatabasePlayer.steamId,
          newDatabasePlayer.firstname,
          newDatabasePlayer.lastname,
          newDatabasePlayer.phone,
          newDatabasePlayer.money,
          newDatabasePlayer.bank,
          newDatabasePlayer.position,
          newDatabasePlayer.license,
          newDatabasePlayer.discord
        );

        PlayerManager.addPlayer(newPlayer.source, newPlayer);
        console.log("[Orion] Nouveau joueur créé : ", newPlayer);
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
