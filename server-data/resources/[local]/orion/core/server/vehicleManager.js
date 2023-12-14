class VehicleManagerClass {
  constructor() {
    this.vehicles = new Map();
  }
  addVehicle(source, vehicle) {
    this.vehicles.set(source, vehicle);
  }
  remove(source) {
    this.vehicles.delete(source);
  }
  getVehicleBySource(source) {
    return this.vehicles.get(source);
  }
  getVehicles() {
    return this.vehicles;
  }
}
module.exports = new VehicleManagerClass();
