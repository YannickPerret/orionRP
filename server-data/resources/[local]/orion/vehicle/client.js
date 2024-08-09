(async () => {
  let ejectVelocity = 60 / 2.236936;
  let unknownEjectVelocity = 70 / 2.236936;
  let unknownModifier = 17.0;
  let minDamage = 2000;
  let volume = 0.25;
  let seatbelt = false;

  let vehicleSeat = 0;

  let brakeLightSpeedThresh = 0.25;
  let seatbeltEjectSpeed = 45.0;
  let seatbeltEjectAccel = 100.0;
  let seatbeltPropModel = 'prop_seatbelt_01';
  let seatbeltProp = null;

  // airbag
  let airbagProp = 'prop_airbag_01';
  let airbagDeploySpeed = 60.0
  let aribargDamageDeploy = 200.0

  const ToggleAirbag = async (currVehicle) => {
    while (!HasModelLoaded(airbagPropp)) {
      RequestModel(modelName)
      await exports['orion'].delay(0)
    }
    let pCoords = GetEntityCoords(PlayerPedId())
    let airbag1 = CreateObject(Config.airbagProp, pCoords.x, pCoords.y, pCoords.z, true, true, true)
    let airbag2 = CreateObject(Config.airbagProp, pCoords.x, pCoords.y, pCoords.z, true, true, true)

    let driverSideBone = GetEntityBoneIndexByName(currVehicle, "seat_dside_f")
    let passSideBone = GetEntityBoneIndexByName(currVehicle, "seat_pside_f")
    AttachEntityToEntity(airbag1, currVehicle, driverSideBone, 0.0, 0.30, 0.40, 0.0, 0.0, 90.0, true, true, false, false, 2, true)
    AttachEntityToEntity(airbag2, currVehicle, passSideBone, 0.0, 0.40, 0.40, 0.0, 0.0, 90.0, true, true, false, false, 2, true)

    TriggerServerEvent("InteractSound_SV:PlayWithinDistance", 10.0, "airbag", 1.0)

    setTick(async () => {
      StartScreenEffect("DeathFailOut", 0, 0)
      ShakeGameplayCam("DEATH_FAIL_IN_EFFECT_SHAKE", 1.0)

      await exports['orion'].delay(3000)

      StopScreenEffect("DeathFailOut")
    })

    Entity(currVehicle).state.airbags = true
    emitNet('vehicle:airbags:s:setState', NetworkGetNetworkIdFromEntity(currVehicle), true)
  }

  exports('getVehicleProprieties', async (vehicle) => {
    let vehicleProprieties = {
      doorsBroken: [false, false, false, false, false, false, false],
    }
    for (let doors = 0; doors <= 5; doors++) {
      vehicleProprieties.doorsBroken[doors] = IsVehicleDoorDamaged(vehicle, doors);
    }
    vehicleProprieties.fuel = GetVehicleFuelLevel(vehicle);
    vehicleProprieties.interiorColor = GetVehicleInteriorColor(vehicle);


    return vehicleProprieties
  })

  onNet('orion:vehicle:c:setVehicleProperties', async (vehicleId, setVehicleProperties) => {
    if (!vehicleId && !setVehicleProperties) {
      return;
    }

    SetVehicleFuelLevel(vehicleId, setVehicleProperties.fuel);
    SetVehicleInteriorColor(vehicleId, setVehicleProperties.interiorColor);
  })


  const createVehicle = async (model, coords) => {
    RequestModel(model);
    while (!HasModelLoaded(model)) {
      await exports['orion'].delay(400)
    }

    /*
      // Check if there's a vehicle blocking the spawn location
      if (! IsAnyVehicleNearPoint(location.X, location.Y, location.Z, distance))
      {
      }*/

    //const vehicle = CreateVehicle(model, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
    SetEntityAsNoLongerNeeded(vehicle);
    SetModelAsNoLongerNeeded(model);
  };


  const createVehiclePedInside = async model => {
    const ped = PlayerPedId();
    const coords = GetEntityCoords(ped);

    RequestModel(model);
    while (!HasModelLoaded(model)) {
      await exports['orion'].delay(400)
    }

    const vehicleName = GetDisplayNameFromVehicleModel(model);

    emitNet('orion:vehicle:s:spawnNewVehicle', GetHashKey(model), model, coords, GetEntityHeading(ped));
  };

  SetFlyThroughWindscreenParams(ejectVelocity, unknownEjectVelocity, unknownModifier, minDamage);

  const toggleSeatbelt = () => {
    seatbelt = !seatbelt;
    if (seatbelt) {
      playSound('buckle');
      SetFlyThroughWindscreenParams(10000.0, 10000.0, 17.0, 500.0);
    } else {
      playSound('unbuckle');
      SetFlyThroughWindscreenParams(ejectVelocity, unknownEjectVelocity, unknownModifier, minDamage);
    }

    SendNUIMessage({
      action: 'seatbelt',
      payload: seatbelt,
    });
  };

  const playSound = sound => {
    SendNUIMessage({
      action: 'playSound',
      payload: {
        sound,
        volume,
      },
    });
  };

  (async () => {
    let ped = PlayerPedId();
    let prevVelocity = { x: 0.0, y: 0.0, z: 0.0 };
    let currSpeed = 0.0;

    while (true) {
      let vehicle = GetVehiclePedIsIn(ped, false);
      //if ped is in a vehicle consume fuel
      if (vehicle != undefined && IsPedInAnyVehicle(ped, false)) {

        let [positionX, positionY, positionZ] = GetEntityCoords(ped, true);
        let prevSpeed = currSpeed;

        let isDriver = ped == GetPedInVehicleSeat(vehicle, -1);

        let fuel = GetVehicleFuelLevel(vehicle);
        let consumption = 0.0;

        //currSpeed = GetEntitySpeed(vehicle) * 3.6;
        currSpeed = GetEntitySpeed(vehicle) * 2.236936;
        SetPedConfigFlag(ped, 32, true);

        DisplayRadar(true);

        //let speed = GetEntitySpeed(vehicle);

        if (seatbelt) {
          DisableControlAction(0, 75, true);
          DisableControlAction(27, 75, true);
          emit('orion:customization:c:loadNewModel', seatbeltPropModel);

          // Attach seatbelt prop on player
          seatbeltProp = CreateObject(GetHashKey(seatbeltPropModel), GetPedBoneIndex(ped, 28933), true, false, false);
          AttachEntityToEntity(seatbeltProp, ped, 28933, 0.0, 0.0, 0.0, 0.0, 0.0, 180.0, false, false, true, false, 2, true);
          SetModelAsNoLongerNeeded(seatbeltPropModel);

          SetPedConfigFlag(ped, 184, true);
          if (GetIsTaskActive(ped, 165)) {
            vehicleSeat = 0;
            if (isDriver) {
              vehicleSeat = -1;
            }
            SetPedIntoVehicle(ped, vehicle, vehicleSeat);
          }
        } else {
          SetPedConfigFlag(ped, 184, false);
          ClearPedProp(ped, GetPedBoneIndex(ped, 28933));

          let [speedX, speedY, speedZ] = GetEntitySpeedVector(vehicle, true);
          let vehIsMovingFwd = speedY > 1.0;
          let vehAcc = (prevSpeed - currSpeed) / GetFrameTime();

          if (vehIsMovingFwd && prevSpeed > seatbeltEjectSpeed / 2.237 && vehAcc > seatbeltEjectAccel * 9.81) {
            SetEntityCoords(ped, positionX, positionY, positionZ - 0.47, true, true, true);
            SetEntityVelocity(ped, prevVelocity.x, prevVelocity.y, prevVelocity.z);
            await exports['orion'].delay(1);
            SetPedToRagdoll(ped, 1000, 1000, 0, 0, 0, 0);
          } else {
            let [velX, velY, velZ] = GetEntityVelocity(vehicle);
            prevVelocity.x = velX;
            prevVelocity.y = velY;
            prevVelocity.z = velZ;
          }
        }

        SendNUIMessage({
          action: 'showVehicleUI',
          payload: {
            pedInVehicle: true,
            fuel: fuel.toFixed(0),
            seatbelt: seatbelt,
            isDriver: isDriver,
            speed: (currSpeed * 3.6).toFixed(0),
          }
        });

        if (currSpeed > 0) {
          consumption = currSpeed * 0.00001;
        } else {
          consumption = 0.00001;
        }

        if (fuel - consumption > 0) {
          SetVehicleFuelLevel(vehicle, fuel - consumption);
        } else {
          SetVehicleFuelLevel(vehicle, 0);
        }
      }
      else {
        SendNUIMessage({
          action: 'showVehicleUI',
          payload: {
            pedInVehicle: false,
            isDriver: false
          }
        });
        CancelEvent('SeatShuffle');
        DisplayRadar(false);

        if (seatbelt) {
          seatbelt = false;
          toggleSeatbelt();
        }
        await exports['orion'].delay(1000);
      }

      if (vehicle != undefined && GetVehicleEngineHealth(vehicle) <= 300) {
        SetVehicleEngineOn(vehicle, false, false, true);
      }

      if (vehicle != undefined && GetEntitySpeed(vehicle) <= brakeLightSpeedThresh) {
        SetVehicleBrakeLights(vehicle, true);
      }
      await exports['orion'].delay(0);
    }
  })();

  RegisterKeyMapping('seatbelt', 'Attacher sa ceinture', 'keyboard', 'N');

  RegisterCommand(
    'seatbelt',
    () => {
      let ped = PlayerPedId();
      if (IsPedInAnyVehicle(ped, false)) {
        let classVehicle = GetVehicleClass(GetVehiclePedIsIn(ped));
        if (classVehicle !== 8 && classVehicle !== 13 && classVehicle !== 14) {
          toggleSeatbelt();
        }
      }
    },
    false
  );

  RegisterCommand('veh', async (source, args) => {
    const model = args[0];
    createVehiclePedInside(model);
    await exports['orion'].delay(3000);
    SetVehicleFuelLevel(GetVehiclePedIsIn(PlayerPedId()), 100.0);
  }, false);



  //target System
  (async () => {
    try {
      const targetOptionInVehicle = []

      //if engine is on or off
      if (IsVehicleEngineOn(GetVehiclePedIsIn(PlayerPedId(), false))) {
        //if engine is on
        targetOptionInVehicle.push(
          {
            label: 'Eteindre le moteur',
            action: () => {
              SetVehicleEngineOn(vehicle, false, false, true);
            }
          }
        )
      }
      else {
        //if engine is off
        targetOptionInVehicle.push(
          {
            label: 'Allumer le moteur',
            action: () => {
              SetVehicleEngineOn(vehicle, true, false, true);
            }
          }
        )
      }

      const targetOptionVehicle = [
        {
          label: 'Ouvrir le coffre',
          bones: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
          action: () => {
            emit('orion:vehicle:c:openInventory')
          }
        }
      ]
    }
    catch (error) {
      console.error(error);
    }

  })();

})();
