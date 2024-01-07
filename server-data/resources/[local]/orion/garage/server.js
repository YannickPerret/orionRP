(async () => {
    const { db, r } = require('./core/server/database.js');
    const GarageManager = require('./core/server/garageManager.js');
    const VehicleManager = require('./core/server/vehicleManager.js');
    const PlayerManager = require('./core/server/playerManager.js');
    const Garage = require('./garage/garage.js');
    const Vehicle = require('./vehicle/vehicle.js');

    onNet('orion:garage:s:setParking', async () => {
        const source = global.source;
        const parkingArray = Array.from(MarkerManager.getMarkers().values());

        emitNet('orion:garage:c:setParking', source, parkingArray);
    })

    onNet('orion:garage:s:openGarage', async (garageMarker) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const garage = GarageManager.getGarageByMarkerPosition(garageMarker)

        const vehicles = await garage.getVehicles();
        vehicles.forEach(vehicle => {
            // Calcul du temps en heures
            const hoursParked = (new Date().getTime() - vehicle.dateStored) / 1000 / 60 / 60;

            // Calcul du prix total
            vehicle.priceToRetrieve = Math.round((garage.price * hoursParked).toFixed(0));
        })

        garage.playerVehicle = vehicles.filter(vehicle => vehicle.owner === player.id);

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

    onNet('orion:garage:s:retrieveVehicle', async (vehicleId, garageId, position) => {
        const source = global.source;
        const vehicle = await Vehicle.getById(vehicleId);
        const garage = GarageManager.getGarageById(garageId);

        if (!garage) {
            emitNet('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de garage");
            return;
        }
        if (!vehicle) {
            emitNet('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de véhicule");
            return;
        }

        const index = garage.vehicles.findIndex(vehicleDb => vehicleDb.id === vehicle.id);
        if (index > -1) {
            garage.vehicles.splice(index, 1);
            await garage.save();
        }
        else {
            emitNet('orion:garage:c:closeGarage', source, "Ce véhicule n'est pas dans ce garage");
            return;
        }

        // get spawn position from garage and check if place it's free
        const spawnPosition = { "X": 117.42, "Y": -1081.14, "Z": 30.20 };
        const spawnHeading = 181.54

        emit('orion:vehicle:s:spawnVehicle', source, vehicle, spawnPosition, spawnHeading);
        emitNet('orion:garage:c:closeGarage', source, "Votre véhicule a été sorti du garage");
    })

    onNet('orion:garage:s:init', async () => {
        await Garage.getAll().then((garageDB) => {
            garageDB.forEach(garage => {
                GarageManager.addGarage(garage.id, garage);
            })
        })
    })

})();