(async () => {
  let isSkinCreatorOpened = false;
  let cam = -1;
  let zoom = 'visage';
  let isCameraActive;
  let heading = 139.73;
  let positionNewPlayer = {
    x: 1.17,
    y: -1508.81,
    z: 29.84,
  };

  let defaultPedSkin = {
    skin: {
      sex: 0,
      father: 0,
      mother: 0,
      shapeMix: 0.5,
      skinMix: 0.5,
      skinColor: 0,
    },
    face: {
      Acne: 0,
      SkinProblem: 0,
      Freckle: 0,
      Wrinkle: 0,
      WrinkleOpacity: 0.0,
      EyebrowType: 0,
      EyebrowOpacity: 0.0,
      EyebrowColor: 0,
    },
    hair: {
      Hair: 0,
      HairColor: 0,
      HairSecondaryColor: 0,
    },
    beard: {
      Beard: 0,
      BeardOpacity: 0.0,
      BeardColor: 0,
    },
    makeup: {
      LipstickType: 0,
      LipstickOpacity: 0.0,
      LipstickColor: 0,
      BlushType: 0,
      BlushOpacity: 0.0,
      BlushColor: 0,
      EyeShadowType: 0,
      EyeShadowOpacity: 0.0,
      EyeShadowColor: 0,
      EyeLinerType: 0,
      EyeLinerOpacity: 0.0,
      EyeLinerColor: 0,
      EyeType: 0,
      EyeOpacity: 0.0,
      EyeColor: 0,
      EyebrowType: 0,
      EyebrowOpacity: 0.0,
      EyebrowColor: 0,
      AgeingOpacity: 0.0,
      AgeingColor: 0,
      ComplexionOpacity: 0.0,
      ComplexionColor: 0,
      SunDamageOpacity: 0.0,
      SunDamageColor: 0,
      MolesFrecklesOpacity: 0.0,
      MolesFrecklesColor: 0,
      ChestHairOpacity: 0.0,
      ChestHairColor: 0,
    },
    tattoos: {},
    clothers: {
      Tshirt: {
        Type: 0,
        Color: 0,
      },
      Torso: {
        Type: 0,
        Color: 0,
      },
      Decals: {
        Type: 0,
        Color: 0,
      },
      Arms: {
        Type: 0,
        Color: 0,
      },
      Pants: {
        Type: 0,
        Color: 0,
      },
      Shoes: {
        Type: 0,
        Color: 0,
      },
      Mask: {
        Type: 0,
        Color: 0,
      },
      Accessory: {
        Type: 0,
        Color: 0,
      },
      Bag: {
        Type: 0,
        Color: 0,
      },
      Vest: {
        Type: 0,
        Color: 0,
      },
      Badge: {
        Type: 0,
        Color: 0,
      },
      Top: {
        Type: 0,
        Color: 0,
      }
    }
  };


  onNet('orion:customization:c:applyClothes', (clothes) => {
    let ped = GetPlayerPed(-1);

    SetPedComponentVariation(ped, 3, clothes.Tshirt.Type, clothes.Tshirt.Color, 2);
    SetPedComponentVariation(ped, 11, clothes.Torso.Type, clothes.Torso.Color, 2);
    SetPedComponentVariation(ped, 10, clothes.Decals.Type, clothes.Decals.Color, 2);
    SetPedComponentVariation(ped, 8, clothes.Arms.Type, clothes.Arms.Color, 2);
    SetPedComponentVariation(ped, 4, clothes.Pants.Type, clothes.Pants.Color, 2);
    SetPedComponentVariation(ped, 6, clothes.Shoes.Type, clothes.Shoes.Color, 2);
    SetPedComponentVariation(ped, 1, clothes.Mask.Type, clothes.Mask.Color, 2);
    SetPedComponentVariation(ped, 7, clothes.Accessory.Type, clothes.Accessory.Color, 2);
    SetPedComponentVariation(ped, 5, clothes.Bag.Type, clothes.Bag.Color, 2);
    SetPedComponentVariation(ped, 9, clothes.Vest.Type, clothes.Vest.Color, 2);
    SetPedComponentVariation(ped, 10, clothes.Badge.Type, clothes.Badge.Color, 2);
    SetPedComponentVariation(ped, 8, clothes.Top.Type, clothes.Top.Color, 2);
  });

  onNet('orion:customization:c:applyMakeup', (makeup) => {
    let ped = GetPlayerPed(-1);

    SetPedHeadOverlay(ped, 8, makeup.LipstickType, makeup.LipstickOpacity);
    SetPedHeadOverlayColor(ped, 8, 2, makeup.LipstickColor, 0);
    SetPedHeadOverlay(ped, 5, makeup.BlushType, makeup.BlushOpacity);
    SetPedHeadOverlayColor(ped, 5, 2, makeup.BlushColor, 0);
    SetPedHeadOverlay(ped, 4, makeup.EyeShadowType, makeup.EyeShadowOpacity);
    SetPedHeadOverlayColor(ped, 4, 2, makeup.EyeShadowColor, 0);
    SetPedHeadOverlay(ped, 2, makeup.EyeLinerType, makeup.EyeLinerOpacity);
    SetPedHeadOverlayColor(ped, 2, 2, makeup.EyeLinerColor, 0);
    SetPedHeadOverlay(ped, 1, makeup.EyeType, makeup.EyeOpacity);
    SetPedHeadOverlayColor(ped, 1, 2, makeup.EyeColor, 0);
    SetPedHeadOverlay(ped, 0, makeup.EyebrowType, makeup.EyebrowOpacity);
    SetPedHeadOverlayColor(ped, 0, 2, makeup.EyebrowColor, 0);
    SetPedHeadOverlay(ped, 3, makeup.AgeingType, makeup.AgeingOpacity);
    SetPedHeadOverlayColor(ped, 3, 2, makeup.AgeingColor, 0);
    SetPedHeadOverlay(ped, 6, makeup.ComplexionType, makeup.ComplexionOpacity);
    SetPedHeadOverlayColor(ped, 6, 2, makeup.ComplexionColor, 0);
    SetPedHeadOverlay(ped, 7, makeup.SunDamageType, makeup.SunDamageOpacity);
    SetPedHeadOverlayColor(ped, 7, 2, makeup.SunDamageColor, 0);
    SetPedHeadOverlay(ped, 9, makeup.MolesFrecklesType, makeup.MolesFrecklesOpacity);
    SetPedHeadOverlayColor(ped, 9, 2, makeup.MolesFrecklesColor, 0);
    SetPedHeadOverlay(ped, 10, makeup.ChestHairType, makeup.ChestHairOpacity);
    SetPedHeadOverlayColor(ped, 10, 2, makeup.ChestHairColor, 0);
  });

  onNet('orion:customization:c:applyTattoos', (tattoos) => {
    let ped = GetPlayerPed(-1);

    ClearPedDecorations(ped);

    for (let i = 0; i < 25; i++) {
      if (tattoos[i]) {
        AddPedDecorationFromHashes(ped, tattoos[i].Collection, tattoos[i].Hash);
      }
    }
  });

  onNet('orion:customization:c:applyBag', (bag, enable) => {
    let ped = GetPlayerPed(-1);
    if (enable) {
      SetPedComponentVariation(ped, 5, bag.Type, bag.Color, 2);
    }
    else {
      SetPedComponentVariation(ped, 5, 0, 0, 2);
    }
  });

  onNet('orion:customization:c:loadNewModel', async (modelHash) => {
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
  });

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
      model.shapeMix,
      model.skinMix,
      0.0,
      true
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
    await emit('orion:customization:c:loadNewModel', hash)
    SetPlayerModel(playerId, hash);
    SetModelAsNoLongerNeeded(hash);
  };

  onNet('orion:customization:c:ShowSkinCreator', (enable) => {
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

    SetNuiFocus(enable, enable);

    SendNUIMessage({
      action: 'showSkinCreator',
      payload: {
        skinCreator: enable,
        skin: defaultPedSkin,
      }
    });

    isCameraActive = enable;
    isSkinCreatorOpened = enable;
  });

  RegisterNuiCallbackType('updateSkin');
  on('__cfx_nui:updateSkin', async (data, cb) => {
    emit('orion:customization:c:updatePlayerSkin', data);
    cb({ ok: true });
  });

  onNet('orion:customization:c:updatePlayerSkin', (data) => {
    let ped = GetPlayerPed(-1);
    let playerId = PlayerId();

    const _model = data.sex == 0 ? GetHashKey('mp_m_freemode_01') : GetHashKey('mp_f_freemode_01');

    const model = {
      Skin: {
        Sex: Number(data.Skin.sex),
        Hash: _model,
        Father: Number(data.dad),
        Mother: Number(data.mom),
        ShapeMix: Number(data.heritage).toFixed(2),
        SkinMix: Number(data.heritage).toFixed(2),
        Skin: Number(data.skin),
      },
      Hair: {
        HairType: Number(data.hair),
        HairColor: Number(data.hairColor),
        HairSecondaryColor: Number(data.highlight),
      },
      Face: {
        Acne: Number(data.acne),
        SkinProblem: Number(data.skinProblem),
        Freckle: Number(data.freckle),
        Wrinkle: Number(data.wrinkle),
        WrinkleOpacity: Number(data.wrinkleOpacity),
      },
      Makeup: {
        LipstickType: Number(data.lipstick),
        LipstickOpacity: Number(data.lipstickOpacity),
        LipstickColor: Number(data.lipstickColor),
        BlushType: Number(data.blush),
        BlushOpacity: Number(data.blushOpacity),
        BlushColor: Number(data.blushColor),
        EyeShadowType: Number(data.eyeShadow),
        EyeShadowOpacity: Number(data.eyeShadowOpacity),
        EyeShadowColor: Number(data.eyeShadowColor),
        EyeLinerType: Number(data.eyeLiner),
        EyeLinerOpacity: Number(data.eyeLinerOpacity),
        EyeLinerColor: Number(data.eyeLinerColor),
        EyeType: Number(data.eye),
        EyeOpacity: Number(data.eyeOpacity),
        EyeColor: Number(data.eyeColor),
        EyebrowType: Number(data.eyebrow),
        EyebrowOpacity: Number(data.eyebrowOpacity),
        EyebrowColor: Number(data.eyebrowColor),
        AgeingType: Number(data.ageing),
        AgeingOpacity: Number(data.ageingOpacity),
        AgeingColor: Number(data.ageingColor),
        ComplexionType: Number(data.complexion),
        ComplexionOpacity: Number(data.complexionOpacity),
        ComplexionColor: Number(data.complexionColor),
        SunDamageType: Number(data.sunDamage),
        SunDamageOpacity: Number(data.sunDamageOpacity),
        SunDamageColor: Number(data.sunDamageColor),
        MolesFrecklesType: Number(data.molesFreckles),
        MolesFrecklesOpacity: Number(data.molesFrecklesOpacity),
        MolesFrecklesColor: Number(data.molesFrecklesColor),
        ChestHairType: Number(data.chestHair),
        ChestHairOpacity: Number(data.chestHairOpacity),
        ChestHairColor: Number(data.chestHairColor),
      },
      Beard: {
        Beard: Number(data.beard),
        BeardOpacity: Number(data.beardThickness),
        BeardColor: Number(data.beardColor),
      },
      Tattoos: {},
    }
    ApplyPlayerModelHash(playerId, model.Skin.Hash);

    SetPedDefaultComponentVariation(ped);

    ClearPedDecorations(ped);

    ApplyPedFaceTrait(model.Skin);
    applyPedFace(ped, model.Face);
    ApplyPedHair(PlayerPedId(), model.Hair);
    emit('orion:customization:c:applyMakeup', model.Makeup);
    emit('orion:customization:c:applyClothes', model.Clothes)
    emit('orion:customization:c:applyTattoos', model.Tattoos)
    // emit('orion:customization:c:applyBag', model.Bag, model.Clothes.Bag.Type != 0)
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
})();