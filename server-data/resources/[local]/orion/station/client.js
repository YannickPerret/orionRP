const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);
let playerHavePipe = false;
let pistoletObject = null;
let rope = null;
let ropeAnchor = null;
let pump = null;
const pumpModels = [-2007231801, 1339433404, 1694452750, 1933174915, -462817101, -469694731];
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
  const [offsetX, offsetY, offsetZ] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 2.0, 0.0);
  const [playerCoordsX, playerCoordsY, playerCoordsZ] = GetEntityCoords(PlayerPedId(), false);
  let rayHandle = CastRayPointToPoint(
    playerCoordsX,
    playerCoordsY,
    playerCoordsZ - 1.3,
    offsetX,
    offsetY,
    offsetZ,
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
  let pumph = 0;

  for (let model of pumpModels) {
    let handle = GetClosestObjectOfType(playerX, playerY, playerZ, 2.0, model, false, false, false);
    if (handle !== 0) {
      const [objCoordsX, objCoordsY, objcoordsZ] = GetEntityCoords(handle);
      let objDistance = GetDistanceBetweenCoords(playerX, playerY, playerZ, objCoordsX, objCoordsY, objcoordsZ, true);
      if (objDistance < distance) {
        distance = objDistance;
        pumph = handle;
      }
    }
  }
  return pumph;
};

const createRopeAnchor = () => {
  const prop = 'w_at_scope_small';
  const [pumpPosX, pumpPosY, pumpPosZ] = GetEntityCoords(pump);
  ropeAnchor = CreateObject(GetHashKey(prop), pumpPosX, pumpPosY, pumpPosZ + 3.2, true, true, true);

  return { x: pumpPosX, y: pumpPosY, z: pumpPosZ };
};

const createRope = async () => {
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

const createNozzle = async () => {
  let ped = PlayerPedId();

  LoadAnimDict('anim@mp_snowball');
  TaskPlayAnim(ped, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
  await Delay(700);

  let pistoletProps = 'prop_cs_fuel_nozle';
  let model = GetHashKey(pistoletProps);
  RequestModel(model);
  while (!HasModelLoaded(model)) {
    await Delay(0);
  }

  pistoletObject = CreateObject(model, 0, 0, 0, true, true, true);

  AttachEntityToEntity(
    pistoletObject,
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

  rope = await createRope();

  const anchorPos = createRopeAnchor();

  //attach rope to nozzle
  const [pistoletPositionX, pistoletPositionY, pistoletPositionZ] = getAttachmentPoint(ped);

  AttachEntitiesToRope(
    rope,
    pump,
    GetPedBoneIndex(ped, 0x49d9),
    anchorPos.x,
    anchorPos.y,
    anchorPos.z + 1.45,
    pistoletPositionX,
    pistoletPositionY,
    pistoletPositionZ,
    true,
    true,
    false,
    true,
    1,
    true
  );
  await Wait(0);
};

// attach nozzle to vehicle.
const putPipeInVehicle = (vehicle, ptankBone, isBike, dontClear, newTankPosition) => {
  if (isBike) {
    AttachEntityToEntity(
      pistoletObject,
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
      pistoletObject,
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
  DetachEntity(pistoletObject, true, true);
  DeleteEntity(pistoletObject);
};

// delete nozzle and rope, and hide ui.
const returnPipeToPump = async () => {
  let ped = PlayerPedId();
  LoadAnimDict('anim@mp_snowball');
  TaskPlayAnim(ped, 'anim@mp_snowball', 'pickup_snowball', 2.0, 8.0, -1, 50, 0, 0, 0, 0);
  await Delay(700);
  DeleteEntity(pistoletObject);
  RopeUnloadTextures();
  DeleteRope(rope);
  ClearPedTasks(ped);
};

(async () => {
  for (const station of gazStationsBlips.GasStations) {
    createBlip(station.coordinates, 361, 0, 'Station essence');
  }

  while (true) {
    await Wait(0);
    const playerPed = PlayerPedId();
    const playerCoords = GetEntityCoords(playerPed, false);

    for (const station of gazStationsBlips.GasStations) {
      for (const pumpCoords of station.pumps) {
        const distance = GetDistanceBetweenCoords(
          playerCoords[0],
          playerCoords[1],
          playerCoords[2],
          pumpCoords.X,
          pumpCoords.Y,
          pumpCoords.Z,
          true
        );

        if (distance <= 2 && !IsPedInAnyVehicle(playerPed, false)) {
          handlePumpInteraction(playerPed, pumpCoords);
        }
      }
    }
    let vehicle = vehicleInFront();

    if (playerHavePipe && vehicle) {
      handleVehicleInteraction(vehicle);
    }
  }
})();

const handlePumpInteraction = (playerPed, pumpCoords) => {
  if (!playerHavePipe) {
    emit('orion:showText', 'Appuyez sur ~g~E~w~ pour prendre une pompe');
    if (IsControlJustReleased(0, 38)) {
      // 38 est le code pour la touche E
      playerHavePipe = true;
      pump = getClosestPumpHandle();
      createNozzle(pump);
    }
  } else {
    emit('orion:showText', 'Appuyez sur ~g~E~w~ pour ranger la pompe');
    if (IsControlJustReleased(0, 38)) {
      playerHavePipe = false;
      returnPipeToPump();
    }
  }
};

const handleVehicleInteraction = vehicle => {
  emit('orion:showText', 'Appuyez sur ~g~E~w~ pour mettre la pompe dans le véhicule');
  if (IsControlJustReleased(0, 38)) {
    // 38 est le code pour la touche E
    putPipeInVehicle(vehicle, 0x4d36b5e0, false, false, { x: 0.0, y: 0.0, z: 0.0 });
  }
};

setInterval(updateRopePosition, 100);

function updateRopePosition() {
  if (playerHavePipe && rope) {
    const ped = PlayerPedId();
    const [playerX, playerY, playerZ] = GetEntityCoords(ped, false);
    const [pumpX, pumpY, pumpZ] = GetEntityCoords(pump);

    const [nozzleX, nozzleY, nozzleZ] = GetOffsetFromEntityInWorldCoords(pistoletObject, 0.0, -0.033, -0.195);
    AttachEntitiesToRope(
      rope,
      pump,
      pistoletObject,
      pumpX,
      pumpY,
      pumpZ + 1.45,
      nozzleX,
      nozzleY,
      nozzleZ,
      5.0,
      false,
      false,
      null,
      null
    );
  }
}
