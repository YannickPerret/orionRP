onNet('orion:showNotification', message => {
  SetNotificationTextEntry('STRING');
  AddTextComponentString(message);
  DrawNotification(false, false);
});

onNet('orion:showAdvancedNotification', (title, subject, message, icon) => {
  SetNotificationTextEntry('STRING');
  AddTextComponentString(message);
  SetNotificationMessage(icon, icon, true, 4, title, subject);
  DrawNotification(false, true);
});


// show text in the top left corner of the screen
onNet('orion:showText', (message, duration) => {
  BeginTextCommandPrint('STRING');
  AddTextComponentSubstringPlayerName(message);
  EndTextCommandPrint(duration, true);
});

onNet('draw3DText', (x, y, z, text) => {
  let [onScreen, _x, _y] = World3dToScreen2d(x, y, z);
  let [pX, pY, pZ] = table.unpack(GetGameplayCamCoords());
  SetTextScale(0.4, 0.4);
  SetTextFont(4);
  SetTextProportional(1);
  SetTextEntry('STRING');
  SetTextCentre(true);
  SetTextColour(255, 255, 255, 255);
  SetTextOutline();
  AddTextComponentString(text);
  DrawText(_x, _y);
});

onNet('orion:showHelpText', (message) => {
  SetTextFont(0)
  SetTextProportional(1)
  SetTextScale(0.0, 0.3)
  SetTextColour(128, 128, 128, 255)
  SetTextDropshadow(0, 0, 0, 0, 255)
  SetTextEdge(1, 0, 0, 0, 255)
  SetTextDropShadow()
  SetTextOutline()
  SetTextEntry("STRING")
  AddTextComponentString(message)
  DrawText(0.005, 0.005)
});

exports('showHelpText', (message) => {
  console.log(message)
  SetTextFont(0)
  SetTextProportional(1)
  SetTextScale(0.0, 0.3)
  SetTextColour(128, 128, 128, 255)
  SetTextDropshadow(0, 0, 0, 0, 255)
  SetTextEdge(1, 0, 0, 0, 255)
  SetTextDropShadow()
  SetTextOutline()
  SetTextEntry("STRING")
  AddTextComponentString(message)
  DrawText(0.005, 0.005)
});

exports('showNotification', (message) => {
  SetNotificationTextEntry('STRING');
  AddTextComponentString(message);
  DrawNotification(false, false);
});
