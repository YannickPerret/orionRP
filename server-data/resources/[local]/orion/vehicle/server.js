(async () => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  const { db } = require('./core/server/database.js');

  onNet('orion:vehicle:s:spawnNewVehicle', async (model, coords, pedHead) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    if (player) {
      let vehicleSpawn = CreateVehicleServerSetter(model, 'automobile', coords[0], coords[1], coords[2], pedHead);

      while (!DoesEntityExist(vehicleSpawn)) {
        await exports['orion'].delay(0)
      }

      SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);

      let vehicleObj = new Vehicle({
        netId: NetworkGetNetworkIdFromEntity(vehicleSpawn),
        spawnId: vehicleSpawn,
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

      await vehicleObj.save();

      TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);

      VehicleManager.addVehicle(vehicleObj.netId, vehicleObj);
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

  onNet('orion:vehicle:s:dispawnVehicle', async (vehicleNetId, _source) => {
    const source = _source || global.source;
    const player = PlayerManager.getPlayerBySource(source);

    console.log('dispawnVehicle', vehicleNetId, source)

    if (player) {
      let vehicle = VehicleManager.getVehicleById(vehicleNetId);
      if (vehicle) {
        vehicle.colours = GetVehicleColours(vehicle.spawnId);
        vehicle.pearlescentColor = GetVehicleExtraColours(vehicle.spawnId)[1];
        vehicle.bodyHealth = GetVehicleBodyHealth(vehicle.spawnId);
        vehicle.dirtLevel = GetVehicleDirtLevel(vehicle.spawnId);
        vehicle.plate = GetVehicleNumberPlateText(vehicle.spawnId);
        for (let doors = 0; doors < 7; doors++) {
          vehicle.doorsBroken[doors] = IsVehicleDoorDamaged(vehicle.spawnId, doors);
        }
        await vehicle.save();

        VehicleManager.remove(vehicle.netId);
        DeleteEntity(vehicle.spawnId);

        delete vehicle;
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

  onNet('orion:vehicle:s:deleteVehicle', async (vehicleId, _source) => {
    const source = _source || global.source;

    if (typeof vehicleId === 'number' && vehicleId > 0) {
      let vehicleObj = VehicleManager.getVehicleById(vehicleId);
      VehicleManager.remove(vehicleObj.id);
      delete vehicleObj;
    }
  });


  RegisterCommand('delveh', async (source, args) => {
    if (source > 0) {
      const player = PlayerManager.getPlayerBySource(source);
      if (player) {

        if (GetVehiclePedIsIn(GetPlayerPed(source), false)) {
          const vehicleId = GetVehiclePedIsIn(GetPlayerPed(source), false);
          DeleteEntity(vehicleId);
          emit('orion:vehicle:s:deleteVehicle', vehicleId, source);
        }
      }
    }
  }, false);


})()

