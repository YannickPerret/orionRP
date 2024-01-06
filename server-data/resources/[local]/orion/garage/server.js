(async () => {
    const { db, r } = require('./core/server/database.js');
    const GarageManager = require('./core/server/garageManager.js');
    const Garage = require('./garage/garage.js');
    const Vehicle = require('./vehicle/vehicle.js');

    onNet('orion:garage:s:setParking', async () => {
        const source = global.source;
        const parkingArray = Array.from(MarkerManager.getMarkers().values());

        emitNet('orion:garage:c:setParking', source, parkingArray);
    })

    onNet('orion:garage:s:openGarage', async (garageMarker) => {
        const garage = GarageManager.getGarageByMarkerPosition()
        garage.vehicles = await garage.getVehicles();

        console.log(garage);
        emitNet('orion:garage:c:openGarage', garage);
    })

    onNet('orion:garage:s:storeVehicle', async (vehicleId, parkingId) => {
        const source = global.source;
        const vehicle = await Vehicle.getById(vehicleId);
        const parking = await db.getById('parking', parkingId);
        if (!parking) {
            emit('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de garage");
            return;
        }
        if (!vehicle) {
            emit('orion:garage:c:closeGarage', source, "Vous n'avez aucun véhicule devant vous");
            return;
        }

        parking.vehicles.push(vehicleId);
        await parking.save();

        emit('orion:garage:c:closeGarage', source, "Votre véhicule a été rentré dans le garage");
    })

    onNet('orion:garage:s:init', async () => {
        await Garage.getAll().then((garage) => {
            garage.forEach(garage => {
                GarageManager.addGarage(garage.id, garage);
            })
        })
    })

})();