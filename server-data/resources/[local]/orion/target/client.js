(async () => {
    let dict = 'shared'
    let texture = 'emptydot_32'
    let player = exports['orion'].getPlayerData()
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
            let [haveHit, entityCoords, entityHit] = getEntityTargeted(15);
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

    //function
    const getEntityTargeted = (distance) => {
        const [rayPos, rayDir] = ScreenPositionToCameraRay();
        const destination = rayPos + distance * rayDir;
        const rayHandle = StartShapeTestLosProbe(rayPos.x, rayPos.y, rayPos.z, destination.x, destination.y, destination.z, -1, PlayerPedId(), 0);
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
        console.log("dddd")
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