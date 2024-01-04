
(async () => {
  function delay(ms) { return new Promise(res => { setTimeout(res, ms); }); }

  function getEntityInFrontOfPlayer(player, distance, type) {
    const [x, y, z] = GetEntityCoords(player, true);
    const [forwardX, forwardY, forwardZ] = GetEntityForwardVector(player);
    const endX = x + forwardX * distance;
    const endY = y + forwardY * distance;
    const endZ = z + forwardZ * distance;
    const rayHandle = StartShapeTestRay(x, y, z, endX, endY, endZ, type, player, 0);
    const [hit, endCoords, surfaceNormal, entity] = GetShapeTestResult(rayHandle);
    return hit ? entity : null;
  }

  exports('getPedInFront', (player, distance = 10.0) => {
    return getEntityInFrontOfPlayer(player, distance, 8); // 8 pour les peds
  });

  function getVehicleInFront(player, distance = 10.0) {
    return getEntityInFrontOfPlayer(player, distance, 10); // 10 pour les véhicules
  }

  function createBlip(coords, sprite, color, text) {
    let blip = AddBlipForCoord(coords.X, coords.Y, coords.Z);
    SetBlipSprite(blip, sprite);
    SetBlipDisplay(blip, 4);
    SetBlipScale(blip, 0.9);
    SetBlipColour(blip, color);
    SetBlipAsShortRange(blip, true);

    if (text) {
      BeginTextCommandSetBlipName('STRING');
      AddTextComponentSubstringPlayerName(text);
      EndTextCommandSetBlipName(blip);
    }
    return blip;
  }

  const waitingLoader = (time) => {
    let interval = setInterval(() => {
      //draw charging bar circle thing 
      DrawRect(0.5, 0.5, 0.1, 0.1, 255, 255, 255, 255);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
    }, time);
  }

  const createMarker = (type, coords, scale, color) => {
    DrawMarker(type, coords.X, coords.Y, coords.Z, 0, 0, 0, 0, 0, 0, scale, scale, scale, color.r, color.g, color.b, color.a, false, false, 2, false, false, false, false);
  }

  exports('createMarker', createMarker);
  exports('waitingLoader', waitingLoader);
  exports('createBlip', createBlip);
  exports('delay', delay);
  exports('getVehicleInFront', getVehicleInFront);

})()
