function applyDefaultSkin() {
    const playerPed = PlayerPedId();
    const skin = config.defaultSkin;

    const model = skin.sex === 0 ? GetHashKey("mp_m_freemode_01") : GetHashKey("mp_f_freemode_01");
    RequestModel(model);
    while (!HasModelLoaded(model)) {
        Wait(0);
    }
    SetPlayerModel(PlayerId(), model);
    SetModelAsNoLongerNeeded(model);

    SetPedComponentVariation(playerPed, 8, skin.tshirt_1, skin.tshirt_2, 0);  // T-Shirt
    SetPedComponentVariation(playerPed, 3, skin.arms, 0, 0);                   // Arms
    SetPedComponentVariation(playerPed, 11, skin.torso_1, skin.torso_2, 0);    // Torso
    SetPedComponentVariation(playerPed, 4, skin.pants_1, skin.pants_2, 0);     // Pants
    SetPedComponentVariation(playerPed, 6, skin.shoes_1, skin.shoes_2, 0);     // Shoes
    SetPedPropIndex(playerPed, 0, skin.helmet_1, skin.helmet_2, true);         // Helmet
    SetPedPropIndex(playerPed, 1, skin.glasses_1, skin.glasses_2, true);       // Glasses

    console.log("Default skin applied");
}

function startCreationCamera() {
    const playerPed = PlayerPedId();
    const [x, y, z] = GetEntityCoords(playerPed, true);

    const camOffset = 2.0;
    const camX = x + camOffset;
    const camY = y;
    const camZ = z + 0.5;

    const cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", camX, camY, camZ, 0.0, 0.0, 0.0, 50.0, false, 0);

    PointCamAtEntity(cam, playerPed, 0, 0, 0, true);

    SetCamActive(cam, true);
    RenderScriptCams(true, false, 0, true, false);

    console.log("Character creation camera activated");
}


onNet('characterCreator:client:startCharacterCreation', () => {
    console.log('Starting character creation')
    const playerPed = PlayerPedId();
    SetEntityCoords(playerPed, config.characterCreator.spawn.x, config.characterCreator.spawn.y, config.characterCreator.spawn.z, false, false, false, true);
    SetEntityHeading(playerPed, config.characterCreator.spawnHeading);

    SetEntityInvincible(playerPed, true);
    FreezeEntityPosition(playerPed, true);

    //applyDefaultSkin();
    openCharacterCreationUI();
    //startCreationCamera();
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
    console.log("Character creation interface activated");
}


RegisterNuiCallbackType("applySkin");
on("__cfx_nui:applySkin", (data, cb) => {
    const playerPed = PlayerPedId();

    // Hair
    SetPedComponentVariation(playerPed, 2, parseInt(data.hairStyle), 0, 0); // Hair style
    SetPedHairColor(playerPed, parseInt(data.hairPrimaryColor), parseInt(data.hairSecondaryColor)); // Hair color

    // Beard
    if (data.beardStyle !== undefined) {
        SetPedHeadOverlay(playerPed, 1, parseInt(data.beardStyle), 1.0); // Beard style
    }

    // Eyebrows
    if (data.eyebrowStyle !== undefined) {
        SetPedHeadOverlay(playerPed, 2, parseInt(data.eyebrowStyle), 1.0); // Eyebrow style
    }

    // Makeup
    if (data.makeupStyle !== undefined) {
        SetPedHeadOverlay(playerPed, 4, parseInt(data.makeupStyle), 1.0); // Makeup style
    }

    // Skin problems (like freckles, acne, etc.)
    if (data.skinProblem !== undefined) {
        SetPedHeadOverlay(playerPed, 9, parseInt(data.skinProblem), parseFloat(data.opacity || 1.0)); // Skin problem
    }

    // Nose features
    if (data.noseWidth !== undefined) SetPedFaceFeature(playerPed, 0, (parseFloat(data.noseWidth) - 5) / 10);
    if (data.noseHeight !== undefined) SetPedFaceFeature(playerPed, 1, (parseFloat(data.noseHeight) - 5) / 10);
    if (data.noseLength !== undefined) SetPedFaceFeature(playerPed, 2, (parseFloat(data.noseLength) - 5) / 10);
    if (data.noseLowering !== undefined) SetPedFaceFeature(playerPed, 3, (parseFloat(data.noseLowering) - 5) / 10);
    if (data.nosePeakLowering !== undefined) SetPedFaceFeature(playerPed, 4, (parseFloat(data.nosePeakLowering) - 5) / 10);
    if (data.noseTwist !== undefined) SetPedFaceFeature(playerPed, 5, (parseFloat(data.noseTwist) - 5) / 10);

    // Eyebrow features
    if (data.eyebrowHeight !== undefined) SetPedFaceFeature(playerPed, 6, (parseFloat(data.eyebrowHeight) - 5) / 10);
    if (data.eyebrowDepth !== undefined) SetPedFaceFeature(playerPed, 7, (parseFloat(data.eyebrowDepth) - 5) / 10);

    // Clothing components
    SetPedComponentVariation(playerPed, 8, parseInt(data.tshirtStyle || 0), parseInt(data.tshirtColor || 0), 0);  // T-shirt
    SetPedComponentVariation(playerPed, 11, parseInt(data.torsoStyle || 0), parseInt(data.torsoColor || 0), 0); // Torso
    SetPedComponentVariation(playerPed, 4, parseInt(data.legsStyle || 0), parseInt(data.pantsColor || 0), 0);   // Pants
    SetPedComponentVariation(playerPed, 6, parseInt(data.shoesStyle || 0), parseInt(data.shoesColor || 0), 0);  // Shoes

    // Additional components (like arms and glasses)
    SetPedComponentVariation(playerPed, 3, parseInt(data.armsStyle || 0), parseInt(data.armsColor || 0), 0);    // Arms
    SetPedPropIndex(playerPed, 1, parseInt(data.glassesStyle || -1), 0, true); // Glasses (remove if style is -1)

    console.log("Applied full skin changes in real-time");
    cb( { status : 'ok' })
});

