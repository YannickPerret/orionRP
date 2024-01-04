const { db, r } = require('../core/server/database.js');
const { v4: uuid } = require('uuid');

class Garage {
    constructor({ id, name, type, position, maxSlots, allowsVehicleTypes, price, owner, spawnPlaces, isActive }) {
        this.id = id || uuid();
        this.name = name;
        this.type = type;
        this.position = position;
        this.maxSlots = maxSlots;
        this.vehicles = [];
        this.allowVehicleTypes = allowsVehicleTypes;
        this.price = price || 0;
        this.owner = owner || null;
        this.spawnPlaces = spawnPlaces || [];
        this.isActive = isActive || true;
    }

    static async getById(id) {
        const garage = await db.getById('garages', id);
        return new Garage(garage);
    }

    static async getAll() {
        const garages = await db.getAll('garages');
        return garages.map(garage => new Garage(garage));
    }

    async save() {
        if (await db.getById('garages', this.id)) {
            return await db.update('garages', this.id, this);
        } else {
            return await db.insert('garages', this);
        }
    }
}

module.exports = Garage;