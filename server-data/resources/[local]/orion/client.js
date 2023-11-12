// Enregistrer le type de callback NUI
RegisterNuiCallbackType("hideFrame");
RegisterNuiCallbackType("getClientData");
RegisterNuiCallbackType("closeNUI");

const toggleNuiFrame = (shouldShow) => {
  SetNuiFocus(shouldShow, shouldShow);
  exports("SendReactMessage")("setVisible", shouldShow);
};

on("__cfx_nui:hideFrame", (data, cb) => {
  toggleNuiFrame(false);
  exports("debugPrint")("Hide NUI frame");
  cb();
});

on("__cfx_nui:getClientData", (data, cb) => {
  exports("debugPrint")("Data sent by React", JSON.stringify(data));

  // Envoyer les coordonnées du joueur à l'interface NUI
  const curCoords = GetEntityCoords(PlayerPedId());
  const retData = { x: curCoords.x, y: curCoords.y, z: curCoords.z };
  cb(retData);
});

on("__cfx_nui:closeNUI", (data, cb) => {
  closeNui();
  cb({ ok: true });
});

//open Nui player menu interface when player press F2
RegisterKeyMapping("openPlayerMenu", "Open Player Menu", "keyboard", "F2");

RegisterCommand(
  "openPlayerMenu",
  () => {
    SendNuiMessage(JSON.stringify({ action: "openNUI" }));
    // Permettre l'interaction avec la NUI
    SetNuiFocus(true, true);
  },
  false
);

const closeNui = () => {
  // Réinitialiser le focus
  SetNuiFocus(false, false);
};
