const PlayerManager = require("./system/playerManager.js");
const Player = require("./player/player.js");
const { db, r } = require("./system/database.js");

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
    `[Orion] ${nomJoueur}, ${steamId || license} se connecte au serveur`
  );

  if (!steamId && !license) {
    console.error("Erreur lors de la récupération du SteamID ou de la licence");
    return;
  }

  try {
    const filters = { steamId: steamId, license: license };
    const playerData = await db.getByWithFilter("players", filters);

    if (playerData.length > 0) {
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
      console.log("Position du joueur : ", playerPosition);
      const newPlayerData = {
        id: r.uuid(),
        steamId: steamId,
        license: license,
        firstname: "John",
        lastname: "Doe",
        phone: "5552727",
        money: 500,
        bank: 0,
        position: {
          x: playerPosition[0],
          y: playerPosition[1],
          z: playerPosition[2],
        },
        discord: null,
      };

      const result = await db.insert("players", newPlayerData);

      if (result.inserted === 1) {
        const newPlayer = new Player(
          newPlayerData.id,
          source,
          newPlayerData.steamId,
          newPlayerData.firstname,
          newPlayerData.lastname,
          newPlayerData.phone,
          newPlayerData.money,
          newPlayerData.bank,
          newPlayerData.position,
          newPlayerData.license,
          newPlayerData.discord
        );
        PlayerManager.addPlayer(newPlayer.source, newPlayer);
        console.log("[Orion] Nouveau joueur créé : ", newPlayer.license);
      } else {
        throw new Error("Erreur lors de la création du joueur");
      }
    }
  } catch (erreur) {
    console.error(
      "Erreur lors de la récupération/création du joueur : ",
      erreur
    );
  }
});

on("playerDropped", (reason) => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManager.removePlayer(sourceId);
});
