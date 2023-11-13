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
