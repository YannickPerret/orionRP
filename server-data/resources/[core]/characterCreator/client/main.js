let creationCam = null;

async function startCreationCamera() {
    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);
    const [rightVector, forwardVector, upVector, position] = GetEntityMatrix(playerPed);

    const camDistance = 3.5;
    const camHeightOffset = 0.5;

    const camX = x + rightVector[0] * camDistance;
    const camY = y + rightVector[1] * camDistance;
    const camZ = z + camHeightOffset;

    creationCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", camX, camY, camZ, 0.0, 0.0, 0.0, 50.0, false, 0);
    PointCamAtCoord(creationCam, x, y, z + camHeightOffset);

    SetCamActive(creationCam, true);
    RenderScriptCams(true, false, 0, true, false);
    console.log("Caméra de création positionnée face au personnage");
}

function maintainCameraPosition() {
    if (creationCam && IsCamActive(creationCam)) {
        const playerPed = PlayerPedId();
        const [x, y, z] = GetEntityCoords(playerPed, true);

        const camOffset = 2.0;
        const camX = x + camOffset;
        const camY = y;
        const camZ = z + 0.5;

        // Mettre à jour la position de la caméra
        SetCamCoord(creationCam, camX, camY, camZ);
        PointCamAtEntity(creationCam, playerPed, 0, 0, 0, true);
    }
}

function stopCreationCamera() {
    if (creationCam) {
        RenderScriptCams(false, false, 0, true, false);
        DestroyCam(creationCam, false);
        creationCam = null;
    }
}

function CreateSkinCam(camera) {
    if (camSkin){
        let newCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", Camera[camera].x, Camera[camera].y, Camera[camera].z, 0.00, 0.00, 0.00, Camera[camera].fov, false, 0)
        PointCamAtCoord(newCam, Camera[camera].x, Camera[camera].y, Camera[camera].z)
        SetCamActiveWithInterp(newCam, camSkin, 2000, true, true)
        camSkin = newCam
    }
else {
        camSkin = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", Camera[camera].x, Camera[camera].y, Camera[camera].z, 0.00, 0.00, 0.00, Camera[camera].fov, false, 0)
        SetCamActive(cam2, true)
        RenderScriptCams(true, false, 2000, true, true)
    }
}

function closeCharacterCreationUI() {
    SetNuiFocus(false, false);
    EnableAllControlActions(0)
    stopCreationCamera();
}

async function applyDefaultSkin() {
    const skin = config.defaultSkin;

    const model = GetHashKey('mp_m_freemode_01')

    RequestModel(model);
    while (!HasModelLoaded(model)) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (IsModelInCdimage(model) && IsModelValid(model)) {
        SetPlayerModel(PlayerId(), model);
        const playerPed = PlayerPedId();

        SetPedComponentVariation(playerPed, 8, skin.tshirt_1, skin.tshirt_2, 0); // T-Shirt
        SetPedComponentVariation(playerPed, 3, skin.arms, 0, 0);                 // Bras
        SetPedComponentVariation(playerPed, 11, skin.torso_1, skin.torso_2, 0);  // Torse
        SetPedComponentVariation(playerPed, 4, skin.pants_1, skin.pants_2, 0);   // Pantalon
        SetPedComponentVariation(playerPed, 6, skin.shoes_1, skin.shoes_2, 0);   // Chaussures

        if (skin.helmet_1 !== -1) {
            SetPedPropIndex(playerPed, 0, skin.helmet_1, skin.helmet_2, true); // Casque
        } else {
            ClearPedProp(playerPed, 0);
        }

        if (skin.glasses_1 !== -1) {
            SetPedPropIndex(playerPed, 1, skin.glasses_1, skin.glasses_2, true);
        } else {
            ClearPedProp(playerPed, 1);
        }

    }
    SetModelAsNoLongerNeeded(model);

    console.log("Default skin applied successfully");
}

onNet('characterCreator:client:startCharacterCreation', async () => {
    console.log('Starting character creation')
    const playerPed = PlayerPedId();
    SetEntityCoords(playerPed, config.characterCreator.spawn.x, config.characterCreator.spawn.y, config.characterCreator.spawn.z, false, false, false, true);
    SetEntityHeading(playerPed, config.characterCreator.spawnHeading);

    SetEntityInvincible(playerPed, true);
    FreezeEntityPosition(playerPed, true);

    await applyDefaultSkin()
    startCreationCamera();
    openCharacterCreationUI();
});

const openCharacterCreationUI = () => {
    SetNuiFocus(true, true);

    SendNuiMessage(
        JSON.stringify({
            app: "characterCreator",
            method: "openCharacterCreation",
            data: true,
        })
    );
}

RegisterNuiCallbackType("applySkin");
on("__cfx_nui:applySkin", async (data, cb) => {
    console.log(data)
    if (data.gender !== undefined) {
        const isMale = data.gender === 'male';
        const model = isMale ? GetHashKey('mp_m_freemode_01') :  GetHashKey('mp_f_freemode_01');
        RequestModel(model);
        while (!HasModelLoaded(model)) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (IsModelInCdimage(model) && IsModelValid(model)) {
            SetPlayerModel(PlayerId(), model);
            const playerPed = PlayerPedId();

            // Set default clothing
            SetPedComponentVariation(playerPed, 0, 0, 0, 2);
            SetPedComponentVariation(playerPed, 2, 11, 4, 2);
            SetPedComponentVariation(playerPed, 4, 1, 5, 2);
            SetPedComponentVariation(playerPed, 6, 1, 0, 2);
            SetPedComponentVariation(playerPed, 11, 7, 2, 2);
        }
        SetModelAsNoLongerNeeded(model);

        console.log("change skin")
    }

    const playerPed = PlayerPedId();

    // Set Heritage
    if (data.heritage !== undefined) {
        const dadId = parseInt(data.heritage.dad);
        const momId = parseInt(data.heritage.mom);
        const shapeMix = data.heritage.shapeMix !== undefined ? parseFloat(data.heritage.shapeMix) : 0.5;
        const skinMix = data.heritage.skinMix !== undefined ? parseFloat(data.heritage.skinMix) : 0.5;
        SetPedHeadBlendData(playerPed, dadId, momId, 0, dadId, momId, 0, shapeMix, skinMix, 0.0, false);
    }

    if (data.appearance !== undefined){
        if (data.appearance.hairStyle !== undefined) {
            SetPedComponentVariation(playerPed, 2, parseInt(data.appearance.hairStyle),0,0);
        }
        if (data.appearance.hairPrimaryColor !== undefined && data.appearance.hairSecondaryColor !== undefined) {
            SetPedHairTint(playerPed, parseInt(data.appearance.hairPrimaryColor), parseInt(data.appearance.hairSecondaryColor));
        }
        // Beard
        if (data.appearance.beardStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 1, parseInt(data.appearance.beardStyle), 1.0); // Beard style
        }

        // Eyebrows
        if (data.appearance.eyebrowStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 2, parseInt(data.appearance.eyebrowStyle), 1.0); // Eyebrow style
        }

        // Makeup
        if (data.appearance.makeupStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 4, parseInt(data.appearance.makeupStyle), 1.0); // Makeup style
        }

        // Skin problems (like freckles, acne, etc.)
        if (data.appearance.skinProblem !== undefined) {
            SetPedHeadOverlay(playerPed, 9, parseInt(data.appearance.skinProblem), parseFloat(data.appearance.opacity || 1.0)); // Skin problem
        }

        // Nose features
        if (data.appearance.noseWidth !== undefined) SetPedFaceFeature(playerPed, 0, (parseFloat(data.appearance.noseWidth) - 5) / 10);
        if (data.appearance.noseHeight !== undefined) SetPedFaceFeature(playerPed, 1, (parseFloat(data.appearance.noseHeight) - 5) / 10);
        if (data.appearance.noseLength !== undefined) SetPedFaceFeature(playerPed, 2, (parseFloat(data.appearance.noseLength) - 5) / 10);
        if (data.appearance.noseLowering !== undefined) SetPedFaceFeature(playerPed, 3, (parseFloat(data.appearance.noseLowering) - 5) / 10);
        if (data.appearance.nosePeakLowering !== undefined) SetPedFaceFeature(playerPed, 4, (parseFloat(data.appearance.nosePeakLowering) - 5) / 10);
        if (data.appearance.noseTwist !== undefined) SetPedFaceFeature(playerPed, 5, (parseFloat(data.appearance.noseTwist) - 5) / 10);

        // Eyebrow features
        if (data.appearance.eyebrowHeight !== undefined) SetPedFaceFeature(playerPed, 6, (parseFloat(data.appearance.eyebrowHeight) - 5) / 10);
        if (data.appearance.eyebrowDepth !== undefined) SetPedFaceFeature(playerPed, 7, (parseFloat(data.appearance.eyebrowDepth) - 5) / 10);

    }

    if (data.clothes !== undefined) {
        // Clothing components
        SetPedComponentVariation(playerPed, 8, parseInt(data.clothes.tshirtStyle || 0), parseInt(data.clothes.tshirtColor || 0), 0);  // T-shirt
        SetPedComponentVariation(playerPed, 11, parseInt(data.clothes.torsoStyle || 0), parseInt(data.clothes.torsoColor || 0), 0); // Torso
        SetPedComponentVariation(playerPed, 4, parseInt(data.clothes.legsStyle || 0), parseInt(data.clothes.pantsColor || 0), 0);   // Pants
        SetPedComponentVariation(playerPed, 6, parseInt(data.clothes.shoesStyle || 0), parseInt(data.clothes.shoesColor || 0), 0);  // Shoes

        // Additional components (like arms and glasses)
        SetPedComponentVariation(playerPed, 3, parseInt(data.clothes.armsStyle || 0), parseInt(data.clothes.armsColor || 0), 0);    // Arms
        SetPedPropIndex(playerPed, 1, parseInt(data.clothes.glassesStyle || -1), 0, true);
    }

    cb({ status: "ok" });
});


RegisterNuiCallbackType('register-character')
on("__cfx_nui:register-character", async (data, cb) => {
    // Préparer les données du personnage
    const characterData = {
        firstName: data.firstName,
        lastName: data.lastName,
        model: data.gender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01',
        appearance: data.appearance,
        clothes: data.clothes,
    };

    // Envoyer les données du personnage au serveur
    emitNet('orionCore:server:registerCharacter', characterData, (status) => {
        if(status === 'ok'){
            closeCharacterCreationUI()
        }
    });

    // Callback pour notifier que le processus est terminé côté client
    cb({ status: "ok" });
})

on('onResourceStop', () => {
    const playerPed = PlayerPedId();
    FreezeEntityPosition(playerPed, false);
    SetEntityInvincible(playerPed, false);
    SetNuiFocus(false, false);

})
