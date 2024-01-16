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

    onNet('orion:garage:s:openGarage', async (garageId) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const garage = GarageManager.getGarageById(garageId);

        const vehicles = await garage.getVehicles();
        vehicles.forEach(vehicle => {
            // Calcul du temps en heures
            const hoursParked = (new Date().getTime() - vehicle.dateStored) / 1000 / 60 / 60;
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

        if (garage.vehicles.length >= garage.maxSlots) {
            emit('orion:garage:c:closeGarage', source, "Ce garage est plein");
            return;
        }

        garage.vehicles.push({ id: vehicle.id, dateStored: new Date().getTime(), priceToRetrieve: garage.price });

        await garage.save();

        emit('orion:vehicle:s:dispawnVehicle', vehicle.netId, vehicleProperties, source);
        emitNet('orion:garage:c:closeGarage', source, "Votre véhicule a été rentré dans le garage");
    })

    onNet('orion:garage:s:retrieveVehicle', async (vehicleId, garageId, spawnPosition) => {
        const source = global.source;
        const garage = GarageManager.getGarageById(garageId);
        const vehicle = garage.vehicles.find(vehicleDb => vehicleDb.id === vehicleId);

        if (!garage) {
            emitNet('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de garage");
            return;
        }
        if (!vehicle) {
            emitNet('orion:garage:c:closeGarage', source, "Vous n'avez pas sélectionné de véhicule");
            return;
        }
        const hoursParked = (new Date().getTime() - vehicle.dateStored) / 1000 / 60 / 60;
        const priceToRetrieve = calculatePriceWithOneHoursFree(Number(garage.price), Number(hoursParked));

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

            emit('orion:vehicle:s:spawnVehicle', vehicle.id, spawnPosition, spawnHeading, source);
            emitNet('orion:garage:c:closeGarage', source);
        }
        else {
            emitNet('orion:garage:c:closeGarage', source, "Vous n'avez pas assez d'argent pour sortir ce véhicule du garage");
        }
    })

    onNet('orion:garage:s:init', async () => {
        let garageMarker = [];
        let garageBlip = [];

        await Garage.getAll().then((garageDB) => {
            garageDB.forEach(garage => {
                GarageManager.addGarage(garage.id, garage);
                garageMarker.push({
                    id: garage.id,
                    name: garage.name,
                    text: "Appuyez sur ~g~E~w~ pour ouvrir le garage",
                    coords: garage.marker,
                    cb: () => {
                        emitNet('orion:garage:s:openGarage', garage.id);
                    },
                    options: {
                        color: { r: 0, g: 128, b: 0 },
                        scale: [1.0, 1.0, 1.0],
                        type: 27,
                        noText: false
                    }
                })
                garageBlip.push({
                    name: garage.name,
                    position: garage.marker,
                    sprite: 326,
                    color: 4,
                })

            })
        })

        emit('orion:marker:c:registerMarkers', garageMarker);


    })

})();