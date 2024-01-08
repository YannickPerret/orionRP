let isNuiOpen = false;

RegisterKeyMapping('openPlayerMenu', 'Open Player Menu', 'keyboard', 'F2');
RegisterCommand(
  'openPlayerMenu',
  () => {
    emitNet('orion:getPlayerData');
  },
  false
);



onNet('orion:openPlayerMenu', playerData => {
  isNuiOpen = !isNuiOpen;
  SetNuiFocus(isNuiOpen, isNuiOpen);
  SendNuiMessage(
    JSON.stringify({
      action: isNuiOpen ? 'ShowPlayerMenu' : 'closeNUI',
      data: playerData,
    })
  );
});

// UI REGISTER
RegisterNuiCallbackType('closeNUI');
on('__cfx_nui:closeNUI', (data, cb) => {
  if (isNuiOpen) {
    isNuiOpen = false;
    SetNuiFocus(false, false);
  }
  cb({ ok: true });
});




/*onNet('orion:markers:c:createMarkers', async (markers) => {
  markers.garages.forEach(garage => {
    exports['orion'].createMarker(1, garage.position, 1.0, { r: 255, g: 255, b: 255, a: 100 });
  });
});*/


onNet('orion:core:c:animations:playAnimation', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5) => {
  RequestAnimDict(dict);
  while (!HasAnimDictLoaded(dict)) {
    await exports['orion'].delay(0);
  }
  TaskPlayAnim(PlayerPedId(), dict, anim, duration, flag, flag2, flag3, flag4, flag5);
});

onNet('orion:core:c:animations:playAnimationWithTime', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5) => {
  RequestAnimDict(dict);
  while (!HasAnimDictLoaded(dict)) {
    await exports['orion'].delay(0);
  }
  TaskPlayAnim(PlayerPedId(), dict, anim, 1.0, -1.0, -1, 1, 1, true, true, true);
  await exports['orion'].delay(duration);
  ClearPedTasks(PlayerPedId());
});


onNet('orion:core:c:animations:playAnimationLoop', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5) => {
  RequestAnimDict(dict);
  while (!HasAnimDictLoaded(dict)) {
    await exports['orion'].delay(0);
  }
  TaskPlayAnim(PlayerPedId(), dict, anim, duration, flag, flag2, flag3, flag4, flag5);
});

onNet('orion:core:c:animations:stopAllAnimations', async () => {
  ClearPedTasks(PlayerPedId());
});

RegisterNuiCallbackType('hideFrame');
on('__cfx_nui:hideFrame', (data, cb) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});


onNet('orion:core:c:hideFrame', async () => {
  SetNuiFocus(false, false);
  SendNuiMessage(
    JSON.stringify({
      action: 'hideFrame',
    })
  );
});

RegisterCommand(
  'login',
  () => {
    exports['orion'].spawnLogin();
  },
  false
);

(async () => {
  for (var i = 1; i <= 15; i++) {
    EnableDispatchService(i, false);
  }
})();
