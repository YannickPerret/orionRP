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
  ShowSkinCreator(true);
});

const ShowSkinCreator = enable => {
  SetEntityCoordsNoOffset(GetPlayerPed(-1), 1.17, -1508.81, 29.84, true, false, true);
  SetPlayerInvincible(PlayerPedId(), true);
  SetEntityHeading(GetPlayerPed(-1), 139.73);

  isCameraActive = true;
  isSkinCreatorOpened = true;

  SetNuiFocus(enable, enable);
  SendNuiMessage(
    JSON.stringify({
      action: 'showSkinCreator',
      data: enable,
    })
  );
};

const CloseSkinCreator = () => {
  isSkinCreatorOpened = false;
  isCameraActive = false;
  SetCamActive(cam, false);
  SetPlayerInvincible(PlayerPedId(), false);
  //DisableIdleCamera(false);
  //RenderScriptCams(false, true, 500, true, true);
  cam = null;
  ShowSkinCreator(false);
};

RegisterNuiCallbackType('rotateHeading');
on('__cfx_nui:rotateHeading', (data, cb) => {
  let currentHeading = GetEntityHeading(GetPlayerPed(-1));
  let heading = currentHeading + Number(data.value);

  SetEntityHeading(GetPlayerPed(-1), heading);
});

// Define which part of the body must be zoomed
RegisterNuiCallbackType('zoom');
on('__cfx_nui:zoom', (data, cb) => {
  zoom = data.zoom;
});

RegisterNuiCallbackType('updateSkin');
on('__cfx_nui:updateSkin', async (data, cb) => {
  const playerPedId = PlayerPedId();
  const playerPed = GetPlayerPed(-1);
  let model = data.sex == 0 ? GetHashKey('mp_m_freemode_01') : GetHashKey('mp_f_freemode_01');

  ApplyPlayerModelHash(PlayerId(), model);

  SetPedDefaultComponentVariation(playerPed);

  ApplyPlayerBodySkin(PlayerId(), {
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
    ShowSkinCreator(false);
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

RegisterCommand('skin', (source, args) => {
  if (!isSkinCreatorOpened) {
    ShowSkinCreator(true);
  } else {
    CloseSkinCreator();
  }
});

RegisterNuiCallbackType('savePosition');
on('__cfx_nui:savePosition', (data, cb) => {
  emitNet('orion:savePlayerPosition', GetEntityCoords(GetPlayerPed(-1), true));
  cb({ ok: true });
});

const ApplyPlayerModelHash = async (playerId, hash) => {
  if (hash == GetEntityModel(GetPlayerPed(-1))) {
    return;
  }

  if (!IsModelInCdimage(hash) || !IsModelValid(hash)) {
    return;
  }

  RequestModel(hash);

  while (!HasModelLoaded(hash)) {
    await Delay(0);
  }

  SetPlayerModel(playerId, hash);
};

const ApplyPedHair = (ped, hair) => {
  SetPedComponentVariation(PlayerPedId(), 2, hair.HairType, 0, 2);
  SetPedHairColor(ped, hair.HairColor, hair.HairSecondaryColor || 0.0);
  SetPedHeadOverlay(ped, 2, hair.EyebrowType, hair.EyebrowOpacity || 1.0);
  SetPedHeadOverlayColor(ped, 2, 1, hair.EyebrowColor, 0);
  SetPedHeadOverlay(ped, 1, hair.BeardType, hair.BeardOpacity || 1.0);
  SetPedHeadOverlayColor(ped, 1, 1, hair.BeardColor, 0);

  SetPedHeadOverlay(ped, 0, hair.acne);
};

const applyPedFace = (ped, face) => {
  if (face.Acne == 0) {
    SetPedHeadOverlay(ped, 0, face.Acne, 0.0);
  } else SetPedHeadOverlay(ped, 0, face.Acne, 1.0);
  SetPedHeadOverlay(ped, 6, face.SkinProblem, 1.0);
  if (face.Freckle == 0) {
    SetPedHeadOverlay(ped, 9, face.Freckle, 0.0);
  } else SetPedHeadOverlay(ped, 9, face.Freckle, 1.0);
  SetPedHeadOverlay(ped, 3, face.Wrinkle, face.WrinkleOpacity);
};

const ApplyPedFaceTrait = model => {
  SetPedHeadBlendData(
    PlayerPedId(),
    model.Mother,
    model.Father,
    0,
    model.Mother,
    model.Father,
    0,
    model.WeightFace,
    model.WeightSkin,
    0.0,
    false
  );
};

const ApplyPlayerBodySkin = (playerId, bodySkin) => {
  ApplyPlayerModelHash(playerId, bodySkin.Model.Hash);

  let ped = GetPlayerPed(-1);
  ClearPedDecorations(ped);

  ApplyPedFaceTrait(bodySkin.Model);
  applyPedFace(ped, bodySkin.Face);
  ApplyPedHair(PlayerPedId(), bodySkin.Hair);
  //ApplyPedMakeup(ped, bodySkin.Makeup)
  //ApplyPedTattoos(ped, bodySkin.Tattoos || {})
  //ApplyPedProps(ped, bodySkin);
};

function CreateFullBodyCam() {
  // Créez une variable pour la caméra

  // Créez la caméra
  cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
  const playerPed = GetPlayerPed(-1);
  const playerCoords = GetEntityCoords(playerPed);
  const newX = playerCoords[0] - 1.2; // Ajout de 120 à la coordonnée X
  const newY = playerCoords[1] - 1.0; // Ajout de 20 à la coordonnée Y
  const newZ = playerCoords[2] + 0.4; // Ajout de 20 à la coordonnée Z

  SetCamCoord(cam, newX, newY, newZ);
  SetCamRot(cam, 0, 0, -40);
  SetCamFov(cam, 90.0);

  // Affichez la caméra
  RenderScriptCams(true, false, 0, true, false);

  return cam;
}

function ZoomToHead(cam) {
  // Obtenez la distance entre la caméra et la tête du joueur

  let distance = GetDistanceBetweenCoords(GetCamCoord(cam.entity), (GetEntityCoords(GetPlayerPed(-1)) + 0.0, 0.0, 0.8));

  SetCamCoord(distance);
  // Définissez le champ de vision de la caméra en fonction de la distance

  //SetFov(30.0 - distance / 100.0);
}

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

  if (isCameraActive) {
    // Si la caméra existe déjà, détruisez-la
    if (!DoesCamExist(cam)) {
      CreateFullBodyCam(); // Créer la caméra
      SetCamActive(cam, true);
    }
  } else {
    if (DoesCamExist(cam)) {
      DestroyCam(cam, false); // Détruire la caméra si elle existe
      cam = null; // Réinitialiser la variable cam
    }
  }
}, 200);

RegisterCommand(
  'zoom',
  (source, args) => {
    if (isCameraActive) {
      if (cam) {
        ZoomToHead(cam);
      }
    }
  },
  false
);

onNet('orion:player:c:teleport', coords => {
  SetEntityCoordsNoOffset(GetPlayerPed(-1), coords.x, coords.y, coords.z, true, false, true);
});

(async () => {
  for (var i = 1; i <= 15; i++) {
    EnableDispatchService(i, false);
  }
})();

onNet('orion:player:c:completRegister', (position, firstname, lastname, skin) => {
  isCameraActive = false;
  SetCamActive(cam, false);
  SetPlayerInvincible(PlayerPedId(), false);
  cam = null;
  ApplyPlayerBodySkin(PlayerId(), skin);
  SetEntityCoordsNoOffset(GetPlayerPed(-1), position.x, position.y, position.z, true, false, true);

  emit('orion:showNotification', `Bienvenue ${firstname} ${lastname} sur Orion !`);
});
