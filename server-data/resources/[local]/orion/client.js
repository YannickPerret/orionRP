let isNuiOpen = false;
let pedIndex = {};

on("playerSpawned", () => {
  //téléporter le player dans un endroit sécurisé
  const playerId = GetPlayerServerId(PlayerId());
  const ped = GetPlayerPed(-1);
  SetPlayerHealthRechargeMultiplier(PlayerId(), 0.0);
  SetEntityCoords(
    ped,
    parseFloat(-1037.0),
    parseFloat(-2738.0),
    parseFloat(20.0),
    false,
    false,
    false,
    false
  );

  emitNet("orion:playerSpawned");

  onNet("orion:sendPlayerData", (playerData) => {
    SetEntityCoords(
      ped,
      parseFloat(playerData.position.x),
      parseFloat(playerData.position.y),
      parseFloat(playerData.position.z),
      false,
      false,
      false,
      false
    );

    setInterval(() => {
      const playerPed = GetPlayerPed(-1);
      const position = GetEntityCoords(playerPed, true);
      emitNet(
        "orion:savePlayerPosition",
        position[0],
        position[1],
        position[2]
      );
    }, 900000);
  });
});

RegisterCommand(
  "openPlayerMenu",
  () => {
    emitNet("orion:getPlayerData");
  },
  false
);

RegisterKeyMapping("openPlayerMenu", "Open Player Menu", "keyboard", "F2");

onNet("orion:openPlayerMenu", (playerData) => {
  isNuiOpen = !isNuiOpen;
  SetNuiFocus(isNuiOpen, isNuiOpen);
  SendNuiMessage(
    JSON.stringify({
      action: isNuiOpen ? "setPlayerData" : "closeNUI",
      data: playerData,
    })
  );
});

RegisterNuiCallbackType("closeNUI");
on("__cfx_nui:closeNUI", (data, cb) => {
  if (isNuiOpen) {
    isNuiOpen = false;
    SetNuiFocus(false, false);
  }
  cb({ ok: true });
});

RegisterNuiCallbackType("savePosition");
on("__cfx_nui:savePosition", (data, cb) => {
  const playerPed = GetPlayerPed(-1);
  const position = GetEntityCoords(playerPed, true);
  emitNet("orion:savePlayerPosition", position[0], position[1], position[2]);
  cb({ ok: true });
});

RegisterCommand(
  "save",
  async (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const position = GetEntityCoords(playerPed, true);
    emitNet("orion:savePlayerPosition", position[0], position[1], position[2]);
  },
  false
);

setTick(() => {
  if (GetPlayerWantedLevel(PlayerId()) > 0) {
    SetPlayerWantedLevel(PlayerId(), 0, false);
    SetPlayerWantedLevelNow(PlayerId(), false);
    SetPlayerWantedLevelNoDrop(PlayerId(), 0, false);
  }

  SetRelationshipBetweenGroups(0, GetHashKey("COP"), GetHashKey("PLAYER"));
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_HILLBILLY"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_BALLAS"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_MEXICAN"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_FAMILY"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_MARABUNTE"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_SALVA"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(
    1,
    GetHashKey("AMBIENT_GANG_LOST"),
    GetHashKey("PLAYER")
  );
  SetRelationshipBetweenGroups(1, GetHashKey("GANG_1"), GetHashKey("PLAYER"));
  SetRelationshipBetweenGroups(1, GetHashKey("GANG_2"), GetHashKey("PLAYER"));
  SetRelationshipBetweenGroups(1, GetHashKey("GANG_9"), GetHashKey("PLAYER"));
  SetRelationshipBetweenGroups(1, GetHashKey("GANG_10"), GetHashKey("PLAYER"));
});

async () => {
  let ped = PlayerPedId();

  if (IsPedInAnyVehicle(ped, false)) {
    displayRadar(false);
    console.log("displayRadar(false)");
  } else {
    displayRadar(true);
  }

  let minimap = RequestScaleformMovie("minimap");
  SetRadarBigmapEnabled(true, false);
  await Delay(0);
  SetRadarBigmapEnabled(false, false);
  while (true) {
    BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR");
    ScaleformMovieMethodAddParamInt(3);
    EndScaleformMovieMethod();
    await Delay(0);
  }
};
