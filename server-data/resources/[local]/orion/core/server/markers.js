(async () => {
    const { db, r } = require('./core/server/database.js');
    const GarageManager = require('./core/server/garageManager.js');

    onNet('orion:markers:s:initializeMarkers', async () => {
        const garages = await GarageManager.getGarages();
        const markersList = {
            garages: garages
        }


        emitNet('orion:markers:c:createMarkers', -1, markersList)
    })


})()