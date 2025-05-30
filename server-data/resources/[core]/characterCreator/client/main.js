let creationCam = null;
let isFaceZoomActive = false;
let hair = 0;
let haircolor = 0;
let haircolor2 = 0;

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

function toggleFaceCameraZoom() {
    if (!creationCam) return;

    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);

    if (isFaceZoomActive) {
        const camDistance = 3.5;
        const camHeightOffset = 0.5;
        const [rightVector, forwardVector] = GetEntityMatrix(playerPed);

        const camX = x + rightVector[0] * camDistance;
        const camY = y + rightVector[1] * camDistance;
        const camZ = z + camHeightOffset;

        SetCamCoord(creationCam, camX, camY, camZ);
        PointCamAtCoord(creationCam, x, y, z + camHeightOffset);
    } else {
        const faceDistance = 1.2;
        const faceHeightOffset = 0.6

        const camPoint = GetOffsetFromEntityInWorldCoords(playerPed, 0, 0, 0.6);

        const [rightVector, forwardVector] = GetEntityMatrix(playerPed);

        const camX = x + rightVector[0] * faceDistance;
        const camY = y + rightVector[1] * faceDistance;
        const camZ = z + faceHeightOffset;

        SetCamCoord(creationCam, camX, camY, camZ);
        PointCamAtCoord(creationCam, camPoint.x, camPoint.y, camPoint.z);
    }

    isFaceZoomActive = !isFaceZoomActive;
}

function stopCreationCamera() {
    if (creationCam) {
        RenderScriptCams(false, false, 0, true, false);
        DestroyCam(creationCam, false);
        creationCam = null;
    }
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

onNet('characterCreator:client:closeCharacterCreation', () => {
    closeCharacterCreationUI()
})

function closeCharacterCreationUI() {
    SetNuiFocus(false, false);
    EnableAllControlActions(0)
    SendNuiMessage(
        JSON.stringify({
            app: "characterCreator",
            method: "openCharacterCreation",
            data: false,
        })
    );
    stopCreationCamera();
}


RegisterNuiCallbackType("toggleFaceZoom");
on("__cfx_nui:toggleFaceZoom", (data, cb) => {
    toggleFaceCameraZoom();
    cb({ status: "ok" });
});

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
            SetPedDefaultComponentVariation(PlayerPedId())
            const playerPed = PlayerPedId();

            if (model === GetHashKey('mp_m_freemode_01')) {
                SetPedComponentVariation(playerPed, 3, 15, 0, 2)
                SetPedComponentVariation(playerPed, 11, 15, 0, 2)
                SetPedComponentVariation(playerPed, 8, 15, 0, 2)
                SetPedComponentVariation(playerPed, 4, 61, 4, 2)
                SetPedComponentVariation(playerPed, 6, 34, 0, 2)
            }
            else if(model === GetHashKey('mp_f_freemode_01')) {
                SetPedComponentVariation(playerPed, 3, 15, 0, 2)
                SetPedComponentVariation(playerPed, 11, 5, 0, 2)
                SetPedComponentVariation(playerPed, 8, 15, 0, 2)
                SetPedComponentVariation(playerPed, 4, 57, 0, 2)
                SetPedComponentVariation(playerPed, 6, 35, 0, 2)
            }
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
            hair = parseInt(data.appearance.hairStyle)
            console.log("change hair")
        }

        if (data.appearance.hairPrimaryColor !== undefined ) {
            SetPedComponentVariation(playerPed, 2, parseInt(hair), parseInt(data.appearance.hairPrimaryColor), parseInt(haircolor2));
            haircolor = parseInt(data.appearance.hairPrimaryColor);
            console.log("change hair color 1")
        }

        if (data.appearance.hairSecondaryColor !== undefined) {
            SetPedComponentVariation(playerPed, 2, parseInt(hair), parseInt(haircolor), parseInt(data.appearance.hairSecondaryColor));
            haircolor2 = parseInt(data.appearance.hairSecondaryColor);
            console.log("change hair color 2")
        }

        // Beard
        if (data.appearance.beardStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 1, parseInt(data.appearance.beardStyle), 1.0);
        }
        if (data.appearance.beardColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 1, 1, parseInt(data.appearance.beardColor), parseInt(data.appearance.beardColor)); // colorType 1 for beard
        }

        // Eyebrows
        if (data.appearance.eyebrowStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 2, parseInt(data.appearance.eyebrowStyle), 1.0);
        }
        if (data.appearance.eyebrowColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 2, 1, parseInt(data.appearance.eyebrowColor), parseInt(data.appearance.eyebrowColor)); // colorType 1 for eyebrows
        }

        // Makeup
        if (data.appearance.makeupStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 4, parseInt(data.appearance.makeupStyle), 1.0);
        }
        if (data.appearance.makeupColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 4, 2, parseInt(data.appearance.makeupColor), parseInt(data.appearance.makeupColor)); // colorType 2 for makeup
        }

        // Skin problems (like freckles, acne, etc.)
        if (data.appearance.skinProblem !== undefined) {
            SetPedHeadOverlay(playerPed, 9, parseInt(data.appearance.skinProblem), parseFloat(data.appearance.opacity || 1.0));
        }

        if (data.appearance.blemishes !== undefined) {
            SetPedHeadOverlay(playerPed, 0, parseInt(data.appearance.blemishes), 1.0);
        }
        if (data.appearance.sunDamage !== undefined) {
            SetPedHeadOverlay(playerPed, 7, parseInt(data.appearance.sunDamage), 1.0);
        }
        if (data.appearance.freckles !== undefined) {
            SetPedHeadOverlay(playerPed, 9, parseInt(data.appearance.freckles), 1.0);
        }
        if (data.appearance.moles !== undefined) {
            SetPedHeadOverlay(playerPed, 12, parseInt(data.appearance.moles), 1.0);
        }

        // Chest Hair
        if (data.appearance.chestHair !== undefined) {
            SetPedHeadOverlay(playerPed, 10, parseInt(data.appearance.chestHair), 1.0);
        }
        if (data.appearance.chestHairColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 10, 1, parseInt(data.appearance.chestHairColor), parseInt(data.appearance.chestHairColor));
        }

        // Blush
        if (data.appearance.blush !== undefined) {
            SetPedHeadOverlay(playerPed, 5, parseInt(data.appearance.blush), 1.0);
        }
        if (data.appearance.blushColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 5, 2, parseInt(data.appearance.blushColor), parseInt(data.appearance.blushColor));
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
    if (data.firstName === '' || data.lastName === '' || data.height < 50 || data.height > 230 || data.birthDate === '') {
        cb({ status : "error", message: "Veuillez remplir les champs d'ADN"})
        return
    }

    const characterData = {
        firstName: data.firstName,
        lastName: data.lastName,
        height: data.height,
        birthDate: data.birthDate,
        gender: data.gender,
        model: data.gender === 'male' ? 'mp_m_freemode_01' : 'mp_f_freemode_01',
        appearance: data.appearance,
        clothes: data.clothes,
    };


    emitNet('orionCore:server:character:register', characterData);
})

on('onResourceStop', () => {
    const playerPed = PlayerPedId();
    FreezeEntityPosition(playerPed, false);
    SetEntityInvincible(playerPed, false);
    closeCharacterCreationUI()
})
