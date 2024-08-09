// rentrer la voiture dans le garage
// sortir la voiture du garage
// Payer le prix du garage quand on sort la voiture
// spawn la voiture à un emplacement libre du parking, sinon interdir le spawn si pas libre
// créer un marker pour ranger la voiture de chaque parking
(async () => {

    let currentGarageObj = {};
    let showGarageHUD = false

    const checkIfVehicleIsOnPlace = () => {
        currentGarageObj.spawnPlaces.forEach((place, index) => {
            if (!exports['orion'].isAreaVehicleOccuped(place, 2.0, 0)) {
                return place
            }
        })
        return false
    }

    RegisterNuiCallbackType('storeVehicle');
    on('__cfx_nui:storeVehicle', async (data, cb) => {
        if (data.garageId === undefined) {
            exports['orion'].showNotification("Vous n'avez pas sélectionné de garage");
            return cb({ ok: false });
        }
        const playerPed = PlayerPedId();
        const vehicleTarget = exports['orion'].getVehicleInFront(playerPed, 2.0);
        if (!vehicleTarget) {
            exports['orion'].showNotification("Vous n'avez aucun véhicule devant vous");
            return cb({ ok: false });
        }
        const vehicleProperties = await exports['orion'].getVehicleProprieties(vehicleTarget);

        emitNet('orion:garage:s:storeVehicle', NetworkGetNetworkIdFromEntity(vehicleTarget), vehicleProperties, data.garageId);
        cb({ ok: true });
    });

    RegisterNuiCallbackType('retrieveVehicle');
    on('__cfx_nui:retrieveVehicle', (data, cb) => {
        if (data.garageId === undefined) {
            exports['orion'].showNotification("Vous n'avez pas sélectionné de garage");
            return cb({ ok: false });
        }
        if (data.vehicleId === undefined) {
            exports['orion'].showNotification("Vous n'avez pas sélectionné de véhicule");
            return cb({ ok: false });
        }

        const garagePlacePos = checkIfVehicleIsOnPlace();
        if (!garagePlacePos) {
            exports['orion'].showNotification("Il n'y a pas de place libre pour sortir votre véhicule");
            return cb({ ok: false });
        }
        emitNet('orion:garage:s:retrieveVehicle', data.vehicleId, data.garageId, garagePlacePos);
        cb({ ok: true });
    });

    RegisterNuiCallbackType('closeGarage');
    on('__cfx_nui:closeGarage', (data, cb) => {
        emit('orion:garage:c:closeGarage');
        cb({ ok: true });
    });

    onNet('orion:garage:c:closeGarage', (message = undefined) => {
        if (message) {
            exports['orion'].showNotification(message)
        }
        showGarageHUD = false
        SetNuiFocus(false, false)
    })

    const showGarage = async (garage) => {
        showGarageHUD = !showGarageHUD
        SetNuiFocus(showGarageHUD, showGarageHUD)
        SendNUIMessage({
            action: "showGarage",
            payload: {
                garageHUD: showGarageHUD,
                garage: garage
            }
        })
    }

    onNet('orion:garage:c:openGarage', (garage) => {
        currentGarageObj = garage
        showGarage(garage)
    })

})();