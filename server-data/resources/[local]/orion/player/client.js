const spawnPos = [-275.522, 6635.835, 7.425];

on("onClientGameTypeStart", () => {
  exports.spawnmanager.setAutoSpawnCallback(() => {
    exports.spawnmanager.spawnPlayer(
      {
        x: spawnPos[0],
        y: spawnPos[1],
        z: spawnPos[2],
        model: "a_m_m_skater_01",
      },
      () => {
        emit("chat:addMessage", {
          args: ["Welcome to the party!~"],
        });
      }
    );
  });

  exports.spawnmanager.setAutoSpawn(true);
  exports.spawnmanager.forceRespawn();
});

RegisterCommand("pos", (source, args) => {
  const pos = GetEntityCoords(GetPlayerPed(-1));
  emit("chat:addMessage", {
    args: [
      `X: ${pos[0].toFixed(2)}, Y: ${pos[1].toFixed(2)}, Z: ${pos[2].toFixed(
        2
      )}`,
    ],
  });
});

RegisterCommand("tp", (source, args) => {
  const ped = GetPlayerPed(-1);
  SetEntityCoords(
    ped,
    parseFloat(args[0]),
    parseFloat(args[1]),
    parseFloat(args[2]),
    false,
    false,
    false,
    false
  );
});

RegisterCommand(
  "tpto",
  (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const blip = GetFirstBlipInfoId(8);
    if (IsBlipOnMap(blip)) {
      const coord = GetBlipInfoIdCoord(blip);

      // Demander la collision à l'emplacement pour s'assurer que le sol est chargé
      RequestCollisionAtCoord(coord[0], coord[1], coord[2]);

      // Trouver la hauteur du sol à cet emplacement
      const [, groundZ] = GetGroundZFor_3dCoord(
        coord[0],
        coord[1],
        coord[2],
        0,
        false
      );

      // Téléporter le joueur à l'emplacement avec la hauteur du sol correcte
      SetEntityCoordsNoOffset(
        playerPed,
        coord[0],
        coord[1],
        groundZ,
        false,
        false,
        true
      );
    } else {
      console.log("Aucun waypoint trouvé.");
    }
  },
  false
);
