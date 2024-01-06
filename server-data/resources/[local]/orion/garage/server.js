(async () => {
    const { db, r } = require('./core/server/database.js');
    const GarageManager = require('./core/server/garageManager.js');
    const VehicleManager = require('./core/server/vehicleManager.js');
    const PlayerManager = require('./core/server/playerManager.js');
    const Garage = require('./garage/garage.js');

    onNet('orion:garage:s:setParking', async () => {
        const source = global.source;
        const parkingArray = Array.from(MarkerManager.getMarkers().values());

        emitNet('orion:garage:c:setParking', source, parkingArray);
    })

    onNet('orion:garage:s:openGarage', async (garageMarker) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const garage = GarageManager.getGarageByMarkerPosition(garageMarker)
        console.log("est de type garage : ", garage instanceof Garage)
        garage.vehicles = await garage.getVehicles()//.value.filter(vehicle => vehicle.owner === player.id)

        // get price by time between now and dateStored * garage.price
        /*garage.vehicles.forEach(vehicle => {
            vehicle.priceToRetrieve = (garage.price * (new Date().getTime() - vehicle.dateStored) / 1000 / 60 / 60) - garage.price;
        })*/

        emitNet('orion:garage:c:openGarage', source, garage);
    })

    onNet('orion:garage:s:storeVehicle', async (vehicleNetId, vehicleDamage = {}, garageId) => {
        const source = global.source;
        const vehicle = VehicleManager.getVehicleById(vehicleNetId);
        const garage = GarageManager.getGarageById(garageId);

        if (!garage) {
            emit('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de garage");
            return;
        }
        if (!vehicle) {
            emit('orion:garage:c:closeGarage', source, "Vous n'avez aucun véhicule devant vous");
            return;
        }

        garage.vehicles.push({ id: vehicle.id, dateStored: new Date().getTime(), priceToRetrieve: garage.price });

        await garage.save();

        emit('orion:vehicle:s:dispawnVehicle', vehicle.netId, vehicleDamage, source);
        emitNet('orion:garage:c:closeGarage', source, "Votre véhicule a été rentré dans le garage");
    })

    onNet('orion:garage:s:init', async () => {
        await Garage.getAll().then((garageDB) => {
            garageDB.forEach(garage => {
                GarageManager.addGarage(garage.id, garage);
            })
        })

        console.log()
    })

})();