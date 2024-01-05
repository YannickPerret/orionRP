(async () => {

    const createMarker = (position, color, icon, scale) => {
        DrawMarker(icon, position.X, position.Y, position.Z, 0.0, 0.0, 0.0, 0.0, 180.0, 0, scale.X, scale.Y, scale.Z, color.r, color.g, color.b, 50, false, true, 2, false, false, false, false)
    }

    exports('createMarker', createMarker)

    onNet('orion:marker:s:initializeMarkers', async (markers) => {
        markers.garages.forEach(garage => {
            createMarker(garage.position, garage.color, garage.icon, garage.scale);
        });

    })

})()