(() => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  const { db } = require('./core/server/database.js');

  onNet('orion:vehicle:s:spawnNewVehicle', async (model, coords, pedHead) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    if (player) {
      let vehicleSpawn = CreateVehicleServerSetter(model, 'automobile', coords[0], coords[1], coords[2], pedHead);
      SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);


      let vehicleObj = new Vehicle({
        id: vehicleSpawn,
        netId: NetworkGetNetworkIdFromEntity(vehicleSpawn),
        model: model,
        owner: player.id,
        plate: GetVehicleNumberPlateText(vehicleSpawn),
        position: coords,
        state: 'good',
        colours: GetVehicleColours(vehicleSpawn),
        pearlescentColor: GetVehicleExtraColours(vehicleSpawn)[1],
        bodyHealth: GetVehicleBodyHealth(vehicleSpawn),
        dirtLevel: GetVehicleDirtLevel(vehicleSpawn),
        doorsBroken: [0, 0, 0, 0, 0, 0, 0],
      });

      await exports['orion'].delay(300)

      TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
      //SetPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);

      VehicleManager.addVehicle(vehicleSpawn, vehicleObj);
      emitNet('orion:vehicle:c:createVehicle', source, vehicleObj);
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }
  });

  onNet('orion:vehicle:s:spawnVehicle', async (vehicleId, coords, pedHead) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    const vehicleDb = await db.getById('vehicles', vehicleId);
    const vehicle = new Vehicle(vehicleDb);

    if (player && vehicle) {
      let vehicleSpawn = CreateVehicleServerSetter(vehicle.model, 'automobile', coords[0], coords[1], coords[2], pedHead);
      vehicle.netId = NetworkGetNetworkIdFromEntity(vehicleSpawn);
      await vehicle.save();

      SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);

      SetVehicleBodyHealth(vehicleSpawn, vehicle.bodyHealth);
      SetVehicleColours(vehicleSpawn, vehicle.primaryColor, vehicle.secondaryColor);
      SetVehiclePlateText(vehicleSpawn, vehicle.plate);
      SetVehicleDirtLevel(vehicleSpawn, vehicle.dirtLevel);
      for (let doors = 0; doors < 7; doors++) {
        SetVehicleDoorBroken(vehicleSpawn, vehicle.doorsBroken[doors], false);
      }

      await exports['orion'].delay(300)

      TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);
      //SetPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);

      VehicleManager.addVehicle(vehicleSpawn, vehicle);
      emitNet('orion:vehicle:c:createVehicle', source, vehicle);
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }
  });

  onNet('orion:vehicle:s:dispawnVehicle', async (vehicle) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    if (player) {
      let vehicleObj = VehicleManager.getVehicleById(vehicle);
      if (vehicleObj) {
        vehicleObj.colours = GetVehicleColours(vehicleObj.id);
        vehicleObj.pearlescentColor = GetVehicleExtraColours(vehicleObj.id)[1];
        vehicleObj.bodyHealth = GetVehicleBodyHealth(vehicleObj.id);
        vehicleObj.dirtLevel = GetVehicleDirtLevel(vehicleObj.id);
        vehicleObj.plate = GetVehicleNumberPlateText(vehicleObj.id);
        for (let doors = 0; doors < 7; doors++) {
          vehicleObj.doorsBroken[doors] = IsVehicleDoorDamaged(vehicleObj.id, doors);
        }
        await vehicleObj.save();

        DeleteEntity(vehicleObj.id);
        VehicleManager.remove(vehicleObj.id);
        delete vehicleObj;
      }
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }
  });

  onNet('orion:vehicle:saveVehicle', async vehicle => {
    let vehicleObj = VehicleManager.getVehicleById(vehicle.id);
    await vehicleObj.save();
  });

  onNet('orion:vehicle:s:deleteVehicle', async (vehicleId, source = undefined) => {
    const source = source || global.source;
    if (typeof vehicleId === 'number') {
      let vehicleObj = VehicleManager.getVehicleById(vehicleId);
      VehicleManager.remove(vehicleObj.id);
      delete vehicleObj;
    }
  });

  RegisterCommand('delveh', async (source, args, rawCommand) => {
    if (source > 0) {
      const player = PlayerManager.getPlayerBySource(source);
      if (player) {
        if (IsPedInAnyVehicle(GetPlayerPed(source), false)) {
          const vehicleId = GetVehiclePedIsIn(GetPlayerPed(source), false);
          DeleteEntity(vehicleId);
          emit('orion:vehicle:s:deleteVehicle', vehicleId, source);
        }
      }
    }
  }, false);


})()

