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
    const playerPed = PlayerPedId();
    SetEntityCoords(playerPed, config.characterCreator.spawn)
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
            app: "orion",
            method: "openCharacterCreation",
            data: true,
        })
    );
    console.log("Character creation interface activated");
}


RegisterNuiCallbackType("applySkin");
on("__cfx_nui:applySkin", (data, cb) => {
    const playerPed = PlayerPedId();

    // Example: Update hair style and color
    SetPedComponentVariation(playerPed, 2, parseInt(data.hairStyle), 0, 0); // Hair style
    SetPedHairColor(playerPed, parseInt(data.hairPrimaryColor), parseInt(data.hairSecondaryColor)); // Hair color

    // Update other components based on data
    SetPedComponentVariation(playerPed, 8, parseInt(data.tshirtStyle), 0, 0);  // T-shirt
    SetPedComponentVariation(playerPed, 11, parseInt(data.torsoStyle), 0, 0); // Torso
    SetPedComponentVariation(playerPed, 4, parseInt(data.legsStyle), 0, 0);   // Pants
    SetPedComponentVariation(playerPed, 6, parseInt(data.shoesStyle), 0, 0);  // Shoes

    console.log("Applied skin changes in real-time");
    cb({ status: "ok" }); // Send a response back to NUI
});
