(async () => {
  const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
  const gazStationsBlips = JSON.parse(gazStationsString);
  let playerPickupPump = false;
  let playerBone = null;

  let pistoletObject = null;
  let pistoletProps = null;

  let currentRope = {};

  let currentPump = null;
  let currentPumpProp = null;

  let currentPumpObj = {};
  
//  let ropeAnchor = null;
 // let pistoletInVehicle = false;

  const pumpModels = [-2007231801, 1339433404, 1694452750, 1933174915, -462817101, -469694731];

  const SetFuel = (vehicle, fuel) => {
    if (Number(fuel) && fuel >= 0 && fuel <= 100) {
      SetVehicleFuelLevel(vehicle, fuel);
      //DecorSetFloat(vehicle, fuelDecor, GetVehicleFuelLevel(vehicle));
    }
  };

  const LoadAnimDict = async dict => {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await exports['orion'].delay(0);

    }
  };

  const getClosestPumpHandle = () => {
    let ped = PlayerPedId();
    const [playerX, playerY, playerZ] = GetEntityCoords(ped, false);
    let distance = 10.0;
    let pumph = 0;

    for (let model of pumpModels) {
      let handle = GetClosestObjectOfType(playerX, playerY, playerZ, 2.0, model, false, false, false);
      if (handle !== 0) {
        const [objCoordsX, objCoordsY, objcoordsZ] = GetEntityCoords(handle);
        let objDistance = GetDistanceBetweenCoords(playerX, playerY, playerZ, objCoordsX, objCoordsY, objcoordsZ, true);
        if (objDistance < distance) {
          distance = objDistance;
          pumph = handle;
        }
      }
    }
    return pumph;
  };

  const vehicleInFront = () => {
    const [offsetX, offsetY, offsetZ] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 2.0, 0.0);
    const [playerCoordsX, playerCoordsY, playerCoordsZ] = GetEntityCoords(PlayerPedId(), false);
    let rayHandle = CastRayPointToPoint(
      playerCoordsX,
      playerCoordsY,
      playerCoordsZ - 1.3,
      offsetX,
      offsetY,
      offsetZ,
      10,
      PlayerPedId(),
      0
    );
    let [A, B, C, D, entity] = GetRaycastResult(rayHandle);
    if (IsEntityAVehicle(entity)) {
      return entity;
    }
  };

  // attach nozzle to vehicle.
  const putPipeInVehicle = (vehicle, ptankBone, isBike, dontClear, newTankPosition) => {
    if (isBike) {
      AttachEntityToEntity(
        pistoletObject,
        vehicle,
        ptankBone,
        0.0 + newTankPosition.x,
        -0.2 + newTankPosition.y,
        0.2 + newTankPosition.z,
        -80.0,
        0.0,
        0.0,
        true,
        true,
        false,
        false,
        1,
        true
      );
    } else {
      AttachEntityToEntity(
        pistoletObject,
        vehicle,
        ptankBone,
        -0.18 + newTankPosition.x,
        0.0 + newTankPosition.y,
        0.75 + newTankPosition.z,
        -125.0,
        -90.0,
        -90.0,
        true,
        true,
        false,
        false,
        1,
        true
      );
    }
    if (IsEntityPlayingAnim(PlayerPedId(), 'timetable@gardener@filling_can', 'gar_ig_5_filling_can', 3)) {
      ClearPedTasks(PlayerPedId());
    }
    pistoletInVehicle = true;
  };


  (async () => {

    const playerPed = PlayerPedId();

    for (const station of gazStationsBlips.GasStations) {
      exports['orion'].createBlip(station.coordinates, 361, 0, 'Station essence');
    }

    while (true) {
      await exports['orion'].delay(5);
      const playerCoords = GetEntityCoords(playerPed, false);

      for (const station of gazStationsBlips.GasStations) {
        for (const pumpCoords of station.pumps) {
          const distance = GetDistanceBetweenCoords( playerCoords[0], playerCoords[1], playerCoords[2], pumpCoords.X, pumpCoords.Y, pumpCoords.Z, true);
          if (distance <= 2 && !IsPedInAnyVehicle(playerPed, false)) {
            handlePumpInteraction(playerPed, pumpCoords);
          }
        }
      }
      let vehicle = vehicleInFront();

      if (playerPickupPump && vehicle) {
        handleVehicleInteraction(vehicle);
      }
    }
  })();

  const handlePumpInteraction = (playerPed, pumpCoords) => {
    if (!playerPickupPump) {
      emit('orion:showText', 'Appuyez sur ~g~E~w~ pour prendre une pompe');
      if (IsControlJustReleased(0, 38)) {
        currentPump = getClosestPumpHandle();
        emit('orion:station:c:pickUpPump')
      }
    } else {
      emit('orion:showText', 'Appuyez sur ~g~E~w~ pour ranger la pompe');
      if (IsControlJustReleased(0, 38)) {
        emit('orion:station:c:pickUpPump')
      }
    }
  };

  const handleVehicleInteraction = vehicle => {
    emit('orion:showText', 'Appuyez sur ~g~E~w~ pour mettre la pompe dans le véhicule');
    if (IsControlJustReleased(0, 38)) {
      // 38 est le code pour la touche E
      putPipeInVehicle(vehicle, 0x4d36b5e0, false, false, { x: 0.0, y: 0.0, z: 0.0 });
      SetFuel(vehicle, 100);
      pistoletInVehicle = false;
    }
  };

  // new code 

  onNet('orion:station:c:pickUpPump', async () => {
    let playerPed = PlayerPedId();

    LoadAnimDict('anim@mp_snowball');
    TaskPlayAnim(playerPed, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
    await exports['orion'].delay(700);

    if(playerPickupPump) {
      emitNet('orion:station:s:detachRope', playerPed);
    }

    else {
      RequestModel('prop_cs_fuel_nozle')
      while(!HasModelLoaded('prop_cs_fuel_nozle')) {
        await exports['orion'].delay(1);
      }

      currentPumpProp = CreateObject(GetHashKey('prop_cs_fuel_nozle'), 1.0, 1.0, 1.0, true, true, false);
      
      playerBone = GetPedBoneIndex(playerPed, 60309);

      AttachEntityToEntity(currentPumpProp, playerPed, playerBone, 0.0549, 0.049, 0.0, -50.0, -90.0, -50.0, true, true, false, false, 0, true);

      RopeLoadTextures();
      while (!RopeAreTexturesLoaded()) {
        await exports['orion'].delay(1);
      }

      let pumpCoords = GetEntityCoords(currentPump);
      let netIdProp = ObjToNet(currentPumpProp);

      SetNetworkIdExistsOnAllMachines(netIdProp, true)
      NetworkSetNetworkIdDynamic(netIdProp, true)
      SetNetworkIdCanMigrate(netIdProp, false)

      playerPickupPump = true;

      emitNet('orion:station:s:attachRope', netIdProp, pumpCoords, GetEntityModel(currentPumpProp));
    }

  });

  

  onNet('orion:station:c:attachRope', async (netIdProp, posPump, model, playerId) => {

    const object = GetHashKey('w_at_scope_small');

    RequestModel(object);
    while (!HasModelLoaded(object)) {
      await exports['orion'].delay(1);
    }

    currentPumpObj[playerId] = CreateObject(object, posPump[0], posPump[1], posPump[2], true, true, false);
    ActivatePhysics(currentPumpObj[playerId][0]);

    SetEntityRecordsCollisions(currentPumpObj[playerId][0], false);
    SetEntityLoadCollisionFlag(currentPumpObj[playerId][0], false);
    let timeout = 0;
    let IdProp;


    while (true) {
      if (timeout > 50) {
        break;
      }
      else if (NetworkDoesEntityExistWithNetworkId(netIdProp)) {
        IdProp = NetworkGetEntityFromNetworkId(netIdProp);
        break;
      } else {
        await exports['orion'].delay(100);
        timeout = timeout + 1;
      }
    }
    let [pumpPropCoordsX, pumpPropCoordsY, pumpPropCoordsZ] = GetOffsetFromEntityInWorldCoords(IdProp, 0.0, -0.019, -0.1749);
    currentRope[playerId] = AddRope(posPump[0], posPump[1], posPump[2] + 1.76, 0.0, 0.0, 0.0, 5.0, 1, 1000.0, 0.5, 1.0, false, false, false, 5.0, false, 0);

    AttachEntitiesToRope(currentRope[playerId][0], IdProp, currentPumpObj[playerId], pumpPropCoordsX, pumpPropCoordsY, pumpPropCoordsZ, posPump[0], posPump[1], posPump[2]+1, 30.0, 0, 0);
  })

  onNet('orion:station:c:detachRope', (playerId) => {

    console.log(currentRope[playerId])
    DetachRopeFromEntity(currentRope[playerId], currentPumpProp)
    DeleteRope(currentRope[playerId])
    
    console.log(currentPumpObj[playerId])
    DeleteEntity(currentPumpObj[playerId])      
    DetachEntity(currentPumpProp, true, true)
    DeleteEntity(currentPumpProp)
    
    ClearPedTasks(PlayerPedId());
    currentPumpProp = null
    currentPump = null
    playerBone = null

    playerPickupPump = false;
  })


  on('onResourceStop', async (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) {
      return;
    }
    if (currentPumpProp) {
      DetachEntity(currentPumpProp, true, true);
      DeleteEntity(currentPumpProp);
    }
    ClearPedTasks(PlayerPedId());

  })

})();
