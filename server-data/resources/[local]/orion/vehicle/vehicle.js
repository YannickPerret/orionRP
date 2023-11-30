const MAX_FUEL = 100; // Quantité maximale de fuel dans le réservoir
const FUEL_CONSUMPTION = 0.5; // Consommation de fuel par seconde
const IDLE_FUEL_CONSUMPTION = 0.1; // Consommation de fuel par seconde au ralenti

class Vehicle {
  constructor({
    id,
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
  }) {
    this.id = id;
    this.model = model;
    this.owner = owner;
    this.plate = plate;
    this.position = position;
    this.state = state;
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
    this.pearlescentColor = pearlescentColor;
    this.customizations = customizations || [];
    this.isEngineOn = isEngineOn || true;
    this.maxFuel = maxFuel || MAX_FUEL;
    this.fuel = fuel || MAX_FUEL;
    this.consumption = fuel_consumption || FUEL_CONSUMPTION;
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
      const filters = { id: this.id };
      const data = {
        id: this.id,
        model: this.model,
        owner: this.owner,
        plate: this.plate,
        position: this.position,
        state: this.state,
        primaryColor: this.primaryColor,
        secondaryColor: this.secondaryColor,
        pearlescentColor: this.pearlescentColor,
        customizations: this.customizations,
      };
      const result = await db.update('vehicles', filters, data);
      if (result.changes && result.changes.length > 0) {
        console.log('[Orion] Véhicule sauvegardé : ', this);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Vehicle;
