var isSkinCreatorOpened = false;
var cam = -1;
var zoom = 'visage';
var isCameraActive;
var heading = 139.73;
var positionNewPlayer = {
  x: 1.17,
  y: -1508.81,
  z: 29.84,
};

const loadNewModel = async modelHash => {
  if (modelHash == GetEntityModel(GetPlayerPed(-1))) {
    return;
  }

  if (!IsModelInCdimage(modelHash) || !IsModelValid(modelHash)) {
    return;
  }

  RequestModel(modelHash);

  while (!HasModelLoaded(modelHash)) {
    await exports['orion'].delay(100);
  }
};

const zoomToPartBody = body => {
  if (isCameraActive) {
    if (DoesCamExist(cam)) {
      if (body === 'head') {
        zoom = 'head';
        zoomToHead();
      } else if (body === 'body') {
        zoom = 'body';
        zoomToBody();
      }
    }
  }
};

const zoomToHead = () => {
  let distance = GetDistanceBetweenCoords(GetCamCoord(cam.entity), (GetEntityCoords(GetPlayerPed(-1)) + 0.0, 0.0, 0.8));

  SetCamCoord(distance);
};

const zoomToBody = () => {
  let distance = GetDistanceBetweenCoords(GetCamCoord(cam.entity), (GetEntityCoords(GetPlayerPed(-1)) + 0.0, 0.0, 1.5));

  SetCamCoord(distance);
};

const CreateFullBodyCam = () => {
  // Créez la caméra
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

const ApplyPedHair = (ped, hair) => {
  SetPedComponentVariation(PlayerPedId(), 2, hair.HairType, 0, 2);
  SetPedHairColor(ped, hair.HairColor, hair.HairSecondaryColor || 0.0);
  SetPedHeadOverlay(ped, 2, hair.EyebrowType, hair.EyebrowOpacity || 1.0);
  SetPedHeadOverlayColor(ped, 2, 1, hair.EyebrowColor, 0);
  SetPedHeadOverlay(ped, 1, hair.BeardType, hair.BeardOpacity || 1.0);
  SetPedHeadOverlayColor(ped, 1, 1, hair.BeardColor, 0);

  SetPedHeadOverlay(ped, 0, hair.acne);
};

const ApplyPlayerModelHash = async (playerId, hash) => {
  await loadNewModel(hash);
  SetPlayerModel(playerId, hash);
  SetModelAsNoLongerNeeded(hash);
};

const ShowSkinCreator = enable => {
  if (enable) {
    cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);

    SetEntityCoordsNoOffset(
      GetPlayerPed(-1),
      positionNewPlayer.x,
      positionNewPlayer.y,
      positionNewPlayer.z,
      true,
      false,
      true
    );
    SetPlayerInvincible(PlayerPedId(), true);
    SetEntityHeading(GetPlayerPed(-1), heading);

    CreateFullBodyCam();

    SetCamActive(cam, true);
    RenderScriptCams(true, false, 0, true, true);
  } else {
    if (DoesCamExist(cam)) {
      SetCamActive(cam, false);
      SetPlayerInvincible(PlayerPedId(), false);
      RenderScriptCams(false, true, 500, true, true);
      cam = -1;
    }
    SetPlayerInvincible(PlayerPedId(), false);
  }

  console.log('ShowSkinCreator', enable);

  SetNuiFocus(enable, enable);
  SendNUIMessage({
    action: 'showSkinCreator',
    payload: { skinCreator: enable }
  });

  isCameraActive = enable;
  isSkinCreatorOpened = enable;
};

exports('ShowSkinCreator', ShowSkinCreator);

exports('applySkin', (skin) => {
  let ped = GetPlayerPed(-1);
  let playerId = PlayerId();

  console.log('applySkin', skin.Model.Hash)

  ApplyPlayerModelHash(playerId, skin.Model.Hash);

  SetPedDefaultComponentVariation(ped);

  ClearPedDecorations(ped);

  ApplyPedFaceTrait(skin.Model);
  applyPedFace(ped, skin.Face);
  ApplyPedHair(PlayerPedId(), skin.Hair);
  //ApplyPedMakeup(ped, skin.Makeup)
  //ApplyPedTattoos(ped, skin.Tattoos || {})
  //ApplyPedProps(ped, skin);
});

exports('skinCreatorZoom', body => {
  zoomToPartBody(body);
});

exports('requestNewModel', hash => {
  loadNewModel(hash);
});

// REGISTER COMMANDS
RegisterCommand('skin', (source, args) => {
  if (!isSkinCreatorOpened) {
    ShowSkinCreator(true);
  } else {
    ShowSkinCreator(false);
  }
});

RegisterCommand('zoom', (source, args) => {
  zoomToPartBody(args[0]);
});

// REGISTER NUI CALLBACKS
RegisterNuiCallbackType('zoom');
on('__cfx_nui:zoom', (data, cb) => {
  zoomToPartBody(data.zoom);
});

RegisterNuiCallbackType('rotateHeading');
on('__cfx_nui:rotateHeading', (data, cb) => {
  let currentHeading = GetEntityHeading(GetPlayerPed(-1));
  let heading = currentHeading + Number(data.value);

  SetEntityHeading(GetPlayerPed(-1), heading);
});

// Interval et async
