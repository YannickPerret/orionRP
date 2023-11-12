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
    // Traite les données reçues du serveur
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

onNet("openPlayerMenu", (playerData) => {
  isNuiOpen = !isNuiOpen;
  SetNuiFocus(isNuiOpen, isNuiOpen);
  console.log(playerData);
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
