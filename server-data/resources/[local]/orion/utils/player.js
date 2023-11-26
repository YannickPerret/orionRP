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
    Ent = GetShapeTestResult(RayHandle);

  console.log('TEST', Ent);
  // test if entity is a ped
  if (IsEntityAPed(Ent)) {
    return Ent;
  } else {
    return false;
  }
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

exports('findNearbyPlayers', maxDistance => {
  let closestPlayerIds = [];

  const activePlayers = GetActivePlayers(); // Get the list of active players

  const playerId = PlayerPedId();
  const [playerCoordsX, playerCoordsY, playerCoordsZ] = GetEntityCoords(playerId, true);

  for (let i = 0; i < activePlayers.length; i++) {
    const serverId = activePlayers[i];
    if (NetworkIsPlayerActive(serverId)) {
      const targetPlayerId = GetPlayerServerId(serverId);

      if (targetPlayerId !== GetPlayerServerId(PlayerId())) {
        const targetPed = GetPlayerPed(targetPlayerId);
        const [targetCoordsX, targetCoordsY, targetCoordsZ] = GetEntityCoords(GetPlayerPed(serverId), true); // Get the coordinates of the target player
        const distance = GetDistanceBetweenCoords(
          playerCoordsX,
          playerCoordsY,
          playerCoordsZ,
          targetCoordsX,
          targetCoordsY,
          targetCoordsZ,
          true
        );

        if (Number(distance) <= Number(maxDistance)) {
          closestPlayerIds.push(targetPlayerId);
        }
      }
    }
  }

  return closestPlayerIds;
});
