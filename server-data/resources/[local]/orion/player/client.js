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

RegisterCommand("tpto", (source, args) => {
  const ped = GetPlayerPed(-1);
  const blip = GetFirstBlipInfoId(8);
  const coord = GetBlipInfoIdCoord(blip);
  SetEntityCoords(
    ped,
    coord[0],
    coord[1],
    coord[2],
    false,
    false,
    false,
    false
  );
});


