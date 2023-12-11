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

setTick(async () => {
    
  if (GetPlayerWantedLevel(PlayerId()) > 0) {
    SetPlayerWantedLevel(PlayerId(), 0, false);
    SetPlayerWantedLevelNow(PlayerId(), false);
    SetPlayerWantedLevelNoDrop(PlayerId(), 0, false);
  }

  SetRelationshipBetweenGroups(0, GetHashKey('COP'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_HILLBILLY'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_BALLAS'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_MEXICAN'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_FAMILY'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_MARABUNTE'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_SALVA'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_LOST'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('GANG_1'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('GANG_2'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('GANG_9'), GetHashKey('PLAYER'));
  SetRelationshipBetweenGroups(1, GetHashKey('GANG_10'), GetHashKey('PLAYER'));

  HideHudComponentThisFrame(3);
  HideHudComponentThisFrame(4);
  HideHudComponentThisFrame(13);
  HideHudComponentThisFrame(14);
  await Delay(5);

  if (isFlymodeEnabled) {
    const playerPed = GetPlayerPed(-1);
    let [x, y, z] = GetEntityCoords(playerPed, true);
    let heading = GetEntityHeading(playerPed);
    const speed = 0.5; // Vitesse de déplacement
    const rotationSpeed = 5.0; // Vitesse de rotation

    const radianAngle = (heading * Math.PI) / 180;

    if (IsControlPressed(0, 32)) {
      // W - Avancer
      x += speed * Math.sin(radianAngle);
      y += speed * Math.cos(radianAngle);
    }
    if (IsControlPressed(0, 33)) {
      // S - Reculer
      x -= speed * Math.sin(radianAngle);
      y -= speed * Math.cos(radianAngle);
    }
    if (IsControlPressed(0, 34)) {
      // A - Gauche (rotation)
      heading += rotationSpeed;
    }
    if (IsControlPressed(0, 35)) {
      // D - Droite (rotation)
      heading -= rotationSpeed;
    }
    if (IsControlPressed(0, 22)) {
      // Espace - Monter
      z += speed;
    }
    if (IsControlPressed(0, 36)) {
      // Ctrl gauche - Descendre
      z -= speed;
    }

    SetEntityCoordsNoOffset(playerPed, x, y, z, true, true, true);
    SetEntityHeading(playerPed, heading);
  }
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
