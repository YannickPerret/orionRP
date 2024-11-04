let isTargetModeActive = false;
let currentTarget = null;
let listSprite = [];


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

drawTarget = async () => {
    await exports['orionCore'].LoadTextureDict('shared')
    let sleepTime;
    let r, g, b, a;

    while (isTargetModeActive) {
        sleepTime = 500;
        for (const zone of listSprite) {
            sleepTime = 0;
            SetDrawOrigin(zone.center.x, zone.center.y, zone.center.z, 0);
            DrawSprite('shared', 'emptydot_32', 0, 0, 0.01, 0.02, 0, r, g, b, a);
            ClearDrawOrigin();
        }
        await exports['orionCore'].Delay(sleepTime);
    }
    listSprite = [];
}

const checkBones = (coords, entity, bonelist) => {
    let closestBone = -1;
    let closestDistance = 20;
    let closestPos, closestBoneName;

    for (const v of bonelist) {
        if (config.targetMenu.boneList.option[v]) {  // Vérifie si l'os est dans la liste d'options
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


const detectTarget = async () => {
    const { entityHit, entityType } = await exports['orionCore'].raycastCamera(30);
    let actions = [];

    if (entityHit) {
        const coords = GetEntityCoords(PlayerPedId(), true);
        let boneData = null;

        if (entityType === 2) {
            boneData = checkBones(coords, entityHit, config.targetMenu.boneList.vehicle);
        }

        const targetActions = config.targetMenu.targetActions;
        if (entityType === 1) {
            actions = targetActions.player.filter(action => hasPermission(action.permission));
        } else if (entityType === 2) {
            actions = targetActions.vehicle.filter(action => hasPermission(action.permission));
        } else if (entityType === 3) {
            actions = targetActions.object.filter(action => hasPermission(action.permission));
        }

        currentTarget = { id: entityHit, type: entityType, actions, boneData };
        listSprite.push({ center: coords, targetoptions: { drawColor: [255, 0, 0, 200] } });
    } else {
        actions = config.targetMenu.targetActions.myself.filter(action => hasPermission(action.permission));
        currentTarget = { id: null, type: "myself", actions };
        listSprite.push({ center: GetEntityCoords(PlayerPedId()), targetoptions: { drawColor: [0, 255, 0, 200] } });
    }

    await drawTarget()
};


function toggleTargetMode() {
    isTargetModeActive = !isTargetModeActive;

    if (isTargetModeActive) {
        detectTarget();
        SendNuiMessage(JSON.stringify({ show: true, target: currentTarget }));
    } else {
        SendNuiMessage(JSON.stringify({ show: false }));

        if (currentTarget && currentTarget.id && config.targetMenu.EnableOutline) {
            SetEntityDrawOutline(currentTarget.id, false);
        }
    }
}

RegisterKeyMapping("playerTarget", "Toggle targeting", "keyboard", config.targetMenu.OpenKey);
RegisterCommand('playerTarget', () => toggleTargetMode());

setTick(() => {
    if (config.targetMenu.DisableControls && isTargetModeActive) {
        DisableControlAction(0, config.targetMenu.MenuControlKey, true);
    }
});