const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function drawText(text, x, y, scale, r, g, b, a) {
    SetTextFont(4);
    SetTextProportional(0);
    SetTextScale(scale, scale);
    SetTextColour(r, g, b, a);
    SetTextDropShadow(0, 0, 0, 0, 255);
    SetTextEdge(2, 0, 0, 0, 150);
    SetTextDropShadow();
    SetTextOutline();
    SetTextEntry("STRING");
    AddTextComponentString(text);
    DrawText(x, y);
}

function screenPositionToCameraRay() {
    const camPos = GetFinalRenderedCamCoord();
    const camRot = GetFinalRenderedCamRot(2);

    // Convert degrees to radians
    const radPitch = (camRot[0] * Math.PI) / 180.0;
    const radYaw = (camRot[2] * Math.PI) / 180.0;

    // Calculate forward direction from camera rotation
    const forwardVector = {
        x: -Math.sin(radYaw) * Math.cos(radPitch),
        y: Math.cos(radYaw) * Math.cos(radPitch),
        z: Math.sin(radPitch),
    };

    return { camPos, forwardVector };
}

async function raycastCamera(flag = -1) {
    const { camPos, forwardVector } = screenPositionToCameraRay();

    // Set destination point based on forward vector
    const destination = {
        x: camPos[0] + forwardVector.x * 16,
        y: camPos[1] + forwardVector.y * 16,
        z: camPos[2] + forwardVector.z * 16,
    };

    const rayHandle = StartShapeTestLosProbe(
        camPos[0],
        camPos[1],
        camPos[2],
        destination.x,
        destination.y,
        destination.z,
        flag,
        PlayerPedId(),
        4
    );

    while (true) {
        const [result, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle);
        if (result !== 1) {
            const playerCoords = GetEntityCoords(PlayerPedId());
            const distance = playerCoords ? GetDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], endCoords[0], endCoords[1], endCoords[2], true) : null;
            const entityType = entityHit ? GetEntityType(entityHit) : 0;

            return {
                endCoords,
                distance,
                entityHit,
                entityType,
            };
        }
        await delay(0);
    }
}

async function loadTextureDict(dict) {
    return new Promise(resolve => {
        if (HasStreamedTextureDictLoaded(dict)) {
            resolve(true);
        } else {
            RequestStreamedTextureDict(dict, true);
            let interval = setInterval(() => {
                if (HasStreamedTextureDictLoaded(dict)) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 10);
        }
    });
}

exports('Delay', delay)
exports('DrawText', drawText)
exports('RaycastCamera', raycastCamera)
exports('LoadTextureDict', loadTextureDict)