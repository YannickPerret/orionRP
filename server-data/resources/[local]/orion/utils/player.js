const getCurrentPlayerBySource = source => {
  return PlayerManager.getPlayerBySource(source);
};

exports('GetEntInFrontOfPlayer', (Distance, Ped) => {
  let CoA = GetEntityCoords(Ped, true);
  let CoB = GetOffsetFromEntityInWorldCoords(Ped, 0.0, Distance, 0.0);
  let RayHandle = StartShapeTestRay(CoA[0], CoA[1], CoA[2], CoB[0], CoB[1], CoB[2], -1, Ped, 0);
  let A,
    B,
    C,
    D,
    Ent = GetRaycastResult(RayHandle);
  return Ent;
});

//Camera's coords
function GetCoordsFromCam(distance) {
  let rot = GetGameplayCamRot(2);
  let coord = GetGameplayCamCoord();

  let tZ = rot[2] * 0.0174532924;
  let tX = rot[0] * 0.0174532924;
  let num = Math.abs(Math.cos(tX));

  let newCoordX = coord[0] + -Math.sin(tZ) * (num + distance);
  let newCoordY = coord[1] + Math.cos(tZ) * (num + distance);
  let newCoordZ = coord[2] + Math.sin(tX) * 8.0;
  return [newCoordX, newCoordY, newCoordZ];
}

const GetPedInFront = () => {
  let player = PlayerId();
  let plyPed = GetPlayerPed(player);
  let plyPos = GetEntityCoords(plyPed, false);
  let plyOffset = GetOffsetFromEntityInWorldCoords(plyPed, 0.0, 1.3, 0.0);
  let rayHandle = StartShapeTestCapsule(
    plyPos.x,
    plyPos.y,
    plyPos.z,
    plyOffset.x,
    plyOffset.y,
    plyOffset.z,
    1.0,
    12,
    plyPed,
    7
  );
  let _,
    _,
    _,
    _,
    ped = GetShapeTestResult(rayHandle);
  return ped;
};

// Get entity's ID and coords from where player sis targeting
exports('targetPlayerAround', (Distance, Ped) => {
  let camCoords = GetGameplayCamCoord();
  let [farCoordsX, farCoordsY, farCoordsZ] = GetCoordsFromCam(Distance);
  let RayHandle = StartShapeTestRay(
    camCoords[0],
    camCoords[1],
    camCoords[2],
    farCoordsX,
    farCoordsY,
    farCoordsZ,
    -1,
    Ped,
    0
  );
  let A,
    B,
    C,
    D,
    Entity = GetRaycastResult(RayHandle);
  if (IsEntityAPed(Entity)) {
    return Entity;
  } else {
    return false;
  }
});
