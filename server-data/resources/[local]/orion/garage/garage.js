const { db, r } = require('../core/server/database.js');
const { v4: uuid } = require('uuid');

class Garage {
    constructor({ id, name, type, position, maxSlots, vehicles, allowsVehicleTypes, price, owner, spawnPlaces, isActive, marker }) {
        this.id = id || uuid();
        this.name = name;
        this.type = type;
        this.position = position;
        this.maxSlots = maxSlots;
        this.vehicles = vehicles || [];
        this.allowVehicleTypes = allowsVehicleTypes;
        this.price = price || 0;
        this.owner = owner || null;
        this.spawnPlaces = spawnPlaces || [];
        this.isActive = isActive || true;
        this.marker = marker || [];
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
        let vehicleDetails
        // vehicles = [{id: 1, dateStored: 123456789, priceToRetrieve: 1000}]
        const vehicles = await Promise.all(this.vehicles.map(async vehicleDb => {
            vehicleDetails = await db.getById('vehicles', vehicleDb.id);
            return {
                ...vehicleDetails,
                dateStored: vehicleDb.dateStored,
                priceToRetrieve: vehicleDb.priceToRetrieve
            }

        }));
        return vehicles;
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
        try {
            let result;
            if (await db.getById('garages', this.id)) {
                result = await db.update('garages', this);
            } else {
                result = await db.insert('garages', this);
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = Garage;