(async () => {
    const GarageManager = require('./core/server/garageManager.js');
    const PlayerManager = require('./core/server/playerManager.js');

    onNet('orion:garage:s:initGarages', async (garages) => {
        GarageManager.getAll().then((garages) => {
            GarageManager.addGarage(garages.id, garages);
        })
        console.log("garages")
    })

})();