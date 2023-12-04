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
let ropeAnchor;
let pumpModels = [-2007231801, 1339433404, 1694452750, 1933174915, -462817101, -469694731];
const Wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const SetFuel = (vehicle, fuel) => {
  if (Number(fuel) && fuel >= 0 && fuel <= 100) {
    SetVehicleFuelLevel(vehicle, fuel);
    DecorSetFloat(vehicle, fuelDecor, GetVehicleFuelLevel(vehicle));
  }
};

const LoadAnimDict = async dict => {
  RequestAnimDict(dict);
  while (!HasAnimDictLoaded(dict)) {
    await Delay(0);
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

const getAttachmentPoint = entity => {
  let bone = GetPedBoneIndex(PlayerPedId(), 4089);
  return GetWorldPositionOfEntityBone(PlayerPedId(), bone);
};

const getClosestPumpHandle = () => {
  let ped = PlayerPedId();
  let pedCoords = GetEntityCoords(ped, false);
  let distance = 10.0;
  let pump = 0;

  for (let model of pumpModels) {
    console.log('ped', pedCoords.x, pedCoords.y, pedCoords.z);
    let handle = GetClosestObjectOfType(pedCoords.x, pedCoords.y, pedCoords.z, 3.0, model, false, false, false);
    console.log('handle', handle);
    if (handle !== 0) {
      console.log(handle);

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

const grabRope = pump => {
  let prop = 'w_at_scope_small';
  let anchorPos = GetEntityCoords(pump);
  ropeAnchor = CreateObject(GetHashKey(prop), anchorPos.x, anchorPos.y, anchorPos.z + 3.2, true, true, true);

  return anchorPos;
};

const createRope = () => {
  RopeLoadTextures();
  let ped = PlayerPedId();
  let pedCoords = GetEntityCoords(ped, false);
  let pedRotation = GetEntityRotation(ped, 2);
  let repoEntity;
  repoEntity = AddRope(
    pedCoords.x,
    pedCoords.y,
    pedCoords.z,
    pedRotation.x,
    pedRotation.y,
    pedRotation.z,
    7.0,
    1,
    2.0,
    0.0,
    10.0,
    1,
    1,
    1.0,
    false,
    0
  );
  return repoEntity;
};

const createNozzle = async pump => {
  let ped = PlayerPedId();

  LoadAnimDict('anim@mp_snowball');
  TaskPlayAnim(PlayerPedId(), 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
  await Delay(700);

  let prop = 'prop_cs_fuel_nozle';
  let model = GetHashKey(prop);
  RequestModel(model);
  while (!HasModelLoaded(model)) {
    await Delay(0);
  }

  pipe = CreateObject(model, 0, 0, 0, true, true, true);

  AttachEntityToEntity(
    pipe,
    ped,
    GetPedBoneIndex(ped, 0x49d9),
    0.22,
    0.05,
    0.04,
    0.0,
    90.0,
    90.0,
    true,
    true,
    false,
    true,
    1,
    true
  );

  rope = createRope();
  let anchorPos = grabRope(pump);

  //attach rope to nozzle
  pipeLocation = getAttachmentPoint(PlayerPedId());
  console.log(anchorPos);
  AttachEntitiesToRope(
    rope,
    PlayerPedId(),
    ropeAnchor,
    pipeLocation.x,
    pipeLocation.y,
    pipeLocation.z,
    anchorPos.x,
    anchorPos.y,
    anchorPos.z + 2.2,
    13.0,
    false,
    false,
    '',
    ''
  );
  await Wait(0);
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
                let pump = getClosestPumpHandle();
                console.log(pump);
                createNozzle(pump);
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
