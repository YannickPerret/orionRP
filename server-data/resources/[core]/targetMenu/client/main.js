let isTargetModeActive = false;
let currentTarget = null;
const dict = 'Shared'
const texture = 'emptydot_32'
let isMenuOpen = false;



const hasPermission = (permission) => {
    const playerState = Entity(PlayerPedId()).state;

    if (!permission) return true;
    const userJob = getPlayerJob();
    const userRank = playerState.role.name
    return (
        (!permission.job || permission.job === userJob) &&
        (!permission.rank || permission.rank === userRank)
    );
};

const hasRole = (requiredRole) => {
    //const userRole = getPlayerRole();
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
        (async () => {
            DisableControlAction(0, 1, true);
            DisableControlAction(0, 2, true);
            DisablePlayerFiring(PlayerPedId(), true);
            DisableControlAction(0, 24, true);  // Désactiver l'attaque (clic gauche)
            DisableControlAction(0, 25, true);  // Désactiver le ciblage (clic droit)
            DisableControlAction(0, 142, true); // Désactiver l'attaque de mêlée alternative
            DisableControlAction(0, 257, true); // Désactiver l'attaque 2
            DisableControlAction(0, 263, true); // Désactiver la mêlée
            DisableControlAction(0, 140, true); // Désactiver l'attaque de mêlée légère
            DisableControlAction(0, 141, true); // Désactiver l'attaque de mêlée lourde
            DisableControlAction(0, 143, true); // Désactiver l'attaque de mêlée
            HideHudComponentThisFrame(14);

            const { entityHit, entityType, endCoords } = await exports['orionCore'].RaycastCamera(30);
            let actions = [];

            if (entityHit && entityHit !== 0) {
                const coords = GetEntityCoords(PlayerPedId(), true);
                let boneData = null;

                const targetActions = config.targetMenu.targetActions;
                if (entityType === 1) { // Joueur
                    actions = targetActions.player.filter(action => hasPermission(action.permission));
                    currentTarget = { id: entityHit, type: entityType, actions };
                } else if (entityType === 2) { // Véhicule
                    boneData = checkBones(coords, entityHit, config.targetMenu.boneList.vehicle);
                    actions = targetActions.vehicle.filter(action => hasPermission(action.permission));
                    currentTarget = { id: entityHit, type: entityType, actions, boneData };
                } else if (entityType === 3) { // Objet
                    const modelHash = GetEntityModel(entityHit);
                    actions = targetActions.object.filter(action => {
                        return action.props && action.props.some(propName => GetHashKey(propName) === modelHash);
                    });

                    if (actions.length > 0) {
                        currentTarget = { id: entityHit, type: entityType, actions };
                    }
                }
            } else {
                actions = config.targetMenu.targetActions.myself;
                currentTarget = { id: null, type: "myself", actions };
            }

            if (actions.length > 0) {
                openTargetMode();
                SendNuiMessage(JSON.stringify({
                    app: "targetMenu",
                    method: "updateTargetData",
                    data: { target: currentTarget },
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
    //SetNuiFocusKeepInput(true);
    SetCursorLocation(0.5, 0.5);
    SendNuiMessage(JSON.stringify({
        app: "targetMenu",
        method: "openTargetMenu",
        data: { show: true, target: currentTarget },
    }));
    isMenuOpen = true;
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
}

RegisterNuiCallbackType('handleAction');
on('__cfx_nui:handleAction', (data, cb) => {
    const { action, targetId, targetType } = data;
    closeTargetMode();
    isTargetModeActive = false;

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