let isNuiOpen = false;
let isNoclipActive = false;
let noClippingEntity;
let previousVelocity = vec(0, 0, 0);
const speed = 5.0;
const breakSpeed = 5.0;

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
*/ /*
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
});*/

on('onClientResourceStart', async resource => {
  if (GetCurrentResourceName() !== resource) {
    return;
  }

  const model = 'mp_m_freemode_01'; // Remplacez par le nom ou l'hash du modèle approprié
  RequestModel(model);

  while (!HasModelLoaded(model)) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Attendez de manière asynchrone
  }

  isNuiOpen = false;
  // executePlayerLogin(); // Décommentez ou ajoutez votre logique supplémentaire ici
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
    SetCanAttackFriendly(PlayerPedId(), true, false);
    NetworkSetFriendlyFireOption(true);

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
  Delay(5);
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

RegisterCommand('pos', (source, args) => {
  const pos = GetEntityCoords(GetPlayerPed(-1));
  emit('chat:addMessage', {
    args: [`X: ${pos[0].toFixed(2)}, Y: ${pos[1].toFixed(2)}, Z: ${pos[2].toFixed(2)}`],
  });
});

RegisterCommand('tp', (source, args) => {
  SetEntityCoordsNoOffset(
    GetPlayerPed(),
    parseFloat(args[0]),
    parseFloat(args[1]),
    parseFloat(args[2]),
    false,
    false,
    true
  );
});

RegisterCommand(
  'tpto',
  (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const blip = GetFirstBlipInfoId(8); // ID 8 correspond à un waypoint
    if (blip !== 0) {
      const coord = GetBlipInfoIdCoord(blip);
      RequestCollisionAtCoord(coord[0], coord[1], coord[2]);

      // Attendre que la hauteur du sol soit chargée
      let groundZ = 0;
      let groundCheck = false;

      setTimeout(() => {
        [groundCheck, groundZ] = GetGroundZFor_3dCoord(coord[0], coord[1], coord[2], 0, false);
        if (groundCheck) {
          SetEntityCoordsNoOffset(playerPed, coord[0], coord[1], groundZ + 1.0, false, false, true); // Ajouté un petit offset pour éviter de se retrouver sous le sol
        } else {
          SetEntityCoords(playerPed, coord[0], coord[1], coord[2], false, false, false, true);
        }
      }, 1000); // Attendre 1 seconde pour laisser le temps au jeu de charger la hauteur du sol
    } else {
      console.log('Aucun waypoint trouvé.');
    }
  },
  false
);

RegisterCommand(
  'noclip',
  () => {
    const player = PlayerId();
    const ped = GetPlayerPed(-1);

    if (!isNoclipActive) {
      SetEntityCollision(ped, false, false);
      SetEntityVisible(ped, false, false);
      isNoclipActive = true;
    } else {
      SetEntityCollision(ped, true, true);
      SetEntityVisible(ped, true, true);
      previousVelocity = vec(0, 0, 0);
      isNoclipActive = false;
    }
  },
  false
);

// Mettre à jour en boucle
setInterval(() => {
  if (isNoclipActive) {
    let inputX = 0; // Gauche/droite
    let inputY = 0; // Avant/arrière
    let inputZ = 0; // Haut/bas

    if (IsControlPressed(0, 32)) {
      // W
      inputY = 1;
    }
    if (IsControlPressed(0, 33)) {
      // S
      inputY = -1;
    }
    if (IsControlPressed(0, 34)) {
      // A
      inputX = -1;
    }
    if (IsControlPressed(0, 35)) {
      // D
      inputX = 1;
    }
    if (IsControlPressed(0, 22)) {
      // Espace
      inputZ = 1;
    }
    if (IsControlPressed(0, 36)) {
      // CTRL
      inputZ = -1;
    }

    // Appliquer le mouvement
    if (IsPedInAnyVehicle(noClippingEntity, false)) {
      MoveCarInNoClip();
    } else {
      MoveInNoClip();
    }
  }
}, 0); // Mettre à jour à chaque frame
