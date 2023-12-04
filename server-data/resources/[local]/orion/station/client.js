const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);
var playerHavePipe = false;
var pipeProps = null;
var pedCoords;

let pipeInVehicle = false;
let vehicleFueling = false;
let usedPump;
let pipe;
let pipeLocation;
let rope;
let pumpModels = [-2007231801, 1339433404, 1694452750, 1933174915, -462817101, -469694731, -164877493];

const Wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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
  let offset = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 2.0, 0.0);
  let playerCoords = GetEntityCoords(PlayerPedId(), false);
  let rayHandle = CastRayPointToPoint(
    playerCoords.x,
    playerCoords.y,
    playerCoords.z - 1.3,
    offset.x,
    offset.y,
    offset.z,
    10,
    PlayerPedId(),
    0
  );
  let [A, B, C, D, entity] = GetRaycastResult(rayHandle);
  if (IsEntityAVehicle(entity)) {
    return entity;
  }
};

const getClosestPumpHandle = () => {
  let ped = PlayerPedId();
  let pedCoords = GetEntityCoords(ped, false);
  let pump;
  let distance = 10.0;

  for (let model of pumpModels) {
    const handle = GetClosestObjectOfType(pedCoords.x, pedCoords.y, pedCoords.z, 2.0, model, false, false, false);
    if (handle !== 0) {
      let objcoords = GetEntityCoords(handle);
      let objDistance = GetDistanceBetweenCoords(
        pedCoords.x,
        pedCoords.y,
        pedCoords.z,
        objcoords.x,
        objcoords.y,
        objcoords.z,
        true
      );
      if (objDistance < distance) {
        distance = objDistance;
        pump = handle;
      }
    }
  }
  return pump;
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

  rope = AddRope(pump.x, pump.y, pump.z, 0.0, 0.0, 0.0, 6.0, 1, 1000.0, 0.0, 1.0, false, false, false, 1.0, true);
  console.log('rope', rope);

  while (!rope) {
    await Delay(0);
  }
  ActivatePhysics(rope);
  await Delay(50);

  //pipeLocation = GetEntityCoords(pipeProps);

  pipeLocation = GetOffsetFromEntityInWorldCoords(pipeProps, 0.0, -0.033, -0.195);

  pumpHandle = getClosestPumpHandle(GetEntityCoords(ped, false));

  console.log(pumpHandle);

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

  pipeInVehicle = false;
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
  pipeInVehicle = false;
  vehicleFueling = false;
};

// attach nozzle to vehicle.
const putPipeInVehicle = (vehicle, ptankBone, isBike, dontClear, newTankPosition) => {
  if (isBike) {
    AttachEntityToEntity(
      pipe,
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
      pipe,
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
  if (IsEntityPlayingAnim(ped, 'timetable@gardener@filling_can', 'gar_ig_5_filling_can', 3)) {
    ClearPedTasks(ped);
  }

  pipeInVehicle = true;
  wastingFuel = false;
  vehicleFueling = vehicle;
};

const dropPipe = () => {
  DetachEntity(pipeProps, true, true);
  DeleteEntity(pipeProps);
  playerHavePipe = false;
  pipeInVehicle = false;
  vehicleFueling = false;
};

// delete nozzle and rope, and hide ui.
const returnPipeToPump = () => {
  DeleteEntity(pipe);
  RopeUnloadTextures();
  DeleteRope(rope);
  playerHavePipe = false;
  pipeInVehicle = false;
  vehicleFueling = false;
};

(async () => {
  for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
    const station = gazStationsBlips.GasStations[i];
    createBlip(station.coordinates, 361, 0, 'Station essence');
  }

  while (true) {
    console.log(getClosestPumpHandle());
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

        if (distance <= 2) {
          if (!IsPedInAnyVehicle(PlayerPedId(), false)) {
            if (!playerHavePipe) {
              emit('orion:showText', 'Appuyez sur ~g~E~w~ pour prendre une pompe');

              if (IsControlJustReleased(0, 38)) {
                playerHavePipe = true;
                grabPipeFromPump(playerPed, stationPumpCoords);
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

    if (playerHavePipe && vehicleInFront()) {
      emit('orion:showText', 'Appuyez sur ~g~E~w~ pour mettre la pompe dans le véhicule');
      if (IsControlJustReleased(0, 38)) {
        putPipeInVehicle(vehicleInFront(), 0x4d36b5e0, false, false, { x: 0.0, y: 0.0, z: 0.0 });
      }
    }
  }
})();

async(() => {
  let pump = getClosestPumpHandle();
  if (pump) {
    console.log(pump);
  }
})();
