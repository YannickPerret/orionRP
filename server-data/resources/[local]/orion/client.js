let isNuiOpen = false;

on("playerSpawned", () => {
  //téléporter le player dans un endroit sécurisé
  const playerId = GetPlayerServerId(PlayerId());
  const ped = GetPlayerPed(-1);
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
  SetNuiFocusKeepInput(isNuiOpen);
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

const setWeaponDrops = () => {
  let handle,
    ped = FindFirstPed();
  let finished = false;
  while (!finished) {
    if (!IsEntityDead(ped)) {
      pedIndex[ped] = {};
    }
    [finished, ped] = FindNextPed(handle);
  }
  while (!finished);
  EndFindPed(handle);

  for (let peds in pedIndex) {
    if (peds !== null) {
      SetPedDropsWeaponsWhenDead(peds, false);
    }
  }
};

setTick(() => {
  //setWeaponDrops();
  //remove search cops
  for (let i = 1; i <= 15; i++) {
    EnableDispatchService(i, false);
  }
  //remove wanted level
  if (GetPlayerWantedLevel(PlayerId()) > 0) {
    SetPlayerWantedLevel(PlayerId(), 0, false);
    SetPlayerWantedLevelNow(PlayerId(), false);
    SetPlayerWantedLevelNoDrop(PlayerId(), 0, false);
  }
});
