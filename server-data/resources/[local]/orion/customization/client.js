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
      acne: 0,
      skinProblem: 0,
      freckle: 0,
      wrinkle: 0,
      wrinkleOpacity: 0.0,
      eyeType: 0,
      eyeOpacity: 0.0,
      eyeColor: 0,
      eyebrowType: 0,
      eyebrowOpacity: 0.0,
      eyebrowColor: 0,
      eyebrowType: 0,
      eyebrowOpacity: 0.0,
      eyebrowColor: 0,
    },
    hair: {
      hair: 2,
      hairColor: 2,
      hairSecondaryColor: 0,
    },
    beard: {
      beard: 0,
      beardOpacity: 0.0,
      beardColor: 0,
    },
    makeup: {
      lipstickType: 0,
      lipstickOpacity: 0.0,
      lipstickColor: 0,
      blushType: 0,
      blushOpacity: 0.0,
      blushColor: 0,
      eyeShadowType: 0,
      eyeShadowOpacity: 0.0,
      eyeShadowColor: 0,
      eyeLinerType: 0,
      eyeLinerOpacity: 0.0,
      eyeLinerColor: 0,
      ageingOpacity: 0.0,
      ageingColor: 0,
      complexionOpacity: 0.0,
      complexionColor: 0,
      sunDamageOpacity: 0.0,
      sunDamageColor: 0,
      molesFrecklesOpacity: 0.0,
      molesFrecklesColor: 0,
      chestHairOpacity: 0.0,
      chestHairColor: 0,
    },
    tattoos: {},
    clothers: {
      tshirt: {
        type: 0,
        color: 0,
      },
      torso: {
        type: 0,
        color: 0,
      },
      decals: {
        type: 0,
        color: 0,
      },
      arms: {
        type: 0,
        color: 0,
      },
      pants: {
        type: 0,
        color: 0,
      },
      shoes: {
        type: 0,
        color: 0,
      },
      mask: {
        type: 0,
        color: 0,
      },
      accessory: {
        type: 0,
        color: 0,
      },
      bag: {
        type: 0,
        color: 0,
      },
      vest: {
        type: 0,
        color: 0,
      },
      badge: {
        type: 0,
        color: 0,
      },
      top: {
        type: 0,
        color: 0,
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

  onNet('orion:customization:c:loadNewModel', async (modelHash, cb) => {
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

    return cb();
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
    if (face.acne == 0) {
      SetPedHeadOverlay(ped, 0, face.acne, 0.0);
    } else
      SetPedHeadOverlay(ped, 0, face.acne, 1.0);

    if (face.skinProblem == 0) {
      SetPedHeadOverlay(ped, 1, face.skinProblem, 0.0);
    } else
      SetPedHeadOverlay(ped, 1, face.skinProblem, 1.0);

    if (face.freckle == 0) {
      SetPedHeadOverlay(ped, 2, face.freckle, 0.0);
    } else
      SetPedHeadOverlay(ped, 2, face.freckle, 1.0);
    SetPedHeadOverlay(ped, 3, face.wrinkle, face.wrinkleOpacity);

    //eyes
    SetPedEyeColor(ped, face.eyeColor);
    SetPedHeadOverlay(ped, 4, face.eyeType, face.eyeOpacity);
    SetPedHeadOverlayColor(ped, 4, 0, face.eyeColor, 0);

    //eyebrows
    SetPedHeadOverlay(ped, 5, face.eyebrowType, face.eyebrowOpacity);
    SetPedHeadOverlayColor(ped, 5, 0, face.eyebrowColor, 0);

  };

  const ApplyPedFaceTrait = model => {
    SetPedHeadBlendData(
      PlayerPedId(),
      model.mother,
      model.father,
      0,
      model.mother,
      model.father,
      0,
      model.shapeMix,
      model.shapeMix,
      0.0,
      true
    );
  };

  const ApplyPedHair = (ped, hair) => {
    SetPedComponentVariation(ped, 2, hair.hair, 0, 2);
    SetPedHairColor(ped, hair.hairColor, hair.hairSecondaryColor || 0.0);
  };

  const ApplyPlayerModelHash = async (playerId, hash) => {
    await emit('orion:customization:c:loadNewModel', hash, () => {
      console.log('ApplyPlayerModelHash', hash)
      SetPlayerModel(playerId, hash);
      SetModelAsNoLongerNeeded(hash);
    })
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

    const model = {
      skin: {
        sex: Number(data.skin.sex),
        hash: Number(data.skin.sex) === 0 ? GetHashKey('mp_m_freemode_01') : GetHashKey('mp_f_freemode_01'),
        father: Number(data.skin.father),
        mother: Number(data.skin.mother),
        shapeMix: Number(data.skin.shapeMix).toFixed(2),
        skinMix: Number(data.skin.skinMix).toFixed(2),
        skinColor: Number(data.skin.skinColor),
      },
      hair: {
        hair: Number(data.hair.hair),
        hairColor: Number(data.hair.hairColor),
        hairSecondaryColor: Number(data.hair.hairSecondaryColor || 0),
      },
      face: {
        acne: Number(data.face.acne),
        skinProblem: Number(data.face.skinProblem),
        freckle: Number(data.face.freckle),
        wrinkle: Number(data.face.wrinkle),
        wrinkleOpacity: Number(data.face.wrinkleOpacity),
        eyeType: Number(data.eye),
        eyeOpacity: Number(data.eyeOpacity),
        eyeColor: Number(data.eyeColor),
        eyebrowType: Number(data.eyebrow),
        eyebrowOpacity: Number(data.eyebrowOpacity),
        eyebrowColor: Number(data.eyebrowColor),
      },
      makeup: {
        lipstickType: Number(data.lipstick),
        lipstickOpacity: Number(data.lipstickOpacity),
        lipstickColor: Number(data.lipstickColor),
        blushType: Number(data.blush),
        blushOpacity: Number(data.blushOpacity),
        blushColor: Number(data.blushColor),
        eyeShadowType: Number(data.eyeShadow),
        eyeShadowOpacity: Number(data.eyeShadowOpacity),
        eyeShadowColor: Number(data.eyeShadowColor),
        eyeLinerType: Number(data.eyeLiner),
        eyeLinerOpacity: Number(data.eyeLinerOpacity),
        eyeLinerColor: Number(data.eyeLinerColor),
        ageingType: Number(data.ageing),
        ageingOpacity: Number(data.ageingOpacity),
        ageingColor: Number(data.ageingColor),
        complexionType: Number(data.complexion),
        complexionOpacity: Number(data.complexionOpacity),
        complexionColor: Number(data.complexionColor),
        sunDamageType: Number(data.sunDamage),
        sunDamageOpacity: Number(data.sunDamageOpacity),
        sunDamageColor: Number(data.sunDamageColor),
        molesFrecklesType: Number(data.molesFreckles),
        molesFrecklesOpacity: Number(data.molesFrecklesOpacity),
        molesFrecklesColor: Number(data.molesFrecklesColor),
        chestHairType: Number(data.chestHair),
        chestHairOpacity: Number(data.chestHairOpacity),
        chestHairColor: Number(data.chestHairColor),
      },
      beard: {
        beard: Number(data.beard),
        beardOpacity: Number(data.beardThickness),
        beardColor: Number(data.beardColor),
      },
      tattoos: {},
    };

    ApplyPlayerModelHash(playerId, model.skin.hash);

    SetPedDefaultComponentVariation(ped);

    ClearPedDecorations(ped);

    ApplyPedFaceTrait(model.skin);
    applyPedFace(ped, model.face);
    ApplyPedHair(PlayerPedId(), model.hair);
    //emit('orion:customization:c:applyMakeup', model.makeup);
    //emit('orion:customization:c:applyClothes', model.clothes)
    //emit('orion:customization:c:applyTattoos', model.tattoos)
    //emit('orion:customization:c:applyBag', model.Bag, model.Clothes.Bag.Type != 0)
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