// resources/[core]/targetMenu/client/main.js

let isTargetModeActive = false;
let currentTarget = null;
const dict = 'Shared';
const texture = 'emptydot_32';
let isMenuOpen = false;
let controlDisabler = null;

const hasPermission = (permission) => {
    const playerState = Entity(PlayerPedId()).state;

    if (!permission) return true;
    const userJob = getPlayerJob();
    const userRank = playerState.role.name;
    return (
        (!permission.job || permission.job === userJob) &&
        (!permission.rank || permission.rank === userRank)
    );
};

const hasRole = (requiredRole) => {
    // const userRole = getPlayerRole();
    return !requiredRole || requiredRole === userRole;
};

const checkBones = (coords, entity, bonelist) => {
    let closestBone = -1;
    let closestDistance = 20;
    let closestPos, closestBoneName;

    for (const v of bonelist) {
        if (config.targetMenu.boneList.option[v]) {
            const boneId = GetEntityBoneIndexByName(entity, v);
            const bonePos = GetWorldPositionOfEntityBone(entity, boneId);
            const distance = Vdist(coords[0], coords[1], coords[2], bonePos[0], bonePos[1], bonePos[2]);
            if (closestBone === -1 || distance < closestDistance) {
                closestBone = boneId;
                closestDistance = distance;
                closestPos = bonePos;
                closestBoneName = v;
            }
        }
    }
    return closestBone !== -1 ? { boneId: closestBone, position: closestPos, boneName: closestBoneName } : false;
};

RegisterKeyMapping("playerTarget", "Toggle targeting", "keyboard", config.targetMenu.OpenKey);
RegisterCommand('playerTarget', async function (source, args) {
    if (isTargetModeActive) {
        isTargetModeActive = false;
        closeTargetMode();
    } else {
        isTargetModeActive = true;

        // Fonction anonyme pour détecter la cible
        await (async () => {
            const playerPed = PlayerPedId();
            const coords = GetEntityCoords(playerPed, true);

            const {entityHit, entityType, endCoords} = await exports['orionCore'].RaycastCamera(30);
            let actions = [];

            if (entityHit && entityHit !== 0) {
                let boneData = null;

                const targetActions = config.targetMenu.targetActions;
                if (entityType === 1) { // Joueur
                    actions = targetActions.player.filter(action => hasPermission(action.permission));
                    currentTarget = {id: entityHit, type: entityType, actions};
                } else if (entityType === 2) { // Véhicule
                    boneData = checkBones(coords, entityHit, config.targetMenu.boneList.vehicle);
                    actions = targetActions.vehicle.filter(action => hasPermission(action.permission));
                    currentTarget = {id: entityHit, type: entityType, actions, boneData};
                } else if (entityType === 3) { // Objet
                    const modelHash = GetEntityModel(entityHit);
                    actions = targetActions.object.filter(action => {
                        return action.props && action.props.some(propName => GetHashKey(propName) === modelHash);
                    });

                    if (actions.length > 0) {
                        currentTarget = {id: entityHit, type: entityType, actions};
                    }
                }
            } else {
                actions = config.targetMenu.targetActions.myself;
                currentTarget = {id: null, type: "myself", actions};
            }

            if (actions.length > 0) {
                openTargetMode();
                SendNuiMessage(JSON.stringify({
                    app: "targetMenu",
                    method: "updateTargetData",
                    data: {target: currentTarget},
                }));
            } else {
                console.log("Aucune entité détectée ou aucune action disponible.");
                isTargetModeActive = false;
            }
        })();
    }
});

function openTargetMode() {
    if (isMenuOpen) return;
    SetNuiFocus(true, true);
    SetNuiFocusKeepInput(true); // Permet au jeu de recevoir les entrées clavier
    SetCursorLocation(0.5, 0.5);
    SendNuiMessage(JSON.stringify({
        app: "targetMenu",
        method: "openTargetMenu",
        data: { show: true, target: currentTarget },
    }));
    isMenuOpen = true;

    // Démarrer la désactivation des contrôles
    startControlDisabler();
}

function closeTargetMode() {
    if (!isMenuOpen) return;
    SetNuiFocus(false, false);
    SendNuiMessage(JSON.stringify({
        app: "targetMenu",
        method: "openTargetMenu",
        data: { show: false },
    }));
    if (currentTarget && currentTarget.id && config.targetMenu.EnableOutline) {
        SetEntityDrawOutline(currentTarget.id, false);
    }
    isMenuOpen = false;
    isTargetModeActive = false;

    // Arrêter la désactivation des contrôles
    if (controlDisabler) {
        clearTick(controlDisabler);
        controlDisabler = null;
    }
}

function startControlDisabler() {
    if (controlDisabler) return; // Évite de créer plusieurs ticks
    controlDisabler = setTick(() => {
        if (!isMenuOpen) {
            clearTick(controlDisabler);
            controlDisabler = null;
            return;
        }
        // Désactiver les contrôles de la caméra et des attaques
        DisableControlAction(0, 1, true);  // LookLeftRight
        DisableControlAction(0, 2, true);  // LookUpDown
        DisableControlAction(0, 24, true); // Attack
        DisableControlAction(0, 25, true); // Aim
        DisableControlAction(0, 68, true); // VehicleAttack
        DisableControlAction(0, 69, true); // VehicleAttack2
        DisableControlAction(0, 70, true); // Vehicle Aim
        DisableControlAction(0, 91, true); // PassengerAim
        DisableControlAction(0, 92, true); // PassengerAttack
        DisableControlAction(0, 257, true); // Attack2
        DisableControlAction(0, 263, true); // MeleeAttack1
        DisableControlAction(0, 264, true); // MeleeAttack2
        DisableControlAction(0, 331, true); // Phone
        // Vous pouvez ajouter d'autres contrôles à désactiver si nécessaire
    });
}

RegisterNuiCallbackType('handleAction');
on('__cfx_nui:handleAction', (data, cb) => {
    const { action, targetId, targetType } = data;
    closeTargetMode();

    if (action) {
        if (action.type === 'client') {
            console.log('Client action:', action.event);
            emit(action.event, action.args);
        } else if (action.type === 'server') {
            console.log('Server action:', action.event);
            emitNet(action.event, action.args);
        } else if (action.type === 'command') {
            console.log('Command action:', action.event);
            ExecuteCommand(action.event);
        } else {
            console.log('No action type matched');
            cb({ ok: false });
            return;
        }
    } else {
        console.log('No action provided');
        cb({ ok: false });
        return;
    }
    cb({ ok: true });
});

on('ResourceStop', () => {
    closeTargetMode();
    isTargetModeActive = false;
});
