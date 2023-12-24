let ejectVelocity = 60 / 2.236936;
let unknownEjectVelocity = 70 / 2.236936;
let unknownModifier = 17.0;
let minDamage = 2000;
let volume = 0.25;
let seatbelt = false;
let vehicleClassDisableControl = {
  [0]: true, //     --compacts
  [1]: true, //     --sedans
  [2]: true, //     --SUV's
  [3]: true, //     --coupes
  [4]: true, //     --muscle
  [5]: true, //     --sport classic
  [6]: true, //     --sport
  [7]: true, //     --super
  [8]: false, //    --motorcycle
  [9]: true, //     --offroad
  [10]: true, //    --industrial
  [11]: true, //    --utility
  [12]: true, //    --vans
  [13]: false, //   --bicycles
  [14]: false, //   --boats
  [15]: false, //   --helicopter
  [16]: false, //   --plane
  [17]: true, //    --service
  [18]: true, //    --emergency
  [19]: false, //    --military
};

let vehicleSeat = 0;

let brakeLightSpeedThresh = 0.25;
let seatbeltEjectSpeed = 45.0;
let seatbeltEjectAccel = 100.0;
let seatbeltPropModel = 'prop_seatbelt_01';
let seatbeltProp = null;



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

  emitNet('orion:vehicle:s:spawnNewVehicle', GetHashKey(model), coords, GetEntityHeading(ped));
};

SetFlyThroughWindscreenParams(ejectVelocity, unknownEjectVelocity, unknownModifier, minDamage);

const toggleSeatbelt = () => {
  seatbelt = !seatbelt;
  if (seatbelt) {
    playSound('buckle');
    SetFlyThroughWindscreenParams(10000.0, 10000.0, 17.0, 500.0);
    emit('orion:showNotification', 'Vous avez attaché votre ceinture de sécurité.');
  } else {
    playSound('unbuckle');
    SetFlyThroughWindscreenParams(ejectVelocity, unknownEjectVelocity, unknownModifier, minDamage);
    emit('orion:showNotification', 'Vous avez détaché votre ceinture de sécurité.');
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
      currSpeed = GetEntitySpeed(vehicle);
      SetPedConfigFlag(ped, 32, true);

      DisplayRadar(true);

      //let speed = GetEntitySpeed(vehicle);

      if (seatbelt) {
        DisableControlAction(0, 75, true);
        DisableControlAction(27, 75, true);
        exports['orion'].requestNewModel(seatbeltPropModel);

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

        console.log(vehIsMovingFwd, prevSpeed, seatbeltEjectSpeed / 2.237, vehAcc, seatbeltEjectAccel * 9.81)

        if (vehIsMovingFwd && prevSpeed > seatbeltEjectSpeed / 2.237 && vehAcc > seatbeltEjectAccel * 9.81) {
          console.log("ffff")
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
        consumption = currSpeed * 0.0001;
      } else {
        consumption = 0.0;
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

RegisterCommand(
  'veh',
  async (source, args) => {
    const model = args[0];
    createVehiclePedInside(model);
  },
  false
);

RegisterCommand(
  'delveh',
  async (source, args) => {
    const ped = PlayerPedId();
    if (IsPedInAnyVehicle(ped, false)) {
      const vehicle = GetVehiclePedIsIn(ped);
      DeleteEntity(vehicle);
      emitNet('orion:vehicle:deleteVehicle', vehicle);
    }
  },
  false
);

