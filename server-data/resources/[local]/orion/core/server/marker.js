(async () => {
    const MarkerManager = require('./core/server/markerManager.js');

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
})();