(async () => {
    const { db, r } = require('./core/server/database.js');
    const GarageManager = require('./core/server/garageManager.js');
    const VehicleManager = require('./core/server/vehicleManager.js');
    const PlayerManager = require('./core/server/playerManager.js');
    const Garage = require('./garage/garage.js');
    const Vehicle = require('./vehicle/vehicle.js');

    const calculatePrice = (price, hoursParked) => {
        return Math.round((Number(price) * Number(hoursParked)).toFixed(0));
    }

    const calculatePriceWithOneHoursFree = (price, hoursParked) => {
        if (hoursParked <= 1) {
            return 0;
        }
        return Math.round((price * (hoursParked - 1)).toFixed(0));
    }


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

            console.log('hoursParked', hoursParked, 'vehicle.dateStored', vehicle.dateStored, 'new Date().getTime()', new Date().getTime(), "garagePrice", garage.price);
            // Calcul du prix total
            vehicle.priceToRetrieve = Number(Math.round((garage.price * hoursParked).toFixed(0)))
        })

        garage.playerVehicle = vehicles.filter(vehicle => vehicle.owner === player.id);

        emitNet('orion:garage:c:openGarage', source, garage);
    })

    onNet('orion:garage:s:storeVehicle', async (vehicleNetId, vehicleProperties = {}, garageId) => {
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

        emit('orion:vehicle:s:dispawnVehicle', vehicle.netId, vehicleProperties, source);
        emitNet('orion:garage:c:closeGarage', source, "Votre véhicule a été rentré dans le garage");
    })

    onNet('orion:garage:s:retrieveVehicle', async (vehicleId, garageId) => {
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

        // get price to retrieve vehicle
        const hoursParked = (new Date().getTime() - vehicle.dateStored) / 1000 / 60 / 60;
        const priceToRetrieve = calculcalculatePriceWithOneHoursFreetePrice(garage.price, hoursParked);

        if (await exports['orion'].playerPaidWithMoney(source, priceToRetrieve)) {

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
            const spawnPosition = { "X": 117.42, "Y": -1081.14, "Z": 29.22 };
            const spawnHeading = 181.54

            emit('orion:vehicle:s:spawnVehicle', vehicle.id, spawnPosition, spawnHeading, source);
            emitNet('orion:garage:c:closeGarage', source);
        }
        else {
            emitNet('orion:garage:c:closeGarage', source, "Vous n'avez pas assez d'argent pour sortir ce véhicule du garage");
        }
    })

    onNet('orion:garage:s:init', async () => {
        await Garage.getAll().then((garageDB) => {
            garageDB.forEach(garage => {
                GarageManager.addGarage(garage.id, garage);
            })
        })
    })

})();