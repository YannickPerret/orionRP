(async () => {
    const MarkerManager = require('./core/server/markerManager.js');
    const GarageManager = require('./core/server/garageManager.js');

    onNet('orion:markers:s:initializeMarkers', async () => {
        const source = global.source;
        const garages = await GarageManager.getGarages();
        console.log(garages);
        // add in marker the garage spawnPosition
        garages.forEach(garage => {
            MarkerManager.addMarker(garage.position, {
                color: { r: 0, g: 128, b: 0 },
                icon: 1,
                scale: { X: 3.0, Y: 3.0, Z: 2.0 },
                garageId: garage.id
            });
        }
        );

        emitNet('orion:marker:c:initializeMarkers', source, MarkerManager.getMarkers());
    })
})()