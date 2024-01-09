
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

  const vehicleInFront = (playerPed, distance = 2.0) => {
    const [offsetX, offsetY, offsetZ] = GetOffsetFromEntityInWorldCoords(playerPed, 0.0, distance, 0.0);
    const [playerCoordsX, playerCoordsY, playerCoordsZ] = GetEntityCoords(playerPed, false);
    let rayHandle = CastRayPointToPoint(playerCoordsX, playerCoordsY, playerCoordsZ - 1.3, offsetX, offsetY, offsetZ, 10, playerPed, 0);
    let [A, B, C, D, entity] = GetRaycastResult(rayHandle);
    if (IsEntityAVehicle(entity)) {
      return entity;
    }
    return null
  };

  exports('getPedInFront', (player, distance = 10.0) => {
    return getEntityInFrontOfPlayer(player, distance, 8); // 8 pour les peds
  });

  function getVehicleInFront(player, distance = 10.0) {
    return getEntityInFrontOfPlayer(player, distance, 10); // 10 pour les véhicules
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

  const getRandomBetween = (min, max) => {
    if (min > max) {
      [min, max] = [max, min]; // Échange les valeurs si min est plus grand que max
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getDistanceBetweenCoords(point1, point2, useZ = true) {
    // is X ou [0] is Y ou [1] is Z ou [2]
    const x1 = point1[0] || point1.x || point1.X;
    const y1 = point1[1] || point1.y || point1.Y;
    const z1 = point1[2] || point1.z || point1.Z;
    const x2 = point2[0] || point2.x || point2.X;
    const y2 = point2[1] || point2.y || point2.Y;
    const z2 = point2[2] || point2.z || point2.Z;
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    if (!useZ) {
      return Math.sqrt(dx * dx + dy * dy);
    }
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  exports('raycastCamera', async (flag, playerCoords) => {
    const playerPed = PlayerPedId();
    if (!playerCoords) {
      playerCoords = GetEntityCoords(playerPed);
    }
    const [rayPos, rayDir] = ScreenPositionToCameraRay();
    const destination = rayPos + 16 * rayDir;
    const rayHandle = StartShapeTestLosProbe(rayPos.x, rayPos.y, rayPos.z, destination.x, destination.y, destination.z, flag || -1, playerPed, 4);

    while (true) {
      let [result, hit, endCoords, surface, entityHit] = GetShapeTestResult(rayHandle);
      if (result !== 1) {
        const distance = exports['orion'].getDistanceBetweenCoords(playerCoords, endCoords);
        if (flag === 30 && entityHit) {
          entityHit = HasEntityClearLosToEntity(entityHit, playerPed, 7) && entityHit;
        }
        let entityType = entityHit && GetEntityType(entityHit);

        if (entityType === 0 && pcall(GetEntityModel, entityHit)) {
          entityType = 3;
        }
        return [endCoords, distance, entityHit, entityType || 0];
      }
      await exports['orion'].delay(0);
    }
  })

  const handsUp = async (enable) => {
    const playerPed = PlayerPedId();
    let dict = "missminuteman_1ig_2"
    let anim = "handsup_enter"

    while (!HasAnimDictLoaded(dict)) {
      RequestAnimDict(dict);
      await delay(100);
    }

    setTick(async () => {
      await exports['orion'].delay(0);
      if (IsControlJustPressed(1, 323)) {
        if (!enable) {
          TaskPlayAnim(playerPed, dict, anim, 8.0, -8.0, -1, 50, 0, false, false, false);
        }
        else {
          ClearPedTasks(playerPed);
        }
      }
    })
  }

  exports('handsUp', handsUp);
  exports('getDistanceBetweenCoords', getDistanceBetweenCoords);
  exports('getRandomBetween', getRandomBetween);
  exports('createMarker', createMarker);
  exports('waitingLoader', waitingLoader);
  exports('delay', delay);
  exports('getVehicleInFront', vehicleInFront);

})()



// a rework : 

/*
local safeZone = (1.0 - GetSafeZoneSize()) * 0.5
local timerBar = {
    baseX = 0.918,
    baseY = 0.984,
    baseWidth = 0.165,
    baseHeight = 0.035,
    baseGap = 0.038,
    titleX = 0.012,
    titleY = -0.009,
    textX = 0.0785,
    textY = -0.0165,
    progressX = 0.047,
    progressY = 0.0015,
    progressWidth = 0.0616,
    progressHeight = 0.0105,
    txtDict = "timerbars",
    txtName = "all_black_bg",
}

function DrawTimerProgressBar(idx, title, progress, titleColor, fgColor, bgColor, usePlayerStyle)
    local title = title or ""
    local titleColor = titleColor or { 255, 255, 255, 255 }
    local progress = progress or false
    local fgColor = fgColor or { 255, 255, 255, 255 }
    local bgColor = bgColor or { 255, 255, 255, 255 }
    local titleScale = usePlayerStyle and 0.465 or 0.3
    local titleFont = usePlayerStyle and 4 or 0
    local titleFontOffset = usePlayerStyle and 0.00625 or 0.0

    local yOffset = (timerBar.baseY - safeZone) - ((idx[1] or 0) * timerBar.baseGap)

    if not HasStreamedTextureDictLoaded(timerBar.txtDict) then
        RequestStreamedTextureDict(timerBar.txtDict, true)

        local t = GetGameTimer() + 5000
        
        repeat
            Citizen.Wait(0)
        until HasStreamedTextureDictLoaded(timerBar.txtDict) or (GetGameTimer() > t)
    end

    DrawSprite(timerBar.txtDict, timerBar.txtName, timerBar.baseX - safeZone, yOffset, timerBar.baseWidth, timerBar.baseHeight, 0.0, 255, 255, 255, 160)

    BeginTextCommandDisplayText("CELL_EMAIL_BCON")
    SetTextFont(titleFont)
    SetTextScale(titleScale, titleScale)
    SetTextColour(titleColor[1], titleColor[2], titleColor[3], titleColor[4])
    SetTextRightJustify(true)
    SetTextWrap(0.0, (timerBar.baseX - safeZone) + timerBar.titleX)
    AddTextComponentSubstringPlayerName(title)
    EndTextCommandDisplayText((timerBar.baseX - safeZone) + timerBar.titleX, yOffset + timerBar.titleY - titleFontOffset)

    local progress = (progress < 0.0) and 0.0 or ((progress > 1.0) and 1.0 or progress)
    local progressX = (timerBar.baseX - safeZone) + timerBar.progressX
    local progressY = yOffset + timerBar.progressY
    local progressWidth = timerBar.progressWidth * progress

    DrawRect(progressX, progressY, timerBar.progressWidth, timerBar.progressHeight, bgColor[1], bgColor[2], bgColor[3], bgColor[4])
    DrawRect((progressX - timerBar.progressWidth / 2) + progressWidth / 2, progressY, progressWidth, timerBar.progressHeight, fgColor[1], fgColor[2], fgColor[3], fgColor[4])

    if idx ~= nil then
        if idx[1] then
            idx[1] = idx[1] + 1
        end
    end
end
*/