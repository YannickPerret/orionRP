(async () => {
    let blipsManager = [] //en faire une classe
    const { db, r } = require('./core/server/database.js');

    const createBlip = (coords, sprite, color, text) => {
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
    exports('createBlip', createBlip);

    const initializeBlips = async () => {
        //station essence
        const stations = await db.getAll('stations');
        const banks = await db.get('banks', { type: 'bank' });

        stations.forEach(station => {
            let blip = createBlip(station.position, 361, 1, station.name);
            blipsManager.push({ id: station.id, blip: blip });
        });

        banks.forEach(bank => {
            let blip = createBlip(bank.position, 108, 1, bank.name);
            blipsManager.push({ id: bank.id, blip: blip });
        });
    }
    exports('initializeBlips', initializeBlips);

})()