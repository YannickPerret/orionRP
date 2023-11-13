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
let brakeLightSpeedThresh = 0.25;
let seatbeltEjectSpeed = 45.0;
let seatbeltEjectAccel = 100.0;

SetFlyThroughWindscreenParams(
  ejectVelocity,
  unknownEjectVelocity,
  unknownModifier,
  minDamage
);

const toggleSeatbelt = () => {
  sealtbelt = !sealtbelt;
  if (sealtbelt) {
    //PlaySoundFrontend(-1, "Faster_Click", "RESPAWN_ONLINE_SOUNDSET", 1)

    playSound("buckle");
    SetFlyThroughWindscreenParams(10000.0, 10000.0, 17.0, 500.0);
    emit(
      "orion:showNotification",
      "Vous avez attaché votre ceinture de sécurité."
    );
  } else {
    playSound("unbuckle");
    SetFlyThroughWindscreenParams(
      ejectVelocity,
      unknownEjectVelocity,
      unknownModifier,
      minDamage
    );
    emit(
      "orion:showNotification",
      "Vous avez détaché votre ceinture de sécurité."
    );
  }
};

const playSound = (sound) => {
  SendNUIMessage({
    action: "playSound",
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
      let vehicle = GetVehiclePedIsIn(ped, false);
      let prevSpeed = currSpeed;

      currSpeed = GetEntitySpeed(vehicle);

      SetPedConfigFlag(PlayerPedId(), 32, true);

      if (sealtbelt) {
        DisableControlAction(0, 75, true);
        DisableControlAction(27, 75, true);
      } else {
        let [speedX, speedY, speedZ] = GetEntitySpeedVector(vehicle, true);
        let vehIsMovingFwd = speedY > 1.0;
        let vehAcc = (prevSpeed - currSpeed) / GetFrameTime();
        if (
          vehIsMovingFwd &&
          prevSpeed > seatbeltEjectSpeed / 2.237 &&
          vehAcc > seatbeltEjectAccel * 9.81
        ) {
          console.log(positionX, prevVelocity.x);
          SetEntityCoords(
            ped,
            positionX,
            positionY,
            positionZ - 0.47,
            true,
            true,
            true
          );
          SetEntityVelocity(
            ped,
            prevVelocity.x,
            prevVelocity.y,
            prevVelocity.z
          );
          TaskLeaveAnyVehicle(PlayerPedId(), 0, 320);
          await Delay(1);
          SetPedToRagdoll(GetPlayerPed(-1), 1000, 1000, 0, 0, 0, 0);
        } else {
          prevVelocity = GetEntityVelocity(vehicle);
        }
      }

      let isDriver = ped === GetPedInVehicleSeat(vehicle, -1);
      let speed = isDriver ? GetEntitySpeed(vehicle) * 3.6 : 0;
      SendNUIMessage({
        action: "updateSpeed",
        data: {
          speed: speed.toFixed(0),
          isDriver: isDriver,
        },
      });

      let vehicleClass = GetVehicleClass(vehicle);

      // disable air control
      if (
        GetPedInVehicleSeat(vehicle, -1) == ped &&
        vehicleClassDisableControl[vehicleClass]
      ) {
        if (IsEntityInAir(vehicle)) {
          DisableControlAction(2, 59);
          DisableControlAction(2, 60);
        }
      }
    } else {
      if (sealtbelt) {
        sealtbelt = false;
        toggleSeatbelt();
      }
      await Delay(1000); // Attendre ici aussi
    }
  }
})();

async () => {
  while (true) {
    let vehicle = GetVehiclePedIsIn(ped, false);

    if (
      vehicle != undefined &&
      GetEntitySpeed(vehicle) <= brakeLightSpeedThresh
    ) {
      SetVehicleBrakeLights(vehicle, true);
    }

    await Delay(0);
  }
};

RegisterKeyMapping("seatbelt", "Attacher sa ceinture", "keyboard", "N");

RegisterCommand(
  "seatbelt",
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
