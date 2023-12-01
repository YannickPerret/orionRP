/*
Bureau FIB :

X: 136.85, Y: -761.65, Z: 45.75
Appartement de luxe :

X: -786.8663, Y: 315.7642, Z: 217.6385
Club de strip-tease (back room) :

X: 116.91, Y: -1296.95, Z: 29.50
Sous-marin :

X: 514.34, Y: 4887.00, Z: -62.59
Humane Labs (intérieur) :

X: 3619.749, Y: 2742.740, Z: 28.690

https://forum.cfx.re/t/list-of-all-online-interiors/1449619
*/

let isNuiOpen = false;

const spawnLogin = () => {
  const ped = GetPlayerPed(-1);
  SetPlayerInvincible(ped, false);
  SetPlayerHealthRechargeMultiplier(PlayerId(), 0.0);
  SetEntityCoordsNoOffset(ped, parseFloat(-1037.0), parseFloat(-2738.0), parseFloat(20.0), false, false, false, true);
  NetworkResurrectLocalPlayer(-1037.0, -2738.0, 20.0, true, true, false);

  SetEntityHeading(ped, 0.0);
  SetCanAttackFriendly(PlayerPedId(), true, false);
  NetworkSetFriendlyFireOption(true);

  emitNet('orion:player:s:playerSpawned');
};

on('onClientResourceStart', async resource => {
  if (GetCurrentResourceName() !== resource) {
    return;
  }

  const model = 'mp_m_freemode_01';
  RequestModel(model);

  while (!HasModelLoaded(model)) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /*SendNuiMessage({
    action: 'closeNUI',
  });*/
});

on('playerSpawned', () => {
  spawnLogin();
});

onNet('orion:playerConnected', playerData => {
  SetEntityCoords(
    GetPlayerPed(-1),
    parseFloat(playerData.position.x),
    parseFloat(playerData.position.y),
    parseFloat(playerData.position.z),
    false,
    false,
    false,
    false
  );

  setInterval(() => {
    emitNet('orion:savePlayerPosition', GetEntityCoords(GetPlayerPed(-1), true));
  }, 900000);
});

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

setTick(() => {
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
  Delay(5);

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
    spawnLogin();
  },
  false
);
