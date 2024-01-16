(async () => {
    const MarkerManager = require('./core/server/markerManager.js');
    const PlayerManager = require('./core/server/playerManager.js');

    onNet('orion:marker:s:registerMarker', async (marker) => {
        MarkerManager.addMarker(marker.id, marker);
    });
    onNet('orion:marker:s:registerMarkers', async (markers) => {
        if (markers == null) return
        if (markers.length <= 0) return

        markers.forEach((marker) => {
            MarkerManager.addMarker(marker.id, marker);
        });
    });

    const checkMarkersVisibleForPlayer = async (source) => {
        let availableMarkers = [];
        const player = PlayerManager.getPlayerBySource(source);
        const markers = MarkerManager.getMarkers();

        if (!player) return;
        if (!markers) return;
        if (!markers.length) return;

        for (let marker in markers) {
            if (marker.require) {
                let canSee = true;
                marker.require.forEach(property, value => {
                    if (player[property] == value) {
                        canSee = true;
                    }
                    else {
                        canSee = false;
                    }
                });
                if (canSee) {
                    availableMarkers.push(marker);
                }
            }
            else {
                availableMarkers.push(marker);
            }
        }
        return availableMarkers;
    }

    exports('checkMarkersVisibleForPlayer', checkMarkersVisibleForPlayer);

})();