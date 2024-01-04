//https://github.com/tringuyenk19/skincreator/blob/master/client.lua

let playerData = {};

(async () => {

  let handsUp = false;
  let isDead = false;
  let mug = false;

  function modelLoadedAsync() {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        const ped = PlayerPedId();
        const model = GetEntityModel(ped);

        if (model && HasModelLoaded(model)) {
          resolve(ped);
          clearInterval(timer);
        }
      }, 100);
    });
  }

  async function getMugshot() {
    const ped = await modelLoadedAsync();

    mug = RegisterPedheadshotTransparent(ped);

    const timer = setInterval(() => {
      if (!IsPedheadshotValid(mug)) {
        UnregisterPedheadshot(mug);

        mug = RegisterPedheadshotTransparent(ped);
      } else {
        if (IsPedheadshotReady(mug)) {
          SendNUIMessage({
            mugshot: GetPedheadshotTxdString(mug),
          });
          UnregisterPedheadshot(mug);
          clearInterval(timer);
        }
      }
    }, 100);
  }


  on('onClientGameTypeStart', () => {
    exports.spawnmanager.setAutoSpawn(false);
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

  on('onClientResourceStart', async (resourceName) => {
    if (GetCurrentResourceName() != resourceName) {
      return;
    }
    getMugshot();
  });

  exports("getPlayerData", () => {
    return playerData;
  });

  emitNet('orion:player:c:setPlayerData', data => {
    playerData = data;
  });

  exports("setPlayerData", (data) => {
    playerData = data;
  });


  RegisterCommand('tpto', (source, args) => {
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
          SetEntityCoordsNoOffset(playerPed, coord[0], coord[1], groundZ + 1.0, false, false, true);
        } else {
          SetEntityCoords(playerPed, coord[0], coord[1], coord[2], false, false, false, true);
        }
      }, 1000);
    } else {
      console.log('Aucun waypoint trouvé.');
    }
  },
    false
  );

  RegisterNuiCallbackType('identityCard');
  on('__cfx_nui:identityCard', (data, cb) => {
    cb({ ok: true });
  });

  RegisterNuiCallbackType('giveAmount');
  on('__cfx_nui:giveAmount', (data, cb) => {
    const amount = parseInt(data.amount);
    const nearbyPlayers = exports['orion'].findNearbyPlayers(3);

    if (nearbyPlayers.length > 0) {
      emitNet('orion:player:s:giveAmount', nearbyPlayers[0], amount);
    } else {
      emit('orion:showNotification', 'Aucun joueur à proximité');
    }
    cb({ ok: true });
  });

  RegisterCommand('revive', (source, args) => {
    const myPlayer = GetPlayerServerId(PlayerId());

    SetEntityHealth(PlayerPedId(), 200);
    ClearPedBloodDamage(PlayerPedId());
    StopScreenEffect('DeathFailOut');

    let ped = PlayerPedId();
    let coords = GetEntityCoords(ped, false);
    let heading = GetEntityHeading(ped);
    NetworkResurrectLocalPlayer(coords[0], coords[1], coords[2], heading, true, false);
  });

  //player died
  onNet('orion:playerDied', message => {
    SetEntityHealth(PlayerPedId(), 0);
    StartScreenEffect('DeathFailOut', 0, false);
    SendNUIMessage({
      action: 'showDeathMessage',
      payload: {
        playerDeadMessage: message
      },
    });
  });

  RegisterNuiCallbackType('validateSkin');
  on('__cfx_nui:validateSkin', (data, cb) => {
    const firstname = data.firstname;
    const lastname = data.lastname;

    // Face
    const finalSkin = {
      skin: data.skin,
      face: data.face,
      hair: data.hair,
      beard: data.beard,
      makeup: data.makeup,
    }

    if (firstname?.length >= 3 && lastname?.length >= 3 && finalSkin) {
      emit('orion:customization:c:ShowSkinCreator', false);
      emitNet('orion:player:s:createNewPlayer', { firstname, lastname, finalSkin });
      cb({ ok: true });
    } else {
      emit(
        'orion:showNotification',
        'Veuillez entrer un prénom et un nom de famille valide ainsi que créer un personnage.'
      );
      cb({ ok: false });
    }
  });

  RegisterNuiCallbackType('savePosition');
  on('__cfx_nui:savePosition', (data, cb) => {
    emitNet('orion:savePlayerPosition', GetEntityCoords(GetPlayerPed(-1), true));
    cb({ ok: true });
  });

  onNet('orion:player:c:playerDied', message => {
    SetEntityHealth(PlayerPedId(), 0);
    StartScreenEffect('DeathFailOut', 0, false);

    SendNUIMessage({
      action: 'showDeathMessage',
      data: {
        message,
      },
    });
  });

  setInterval(() => {
    isDead = IsPlayerDead(GetPlayerPed(-1));

    if (isDead) {
      emitNet('orion:player:c:playerDied', 'Vous avez perdu connaissance !');
    }

    if (handsUp) {
      console.log('handsUp');
      TaskHandsUp(PlayerPedId(), 250, PlayerPedId(), -1, true);
    }
  }, 100);

  onNet('orion:player:c:teleport', coords => {
    SetEntityCoordsNoOffset(GetPlayerPed(-1), coords.x, coords.y, coords.z, true, false, true);
  });

  onNet('orion:c:player:createNewPlayer', () => {
    emit('orion:customization:c:ShowSkinCreator', true);
  })


  onNet('orion:player:c:completRegister', (playerDataServer) => {
    exports['orion'].setPlayerData(playerDataServer);
    SetEntityCoordsNoOffset(GetPlayerPed(-1), playerDataServer.position.x, playerDataServer.position.y, playerDataServer.position.z, true, false, true);

    emit('orion:showNotification', `Bienvenue ${playerDataServer.firstname} ${playerDataServer.lastname} sur Orion !`);
  });

  onNet('orion:player:c:playerConnected', (playerData) => {

    exports['orion'].setPlayerData(playerData);

    SetEntityCoords(GetPlayerPed(-1), parseFloat(playerData.position.x), parseFloat(playerData.position.y), parseFloat(playerData.position.z), false, false, false, false);
    SetEntityHeading(GetPlayerPed(-1), parseFloat(playerData.position.heading));

    //SendNuiMessage(JSON.stringify({ action: 'switchToIngame' }));

    emitNet('orion:blips:s:initializeBlips')

    setInterval(() => {
      const [playerPositionX, playerPositionY, playerPositionZ] = GetEntityCoords(GetPlayerPed(-1), true);
      emitNet('orion:savePlayerPosition', playerPositionX, playerPositionY, playerPositionZ);
    }, 900000);

  });


  setInterval(async () => {
    //const ped = PlayerPedId();

    SendNUIMessage({
      action: 'updatePlayerStatus',
      payload: {
        showPlayerHUD: !IsPauseMenuActive(),
        //health: GetEntityHealth(ped) - (GetEntityMaxHealth(ped) === 175 ? 75 : 100),
        //armor: GetPedArmour(ped),
      },
    });
  }, 100);

  setInterval(async () => {
    const hunger = playerData.hunger;
    const thirst = playerData.thirst;

    SendNUIMessage({
      action: 'updatePlayerStatus',
      payload: {
        hunger,
        thirst,
      },
    });
  }, 1000);


  on('onClientResourceStop', (resourceName) => {
    if (GetCurrentResourceName() != resourceName) {
      return;
    }
    if (mug) UnregisterPedheadshot(mug);
  });

})()
