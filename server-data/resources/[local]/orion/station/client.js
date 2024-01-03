(async () => {
  const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
  const gazStationsBlips = JSON.parse(gazStationsString);
  let playerPickupPump = false;
  let playerBone = null;
  let FUEL_DECOR = "_ANDY_FUEL_DECORE_"
  let pistoletInVehicle = false;
  let vehicleEntityInFront = null;
  let fuelPrice = 1;


  let pistoletObject = null;
  let pistoletProps = null;

  let currentRope = {};

  let currentPump = null;
  let currentPumpProp = null;

  let currentPumpObj = {};
  let nozzleBasedOnClass = [
    0.65, //Compacts
    0.65, //Sedans
    0.85, //SUVs
    0.6, //Coupes
    0.55, //Muscle
    0.6, //Sports Classics
    0.6, //Sports
    0.55, //Super
    0.12, //Motorcycles
    0.8, //Off - road
    0.7, //Industrial
    0.6, //Utility
    0.7, //Vans
    0.0, //Cycles
    0.0, //Boats
    0.0, //Helicopters
    0.0, //Planes
    0.6, //Service
    0.65, //Emergency
    0.65, //Military
    0.75, //Commercial
    0.0 // Trains
  ];

  let electricVehicles = [`Imorgon`, `Neon`, `Raiden`, `Cyclone`, `Voltic`, `Voltic2`, `Tezeract`, `Dilettante`, `Dilettante2`, `Airtug`, `Caddy`, `Caddy2`, `Caddy3`, `Surge`, `Khamelion`, `RCBandito`, `Models`];

  const pumpModels = [-2007231801, 1339433404, 1694452750, 1933174915, -462817101, -469694731];

  const setFuel = (vehicle, fuel) => {
    if (Number(fuel) && fuel >= 0 && fuel <= 100) {
      SetVehicleFuelLevel(vehicle, fuel);
      DecorSetFloat(vehicle, FUEL_DECOR, GetVehicleFuelLevel(vehicle));
    }
  };

  const LoadAnimDict = async dict => {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await exports['orion'].delay(0);

    }
  };

  const getFuel = (vehicle) => {
    if (!DecorExistOn(vehicle, FUEL_DECOR)) {
      return GetVehicleFuelLevel(vehicle)
    }
    return DecorGetFloat(vehicle, FUEL_DECOR)
  }

  const playEffect = (pdict, pname) => {
    setTick(async () => {
      let position = GetOffsetFromEntityInWorldCoords(pistoletObject, 0.0, 0.28, 0.17)
      UseParticleFxAsset(pdict)
      let pfx = StartParticleFxLoopedAtCoord(pname, position.x, position.y, position.z, 0.0, 0.0, GetEntityHeading(pistoletObject), 1.0, false, false, false, false)
      await exports['orion'].delay(1000)
      StopParticleFxLooped(pfx, 0)
    })
  }

  const getClosestPumpHandle = () => {
    let ped = PlayerPedId();
    const [playerX, playerY, playerZ] = GetEntityCoords(ped, false);
    let distance = 10.0;
    let pumph = 0;

    for (let model of pumpModels) {
      let handle = GetClosestObjectOfType(playerX, playerY, playerZ, 1.5, model, false, false, false);
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

  const getVehicleRefuelPositions = (vehicle) => {
    let ped = PlayerPedId();
    let [rightVector, forwardVector, upVector, position] = GetEntityMatrix(ped);

    let leftWheelBone = GetEntityBoneIndexByName(vehicle, 'wheel_lr');
    let rightWheelBone = GetEntityBoneIndexByName(vehicle, 'wheel_rr');
    let leftWheelPosition = GetWorldPositionOfEntityBone(vehicle, leftWheelBone);
    let rightWheelPosition = GetWorldPositionOfEntityBone(vehicle, rightWheelBone);
    let leftWheelDistance = GetDistanceBetweenCoords(leftWheelPosition[0], leftWheelPosition[1], leftWheelPosition[2], position[0], position[1], position[2], true);
    let rightWheelDistance = GetDistanceBetweenCoords(rightWheelPosition[0], rightWheelPosition[1], rightWheelPosition[2], position[0], position[1], position[2], true);
    let tankPosition = null;

    if (leftWheelDistance < rightWheelDistance) {
      tankPosition = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, 1.0, 0.0);
    }
    else {
      tankPosition = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -1.0, 0.0);
    }
    return tankPosition
  }

  const vehicleInFront = () => {
    const [offsetX, offsetY, offsetZ] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 2.0, 0.0);
    const [playerCoordsX, playerCoordsY, playerCoordsZ] = GetEntityCoords(PlayerPedId(), false);
    let rayHandle = CastRayPointToPoint(playerCoordsX, playerCoordsY, playerCoordsZ - 1.3, offsetX, offsetY, offsetZ, 10, PlayerPedId(), 0);
    let [A, B, C, D, entity] = GetRaycastResult(rayHandle);
    if (IsEntityAVehicle(entity)) {
      return entity;
    }
  };

  // attach nozzle to vehicle.
  const putPipeInVehicle = (vehicle, ptankBone, isBike, dontClear, newTankPosition) => {
    if (isBike) {
      AttachEntityToEntity(pistoletObject, vehicle, ptankBone, 0.0 + newTankPosition.x, -0.2 + newTankPosition.y, 0.2 + newTankPosition.z, -80.0, 0.0, 0.0, true, true, false, false, 1, true);
    } else {
      AttachEntityToEntity(pistoletObject, vehicle, ptankBone, -0.18 + newTankPosition.x, 0.0 + newTankPosition.y, 0.75 + newTankPosition.z, -125.0, -90.0, -90.0, true, true, false, false, 1, true);
    }
    if (!dontClear && IsEntityPlayingAnim(PlayerPedId(), 'timetable@gardener@filling_can', 'gar_ig_5_filling_can', 3)) {
      ClearPedTasks(PlayerPedId());
    }
    pistoletInVehicle = true;
  };


  setTick(async () => {

    const playerPed = PlayerPedId();

    while (true) {
      await exports['orion'].delay(5);
      const playerCoords = GetEntityCoords(playerPed, false);

      for (const station of gazStationsBlips.GasStations) {
        for (const pumpCoords of station.pumps) {
          const distance = GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], pumpCoords.X, pumpCoords.Y, pumpCoords.Z, true);
          if (distance <= 2 && !IsPedInAnyVehicle(playerPed, false)) {
            if (!playerPickupPump) {
              emit('orion:showText', 'Appuyez sur ~g~E~w~ pour prendre une pompe');
              //ajouter le prix du fuel
              if (IsControlJustReleased(0, 38)) {
                currentPump = getClosestPumpHandle();
                //Add le fuel price de la pump
                emit('orion:station:c:pickUpPump')
              }
            } else {
              emit('orion:showText', 'Appuyez sur ~g~E~w~ pour ranger la pompe');
              if (IsControlJustReleased(0, 38)) {
                emit('orion:station:c:pickUpPump')
              }
            }
          }
        }
      }
      vehicleEntityInFront = vehicleInFront();

      if (playerPickupPump && vehicleEntityInFront) {
        if (!pistoletInVehicle) {

          emit('orion:showText', 'Appuyez sur ~g~E~w~ pour mettre la pompe dans le véhicule');
          if (IsControlJustReleased(0, 38)) {
            if (IsVehicleEngineOn(vehicleEntityInFront)) {
              emit('orion:showNotification', 'Vous devez éteindre le moteur du véhicule.');
              return;
            }

            const currentFuelInVehicle = getFuel(vehicleEntityInFront);

            const missingFuel = 100 - currentFuelInVehicle;
            if (missingFuel <= 0) {
              emit('orion:station:c:canceledRefuel', 'Le véhicule est déjà plein.')
              return;
            }
            let isBike = IsThisModelABike(GetEntityModel(vehicleEntityInFront));
            let vehClass = GetVehicleClass(vehicleEntityInFront)
            let nozzleModifiedPosition = {
              x: 0.0,
              y: 0.0,
              z: 0.0
            }

            let tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'petroltank');

            if ((vehClass == 8 && vehClass != 13) && !electricVehicles[GetHashKey(vehicleEntityInFront)]) {
              tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'petrolcap');
              if (tankBone == -1) {
                tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'petroltank');
              }
              if (tankBone == -1) {
                tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'engine');
              }
              isBike = true;
            }
            else if (vehClass !== 13 && !electricVehicles[GetHashKey(vehicleEntityInFront)]) {
              tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'petrolcap');
              if (tankBone == -1) {
                tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'petroltank_l');
              }
              if (tankBone == -1) {
                tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, 'hub_lr');
              }
              if (tankBone == -1) {
                tankBone = GetEntityBoneIndexByName(vehicleEntityInFront, "handle_dside_r")
                nozzleModifiedPosition.x = 0.1
                nozzleModifiedPosition.y = -0.5
                nozzleModifiedPosition.z = -0.6
              }
            }
            tankPosition = GetWorldPositionOfEntityBone(vehicleEntityInFront, tankBone);

            LoadAnimDict('timetable@gardener@filling_can');
            TaskPlayAnim(PlayerPedId(), "timetable@gardener@filling_can", "gar_ig_5_filling_can", 2.0, 8.0, -1, 50, 0, 0, 0, 0)
            await exports['orion'].delay(300);
            //let fuelposition = getVehicleRefuelPositions(vehicle);

            putPipeInVehicle(vehicleEntityInFront, tankBone, isBike, true, nozzleModifiedPosition);
            pistoletInVehicle = true;

          }

        }
        else {
          emit('orion:showText', 'Appuyez sur ~g~E~w~ pour arrêter de mettre de l\'essence');
          if (IsControlJustReleased(0, 38)) {
            pistoletInVehicle = false;
            ClearPedTasks(PlayerPedId());
          }
        }
      }
    }
  });

  (async () => {
    while (true) {
      await exports['orion'].delay(100);
      if (pistoletInVehicle) {
        if (!vehicleEntityInFront) {
          pistoletInVehicle = false;
          ClearPedTasks(PlayerPedId());
        }
        else {
          let fuel = GetVehicleFuelLevel(vehicleEntityInFront);
          if (fuel < 100) {
            emitNet('orion:station:s:payRefuelVehicle', (1 * fuelPrice));
            setFuel(vehicleEntityInFront, fuel + 1);
          }
          else {
            pistoletInVehicle = false;
            ClearPedTasks(PlayerPedId());
          }
        }
        exports['orion'].showHelpText('Essence: ~g~' + Math.round(GetVehicleFuelLevel(vehicleEntityInFront)) + ' / 100');
      }
    }
  })();

  onNet('orion:station:c:canceledRefuel', (message) => {
    pistoletInVehicle = false;
    ClearPedTasks(PlayerPedId());
    emit('orion:showNotification', message);
  })

  onNet('orion:station:c:pickUpPump', async () => {
    let playerPed = PlayerPedId();

    LoadAnimDict('anim@mp_snowball');
    TaskPlayAnim(playerPed, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
    await exports['orion'].delay(700);

    if (playerPickupPump) {
      emitNet('orion:station:s:detachRope', playerPed);
    }

    else {
      RequestModel('prop_cs_fuel_nozle')
      while (!HasModelLoaded('prop_cs_fuel_nozle')) {
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

    AttachEntitiesToRope(currentRope[playerId][0], IdProp, currentPumpObj[playerId], pumpPropCoordsX, pumpPropCoordsY, pumpPropCoordsZ, posPump[0], posPump[1], posPump[2] + 1, 30.0, 0, 0);
  })

  onNet('orion:station:c:detachRope', (playerId) => {
    DetachRopeFromEntity(currentRope[playerId][0], currentPumpProp)
    DeleteRope(currentRope[playerId][0])

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
