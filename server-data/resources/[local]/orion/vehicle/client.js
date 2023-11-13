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

const toggleSeatbelt = (toggle) => {
  if (toggle === undefined) {
    if (sealtbelt) {
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
    } else {
      playSound("buckle");
      SetFlyThroughWindscreenParams(10000.0, 10000.0, 17.0, 500.0);
      emit(
        "orion:showNotification",
        "Vous avez attaché votre ceinture de sécurité."
      );
    }
    sealtbelt = toggle;
  } else {
    if (toggle) {
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
    sealtbelt = toggle;
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

async () => {
  let ped = PlayerPedId();

  while (true) {
    Delay(10);
    if (IsPedInAnyVehicle(ped)) {
      if (sealtbelt) {
        DisableControlAction(0, 75, true);
        DisableControlAction(27, 75, true);
      }
    } else {
      if (sealtbelt) {
        sealtbelt = false;
        toggleSeatbelt(false);
      }
      Delay(1000);
    }
  }
};

RegisterKeyMapping("seatbelt", "Attacher sa ceinture", "keyboard", "N");

registerCommand(
  "seatbelt",
  () => {
    if (IsPedInAnyVehicle(ped, false)) {
      let classVehicle = GetVehicleClass(GetVehiclePedIsIn(ped));
      if (classVehicle != 8 || classVehicle != 13 || classVehicle != 14) {
        toggleSeatbelt();
      }
    }
  },
  false
);
