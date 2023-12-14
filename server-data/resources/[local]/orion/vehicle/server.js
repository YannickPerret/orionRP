(() => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  
  onNet('orion:vehicle:s:spawnVehicle', (model, coords, pedHead) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    let vehicle = CreateVehicle(model, coords[0], coords[1], coords[2], pedHead, true, false);
    console.log(vehicle);
    console.log(GetNetworkIdFromEntity(vehicle));

    SetEntityDistanceCullingRadius(vehicle, 1000.0);
  
    let vehicleObj = new Vehicle({
      id: vehicle,
      model: model,
      owner: player.id,
      plate: GetVehicleNumberPlateText(vehicle),
      position: coords,
      state: 'good',
      primaryColor:  GetVehicleColours(vehicle)[0],
      secondaryColor: GetVehicleColours(vehicle)[1],
      pearlescentColor: GetVehicleExtraColours(vehicle)[1],
    });

    exports['orion'].delay(1000).then(() => {
      SetPedIntoVehicle(GetPlayerPed(source), vehicle, -1);
    });

    VehicleManager.addVehicle(vehicle, vehicleObj);
    emitNet('orion:vehicle:c:createVehicle', source,  vehicleObj);
  
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

