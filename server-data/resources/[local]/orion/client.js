let isNuiOpen = false;
let model = `mp_m_freemode_01`;

/*const executePlayerLogin = () => {
  const Player = GetPlayerServerId(PlayerId());
  const Ped = PlayerPedId();


  SetPlayerModel(Player, model);
  SetPedRandomComponentVariation(Ped, true);

  SetEntityCoordsNoOffset(Ped, -312.68, 194.5, 144.37, false, false, false, true);
  NetworkResurrectLocalPlayer(-312.68, 194.5, 144.37, true, true, false);
  SetEntityHeading(Ped, 0.0);
  DisplayRadar(false);
  FreezeEntityPosition(Ped, true);
  SetEntityInvincible(Ped, true);
  SetEntityVisible(Ped, false, false);
  SetPlayerControl(Ped, false, false);
  SetEntityHealth(Ped, 100);
  SetPedArmour(Ped, 0);

  console.log(Ped);
  onEmit('spawn:PlayerSpawned');
};
*/
on('onClientResourceStart', Resource => {
  if (GetCurrentResourceName() != Resource) {
    return;
  }
  RequestModel(model);
  while (!HasModelLoaded(model)) {
    Delay(0);
  }
  isNuiOpen = false;
  //executePlayerLogin();
});

on('playerSpawned', () => {
  const playerId = GetPlayerServerId(PlayerId());
  const ped = GetPlayerPed(-1);
  SetPlayerHealthRechargeMultiplier(PlayerId(), 0.0);
  SetEntityCoordsNoOffset(ped, parseFloat(-1037.0), parseFloat(-2738.0), parseFloat(20.0), false, false, false, true);
  NetworkResurrectLocalPlayer(-1037.0, -2738.0, 20.0, true, true, false);
  SetEntityHeading(ped, 0.0);

  emitNet('orion:playerSpawned');

  onNet('orion:sendPlayerData', playerData => {
    SetEntityCoords(
      ped,
      parseFloat(playerData.position.x),
      parseFloat(playerData.position.y),
      parseFloat(playerData.position.z),
      false,
      false,
      false,
      false
    );

    setInterval(() => {
      const playerPed = GetPlayerPed(-1);
      const position = GetEntityCoords(playerPed, true);
      emitNet('orion:savePlayerPosition', position[0], position[1], position[2]);
    }, 900000);
  });
});

RegisterKeyMapping('openPlayerMenu', 'Open Player Menu', 'keyboard', 'F2');
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

setTick(() => {
  let player = PlayerId();
  let isDead = IsEntityDead(GetPlayerPed(-1));

  if (isDead) {
    emitNet('orion:playerDied', 'Vous avez perdu connaissance !');
  }

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

RegisterNuiCallbackType('savePosition');
on('__cfx_nui:savePosition', (data, cb) => {
  const playerPed = GetPlayerPed(-1);
  const position = GetEntityCoords(playerPed, true);
  emitNet('orion:savePlayerPosition', position[0], position[1], position[2]);
  cb({ ok: true });
});

// REGISTER COMMANDS
RegisterCommand(
  'save',
  async (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const position = GetEntityCoords(playerPed, true);
    emitNet('orion:savePlayerPosition', position[0], position[1], position[2]);
  },
  false
);

RegisterCommand(
  'openPlayerMenu',
  () => {
    emitNet('orion:getPlayerData');
  },
  false
);
