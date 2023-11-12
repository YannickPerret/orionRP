let isNuiOpen = false;

RegisterCommand(
  "openPlayerMenu",
  () => {
    emitNet("orion:getPlayerData", GetPlayerServerId(PlayerId()));
  },
  false
);

RegisterKeyMapping("openPlayerMenu", "Open Player Menu", "keyboard", "F2");

onNet("orion:sendPlayerData", (playerData) => {
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
