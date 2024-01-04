(async () => {
    const { db, r } = require('./core/server/database.js');

    onNet('orion:markers:s:initializeMarkers', async () => {
        const garages = await db.getByWithFilter('garages', { isActive: true });

        const markersList = { garages: [...garages] };
        emitNet('orion:markers:c:createMarkers', -1, markersList)
    })
})()