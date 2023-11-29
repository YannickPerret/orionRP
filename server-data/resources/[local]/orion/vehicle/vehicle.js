const MAX_FUEL = 100; // Quantité maximale de fuel dans le réservoir
const FUEL_CONSUMPTION = 0.5; // Consommation de fuel par seconde
const IDLE_FUEL_CONSUMPTION = 0.1; // Consommation de fuel par seconde au ralenti

class Vehicle {
  constructor(
    id,
    model,
    owner,
    plate,
    position,
    state,
    color,
    customizations,
    isEngineOn,
    maxFuel,
    fuel,
    fuel_consumption
  ) {
    this.id = id;
    this.model = model;
    this.owner = owner;
    this.plate = plate;
    this.position = position;
    this.state = state;
    this.color = color;
    this.customizations = customizations;
    this.isEngineOn = isEngineOn || true;
    this.maxFuel = maxFuel || MAX_FUEL;
    this.fuel = fuel || MAX_FUEL;
    this.consumption = fuel_consumption || FUEL_CONSUMPTION;

    this.startVehicle();
  }

  consumeFuel() {
    // Si le véhicule est arrêté avec moteur allumé, on consomme du fuel
    if (!this.isEngineOn) {
      this.consumption = IDLE_FUEL_CONSUMPTION;
    } else {
      this.consumption = FUEL_CONSUMPTION;
    }

    // Consommation de fuel
    this.fuel -= this.consumption;

    // Si le réservoir est vide, le véhicule s'arrête
    if (this.fuel <= 0) {
      this.fuel = 0;
      this.stopVehicle(this);
    }
  }

  fillTank(value) {
    if (this.fuel + value <= this.maxFuel) {
      this.fuel += value;
    }
  }

  getFuel() {
    return this.fuel;
  }

  startVehicle() {
    SetVehicleEngineOn(this, true, true, false);
  }

  // Méthode pour arrêter le véhicule
  stopVehicle() {
    SetVehicleEngineOn(this, false, false, true);
  }

  async save() {
    try {
      const filters = { id: this.id };
      const data = {
        model: this.model,
        owner: this.owner,
        plate: this.plate,
        position: this.position,
        state: this.state,
        color: this.color,
        customizations: this.customizations,
        isLocked: this.isLocked,
        isEngineOn: this.isEngineOn,
        inventory: this.inventory,
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
