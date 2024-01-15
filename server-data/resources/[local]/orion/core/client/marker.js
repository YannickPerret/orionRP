(async () => {
    let markers = {}
    let drawnMarkers = [];
    let currentMarker = null;


    const registerMarker = (name, text, coords, maxDist = 15, interactDist = 0.8, cb, options) => {
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
        for (zone in markers) {
            if (markers[zone][name] != null) {
                delete markers[zone][name]
            }
        }
    }

    exports('registerMarker', registerMarker)
    exports('unregisterMarker', unregisterMarker)

    onNet('orion:marker:c:registerMarker', (name, text, coords, maxDist, interactDist, cb, options) => {
        registerMarker(name, text, coords, maxDist, interactDist, cb, options)
    })
    onNet('orion:marker:c:registerMarkers', (markers) => {
        if (markers == null) return
        if (markers.length <= 0) return

        for (marker in markers) {
            registerMarker(marker.name, marker.text, marker.coords, marker.maxDist, marker.interactDist, marker.cb, marker.options)
        }
    })

    onNet('orion:marker:c:unregisterMarker', (name) => {
        unregisterMarker(name)
    })


    setTick(async () => {
        await exports['orion'].delay(1000)
        const pedCoords = GetEntityCoords(PlayerPedId(), true);
        const zone = GetZoneAtCoords(pedCoords);
        const maxDistance = 15;
        drawnMarkers = [];
        if (!playerIsDead) {
            if (markers[zone] != null) {
                for (marker in markers[zone]) {
                    let distanceToMarker = exports['orion'].getDistanceBetweenCoords(pedCoords, markers[zone][marker].coords);
                    if (distanceToMarker < maxDistance) {
                        drawnMarkers.push(marker);
                    }
                }
            }
        }
    });

    setTick(async () => {
        const interactDistance = 0.8;
        const [playerPositionX, playerPositionY, playerPositionZ] = GetEntityCoords(PlayerPedId(), true);
        for (const marker of drawnMarkers) {
            DrawMarker(markers.type, markers.coords.X, markers.coords.Y, marker.coords.Z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 180.0, 0, markers.scale[0], markers.color.r, markers.color.g, markers.color.b, marker.color.a, false, true, 2, false, false, false, false)
            if (exports['orion'].getDistanceBetweenCoords(playerPositionX, playerPositionY, playerPositionZ, markers.coords.X, markers.coords.Y, markers.coords.Z) < interactDistance) {
                if (currenMarker != marker) {
                    currentMarker = marker;
                }
                if (marker.hasText) {
                    exports['orion'].draw3DText(markers.coords.X, markers.coords.Y, markers.coords.Z + 1.0, markers.text);
                }
                if (IsControlJustPressed(0, 38)) {
                    markers.cb();
                }
            }
        }
    });

})()