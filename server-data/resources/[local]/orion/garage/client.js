// rentrer la voiture dans le garage
// sortir la voiture du garage
// Payer le prix du garage quand on sort la voiture
// spawn la voiture à un emplacement libre du parking, sinon interdir le spawn si pas libre
// créer un marker pour ranger la voiture de chaque parking
(async () => {
    const garageJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'garage/garages.json'))

    let garageObj = [];
    let showGarageHUD = false

    onNet('orion:garage:c:initializeGarages', () => {
        console.log('initializeGarages')
        emitNet('orion:garage:s:setParking')
    })

    onNet('orion:garage:c:setParking', (parking) => {
        garageObj = parking
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
        const vehicleDamage = exports['orion'].getVehicleDamage(vehicleTarget);
        emitNet('orion:garage:s:storeVehicle', NetworkGetNetworkIdFromEntity(vehicleTarget), vehicleDamage, data.garageId);
        cb({ ok: true });
    });

    RegisterNuiCallbackType('takeVehicle');
    on('__cfx_nui:takeVehicle', (data, cb) => {
        if (data.garageId === undefined) {
            exports['orion'].showNotification("Vous n'avez pas sélectionné de garage");
            return cb({ ok: false });
        }
        emitNet('orion:garage:s:takeVehicle', data.vehicleId, data.garageId);
        cb({ ok: true });
    });

    RegisterNuiCallbackType('closeGarage');
    on('__cfx_nui:closeGarage', (data, cb) => {
        emit('orion:garage:c:closeGarage', data.message);
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
        showGarage(garage)
    })

    setTick(async () => {
        let playerPed = PlayerPedId();

        while (true) {
            let playerCoords = GetEntityCoords(playerPed);
            garageJson.garages.forEach(garage => {
                if (!showGarageHUD) {
                    if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], garage.marker.X, garage.marker.Y, garage.marker.Z, true) < 1.8) {
                        emit('orion:showText', `Appuyez sur ~g~E~w~ pour ouvrir le garage`)
                        if (!IsPedInAnyVehicle(playerPed, false)) {
                            if (IsControlJustReleased(0, 38)) {
                                emitNet('orion:garage:s:openGarage', garage.marker)
                            }
                        }
                    }
                    else {
                        if (showGarageHUD) {
                            emit('orion:garage:c:closeGarage')
                        }
                    }
                }
            })
            await exports['orion'].delay(5)

        }

    });


})();