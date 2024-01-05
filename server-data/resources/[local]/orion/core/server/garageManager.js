class GarageManager {
    constructor() {
        this.garages = new Map();
    }

    addGarage(position, garage) {
        this.garages.set(position, garage);
    }

    removeGarage(position) {
        this.garages.delete(position);
    }

    getGarageById(id) {
        return this.garages.get(id);
    }

    getGarages() {
        return this.garages;
    }
}

module.exports = new GarageManager();