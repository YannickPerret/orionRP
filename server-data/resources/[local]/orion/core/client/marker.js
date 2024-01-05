(async () => {

    const createMarker = (position, color, icon, scale) => {
        DrawMarker(icon, position.X, position.Y, position.Z, 0.0, 0.0, 0.0, 0.0, 180.0, 0, scale.X, scale.Y, scale.Z, color.r, color.g, color.b, 50, false, true, 2, false, false, false, false)
    }

    exports('createMarker', createMarker)

    onNet('orion:marker:c:initializeMarkers', async (markers) => {

        console.log(markers)
        const playerPed = PlayerPedId();

        setTick(() => {
            const playerCoords = GetEntityCoords(playerPed);
            markers.forEach(marker => {
                if (GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], marker.position.X, marker.position.Y, marker.position.Z, true) < 15) {
                    createMarker(marker.position, marker.color, marker.icon, marker.scale);
                }
            });

            exports['orion'].delay(10);
        })
    })

})()