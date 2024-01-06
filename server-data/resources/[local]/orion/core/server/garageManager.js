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
            return garage.position.x === position.x && garage.position.y === position.y && garage.position.z === position.z;
        });
        return garage;
    }

    getGarageByMarkerPosition(position) {
        const garages = Array.from(this.garages.values());
        const garage = garages.find(garage => {
            return garage.marker.x === position.x && garage.marker.y === position.y && garage.marker.z === position.z;
        });
        return garage;
    }

    getGarages() {
        return this.garages;
    }
}

module.exports = new GarageManager();