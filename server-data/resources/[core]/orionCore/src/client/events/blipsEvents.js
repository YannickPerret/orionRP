let blips = [];

onNet('blipsManager:client:setBlips', (blipsData) => {
    clearBlips();
    blips = [];
    blipsData.forEach((blipData) => {
        createBlip(blipData);
    });
});

function createBlip(blipData) {
    const blipHandle = AddBlipForCoord(blipData.positionX, blipData.positionY, blipData.positionZ);
    SetBlipSprite(blipHandle, blipData.blip_id || 1);
    SetBlipDisplay(blipHandle, blipData.display || 4);
    SetBlipScale(blipHandle, blipData.scale || 1.0);
    SetBlipColour(blipHandle, blipData.color || 1);
    SetBlipAsShortRange(blipHandle, blipData.short_range);

    if (blipData.title) {
        BeginTextCommandSetBlipName("STRING");
        AddTextComponentString(blipData.title);
        EndTextCommandSetBlipName(blipHandle);
    }

    blips.push(blipHandle);
}

function clearBlips() {
    blips.forEach((blipHandle) => {
        RemoveBlip(blipHandle);
    });
    blips = [];
}
