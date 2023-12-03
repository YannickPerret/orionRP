let ejectVelocity = 60 / 2.236936;
let unknownEjectVelocity = 70 / 2.236936;
let unknownModifier = 17.0;
let minDamage = 2000;
let volume = 0.25;
let sealtbelt = false;
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
let sealtbeltProps = 'prop_cs_seatbelt_01';

const createVehicle = async (model, coords) => {
  RequestModel(model);
  while (!HasModelLoaded(model)) {
    await Delay(400);
  }
  const vehicle = CreateVehicle(model, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
  SetEntityAsNoLongerNeeded(vehicle);
  SetModelAsNoLongerNeeded(model);
};

const createVehiclePedInside = async model => {
  const ped = PlayerPedId();
  const coords = GetEntityCoords(ped);
  let vehicle = {};
  RequestModel(model);
  while (!HasModelLoaded(model)) {
    await Delay(400);
  }
  vehicle.id = CreateVehicle(model, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
  vehicle.model = model;
  vehicle.owner = GetPlayerServerId(PlayerId());
  vehicle.plate = GetVehicleNumberPlateText(vehicle.id);
  vehicle.position = coords;
  vehicle.fuel = GetVehicleFuelLevel(vehicle.id);
  vehicle.state = 'good';
  vehicle.primaryColor = GetVehicleColours(vehicle.id)[0];
  vehicle.secondaryColor = GetVehicleColours(vehicle.id)[1];
  vehicle.pearlescentColor = GetVehicleExtraColours(vehicle.id)[1];

  SetPedIntoVehicle(ped, vehicle.id, -1);
  SetEntityAsNoLongerNeeded(vehicle.id);
  SetModelAsNoLongerNeeded(model);
  emitNet('orion:vehicle:createVehicle', vehicle);
};

SetFlyThroughWindscreenParams(ejectVelocity, unknownEjectVelocity, unknownModifier, minDamage);

const toggleSeatbelt = () => {
  sealtbelt = !sealtbelt;
  if (sealtbelt) {
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
    data: sealtbelt,
  });
};

const playSound = sound => {
  SendNUIMessage({
    action: 'playSound',
    data: {
      sound,
      volume,
    },
  });
};

(async () => {
  let currSpeed = 0.0;
  let prevVelocity = { x: 0.0, y: 0.0, z: 0.0 };

  while (true) {
    await Delay(0);
    let ped = PlayerPedId();
    let [positionX, positionY, positionZ] = GetEntityCoords(ped, true);

    if (IsPedInAnyVehicle(ped, false)) {
      DisplayRadar(true);

      let vehicle = GetVehiclePedIsIn(ped, false);
      let prevSpeed = currSpeed;

      currSpeed = GetEntitySpeed(vehicle);

      SetPedConfigFlag(PlayerPedId(), 32, true);

      if (sealtbelt) {
        DisableControlAction(0, 75, true);
        DisableControlAction(27, 75, true);
        exports['orion'].requestNewModel(sealtbeltProps);

        // Attach seatbelt prop on player
        if (!DoesEntityExist(sealtbeltProps)) {
          let seatbeltProp = CreateObject(GetHashKey(sealtbeltProps), 0, 0, 0, true, true, false);
          AttachEntityToEntity(
            seatbeltProp,
            ped,
            GetPedBoneIndex(ped, 57005),
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            180.0,
            false,
            false,
            true,
            false,
            2,
            true
          );
        }
        SetModelAsNoLongerNeeded(sealtbeltProps);

        SetPedConfigFlag(GetPlayerPed(-1), 184, true);
        if (GetIsTaskActive(GetPlayerPed(-1), 165)) {
          vehicleSeat = 0;
          if (GetPedInVehicleSeat(vehicle, -1) == GetPlayerPed(-1)) {
            vehicleSeat = -1;
          }
          SetPedIntoVehicle(GetPlayerPed(-1), vehicle, vehicleSeat);
        }
      } else {
        SetPedConfigFlag(ped, 184, false);
        if (DoesEntityExist(sealtbeltProps)) {
          DeleteEntity(sealtbeltProps);
          ClearPedProp(ped, GetPedBoneIndex(ped, 57005));
        }

        let [speedX, speedY, speedZ] = GetEntitySpeedVector(vehicle, true);
        let vehIsMovingFwd = speedY > 1.0;
        let vehAcc = (prevSpeed - currSpeed) / GetFrameTime();
        if (vehIsMovingFwd && prevSpeed > seatbeltEjectSpeed / 2.237 && vehAcc > seatbeltEjectAccel * 9.81) {
          console.log(positionX, prevVelocity.x);
          SetEntityCoords(ped, positionX, positionY, positionZ - 0.47, true, true, true);
          SetEntityVelocity(ped, prevVelocity.x, prevVelocity.y, prevVelocity.z);
          await Delay(1);
          SetPedToRagdoll(GetPlayerPed(-1), 1000, 1000, 0, 0, 0, 0);
        } else {
          let [velX, velY, velZ] = GetEntityVelocity(vehicle);
          prevVelocity.x = velX;
          prevVelocity.y = velY;
          prevVelocity.z = velZ;
        }
      }

      let isDriver = ped === GetPedInVehicleSeat(vehicle, -1);
      let speed = isDriver ? GetEntitySpeed(vehicle) * 3.6 : 0;
      SendNUIMessage({
        action: 'updateSpeed',
        data: {
          speed: speed.toFixed(0),
          isDriver: isDriver,
        },
      });

      let vehicleClass = GetVehicleClass(vehicle);

      // disable air control
      if (GetPedInVehicleSeat(vehicle, -1) == ped && vehicleClassDisableControl[vehicleClass]) {
        if (IsEntityInAir(vehicle)) {
          DisableControlAction(2, 59);
          DisableControlAction(2, 60);
        }
      }
    } else {
      CancelEvent('SeatShuffle');

      DisplayRadar(false);
      SendNUIMessage({
        action: 'updateSpeed',
        data: {
          speed: 0,
          isDriver: false,
        },
      });
      if (sealtbelt) {
        sealtbelt = false;
        toggleSeatbelt();
      }
      await Delay(1000); // Attendre ici aussi
    }
  }
})();

async () => {
  let ped = PlayerPedId();

  while (true) {
    let vehicle = GetVehiclePedIsIn(ped, false);

    //if ped is in a vehicle consume fuel
    if (vehicle != undefined && IsPedInAnyVehicle(ped, false)) {
      console.log(VehicleManager.getVehicles());
      let fuel = GetVehicleFuelLevel(vehicle);
      let speed = GetEntitySpeed(vehicle);
      let consumption = 0.0;

      if (speed > 0) {
        consumption = speed * 0.0001;
      } else {
        consumption = 0.0;
      }

      if (fuel - consumption <= fuel * 0.9) {
        SendNUIMessage({
          action: 'updateFuel',
          data: {
            fuel: (fuel - consumption).toFixed(0),
          },
        });
      }

      if (fuel - consumption > 0) {
        SetVehicleFuelLevel(vehicle, fuel - consumption);
      } else {
        SetVehicleFuelLevel(vehicle, 0);
      }
    }

    if (vehicle != undefined && GetVehicleEngineHealth(vehicle) <= 300) {
      SetVehicleEngineOn(vehicle, false, false, true);
    }

    if (vehicle != undefined && GetEntitySpeed(vehicle) <= brakeLightSpeedThresh) {
      SetVehicleBrakeLights(vehicle, true);
    }

    await Delay(0);
  }
};

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
