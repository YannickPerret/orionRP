const { db, r } = require('../core/server/database.js');
const { v4: uuidv4 } = require('uuid');

class Station {
    constructor(id, coord, pumps) {
        this.id = id || uuidv4();
        this.coord = coord;
        this.pumps = pumps || [];
    }


    static async getAll() {
        return await db.getAll('stations');
    }

    static async getById(id) {
        return await db.getById('stations', id);
    }

    async save() {
        let result;
        if (await db.getById('stations', this.id)) {
            result = await db.update('stations', this);
        } else {
            result = await db.insert('stations', this);
        }

        return result;
    }
}

class PumpStation {
    constructor(id, coord, model, maxFuelCapacity, currentFuel) {
        this.id = id || uuidv4();
        this.coord = coord;
        this.model = model;
        this.maxFuel = maxFuelCapacity;
        this.currentFuel = currentFuel;
    }

    static async getAll() {
        return await db.getAll('pumpStations');
    }

    static async getById(id) {
        return await db.getById('pumpStations', id);
    }

    async save() {
        let result;
        if (await db.getById('pumpStations', this.id)) {
            result = await db.update('pumpStations', this);
        } else {
            result = await db.insert('pumpStations', this);
        }

        return result;
    }
}

module.exports = { Station, PumpStation };