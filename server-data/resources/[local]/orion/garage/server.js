(async () => {
    const { db, r } = require('./core/server/database.js');

    onNet('orion:garage:s:setParking', async () => {
        const parking = await db.getAll('parking');
        emitNet('orion:garage:setParking', parking);
    })


})();