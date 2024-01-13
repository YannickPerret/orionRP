(async () => {
    let dict = 'Shared'
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
    let targetOpen = false;

    let currentTarget = {}
    let keyToOpen = 'LMENU'
    let menuControlKey = 238
    let isInteract = false;
    let targetModelsArray = []
    let targetPedsArray = []
    let targetVehiclesArray = []
    let targetObjectsArray = []
    let targetPlayersArray = []
    let targetOtherPlayersArray = []
    let targetInAVehicleArray = []


    //events
    onNet('orion:target:c:registerNewOptions', (type, options = []) => {
        options.forEach((option) => {
            if (type == 'otherPlayer') {
                targetOtherPlayersArray.push(option)
            }
            if (type == 'ped') {
                targetPedsArray.push(option)
            }
            if (type == 'vehicle') {
                targetVehiclesArray.push(option)
            }
            if (type == 'object') {
                targetObjectsArray.push(option)
            }
            if (type == 'all') {
                targetModelsArray.push(options)
            }
            if (type == 'player') {
                targetPlayersArray.push(option)
            }
            if (type == 'inVehicle') {
                targetInAVehicleArray.push(option)
            }


        })
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
    const rayCastGamePlayCamera = async (distance) => {
        let cameraRotation = GetGameplayCamRot();
        let cameraCoord = GetGameplayCamCoord();
        let direction = RotationToDirection(cameraRotation);
        let destination = {
            x: cameraCoord[0] + direction.x * distance,
            y: cameraCoord[1] + direction.y * distance,
            z: cameraCoord[2] + direction.z * distance
        }
        let [a, hit, coords, d, entity] = GetShapeTestResult(StartShapeTestRay(cameraCoord[0], cameraCoord[1], cameraCoord[2], destination.x, destination.y, destination.z, -1, PlayerPedId(), 0));
        await exports['orion'].delay(10);
        if (exports['orion'].getDistanceBetweenCoords(coords, GetEntityCoords(PlayerPedId())) < 1.5) {
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

    const showMenuWheel = () => {
        targetOpen = true;

        SetNuiFocus(targetOpen, targetOpen)
        SetNuiFocusKeepInput(targetOpen)

        // console.log("entityOptions", entityOptions)

        SendNuiMessage(JSON.stringify({
            action: 'targetShowOptions',
            payload: {
                targetEyesHUD: targetOpen,
                targetOptions: entityOptions
            }
        }))
    }

    const close = () => {
        activeTarget = false;
        isInteract = false;
        targetOpen = false;
        entityOptions = targetValue[0];

        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)

        SendNuiMessage(JSON.stringify({
            action: 'targetShowOptions',
            payload: {
                targetEyesHUD: false,
            }
        }))
    }

    //threds
    setTick(async () => {
        if (activeTarget && !IsPauseMenuActive() && !IsPedArmed(PlayerPedId(), 6)) {
            let playerPed = PlayerPedId();
            DisableControlAction(0, 24, true)
            DisableControlAction(0, 142, true)
            //disable camera movement
            DisableControlAction(0, 1, true)
            DisableControlAction(0, 2, true)

            DisablePlayerFiring(PlayerId(), true)


            while (!HasStreamedTextureDictLoaded(dict)) {
                await exports['orion'].delay(10);
                RequestStreamedTextureDict(dict, true)
            }
            // draw sprite in middle of screen camera
            /*SetDrawOrigin(GetEntityCoords(playerPed), 0);
            DrawSprite(dict, texture, 0, 0, 0.02, 0.035, 0, 255, 255, 255, 255);
            ClearDrawOrigin();*/
            DrawSprite(dict, texture, 0.5, 0.5, 0.01, 0.01, 0, 255, 255, 255, 255)

            if (!isInteract) {

                if (IsPedInAnyVehicle(playerPed, false)) {
                    console.log("is in vehicle")
                    let playerVehicle = GetVehiclePedIsIn(playerPed, false);
                    let playerVehicleModel = GetEntityModel(playerVehicle);
                    let playerVehicleHash = GetHashKey(playerVehicleModel);
                    let playerVehicleCoords = GetEntityCoords(playerVehicle);
                    entityOptions = targetValue['inVehicle'] = {
                        id: playerVehicle,
                        model: playerVehicleModel,
                        hash: playerVehicleHash,
                        coords: playerVehicleCoords,
                        actions: targetInAVehicleArray
                    }
                }
                else {
                    let [haveHit, entityCoords, entityHit] = await rayCastGamePlayCamera(10);
                    //get type of entity and set targetValue by type
                    let entityType = GetEntityType(entityHit);

                    //console.log("entityType", entityType, "entityHit", entityHit)
                    if (haveHit) {
                        if (entityType == 0) {
                            // Nothing
                            console.log("nothing, is self player")
                            entityOptions = targetValue['player'] = {
                                id: NetworkGetNetworkIdFromEntity(playerPed),
                                name: GetPlayerName(PlayerId()),
                                coords: GetEntityCoords(playerPed),
                                actions: targetPlayersArray
                            }
                        }
                        else if (entityType == 1) {
                            // if ped, test if ped normal or player
                            let entity = NetworkGetNetworkIdFromEntity(entityHit)
                            if (entity == -1) {
                                // if ped
                                console.log("is a pnj ped")
                                entityOptions = targetValue[entityType] = {
                                    id: entity,
                                    coords: GetEntityCoords(entityHit),
                                    model: GetEntityModel(entityHit),
                                    hash: GetHashKey(GetEntityModel(entityHit)),
                                    actions: targetPedsArray
                                }
                            }
                            else {
                                // if a player
                                console.log("is a other player")
                                entityOptions = targetValue['player'] = {
                                    id: GetPlayerFromServerId(entity),
                                    coords: NetworkGetPlayerCoords(GetPlayerFromServerId(entity)),
                                    actions: targetOtherPlayersArray
                                }

                            }
                        }
                        else if (entityType == 2) {
                            // if vehicle, get vehicle model and hash
                            console.log("is a vehicle")
                            let entity = NetworkGetNetworkIdFromEntity(entityHit);
                            let entityModel = GetEntityModel(entityHit);
                            let entityHash = GetHashKey(entityModel);
                            entityOptions = targetValue[entityType] = {
                                id: entity,
                                model: entityModel,
                                hash: entityHash,
                                coords: entityCoords,
                                actions: targetVehiclesArray
                            }

                        }
                        else if (entityType == 3) {
                            // if object, know type, hash 
                            console.log("is a object")
                            let entityModel = GetEntityModel(entityHit);
                            let entityHash = GetHashKey(entityModel);

                            let targetObject = targetObjectsArray.find((object) => {
                                return object.hash.includes(entityModel)
                            })

                            if (targetObject) {
                                entityOptions = targetValue[entityType] = {
                                    actions: [targetObject],
                                    args: {
                                        id: entityHit,
                                        coords: entityCoords,
                                    },
                                }
                            }
                        }
                    }
                    else {
                        console.log("is self player")
                        entityOptions = targetValue['player'] = {
                            id: NetworkGetNetworkIdFromEntity(playerPed),
                            name: GetPlayerName(PlayerId()),
                            coords: GetEntityCoords(playerPed),
                            actions: targetPlayersArray
                        }
                    }
                    if (!isInteract && targetValue[entityType] && !targetOpen) {
                        isInteract = true
                        showMenuWheel()
                    }
                }
            }
        }
        else {
            activeTarget = false;
            isInteract = false;
        }
        await exports['orion'].delay(10);
    });

    //Nui Callback
    RegisterNuiCallbackType("targetSelect")
    on("__cfx_nui:targetSelect", (data, cb) => {
        console.log("targetSelect", data)
        if (data.action) {
            if (data.action.type == 'client') {
                console.log(data)
                emit(data.action.event, data.args)
            }
            else if (data.action.type == 'server') {
                emitNet(data.action.event)
            }
            else if (data.action.type == 'command') {
                ExecuteCommand(data.action.event)
            }
            else {
                console.log("no action")
                cb({ ok: false })
            }
        }

        close()
        cb({ ok: true })
    });

    RegisterNuiCallbackType("Close")
    on("__cfx_nui:Close", (data, cb) => {
        close()
        cb({ ok: true })
    });

    // Register commande
    RegisterKeyMapping("playerTarget", "Toggle targeting", "keyboard", keyToOpen)
    RegisterCommand('playerTarget', function (source, args) {
        activeTarget = !activeTarget
        if (!activeTarget) {
            close()
        }
    })

})();   