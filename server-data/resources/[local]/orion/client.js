// Enregistrer le type de callback NUI
RegisterNuiCallbackType("hideFrame");
RegisterNuiCallbackType("getClientData");

const toggleNuiFrame = (shouldShow) => {
  SetNuiFocus(shouldShow, shouldShow);
  exports("SendReactMessage")("setVisible", shouldShow);
};

RegisterCommand(
  "toggleui",
  () => {
    toggleNuiFrame(true);
    exports("debugPrint")("Show NUI frame");
  },
  false
);

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

//open Nui player menu interface when player press F2
RegisterKeyMapping("openPlayerMenu", "Open Player Menu", "keyboard", "F2");

RegisterCommand(
  "openPlayerMenu",
  () => {
    toggleNuiFrame(true);
    exports("debugPrint")("Show NUI frame");
  },
  false
);
