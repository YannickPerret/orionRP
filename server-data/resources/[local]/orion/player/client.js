const spawnPos = [-275.522, 6635.835, 7.425];

on("onClientGameTypeStart", () => {
  exports.spawnmanager.setAutoSpawn(false);
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
    const blip = GetFirstBlipInfoId(8); // ID 8 correspond à un waypoint
    if (blip !== 0) {
      const coord = GetBlipInfoIdCoord(blip);
      RequestCollisionAtCoord(coord[0], coord[1], coord[2]);

      // Attendre que la hauteur du sol soit chargée
      let groundZ = 0;
      let groundCheck = false;

      setTimeout(() => {
        [groundCheck, groundZ] = GetGroundZFor_3dCoord(
          coord[0],
          coord[1],
          coord[2],
          0,
          false
        );
        if (groundCheck) {
          SetEntityCoordsNoOffset(
            playerPed,
            coord[0],
            coord[1],
            groundZ + 1.0,
            false,
            false,
            true
          ); // Ajouté un petit offset pour éviter de se retrouver sous le sol
        } else {
          SetEntityCoords(
            playerPed,
            coord[0],
            coord[1],
            coord[2],
            false,
            false,
            false,
            true
          );
        }
      }, 1000); // Attendre 1 seconde pour laisser le temps au jeu de charger la hauteur du sol
    } else {
      console.log("Aucun waypoint trouvé.");
    }
  },
  false
);
