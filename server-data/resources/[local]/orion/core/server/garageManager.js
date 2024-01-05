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

    getGarages() {
        return this.garages;
    }
}

module.exports = new GarageManager();