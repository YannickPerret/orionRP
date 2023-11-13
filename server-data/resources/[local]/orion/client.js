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
    emit("chat:addMessage", {
      args: ["Welcome back!~"],
    });

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

onNet("orion:showNotification", (message) => {
  SetNotificationTextEntry("STRING");
  AddTextComponentString(message);
  DrawNotification(false, false);
});

onNet("orion:showAdvancedNotification", (title, subject, message, icon) => {
  SetNotificationTextEntry("STRING");
  AddTextComponentString(message);
  SetNotificationMessage(icon, icon, true, 4, title, subject);
  DrawNotification(false, true);
});
