const VehicleManager = require('./core/server/vehicleManager.js');
const Vehicle = require('./vehicle/vehicle.js');

onNet('orion:vehicle:createVehicle', async vehicle => {
  let vehicleObj = new Vehicle({
    id: vehicle.id,
    model: vehicle.model,
    owner: vehicle.owner,
    plate: vehicle.plate,
    position: vehicle.position,
    state: vehicle.state,
    primaryColor: vehicle.primaryColor,
    secondaryColor: vehicle.secondaryColor,
    pearlescentColor: vehicle.pearlescentColor,
  });
  VehicleManager.addVehicle(vehicle.id, vehicleObj);
});

onNet('orion:vehicle:saveVehicle', async vehicle => {
  let vehicleObj = VehicleManager.getVehicleBySource(vehicle.source);
  await vehicleObj.save();
});

onNet('orion:vehicle:deleteVehicle', async vehicle => {
  let vehicleObj = VehicleManager.getVehicleBySource(vehicle.source);
  await vehicleObj.delete();
});
