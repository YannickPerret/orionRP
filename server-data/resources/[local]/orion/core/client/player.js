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
        console.log(targetPlayerId, "targetPed", targetPed);

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

exports('getPlayer', () => {
  return PlayerId();
});

exports('getPlayerServerId', () => {
  return GetPlayerServerId(PlayerId());
});