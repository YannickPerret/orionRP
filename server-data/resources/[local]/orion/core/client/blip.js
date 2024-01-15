(async () => {
    let blipsRegistered = [];

    onNet('orion:blips:c:registerBlip', async (name, coords, sprite, color) => {
        blipsRegistered.push({
            name: name,
            position: coords,
            sprite: sprite,
            color: color,
        });

        let blips = createBlip(coords, sprite, color, name);
        blipsRegistered[arry.length - 1].blips = blips;
    });

    onNet('orion:blips:c:registerBlips', async (blips) => {
        blips.forEach(blip => {
            blipsRegistered.push({
                name: blip.name,
                position: blip.position,
                sprite: blip.sprite,
                color: blip.color,
            });

            let blips = createBlip(blip.position, blip.sprite, blip.color);
            blipsRegistered[arry.length - 1].blips = blips;
        });
    });

    onNet('orion:blips:c:unregisterBlips', (name) => {
        let blip = blipsRegistered.find(blip => blip.name === name);
        if (!blip) return;
        RemoveBlip(blip.blips);
        blipsRegistered = blipsRegistered.filter(blip => blip.name !== name);
    })


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

    /*
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
        });*/

    exports('createBlip', createBlip);

})()