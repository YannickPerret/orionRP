// rentrer la voiture dans le garage
// sortir la voiture du garage
// Payer le prix du garage quand on sort la voiture
// spawn la voiture à un emplacement libre du parking, sinon interdir le spawn si pas libre
// créer un marker pour ranger la voiture de chaque parking
(async () => {
    const garageJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'garage/garages.json'))

    const parking = []
    const showGarageHUD = false

    onNet('orion:garage:setParking', (parking) => {
        parking.push(parking)
    })

    RegisterNuiCallbackType('storeVehicle');
    on('__cfx_nui:storeVehicle', (data, cb) => {
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
        emitNet('orion:garage:s:storeVehicle', vehicleTarget, data.garageId);
        cb({ ok: true });
    });

    emitNet('orion:garage:c:closeGarage', (message) => {
        exports['orion'].showNotification(message)
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
        showGarage(garage)
    })

    setTick(async () => {
        while (true) {
            let playerPed = PlayerPedId();
            let playerCoords = GetEntityCoords(playerPed);
            garageJson.garages.forEach(garage => {
                if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z, true) < 15) {
                    DrawMarker(1, garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z, 0.0, 0.0, 0.0, 0.0, 180.0, 0, 3.0, 3.0, 2.0, 0, 128, 0, 50, false, true, 2, false, false, false, false)
                    if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z, true) < 1.8) {
                        //exports['orion'].draw3DText(garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z + 1, `Appuyez sur ~g~E~w~ pour rentrer la voiture dans le garage`)
                        emit('orion:showText', `Appuyez sur ~g~E~w~ pour ouvrir le garage`)
                        if (IsControlJustReleased(0, 38)) {
                            emitNet('orion:garage:s:openGarage', garage.id)
                        }
                    }
                }
            })
            await exports['orion'].delay(5)

        }

    });


})();