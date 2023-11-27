//https://github.com/tringuyenk19/skincreator/blob/master/client.lua

/*
if gent == 0 then
			characterModel = GetHashKey('mp_m_freemode_01')
		elseif gent > 1 then
			characterModel = pedList[gent - 1]
		else
			characterModel = GetHashKey('mp_f_freemode_01')
		end
    */
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

on('orion:createNewPlayer', source => {
  ShowSkinCreator(true);
});

function getPedAppearance(ped) {
  const eyeColor = GetPedEyeColor(ped);

  return {
    model: getPedModel(ped) || 'mp_m_freemode_01',
    headBlend: getPedHeadBlend(ped),
    faceFeatures: getPedFaceFeatures(ped),
    headOverlays: getPedHeadOverlays(ped),
    components: getPedComponents(ped),
    props: getPedProps(ped),
    hair: getPedHair(ped),
    eyeColor: eyeColor < EYE_COLORS.length ? eyeColor : 0,
    tattoos: getPedTattoos(),
  };
}

const ShowSkinCreator = enable => {
  SetEntityCoordsNoOffset(GetPlayerPed(-1), -705.85, -151.68, 37.42, false, false, true);
  isCameraActive = true;
  SetPlayerInvincible(PlayerPedId(), true);
  isSkinCreatorOpened = true;
  //RenderScriptCams(false, false, 0, 1, 0);
  SetEntityHeading(GetPlayerPed(-1), 90.0);

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
  //SetCamActive(cam, false);
  SetPlayerInvincible(PlayerPedId(), false);
  //RenderScriptCams(false, true, 500, true, true);
  cam = null;
  ShowSkinCreator(false);
};

RegisterNuiCallbackType('rotateHeading');
on('__cfx_nui:rotateHeading', (data, cb) => {
  let currentHeading = GetEntityHeading(GetPlayerPed(-1));
  heading = currentHeading + Number(data.value);

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
  let model = data.sex == 0 ? 'mp_m_freemode_01' : 'mp_f_freemode_01';

  ApplyPlayerModelHash(PlayerId(), model);

  SetPedDefaultComponentVariation(playerPed);

  ApplyPlayerBodySkin(PlayerId(), {
    Model: {
      Hash: model,
      Father: data.dad,
      Mother: data.mom,
      ShapeMix: data.heritage * 0.1,
      SkinMix: data.heritage * 0.1,
    },
    Hair: {
      HairType: data.hair,
      HairColor: data.hairColor,
      HairSecondaryColor: data.highlight,
      EyebrowType: data.eyebrow,
      EyebrowOpacity: data.eyebrowThickness,
      EyebrowColor: data.eyebrowColor,
      BeardType: data.beard,
      BeardOpacity: data.beardThickness,
      BeardColor: data.beardColor,
      //ChestHairType: data.chestHair,
      //ChestHairOpacity: data.chestHairOpacity,
      //ChestHairColor: data.chestHairColor,
    },
  });
  cb({ ok: true });
});

(async () => {
  while (true) {
    if (isCameraActive == true) {
      RenderScriptCams(false, false, 0, 1, 0);
      DestroyCam(cam, false);
      if (!DoesCamExist(cam)) {
        cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
        SetCamCoord(cam, GetEntityCoords(GetPlayerPed(-1)));
        SetCamRot(cam, 90.0, 0.0, 0.0);
        SetCamActive(cam, true);
        RenderScriptCams(true, false, 0, true, true);
        SetCamCoord(cam, GetEntityCoords(GetPlayerPed(-1)));
      }
    }
    await Delay(500);
  }
})();

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
  let heritage = Number(data.heritage);
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

  let skinn = {
    ['sex']: gent,
    ['face']: dad,
    ['skin']: skin,
    ['eye_color']: eyecolor,
    ['complexion_1']: skinproblem,
    ['complexion_2']: 1,
    ['moles_1']: freckle,
    ['moles_2']: 1,
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
    ['arms']: torso,
    ['arms_2']: torsotext,
    ['pants_1']: leg,
    ['pants_2']: legtext,
    ['shoes_1']: shoes,
    ['shoes_2']: shoestext,
    ['chain_1']: accessory,
    ['chain_2']: accessorytext,
    ['tshirt_1']: undershirt,
    ['tshirt_2']: undershirttext,
    ['torso_1']: torso2,
    ['torso_2']: torso2text,
    ['helmet_1']: prop_hat,
    ['helmet_2']: prop_hat_text,
    ['glasses_1']: prop_glasses,
    ['glasses_2']: prop_glasses_text,
    ['ears_1']: prop_earrings,
    ['ears_2']: prop_earrings_text,
    ['watches_1']: prop_watches,
    ['watches_2']: prop_watches_text,
  };

  if (firstname && lastname) {
    emitNet('orion:player:createNewPlayer', firstname, lastname, skinn);
    cb({ ok: true });
  } else {
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

const ApplyPlayerModelHash = async (playerId, hash) => {
  if (hash == GetEntityModel(GetPlayerPed(playerId))) {
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
  if (IsPedComponentVariationValid(ped, 2, hair.HairType, 0, 0) == false) {
    hair.HairType = 0;
    console.log('HairType is invalid');
  }
  SetPedComponentVariation(ped, 2, hair.HairType, 0, 0);
  SetPedHairColor(ped, hair.HairColor, hair.HairSecondaryColor || 0);
  SetPedHeadOverlay(ped, 2, hair.EyebrowType, hair.EyebrowOpacity || 1.0);
  SetPedHeadOverlayColor(ped, 2, 1, hair.EyebrowColor, 0);

  // SetPedHeadOverlay(ped, HeadOverlayType.FacialHair, hair.BeardType, (hair.BeardOpacity || 0) + 0.0 || 1.0);
  //SetPedHeadOverlayColor(ped, HeadOverlayType.FacialHair, 1, hair.BeardColor, 0);
  //SetPedHeadOverlay(ped, HeadOverlayType.ChestHair, hair.ChestHairType, (hair.ChestHairOpacity || 0) + 0.0 || 1.0);
  //SetPedHeadOverlayColor(ped, HeadOverlayType.ChestHair, 1, hair.ChestHairColor, 0);
};

const ApplyPedFaceTrait = (ped, model) => {
  SetPedHeadBlendData(
    ped,
    model.Father,
    model.Mother,
    0,
    model.Father,
    model.Mother,
    0,
    model.ShapeMix,
    model.SkinMix,
    1.0,
    true
  );
};

const ApplyPlayerBodySkin = (playerId, bodySkin) => {
  ApplyPlayerModelHash(playerId, bodySkin.Model.Hash);

  let ped = GetPlayerPed(playerId);
  ClearPedDecorations(ped);

  ApplyPedFaceTrait(ped, bodySkin.Model);
  ApplyPedHair(PlayerPedId(), bodySkin.Hair);
  //ApplyPedMakeup(ped, bodySkin.Makeup)
  //ApplyPedTattoos(ped, bodySkin.Tattoos || {})
  //ApplyPedProps(ped, bodySkin);
};
