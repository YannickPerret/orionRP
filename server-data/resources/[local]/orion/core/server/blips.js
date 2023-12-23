(async () => {
    let blipsManager = [] //en faire une classe
    const { db, r } = require('./core/server/database.js');

    const createBlip = (coords, sprite, color, text) => {
        let blip = AddBlipForCoord(coords.X, coords.Y, coords.Z);
        SetBlipSprite(blip, sprite);
        //SetBlipDisplay(blip, 4);
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
        const source = global.source;
        const stations = await db.getAll('stations');
        const banks = await db.getByWithFilter('banks', { type: 'bank' });
        const blipsList = { stations: [...stations], banks: [...banks] };

        emitNet('orion:blips:c:createBlips', source, blipsList)
    }
    exports('initializeBlips', initializeBlips);

})()