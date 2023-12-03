const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);
var playerHavePipe = false;
var pipeProps = null;
var fuelDecor = '_ANDY_FUEL_DECORE_';

let pipeDropped = false;
let holdingPipe = true;
let pipeInVehicle = false;
let vehicleFueling = false;
let usedPump;
let pump;
let pipe;
let pipeLocation;

const SetFuel = (vehicle, fuel) => {
  if (Number(fuel) && fuel >= 0 && fuel <= 100) {
    SetVehicleFuelLevel(vehicle, fuel);
    DecorSetFloat(vehicle, fuelDecor, GetVehicleFuelLevel(vehicle));
  }
};

const LoadAnimDict = async dict => {
  if (!HasAnimDictLoaded(dict)) {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await Delay(1);
    }
  }
};

const vehicleInFront = () => {
  let offset = GetOffsetFromEntityInWorldCoords(ped, 0.0, 2.0, 0.0);
  let rayHandle = CastRayPointToPoint(
    pedCoords.x,
    pedCoords.y,
    pedCoords.z - 1.3,
    offset.x,
    offset.y,
    offset.z,
    10,
    ped,
    0
  );
  let [A, B, C, D, entity] = GetRaycastResult(rayHandle);
  if (IsEntityAVehicle(entity)) {
    return entity;
  }
};

const grabPipeFromPump = async (ped, pump) => {
  LoadAnimDict('anim@am_hold_up@male');
  TaskPlayAnim(ped, 'anim@am_hold_up@male', 'shoplift_high', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
  await Delay(300);
  pipeProps = CreateObject(`prop_cs_fuel_nozle`, 0, 0, 0, true, true, true);
  AttachEntityToEntity(
    pipeProps,
    ped,
    GetPedBoneIndex(ped, 0x49d9),
    0.11,
    0.02,
    0.02,
    -80.0,
    -90.0,
    15.0,
    true,
    true,
    false,
    true,
    1,
    true
  );
  RopeLoadTextures();
  while (!RopeAreTexturesLoaded()) {
    await Delay(0);
  }

  RopeLoadTextures();
  while (!pump) {
    await Delay(0);
  }
  let rope = AddRope(pump.x, pump.y, pump.z, 0.0, 0.0, 0.0, 3.0, 1, 1000.0, 0.0, 1.0, false, false, false, 1.0, true);
  while (!rope) {
    await Delay(0);
  }
  ActivatePhysics(rope);
  await Delay(50);
  pipeLocation = GetEntityCoords(pipeProps);
  pipeLocation = GetOffsetFromEntityInWorldCoords(pipeProps, 0.0, -0.033, -0.195);

  pumpHandle = GetClosestObjectOfType(
    pipeLocation.x,
    pipeLocation.y,
    pipeLocation.z,
    0.8,
    -2007231801,
    true,
    true,
    true
  );

  AttachEntitiesToRope(
    rope,
    pumpHandle,
    pipeProps,
    pump.x,
    pump.y,
    pump.z + 1.45,
    pipeLocation.x,
    pipeLocation.y,
    pipeLocation.z,
    5.0,
    false,
    false,
    null,
    null
  );
  nozzleDropped = false;
  holdingNozzle = true;
  nozzleInVehicle = false;
  vehicleFueling = false;
};

//attach the nozzle to the player.
const grabExistingNozzle = ped => {
  AttachEntityToEntity(
    pipe,
    ped,
    GetPedBoneIndex(ped, 0x49d9),
    0.11,
    0.02,
    0.02,
    -80.0,
    -90.0,
    15.0,
    true,
    true,
    false,
    true,
    1,
    true
  );
  pipeDropped = false;
  holdingPipe = true;
  pipeInVehicle = false;
  vehicleFueling = false;
};

// attach nozzle to vehicle.
const putNozzleInVehicle = (vehicle, ptankBone, isBike, dontClear, newTankPosition) => {
  if (isBike) {
    AttachEntityToEntity(
      nozzle,
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
      nozzle,
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
  if (!dontClear && IsEntityPlayingAnim(ped, 'timetable@gardener@filling_can', 'gar_ig_5_filling_can', 3)) {
    ClearPedTasks(ped);
  }
  nozzleDropped = false;
  holdingNozzle = false;
  nozzleInVehicle = true;
  wastingFuel = false;
  vehicleFueling = vehicle;
};

const dropPipe = () => {
  DetachEntity(pipe, true, true);
  pipeDropped = true;
  holdingPipe = false;
  pipeInVehicle = false;
  vehicleFueling = false;
  /*SendNUIMessage({
        type = "status",
        status = false
    })*/
};

// delete nozzle and rope, and hide ui.
const returnPipeToPump = () => {
  DeleteEntity(pipe);
  RopeUnloadTextures();
  DeleteRope(rope);
  pipeDropped = false;
  holdingPipe = false;
  pipeInVehicle = false;
  vehicleFueling = false;
  /*SendNUIMessage({
        type = "status",
        status = false
    })*/
};

(async () => {
  try {
    for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
      const station = gazStationsBlips.GasStations[i];
      createBlip(station.coordinates, 361, 0, 'Station essence');
    }

    while (true) {
      await Wait(0); // Important pour éviter de surcharger le thread
      const playerPed = PlayerPedId();
      const playerCoords = GetEntityCoords(playerPed, false);

      for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
        const stationCoords = gazStationsBlips.GasStations[i].pumps;

        for (let j = 0; j < stationCoords.length; j++) {
          const stationPumpCoords = stationCoords[j];
          const distance = GetDistanceBetweenCoords(
            playerCoords[0],
            playerCoords[1],
            playerCoords[2],
            stationPumpCoords.X,
            stationPumpCoords.Y,
            stationPumpCoords.Z,
            true
          );

          if (!pipeDropped) {
            if (pipeLocation - stationPumpCoords > 6.0) {
              dropPipe();
            } else if (stationPumpCoords - playerCoords > 100.0) {
              returnPipeToPump();
            }
          }

          if (distance <= 2) {
            if (!IsPedInAnyVehicle(PlayerPedId(), false)) {
              if (!pipeProps) {
                emit('orion:showText', 'Appuyez sur ~g~E~w~ pour prendre une pompe');

                if (IsControlJustReleased(0, 38)) {
                  // DeleteEntity(pipeProps);
                  playerHavePipe = true;

                  LoadAnimDict('anim@mp_snowball');
                  TaskPlayAnim(playerPed, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
                  await Delay(700);
                  grabPipeFromPump(playerPed, stationPumpCoords);
                  ClearPedTasks(playerPed);

                  /*
                  pipeProps = CreateObject(GetHashKey('prop_gascyl_01a'), pump.x, pump.y, pump.z, true, true, true);

                  AttachEntityToEntity(
                    pipeProps,
                    playerPed,
                    GetPedBoneIndex(playerPed, 28422),
                    0.15, // Ajustez ces valeurs pour positionner correctement le tuyau
                    -0.15,
                    0,
                    0,
                    0,
                    90, // Ajustez l'angle si nécessaire
                    true,
                    true,
                    false,
                    false,
                    0,
                    true
                  );

                  // Configurez ces paramètres selon vos besoins
                  SetEntityCollision(pipeProps, true, true);
                  SetEntityDynamic(pipeProps, true);
                  SetEntityVisible(pipeProps, true, true);
                  */
                }
              } else {
                emit('orion:showText', 'Appuyez sur ~g~E~w~ pour ranger la pompe');
                if (IsControlJustReleased(0, 38)) {
                  playerHavePipe = false;
                  LoadAnimDict('anim@mp_snowball');
                  TaskPlayAnim(playerPed, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
                  await Delay(700);
                  dropPipe();
                  ClearPedTasks(playerPed);
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
})();

function DrawText3Ds(x, y, z, text) {
  // Implémentez la fonction pour afficher le texte en 3D aux coordonnées spécifiées
}

function Wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
