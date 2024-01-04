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

    async addVehicle(vehicleId) {
        if (this.vehicles.length >= this.maxSlots) {
            return false;
        }

        this.vehicles.push(vehicleId);
        await this.save();
        return true;
    }

    async removeVehicle(vehicleId) {
        const index = this.vehicles.indexOf(vehicleId);
        if (index > -1) {
            this.vehicles.splice(index, 1);
            await this.save();
            return true;
        }
        return false;
    }

    async getVehicles() {
        const vehicles = await db.getAll('vehicles');
        return vehicles.filter(vehicle => this.vehicles.includes(vehicle.id));
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