let isSkinCreatorOpened = false;
let cam = -1;
let heading = 332.219879;
let zoom = 'visage';
let isCameraActive;

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

RegisterNuiCallbackType('identityCard');
on('__cfx_nui:identityCard', (data, cb) => {
  cb({ ok: true });
});

RegisterNuiCallbackType('giveAmount');
on('__cfx_nui:giveAmount', (data, cb) => {
  const amount = parseInt(data.amount);
  const myPlayer = GetPlayerServerId(PlayerId());
  const nearbyPlayers = exports['orion'].findNearbyPlayers(3);

  if (nearbyPlayers.length > 0) {
    emitNet('orion:player:giveAmount', nearbyPlayers[0], amount);
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
    data: {
      message,
    },
  });
});

const ShowSkinCreator = enable => {
  SetNuiFocus(enable);
  SendNUIMessage({
    openSkinCreator: enable,
  });
};

const CloseSkinCreator = () => {
  let ped = PlayerPedId();
  isSkinCreatorOpened = false;
  ShowSkinCreator(false);
  isCameraActive = false;
  SetCamActive(cam, false);
  RenderScriptCams(false, true, 500, true, true);
  cam = nil;

  SetPlayerInvincible(ped, false);
};

on('orion:createNewPlayer', source => {
  SendNUIMessage({
    action: 'showSkinCreator',
  });
});

RegisterNuiCallbackType('rotateleftheading');
on('__cfx_nui:rotateleftheading', (data, cb) => {
  let currentHeading = GetEntityHeading(GetPlayerPed(-1));
  heading = currentHeading + Number(data.value);
});

RegisterNuiCallbackType('rotaterightheading');
on('__cfx_nui:rotaterightheading', (data, cb) => {
  let currentHeading = GetEntityHeading(GetPlayerPed(-1));
  heading = currentHeading - Number(data.value);
});

// Define which part of the body must be zoomed
RegisterNuiCallbackType('zoom');
on('__cfx_nui:zoom', (data, cb) => {
  zoom = data.zoom;
});

RegisterNuiCallbackType('createNewPlayer');
on('__cfx_nui:createNewPlayer', (data, cb) => {
  const firstname = data.firstname;
  const lastname = data.lastname;

  // Face
  let genre = Number(data.genre);
  if (genre == 0) {
    if (Number(data.dad) == 0) {
      dad = Number(data.mum);
    } else {
      dad = Number(data.dad);
    }
  }
  let mom = Number(data.mom);
  let dadmumpercent = Number(data.dadmumpercent);
  let skin = Number(data.skin);
  let eyecolor = Number(data.eyecolor);
  let acne = Number(data.acne);
  let skinproblem = Number(data.skinproblem);
  let freckle = Number(data.freckle);
  let wrinkle = Number(data.wrinkle);
  let wrinkleopacity = Number(data.wrinkleopacity);
  let hair = Number(data.hair);
  let haircolor = Number(data.haircolor);
  let eyebrow = Number(data.eyebrow);
  let eyebrowopacity = Number(data.eyebrowopacity);
  let beard = Number(data.beard);
  let beardopacity = Number(data.beardopacity);
  let beardcolor = Number(data.beardcolor);
  // Clothes;
  let hats = Number(data.hats);
  let glasses = Number(data.glasses);
  let ears = Number(data.ears);
  let tops = Number(data.tops);
  let pants = Number(data.pants);
  let shoes = Number(data.shoes);
  let watches = Number(data.watches);

  if (firstname && lastname && phone) {
    emitNet('orion:player:createNewPlayer', firstname, lastname, phone);
    cb({ ok: true });
  } else {
    cb({ ok: false });
  }
});

RegisterCommand('skin', (source, args) => {
  ShowSkinCreator(true);
});
