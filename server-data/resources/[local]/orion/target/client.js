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
            x: cameraCoord[0] + direction.x * distance,
            y: cameraCoord[1] + direction.y * distance,
            z: cameraCoord[2] + direction.z * distance
        }
        let [a, hit, coords, d, entity] = GetShapeTestResult(StartShapeTestRay(cameraCoord.x, cameraCoord.y, cameraCoord.z, destination.x, destination.y, destination.z, -1, PlayerPedId(), 0));
        if (exports['orion'].getDistanceBetweenCoords(cameraCoord, coords) < distance) {
            return [hit, coords, entity];
        }
        else {
            return [0, [0, 0, 0], 0];
        }
    }
    const RotationToDirection = (rotation) => {
        let adjustedRotation = {
            x: (Math.PI / 180) * rotation[0],
            y: (Math.PI / 180) * rotation[1],
            z: (Math.PI / 180) * rotation[2]
        }
        let direction = {
            x: -Math.sin(adjustedRotation.z) * Math.abs(Math.cos(adjustedRotation.x)),
            y: Math.cos(adjustedRotation.z) * Math.abs(Math.cos(adjustedRotation.x)),
            z: Math.sin(adjustedRotation.x)
        }
        return direction;
    }

    const showEyesTarget = (activeTarget, targetValue) => {
        SetNuiFocus(activeTarget, activeTarget)

        SendNuiMessage(JSON.stringify({
            action: 'showTarget',
            payload: {
                activeTarget: activeTarget,
                targetValue: targetValue
            }
        }))
    }

    //threds
    setTick(async () => {
        if (activeTarget) {
            let playerPed = PlayerPedId();
            let [haveHit, entityCoords, entityHit] = rayCastGamePlayCamera(15);
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
        await exports['orion'].delay(100);
    })

    // Register commande
    RegisterKeyMapping("playerTarget", "Toggle targeting", "keyboard", keyToOpen)
    RegisterCommand('playerTarget', function (source, args) {
        activeTarget = !activeTarget
        console.log(activeTarget)
    })

})();   