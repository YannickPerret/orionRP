(async () => {

    function createBlip(coords, sprite, color, text) {
        let blip = AddBlipForCoord(coords.X, coords.Y, coords.Z);
        SetBlipSprite(blip, sprite);
        SetBlipDisplay(blip, 4);
        SetBlipScale(blip, 0.9);
        SetBlipColour(blip, color);
        SetBlipAsShortRange(blip, true);

        if (text) {
            BeginTextCommandSetBlipName('STRING');
            AddTextComponentSubstringPlayerName(text);
            EndTextCommandSetBlipName(blip);
        }
        return blip;
    }

    onNet('orion:blips:c:createBlips', async (blips) => {
        blips.forEach(blip => {
            createBlip(blip.position, blip.sprite, blip.color, blip.text);
        });
    });


    onNet('orion:blips:c:createAllBlips', async (blips) => {
        blips.garages.forEach(garage => {
            exports['orion'].createBlip(garage.position, 326, 4, garage.name);
        });
        blips.stations.forEach(station => {
            exports['orion'].createBlip(station.position, 361, 13, station.name);
        });
        blips.banks.forEach(bank => {
            exports['orion'].createBlip(bank.position, 108, 2, bank.name);
        });
        blips.bankNationals.forEach(bank => {
            exports['orion'].createBlip(bank.position, 108, 2, bank.name);
        });
    });

    exports('createBlip', createBlip);

})()