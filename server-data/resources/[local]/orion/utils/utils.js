exports("SendReactMessage", (action, data) => {
  SendNUIMessage({
    action: action,
    data: data,
  });
});

let currentResourceName = GetCurrentResourceName();

let debugIsEnabled = GetConvarInt(`${currentResourceName}-debugMode`, 0) == 1;

exports("debugPrint", (...args) => {
  if (!debugIsEnabled) return false;

  const appendStr = args.join(" ");
  const message = `[${currentResourceName}] ${appendStr}`;
  console.log(message);
});

function Delay(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

function getEntityInFrontOfPlayer(player, distance, type) {
  const [x, y, z] = GetEntityCoords(player, true);
  const [forwardX, forwardY, forwardZ] = GetEntityForwardVector(player);
  const endX = x + forwardX * distance;
  const endY = y + forwardY * distance;
  const endZ = z + forwardZ * distance;
  const rayHandle = StartShapeTestRay(
    x,
    y,
    z,
    endX,
    endY,
    endZ,
    type,
    player,
    0
  );
  const [hit, endCoords, surfaceNormal, entity] = GetShapeTestResult(rayHandle);
  return hit ? entity : null;
}

function getPedInFront(player, distance = 10.0) {
  return getEntityInFrontOfPlayer(player, distance, 8); // 8 pour les peds
}

function getVehicleInFront(player, distance = 10.0) {
  return getEntityInFrontOfPlayer(player, distance, 10); // 10 pour les véhicules
}

module.exports = { getPedInFront, getVehicleInFront };

exports("Delay", Delay);
