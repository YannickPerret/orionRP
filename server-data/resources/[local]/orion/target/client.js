(async () => {
    let dict = 'shared'
    let texture = 'emptydot_32'
    let targetValue = {
        [0]: {},
        [1]: {},
        [2]: {},
        [3]: {},
        ['player']: {},
        ['inVehicle']: {}
    }
    let entityOptions = targetValue[0];

    let activeTarget = false;
    let currentTarget = {}
    let keyToOpen = 'LMENU'
    let menuControlKey = 238


    //threds
    setTick(async () => {
        if (activeTarget) {
            let playerPed = PlayerPedId();
            let [haveHit, entityCoords, entityHit] = rayCastGamePlayCamera(15);
            console.log(haveHit, entityCoords, entityHit)
            //get type of entity and set targetValue by type
            if (haveHit) {
                let entityType = GetEntityType(entityHit);
                entityOptions = targetValue[entityType];

                if (entityType == 1) {
                    // if ped, test if ped normal or player
                    let entity = NetworkGetPlayerIndexFromPed(entityHit);
                    if (entity == -1) {
                        // if ped
                        entityOptions = targetValue[entityType] = {
                            id: entity,
                            name: GetPlayerName(entity),
                            coords: entityCoords
                        }
                    }
                    else {
                        // if player
                        entityOptions = targetValue['player'] = {
                            id: entity,
                            name: GetPlayerName(entity),
                            coords: entityCoords
                        }

                    }
                }

                else if (entityType == 2) {
                    // if vehicle, get vehicle model and hash

                }

                else if (entityType == 3) {
                    // if object, know type, hash 
                    entityOptions = targetValue[entityType] = {
                        id: entity,
                        hash: GetEntityModel(entityHit),
                        coords: entityCoords
                    }
                }
            }
        }
    })
    //events
    onNet('orion:target:c:registerNewOptions', (options) => {

    })

    //functions
    const getAllObjects = () => {
        return GetGamePool('CObject')
    }
    const getAllVehicles = () => {
        return GetGamePool('CVehicle')
    }
    const GetPeds = () => {
        let peds = [];
        let playerPed = PlayerPedId();
        let pools = [GetGamePool('CPed')]

        for (let i = 0; i < pools.length; i++) {
            if (pools[i] != playerPed) {
                peds.push(pools[i])
            }
        }
        return peds;
    }

    const rayCastGamePlayCamera = (distance) => {
        let cameraRotation = GetGameplayCamRot();
        let cameraCoord = GetGameplayCamCoord();
        let direction = RotationToDirection(cameraRotation);
        let destination = {
            x: cameraCoord.x + direction.x * distance,
            y: cameraCoord.y + direction.y * distance,
            z: cameraCoord.z + direction.z * distance
        }
        let [a, hit, coords, d, entity] = GetShapeTestResult(StartShapeTestRay(cameraCoord.x, cameraCoord.y, cameraCoord.z, destination.x, destination.y, destination.z, -1, PlayerPedId(), 0));
        if (exports['orion'].getDistanceBetweenCoords(cameraCoord, coords) < Range) {
            return [hit, coords, entity];
        }
        else {
            return;
        }
    }
    const RotationToDirection = (rotation) => {
        let adjustedRotation = {
            x: (Math.PI() / 180) * rotation.x,
            y: (Math.PI() / 180) * rotation.y,
            z: (Math.PI() / 180) * rotation.z
        }
        let direction = {
            x: -Math.sin(adjustedRotation.z) * Math.abs(math.cos(adjustedRotation.x)),
            y: Math.cos(adjustedRotation.z) * Math.abs(math.cos(adjustedRotation.x)),
            z: Math.sin(adjustedRotation.x)
        }
        return direction;
    }

    const getEntityTargeted = (distance) => {
        // get the entity player is looking at with camera
        const playerPed = PlayerPedId();
        let playerCoords = GetEntityCoords(playerPed);

        const [rayPos, rayDir] = ScreenPositionToCameraRay();
        const destination = rayPos + distance * rayDir;
        const rayHandle = StartShapeTestLosProbe(rayPos.x, rayPos.y, rayPos.z, destination.x, destination.y, destination.z, -1, playerPed, 0);

        let [result, hit, endCoords, surface, entityHit] = GetShapeTestResult(rayHandle);
        if (result !== 1) {
            return [hit, endCoords, entityHit];
        }
        else {
            return;
        }
    }

    const showEyesTarget = () => {

    }


    // Register commande
    RegisterKeyMapping("playerTarget", "Toggle targeting", "keyboard", keyToOpen)
    RegisterCommand('playerTarget', function (source, args) {
        activeTarget = !activeTarget
        if (activeTarget) {
            SetNuiFocus(true, true)
        }
        else {
            SetNuiFocus(false, false)
        }
        SendNuiMessage(JSON.stringify({
            action: 'showTarget',
            payload: {
                activeTarget: activeTarget,
                targetValue: targetValue
            }
        }))
    })

})();   