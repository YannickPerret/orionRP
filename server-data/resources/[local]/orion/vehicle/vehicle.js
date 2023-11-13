const db = require("../system/database.js");

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
    isLocked,
    isEngineOn,
    inventory,
    insurance,
    isNoBeltSound
  ) {
    this.id = id;
    this.model = model;
    this.owner = owner;
    this.plate = plate;
    this.position = position;
    this.state = state;
    this.color = color;
    this.customizations = customizations;
    this.isLocked = isLocked;
    this.isEngineOn = isEngineOn;
    this.inventory = inventory;
    this.insurance = insurance || null;
    this.isNoBeltSound = isNoBeltSound || false;
    this.isB
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
      const result = await db.update("vehicles", filters, data);
      if (result.changes && result.changes.length > 0) {
        console.log("[Orion] Véhicule sauvegardé : ", this);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Vehicle;
