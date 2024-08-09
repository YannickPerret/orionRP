(async () => {
    const { db, r } = require('./core/server/database.js');

    onNet('orion:blips:s:initializeBlips', async () => {
        const source = global.source;
        const stations = await db.getAll('stations');
        const banks = await db.getByWithFilter('banks', { type: 'bank' });
        const bankNationals = await db.getByWithFilter('banks', { type: 'bank_nation' });
        const blipsList = { stations: [...stations], banks: [...banks], bankNationals: [...bankNationals], garages: [...garages] };
        emitNet('orion:blips:c:createAllBlips', source, blipsList)
    })

})()