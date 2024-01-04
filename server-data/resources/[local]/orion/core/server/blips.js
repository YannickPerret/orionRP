(async () => {
    let blipsManager = [] //en faire une classe
    const { db, r } = require('./core/server/database.js');

    const createBlip = (coords, sprite, color, text) => {
        let blip = AddBlipForCoord(coords);
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
        const stations = await db.getAll('stations');
        const banks = await db.getByWithFilter('banks', { type: 'bank' });
        const bankNationals = await db.getByWithFilter('banks', { type: 'bank_nation' });
        const garages = await db.getByWithFilter('garages', { isActive: true });
        console.log("garages", garages)
        console.log("stations", stations)
        const blipsList = { stations: [...stations], banks: [...banks], bankNationals: [...bankNationals], garages: [...garages] };
        emitNet('orion:blips:c:createBlips', -1, blipsList)
    }
    exports('initializeBlips', initializeBlips);

})()