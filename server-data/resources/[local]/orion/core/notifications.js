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

onNet('orion:showHelpNotification', (message, thisFrame, beep, duration) => {
  BeginTextCommandDisplayHelp('STRING');
  AddTextComponentSubstringPlayerName(message);
  EndTextCommandDisplayHelp(thisFrame, beep, duration, -1);
});

// show text in the top left corner of the screen
onNet('orion:showText', (message, duration) => {
  BeginTextCommandPrint('STRING');
  AddTextComponentSubstringPlayerName(message);
  EndTextCommandPrint(duration, true);
});
