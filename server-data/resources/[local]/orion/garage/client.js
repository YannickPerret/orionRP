// rentrer la voiture dans le garage
// sortir la voiture du garage
// Payer le prix du garage quand on sort la voiture
// spawn la voiture à un emplacement libre du parking, sinon interdir le spawn si pas libre
// créer un marker pour ranger la voiture de chaque parking
(async () => {
    const garageJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'garage/garage.json')).garages

    const parking = []

    onNet('orion:garage:setParking', (parking) => {
        parking.push(parking)
    })


    setTick(async () => {
        while (true) {
            let playerPed = PlayerPedId();
            let playerCoords = GetEntityCoords(playerPed);
            garageJson.forEach(garage => {
                if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], garage.x, garage.y, garage.z, true) < 5) {
                    DrawMarker(1, garage.x, garage.y, garage.z - 1, 0, 0, 0, 0, 0, 0, 1.0, 1.0, 0.5, 0, 255, 0, 100, false, true, 2, false, false, false, false)
                    if (IsControlJustReleased(0, 38)) {
                        emitNet('orion:garage:c:enterGarage', garage.id)
                    }
                }
            })
            await exports['orion'].delay(10)

        }

    });


})();