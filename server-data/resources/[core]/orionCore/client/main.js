let playerSpawned = false

on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;

    setTick(() => {
        const playerId = PlayerId();
        SetPoliceIgnorePlayer(playerId, true);
        SetDispatchCopsForPlayer(playerId, false);
        SetMaxWantedLevel(0);
        ClearPlayerWantedLevel(playerId);
        SetPlayerHealthRechargeMultiplier(PlayerId(), config.character.healthRegen);
        NetworkSetFriendlyFireOption(true);
        SetCanAttackFriendly(PlayerPedId(), true, true);

        DisableIdleCamera(true)

        SetCanAttackFriendly(PlayerPedId(), true, false);
        SetPedDropsWeaponsWhenDead(PlayerPedId(), false);

        HideHudComponentThisFrame(3);
        HideHudComponentThisFrame(4);

        const gangGroups = [
            "AMBIENT_GANG_HILLBILLY", "AMBIENT_GANG_BALLAS", "AMBIENT_GANG_MEXICAN",
            "AMBIENT_GANG_FAMILY", "AMBIENT_GANG_MARABUNTE", "AMBIENT_GANG_SALVA",
            "AMBIENT_GANG_LOST", "GANG_1", "GANG_2", "GANG_9", "GANG_10", "FIREMAN", "MEDIC", "COP"
        ];

        gangGroups.forEach(gang => {
            SetRelationshipBetweenGroups(1, GetHashKey(gang), GetHashKey("PLAYER"));
        });
    });
});

on('playerSpawned', () => {
    if (!playerSpawned) {
        ShutdownLoadingScreenNui()
        playerSpawned = true
    }

    let tick = setTick(async () => {
        if (NetworkIsSessionStarted()) {
            emitNet('orionCore:server:requestPlayerData');
            clearTick(tick);
            return false;
        }
        await Wait(1000);
    });
});