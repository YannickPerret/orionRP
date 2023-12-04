const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);
var playerHavePipe = false;
var pipeProps = null;
var pedCoords;

let pipeInVehicle = false;
let vehicleFueling = false;
let usedPump;
let pipe;
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
  const [playerX, playerY, playerZ] = GetEntityCoords(ped, false);
  let distance = 10.0;
  let pump = 0;

  for (let model of pumpModels) {
    let handle = GetClosestObjectOfType(playerX, playerY, playerZ, 2.0, model, false, false, false);
    if (handle !== 0) {
      const [objCoordsX, objCoordsY, objcoordsZ] = GetEntityCoords(handle);
      let objDistance = GetDistanceBetweenCoords(playerX, playerY, playerZ, objCoordsX, objCoordsY, objcoordsZ, true);
      if (objDistance < distance) {
        distance = objDistance;
        pump = handle;
      }
    }
  }
  return pump;
};

const grabRope = pump => {
  const prop = 'w_at_scope_small';
  const [pumpPosX, pumpPosY, pumpPosZ] = GetEntityCoords(pump);
  ropeAnchor = CreateObject(GetHashKey(prop), pumpPosX, pumpPosY, pumpPosZ + 3.2, true, true, true);

  return { x: pumpPosX, y: pumpPosY, z: pumpPosZ };
};

const createRope = async pump => {
  RopeLoadTextures();
  let ped = PlayerPedId();
  const [playerX, playerY, playerZ] = GetEntityCoords(ped, false);
  const [pedRotationX, pedRotationY, pedRotationZ] = GetEntityRotation(ped, 2);
  let repoEntity;
  repoEntity = AddRope(
    playerX,
    playerY,
    playerZ,
    pedRotationX,
    pedRotationY,
    pedRotationZ,
    7.0,
    1,
    2.0,
    0.0,
    10.0,
    1,
    1,
    1.0,
    false,
    false
  );

  while (!pump) {
    await Delay(0);
  }
  ActivatePhysics(repoEntity);
  await Wait(50);
  return repoEntity;
};

const createNozzle = async pump => {
  let ped = PlayerPedId();

  LoadAnimDict('anim@mp_snowball');
  TaskPlayAnim(ped, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
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

  //isok

  rope = await createRope(pump);

  const anchorPos = grabRope(pump);

  //attach rope to nozzle
  const [pipeLocationX, pipeLocationY, pipeLocationZ] = getAttachmentPoint(ped);

  AttachEntitiesToRope(
    rope,
    ped,
    ropeAnchor,
    anchorPos.x,
    anchorPos.y,
    anchorPos.z,

    pipeLocationX,
    pipeLocationY,
    pipeLocationZ,
    5.0,
    false,
    false,
    null,
    null
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
  DetachEntity(pipe, true, true);
  DeleteEntity(pipe);
};

// delete nozzle and rope, and hide ui.
const returnPipeToPump = async () => {
  LoadAnimDict('anim@mp_snowball');
  TaskPlayAnim(playerPed, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
  await Delay(700);
  DeleteEntity(pipe);
  RopeUnloadTextures();
  DeleteRope(rope);
  ClearPedTasks(playerPed);
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
                await createNozzle(pump);
              }
            } else {
              emit('orion:showText', 'Appuyez sur ~g~E~w~ pour ranger la pompe');
              if (IsControlJustReleased(0, 38)) {
                playerHavePipe = false;
                await returnPipeToPump();
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
