(() => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  
  onNet('orion:vehicle:s:spawnVehicle', (model, coords, pedHead) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    console.log(model, coords, pedHead);
    let vehicleSpawn = CreateVehicleServerSetter(model, 'automobile', coords, pedHead);
    console.log(vehicleSpawn);
   //TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicle, -1);

    SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);
  
    let vehicleObj = new Vehicle({
      id: vehicleSpawn,
      model: model,
      owner: source,
      plate: GetVehicleNumberPlateText(vehicleSpawn),
      position: coords,
      state: 'good',
      primaryColor:  GetVehicleColours(vehicleSpawn)[0],
      secondaryColor: GetVehicleColours(vehicleSpawn)[1],
      pearlescentColor: GetVehicleExtraColours(vehicleSpawn)[1],
    });

    exports['orion'].delay(1000).then(() => {
      SetPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
    });

    VehicleManager.addVehicle(vehicleSpawn, vehicleObj);
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

