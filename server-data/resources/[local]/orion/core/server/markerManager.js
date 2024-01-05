class MarkerManager {
    constructor() {
        this.markers = new Map();
    }

    addMarker(marker) {
        this.markers.set(marker.id, marker);
    }

    getMarker(id) {
        return this.markers.get(id);
    }

    getMarkers() {
        return this.markers;
    }

    removeMarker(id) {
        this.markers.delete(id);
    }

    removeMarkers() {
        this.markers.clear();
    }
}

module.exports = new MarkerManager;