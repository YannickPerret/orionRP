const PlayerManager = require("./playerManager.js");
const Player = require("./player/player.js");
const { db, r } = require("./database.js");

on("playerConnecting", (nomJoueur, setKickReason, deferrals) => {
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
    `[Orion] ${nomJoueur}, ${steamId || license} se connecte au serveur`
  );

  if (!steamId && !license) {
    console.error("Erreur lors de la récupération du SteamID ou de la licence");
    return;
  }

  db.connect()
    .then((connection) => {
      return connection
        .table("players")
        .filter(r.row("steamId").eq(steamId).or(r.row("license").eq(license)))
        .run()
        .then((cursor) => cursor.toArray());
    })
    .then((playerData) => {
      if (playerData?.length > 0) {
        // Traitement pour un joueur existant
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
        PlayerManager.addPlayer(player.source, player);
        console.log("[Orion] Joueur existant récupéré : ", player);
      } else {
        // Traitement pour un nouveau joueur
        const playerPosition = GetEntityCoords(GetPlayerPed(source));
        return connection
          .table("players")
          .insert(
            {
              id: r.uuid(),
              steamId: steamId,
              license: license,
              firstname: "John",
              lastname: "Doe",
              phone: "5552727",
              money: 500,
              bank: 0,
              position: {
                x: playerPosition.x,
                y: playerPosition.y,
                z: playerPosition.z,
              },
              discord: null,
            },
            { return_changes: true }
          )
          .run()
          .then((result) => {
            if (result.changes && result.changes.length > 0) {
              const newDatabasePlayer = result.changes[0].new_val;
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
              console.log("[Orion] Nouveau joueur créé : ", newPlayer.license);
            } else {
              throw new Error("Erreur lors de la création du joueur");
            }
          });
      }
    })
    .catch((erreur) => {
      console.error(
        "Erreur lors de la récupération/création du joueur : ",
        erreur
      );
    });
});

on("playerDropped", (reason) => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManager.removePlayer(sourceId);
});
