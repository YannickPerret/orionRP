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
  RenderScriptCams(false, false, 0, 1, 0);

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
  RenderScriptCams(false, true, 500, true, true);
  SetPlayerInvincible(PlayerPedId(), false);

  cam = nil;
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
  const playerPed = PlayerPedId();
  let characterModel;

  if (data.sex == 0) {
    characterModel = GetHashKey('mp_m_freemode_01');
  } else {
    characterModel = GetHashKey('mp_f_freemode_01');
  }

  const hash = GetEntityModel(PlayerPedId());

  if (hash != GetHashKey(characterModel)) {
    RequestModel(characterModel);

    while (!HasModelLoaded(characterModel)) {
      RequestModel(characterModel);
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    if (IsModelInCdimage(characterModel) && IsModelValid(characterModel)) {
      SetPlayerModel(PlayerId(), characterModel);
    }

    SetModelAsNoLongerNeeded(characterModel);
  }

  SetPedDefaultComponentVariation(GetPlayerPed(-1));
  // Face
  console.log(data);
  SetPedHeadBlendData(
    GetPlayerPed(-1),
    data.dad,
    data.mom,
    data.mom,
    data.skin,
    data.skin,
    data.skin,
    data.heritage * 0.1,
    data.heritage * 0.1,
    1.0,
    true
  );

  SetPedEyeColor(GetPlayerPed(-1), data.eyeColor);
  if (data.acne == 0) SetPedHeadOverlay(GetPlayerPed(-1), 0, data.acne, 0.0);
  else SetPedHeadOverlay(GetPlayerPed(-1), 0, data.acne, 1.0);

  SetPedHeadOverlay(GetPlayerPed(-1), 6, data.skinProblem, 1.0);
  if (data.freckle == 0) SetPedHeadOverlay(GetPlayerPed(-1), 9, data.freckle, 0.0);
  else SetPedHeadOverlay(GetPlayerPed(-1), 9, data.freckle, 1.0);

  SetPedHeadOverlay(GetPlayerPed(-1), 3, data.wrinkle, data.wrinkleIntensity * 0.1);
  SetPedComponentVariation(GetPlayerPed(-1), 2, data.hair, 0, 0);
  SetPedHairColor(GetPlayerPed(-1), data.hairColor, data.hairColor);
  SetPedHeadOverlay(GetPlayerPed(-1), 2, data.eyebrow, data.eyebrowThickness * 0.1); // icicicici
  SetPedHeadOverlay(GetPlayerPed(-1), 1, data.beard, data.beardThickness * 0.1); // ICICICI
  SetPedHeadOverlayColor(GetPlayerPed(-1), 1, 1, data.beardColor, data.beardColor);
  SetPedHeadOverlayColor(GetPlayerPed(-1), 2, 1, data.beardColor, data.beardColor);

  SetPedHeadOverlay(GetPlayerPed(-1), 4, 0, 0.0); //Lipstick
  SetPedHeadOverlay(GetPlayerPed(-1), 8, 0, 0.0); // Makeup
  SetPedHeadOverlayColor(GetPlayerPed(-1), 4, 1, 0, 0); // Makeup Color
  SetPedHeadOverlayColor(GetPlayerPed(-1), 8, 1, 0, 0); // Lipstick Color
  SetPedComponentVariation(GetPlayerPed(-1), 1, 0, 0, 2); // Mask

  cb({ ok: true });
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
