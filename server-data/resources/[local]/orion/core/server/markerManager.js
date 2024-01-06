class MarkerManager {
    constructor() {
        this.markers = new Map();
    }

    addMarker(markerId, marker) {
        if (!marker.id) {
            console.log(`Erreur: le marker ajouté n'a pas d'ID.`);
            return;
        }
        this.markers.set(markerId, marker);
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