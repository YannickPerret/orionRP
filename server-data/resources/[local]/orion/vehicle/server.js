(() => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  
  onNet('orion:vehicle:createVehicle', async vehicle => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);
  
    let vehicleObj = new Vehicle({
      id: vehicle.id,
      model: vehicle.model,
      owner: player.source,
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

    VehicleManager.remove(vehicle.source);
    delete vehicleObj;
  });
  

})()

