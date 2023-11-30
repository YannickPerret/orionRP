class VehicleManager {
  constructor() {
    this.vehicles = new Map();
  }
  addVehicle(source, vehicle) {
    this.vehicles.set(source, vehicle);
  }
  removeVehicle(source) {
    this.vehicles.delete(source);
  }
  getVehicleBySource(source) {
    return this.vehicles.get(source);
  }
  getVehicles() {
    return this.vehicles;
  }
}
const vehicleManager = new VehicleManager();
module.exports = vehicleManager;
