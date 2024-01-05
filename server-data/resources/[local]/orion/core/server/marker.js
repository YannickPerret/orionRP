(async () => {
    const MarkerManager = require('./core/server/markerManager.js');
    const GarageManager = require('./core/server/garageManager.js');

    onNet('orion:markers:s:initializeMarkers', async () => {
        const source = global.source;
        const garages = GarageManager.getGarages();
        // add in marker the garage spawnPosition

        garages.forEach((garage, garageId) => {
            MarkerManager.addMarker(garageId, {
                color: { r: 0, g: 128, b: 0 },
                icon: 1,
                scale: { X: 3.0, Y: 3.0, Z: 2.0 },
                position: garage.position,
                type: 'garage'
            });
        });

        // Convertir la Map en un tableau d'objets avec les IDs inclus
        const markersArray = Array.from(MarkerManager.getMarkers(), ([id, marker]) => ({ id, ...marker }));

        console.log(markersArray)
        if (markersArray.length <= 0) {
            emit('orion:showNotification', source, "Aucun marker n'a été trouvé");
            return;
        }
        emitNet('orion:marker:c:initializeMarkers', source, markersArray);
    });
})()