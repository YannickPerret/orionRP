let isNuiOpen = false;

// Commande pour ouvrir/fermer la NUI
RegisterCommand(
  "openPlayerMenu",
  async () => {
    // Demander les informations du joueur au serveur
    emitNet("orion:getPlayerData", GetPlayerServerId(PlayerId()));
  },
  false
);

RegisterKeyMapping("openPlayerMenu", "Open Player Menu", "keyboard", "F2");

onNet("orion:sendPlayerData", (playerData) => {
  isNuiOpen = !isNuiOpen;
  SetNuiFocus(isNuiOpen, isNuiOpen);
  if (isNuiOpen) {
    SendNuiMessage(
      JSON.stringify({
        action: "setPlayerData",
        data: playerData,
      })
    );
  } else {
    SendNuiMessage(JSON.stringify({ action: "closeNUI" }));
  }
});

// Callback pour fermer la NUI depuis React
RegisterNuiCallbackType("closeNUI");
on("__cfx_nui:closeNUI", (data, cb) => {
  if (isNuiOpen) {
    toggleNui(global.source); // global.source devrait être la source du joueur actuel
  }
  cb({ ok: true });
});
