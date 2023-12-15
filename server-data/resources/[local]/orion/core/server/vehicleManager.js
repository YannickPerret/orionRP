class VehicleManagerClass {
  constructor() {
    this.vehicles = new Map();
  }
  addVehicle(id, vehicle) {
    this.vehicles.set(id, vehicle);
  }
  remove(id) {
    this.vehicles.delete(id);
  }
  getVehicleById(id) {
    return this.vehicles.get(id);
  }

  getVehicles() {
    return this.vehicles;
  }
}
module.exports = new VehicleManagerClass();
