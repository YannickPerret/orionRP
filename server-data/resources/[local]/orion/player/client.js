//https://github.com/tringuyenk19/skincreator/blob/master/client.lua

var isSkinCreatorOpened = false;
var cam = -1;
var zoom = 'visage';
var isCameraActive;
var heading = 332.219879;
var handsUp = false;
var isDead = false;

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

onNet('orion:c:player:createNewPlayer', source => {
  exports['orion'].ShowSkinCreator(true);
});

RegisterNuiCallbackType('updateSkin');
on('__cfx_nui:updateSkin', async (data, cb) => {
  const playerPed = GetPlayerPed(-1);
  let model = data.sex == 0 ? GetHashKey('mp_m_freemode_01') : GetHashKey('mp_f_freemode_01');

  exports['orion'].applySkin({
    Model: {
      Hash: model,
      Father: Number(data.dad),
      Mother: Number(data.mom),
      WeightFace: Number(data.heritage * 0.1).toFixed(2),
      WeightSkin: Number(data.heritage * 0.1).toFixed(2),
      Skin: Number(data.skin),
    },
    Hair: {
      HairType: Number(data.hair),
      HairColor: Number(data.hairColor),
      HairSecondaryColor: Number(data.highlight),
      EyebrowType: Number(data.eyebrow),
      EyebrowOpacity: Number(data.eyebrowThickness),
      EyebrowColor: Number(data.eyebrowColor),
      BeardType: Number(data.beard),
      BeardOpacity: Number(data.beardThickness),
      BeardColor: Number(data.beardColor),
      //ChestHairType: data.chestHair,
      //ChestHairOpacity: data.chestHairOpacity,
      //ChestHairColor: data.chestHairColor,
    },
    Face: {
      Acne: Number(data.acne),
      SkinProblem: Number(data.skinProblem),
      Freckle: Number(data.freckle),
      Wrinkle: Number(data.wrinkle),
      WrinkleOpacity: Number(data.wrinkleOpacity),
    },
  });

  cb({ ok: true });
});

RegisterNuiCallbackType('validateSkin');
on('__cfx_nui:validateSkin', (data, cb) => {
  const firstname = data.firstname;
  const lastname = data.lastname;

  // Face
  const genre = Number(data.sex);
  const dad = Number(data.dad);
  const mom = Number(data.mom);
  const heritage = Number(data.heritage);
  const skin = Number(data.skin);
  const eyecolor = Number(data.eyeColor);
  const acne = Number(data.acne);
  const skinproblem = Number(data.skinProblem);
  const freckle = Number(data.freckle);
  const wrinkle = Number(data.wrinkle);
  const wrinkleopacity = Number(data.wrinkleIntensity);
  const hair = Number(data.hair);
  const haircolor = Number(data.hairColor);
  const eyebrow = Number(data.eyeBrow);
  const eyebrowopacity = Number(data.eyebrowThickness);
  const beard = Number(data.beard);
  const beardopacity = Number(data.beardThickness);
  const beardcolor = Number(data.beardColor);

  const finalSkin = [
    {
      ['sex']: genre,
      ['face1']: dad,
      ['face2']: mom,
      ['heritage']: heritage,
      ['skin']: skin,
      ['eye_color']: eyecolor,
      ['complexion_1']: skinproblem,
      ['complexion_2']: 1,
      ['moles_1']: freckle,
      //['moles_2']: 1,
      ['age_1']: wrinkle,
      ['age_2']: wrinkleopacity,
      ['eyebrows_1']: eyebrow,
      ['eyebrows_2']: eyebrowopacity,
      ['beard_1']: beard,
      ['beard_2']: beardopacity,
      ['beard_3']: beardcolor,
      ['beard_4']: beardcolor,
      ['hair_1']: hair,
      ['hair_2']: 0,
      ['hair_color_1']: haircolor,
      ['hair_color_2']: haircolor,
      ['acne_1']: acne,
    },
  ];

  if (firstname?.length >= 3 && lastname?.length >= 3 && finalSkin?.length > 0) {
    exports['orion'].ShowSkinCreator(false);
    emitNet('orion:player:s:createNewPlayer', { firstname, lastname, finalSkin });
    cb({ ok: true });
  } else {
    emitNet(
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

RegisterKeyMapping('hanidsup', 'Hands Up', 'keyboard', 'i');
RegisterCommand(
  'handsup',
  () => {
    handsUp != handsUp;
  },
  false
);

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

onNet('orion:player:c:completRegister', (position, firstname, lastname, skin) => {
  exports['orion'].ShowSkinCreator(false);
  exports['orion'].applySkin(skin);

  SetEntityCoordsNoOffset(GetPlayerPed(-1), position.x, position.y, position.z, true, false, true);

  emit('orion:showNotification', `Bienvenue ${firstname} ${lastname} sur Orion !`);
});
