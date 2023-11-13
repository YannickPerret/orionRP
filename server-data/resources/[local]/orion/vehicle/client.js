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

SetFlyThroughWindscreenParams(
  ejectVelocity,
  unknownEjectVelocity,
  unknownModifier,
  minDamage
);

const toggleSeatbelt = () => {
  sealtbelt = !sealtbelt;
  if (sealtbelt) {
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
  let ped = PlayerPedId();

  while (true) {
    await Delay(10); // Utilisez await avant Delay pour suspendre l'exécution
    if (IsPedInAnyVehicle(ped, false)) {
      if (sealtbelt) {
        DisableControlAction(0, 75, true);
        DisableControlAction(27, 75, true);
      }

      let vehicle = GetVehiclePedIsIn(ped, false);
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
        GetPedInVehicleSeat(vehicle, -1) == player &&
        vehicleClassDisableControl[vehicleClass]
      ) {
        if (IsEntityInAir(vehicle)) {
          DisableControlAction(2, 59);
          DisableControlAction(2, 60);
        }
      }

      if (vehicle != nil && GetEntitySpeed(vehicle) <= brakeLightSpeedThresh) {
        SetVehicleBrakeLights(vehicle, true);
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
