(async () => {
  const VehicleManager = require('./core/server/vehicleManager.js');
  const Vehicle = require('./vehicle/vehicle.js');
  const PlayerManager = require('./core/server/playerManager.js');
  const { db } = require('./core/server/database.js');

  onNet('orion:vehicle:s:spawnNewVehicle', async (model, name = '', coords, pedHead) => {
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
        title: name,
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

  onNet('orion:vehicle:s:spawnVehicle', async (vehicleId, coords, pedHead, _source) => {

    const source = _source || global.source;
    const player = PlayerManager.getPlayerBySource(source);

    const vehicleDb = await Vehicle.getById(vehicleId);
    const vehicle = new Vehicle(vehicleDb);

    if (player && vehicle) {
      let vehicleSpawn = CreateVehicleServerSetter(vehicle.model, 'automobile', coords.X, coords.Y, coords.Z, pedHead);
      while (!DoesEntityExist(vehicleSpawn)) {
        await exports['orion'].delay(0)
      }

      if (vehicleSpawn) {

        SetEntityDistanceCullingRadius(vehicleSpawn, 1000.0);

        SetVehicleBodyHealth(vehicleSpawn, vehicle.bodyHealth);
        SetVehicleColours(vehicleSpawn, vehicle.primaryColor, vehicle.secondaryColor);
        SetVehicleNumberPlateText(vehicleSpawn, vehicle.plate);
        SetVehicleDirtLevel(vehicleSpawn, vehicle.dirtLevel);

        console.log(vehicle.doorsBroken)
        for (let doors = 0; doors <= vehicle.doorsBroken.length; doors++) {
          SetVehicleDoorBroken(vehicleSpawn, doors, vehicle.doorsBroken[doors]);
        }

        vehicle.netId = NetworkGetNetworkIdFromEntity(vehicleSpawn);
        vehicle.spawnId = vehicleSpawn;
        await vehicle.save();

        TaskWarpPedIntoVehicle(GetPlayerPed(source), vehicleSpawn, -1);

        VehicleManager.addVehicle(vehicleSpawn, vehicle);
      }
      else {
        emitNet('orion:showNotification', source, 'Vehicle not found!')
      }
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }
  });

  onNet('orion:vehicle:s:dispawnVehicle', async (vehicleNetId, vehicleDamage = {}, _source) => {
    const source = _source || global.source;
    const player = PlayerManager.getPlayerBySource(source);
    let vehicle = VehicleManager.getVehicleById(vehicleNetId);

    if (player) {
      if (vehicle) {
        vehicle.colours = GetVehicleColours(vehicle.spawnId);
        vehicle.pearlescentColor = GetVehicleExtraColours(vehicle.spawnId)[1];
        vehicle.bodyHealth = GetVehicleBodyHealth(vehicle.spawnId);
        vehicle.dirtLevel = GetVehicleDirtLevel(vehicle.spawnId);
        vehicle.plate = GetVehicleNumberPlateText(vehicle.spawnId);
        vehicle.position = GetEntityCoords(vehicle.spawnId);
        vehicle.doorsBroken = vehicleDamage.doorsBroken;

        await vehicle.save();

        VehicleManager.remove(vehicle.netId);

      }
    }
    else {
      emitNet('orion:showNotification', source, 'You are not logged in!')
    }

    DeleteEntity(vehicle.spawnId);
    delete vehicle;
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
          emit('orion:vehicle:s:deleteVehicle', vehicleId, source);
        }
      }
    }
  }, false);


})()

