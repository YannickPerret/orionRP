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

RegisterNUICallback(
  "hideFrame",
  () => {
    toggleNuiFrame(false);
    debugPrint("Hide NUI frame");
    cb();
  },
  false
);

RegisterNUICallback(
  "getClientData",
  (data, cb) => {
    debugPrint("Data sent by React", json.encode(data));

    // Lets send back client coords to the React frame for use
    const curCoords = GetEntityCoords(PlayerPedId());

    const retData = { x: curCoords.x, y: curCoords.y, z: curCoords.z };
    cb(retData);
  },
  false
);
