// rentrer la voiture dans le garage
// sortir la voiture du garage
// Payer le prix du garage quand on sort la voiture
// spawn la voiture à un emplacement libre du parking, sinon interdir le spawn si pas libre
// créer un marker pour ranger la voiture de chaque parking
(async () => {
    const garageJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'garage/garages.json'))

    const parking = []

    onNet('orion:garage:setParking', (parking) => {
        parking.push(parking)
    })


    setTick(async () => {
        while (true) {
            let playerPed = PlayerPedId();
            let playerCoords = GetEntityCoords(playerPed);
            garageJson.garages.forEach(garage => {
                if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z, true) < 15) {
                    DrawMarker(1, garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z + 2, 0.0, 0.0, 0.0, 0.0, 180.0, 0, 2.0, 2.0, 2.0, 255, 128, 0, 50, false, true, 2, false, false, false, false)
                    if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z, true) < 2) {
                        //exports['orion'].draw3DText(garage.dispawnPlace.X, garage.dispawnPlace.Y, garage.dispawnPlace.Z + 1, `Appuyez sur ~g~E~w~ pour rentrer la voiture dans le garage`)
                        exports['orion'].showHelpText(`Appuyez sur ~g~E~w~ pour rentrer la voiture dans le garage`)
                        if (IsControlJustReleased(0, 38)) {
                            emitNet('orion:garage:c:enterGarage', garage.id)
                        }
                    }
                }
            })
            await exports['orion'].delay(5)

        }

    });


})();