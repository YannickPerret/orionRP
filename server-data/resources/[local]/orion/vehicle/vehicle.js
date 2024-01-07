const MAX_FUEL = 100; // Quantité maximale de fuel dans le réservoir
const FUEL_CONSUMPTION = 0.5; // Consommation de fuel par seconde
const IDLE_FUEL_CONSUMPTION = 0.1; // Consommation de fuel par seconde au ralenti
const { db, r } = require('../core/server/database.js');
const { v4: uuidv4 } = require('uuid');

class Vehicle {
  constructor({ id, netId, spawnId, title, model, owner, plate, position, state, colours, pearlescentColor, customizations, isEngineOn, maxFuel, fuel, fuel_consumption, dirtLevel, doorsBroken, bodyHealth }) {
    this.id = id || uuidv4();
    this.netId = netId;
    this.spawnId = spawnId || null;
    this.title = title || model
    this.model = model;
    this.owner = owner;
    this.plate = plate;
    this.position = position;
    this.state = state;
    this.dirtLevel = dirtLevel || 0.0;
    this.bodyHealth = bodyHealth || 1000.0;
    this.colours = colours || [];
    this.pearlescentColor = pearlescentColor;
    this.customizations = customizations || [];
    this.isEngineOn = isEngineOn || true;
    this.maxFuel = maxFuel || MAX_FUEL;
    this.fuel = fuel || MAX_FUEL;
    this.consumption = fuel_consumption || FUEL_CONSUMPTION;
    this.doorsBroken = doorsBroken || [];
  }

  fillTank(value) {
    if (this.fuel + value <= this.maxFuel) {
      this.fuel += value;
    }
  }

  getFuel() {
    return this.fuel;
  }

  static async getById(id) {
    const vehicle = await db.getById('vehicles', id);
    return new Vehicle(vehicle);
  }

  async save() {
    try {
      let result;
      if (await db.getById('vehicles', this.id)) {
        result = await db.update('vehicles', this);
      } else {
        result = await db.insert('vehicles', this);
      }
      return result;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Vehicle;
