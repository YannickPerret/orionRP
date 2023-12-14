const MAX_FUEL = 100; // Quantité maximale de fuel dans le réservoir
const FUEL_CONSUMPTION = 0.5; // Consommation de fuel par seconde
const IDLE_FUEL_CONSUMPTION = 0.1; // Consommation de fuel par seconde au ralenti

class Vehicle {
  constructor({
    id,
    netId,
    model,
    owner,
    plate,
    position,
    state,
    primaryColor,
    secondaryColor,
    pearlescentColor,
    customizations,
    isEngineOn,
    maxFuel,
    fuel,
    fuel_consumption,
    dirtLevel,
    doorsBroken,
    bodyHealth,
  }) {
    this.id = id;
    this.netId = netId;
    this.model = model;
    this.owner = owner;
    this.plate = plate;
    this.position = position;
    this.state = state;
    this.dirtLevel = dirtLevel || 0.0;
    this.bodyHealth = bodyHealth || 1000.0;
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
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

  async save() {
    try {
      let result;
      if (await db.get('vehicles', this.id)) {
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
