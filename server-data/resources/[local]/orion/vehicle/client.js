let ejectVelocity = 60 / 2.236936;
let unknownEjectVelocity = 70 / 2.236936;
let unknownModifier = 17.0;
let minDamage = 2000;
let volume = 0.25;
let sealtbelt = false;

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
