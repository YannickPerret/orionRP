(() => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  
  onNet('orion:vehicle:s:spawnNewVehicle', (model, coords, pedHead) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    if (player) {
      let vehicleSpawn = CreateVehicleServerSetter(model, 'automobile', coords[0], coords[1], coords[2], pedHead);
  
    
      let vehicleObj = new Vehicle({
        id: vehicleSpawn,
        netId: NetworkGetNetworkIdFromEntity(vehicleSpawn), 
        model: model,
        owner: source,
        plate: GetVehicleNumberPlateText(vehicleSpawn),
        position: coords,
        state: 'good',
        primaryColor:  GetVehicleColours(vehicleSpawn)[0],
        secondaryColor: GetVehicleColours(vehicleSpawn)[1],
        pearlescentColor: GetVehicleExtraColours(vehicleSpawn)[1],
      });
      SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);
  
      TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
      //SetPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
  
      VehicleManager.addVehicle(vehicleSpawn, vehicleObj);
      emitNet('orion:vehicle:c:createVehicle', source,  vehicleObj);
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }
  });

  onNet('orion:vehicle:s:spawnVehicle', (vehicleId, coords, pedHead) => {
    // get vehicle by id 
    // spawn vehicle
    // set vehicle properties
    // set vehicle position
    // set vehicle owner
    // set vehicle state
    // set vehicle color
    // set vehicle plate

    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);
    const vehicle = VehicleManager.getVehicleById(vehicleId);

    if (player && vehicle) {
      let vehicleSpawn = CreateVehicleServerSetter(vehicle.model, 'automobile', coords[0], coords[1], coords[2], pedHead);
      SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);

      SetVehicleBodyHealth(vehicleSpawn, vehicle.bodyHealth);
      SetVehicleColours(vehicleSpawn, vehicle.primaryColor, vehicle.secondaryColor);
      SetVehiclePlateText(vehicleSpawn, vehicle.plate);
      SetVehicleDirtLevel(vehicleSpawn, 0.0);
      for (let doors = 0; doors < 7; doors++) {
        SetVehicleDoorBroken(vehicleSpawn, vehicle.doorsBroken[doors], false);
      }
  
      TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
      //SetPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
  
      VehicleManager.addVehicle(vehicleSpawn, vehicleObj);
      emitNet('orion:vehicle:c:createVehicle', source,  vehicleObj);
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }
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

