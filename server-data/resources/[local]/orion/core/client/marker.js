(async () => {
    markers = {}

    const registerMarker = (name, text, coords, maxDist, interactDist, cb, options) => {
        let zone = GetZoneAtCoords(coords.X, coords.Y, coords.Z);
        if (markers[zone] == null) {
            markers[zone] = {}
        }
        let color = { r: 255, g: 255, b: 255, a: 100 }
        if (options.color !== null) {
            color = options.color
        }
        let scale = [1.0, 1.0, 1.0]

        if (options.scale !== null) {
            scale = options.scale
        }
        let type = 27
        if (options.type !== null) {
            type = options.type
        }
        let hasText = true
        if (options.noText == true) {
            hasText = false
        }
        markers[zone][name] = {
            name: name,
            text: text,
            coords: coords,
            maxDist: maxDist,
            interactDist: interactDist,
            cb: cb,
            color: color,
            scale: scale,
            type: type,
            hasText: hasText
        }
    }

    const unregisterMarker = (name) => {
        let zone = GetZoneAtCoords(markers[name].coords.X, markers[name].coords.Y, markers[name].coords.Z);
        markers[zone][name] = null
    }

    /* const createMarker = (position, color, icon, scale) => {
         DrawMarker(icon, position.X, position.Y, position.Z, 0.0, 0.0, 0.0, 0.0, 180.0, 0, scale.X, scale.Y, scale.Z, color.r, color.g, color.b, 50, false, true, 2, false, false, false, false)
     }
 
     exports('createMarker', createMarker)
 
     onNet('orion:marker:c:initializeMarkers', async (markers) => {
         //map markers map to create marker
         setTick(async () => {
             let playerPed = PlayerPedId();
             let playerCoords = GetEntityCoords(playerPed);
             markers.forEach(async marker => {
                 if (exports['orion'].getDistanceBetweenCoords(playerCoords, marker.position) <= 13.0) {
                     createMarker(marker.position, marker.color, marker.icon, marker.scale);
                     await exports['orion'].delay(5);
                 }
                 else {
                     await exports['orion'].delay(500);
                 }
             });
         })
     })*/


    onNet('orion:marker:c:registerMarker', (name, text, coords, maxDist, interactDist, cb, options) => {
        registerMarker(name, text, coords, maxDist, interactDist, cb, options)
    })
    onNet('orion:marker:c:unregisterMarker', (name) => {
        unregisterMarker(name)
    })


    exports('registerMarker', registerMarker)
    exports('unregisterMarker', unregisterMarker)

})()