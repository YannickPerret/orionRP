(async () => {
    const { db, r } = require('./core/server/database.js');
    const GarageManager = require('./core/server/garageManager.js');
    const VehicleManager = require('./core/server/vehicleManager.js');
    const Garage = require('./garage/garage.js');

    onNet('orion:garage:s:setParking', async () => {
        const source = global.source;
        const parkingArray = Array.from(MarkerManager.getMarkers().values());

        emitNet('orion:garage:c:setParking', source, parkingArray);
    })

    onNet('orion:garage:s:openGarage', async (garageMarker) => {
        const source = global.source;
        const garage = GarageManager.getGarageByMarkerPosition(garageMarker)
        garage.vehicles = await garage.getVehicles();

        emitNet('orion:garage:c:openGarage', source, garage);
    })

    onNet('orion:garage:s:storeVehicle', async (vehicleId, garageId) => {
        const source = global.source;
        const vehicle = VehicleManager.getVehicleById(vehicleId);
        const garage = GarageManager.getGarageById(garageId);

        if (!garage) {
            emit('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de garage");
            return;
        }
        if (!vehicle) {
            emit('orion:garage:c:closeGarage', source, "Vous n'avez aucun véhicule devant vous");
            return;
        }

        garage.vehicles.push({ id: vehicle.id, dateStored: new Date().getTime() });
        await garage.save();

        emit('orion:vehicle:s:dispawnVehicle', source, vehicle.netId, source);
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