class GarageManager {
    constructor() {
        this.garages = new Map();
    }

    addGarage(id, garage) {
        this.garages.set(id, garage);
    }

    removeGarage(id) {
        this.garages.delete(id);
    }

    getGarageById(id) {
        return this.garages.get(id);
    }

    getGarageByPosition(position) {
        const garages = Array.from(this.garages.values());
        const garage = garages.find(garage => {
            return garage.position.X === position.X && garage.position.Y === position.Y && garage.position.Z === position.Z;
        });
        return garage;
    }

    getGarageByMarkerPosition(position) {
        const garages = Array.from(this.garages.values());
        const garage = garages.find(garage => {
            return garage.marker.X === position.X && garage.marker.Y === position.Y && garage.marker.Z === position.Z;
        });
        return garage;
    }

    getGarages() {
        return this.garages;
    }
}

module.exports = new GarageManager();