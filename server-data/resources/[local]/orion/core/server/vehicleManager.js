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

  getVehicleBySpawnId(spawnId) {
    return Array.from(this.vehicles.values()).find(vehicle => vehicle.spawnId === spawnId);
  }

  getVehicles() {
    return this.vehicles;
  }
}
module.exports = new VehicleManagerClass();
