on('onClientGameTypeStart', () => {
    exports.spawnmanager.setAutoSpawnCallback(() => {
        exports.spawnmanager.spawnPlayer({
            x: spawnPos[0],
            y: spawnPos[1],
            z: spawnPos[2],
            model: 'a_m_m_skater_01'
        }, () => {
            emit('chat:addMessage', {
                args: [
                    'Welcome to the party!~'
                ]
            })
        });
    });

    exports.spawnmanager.setAutoSpawn(true)
    exports.spawnmanager.forceRespawn()
});

on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;
    console.log('Ressource client démarrée : ' + resourceName);

    // Désactiver les recherches de police et rendre les gangs pacifiques
    setTick(() => {
        const playerId = PlayerId();
        SetPoliceIgnorePlayer(playerId, true);
        SetDispatchCopsForPlayer(playerId, false);
        SetMaxWantedLevel(0);
        ClearPlayerWantedLevel(playerId);
        SetPlayerHealthRechargeMultiplier(PlayerId(), config.character.healthRegen);
        NetworkSetFriendlyFireOption(true);
        SetCanAttackFriendly(PlayerPedId(), true, true);

        // Rendre les gangs non agressifs envers le joueur
        const gangGroups = [
            "AMBIENT_GANG_HILLBILLY", "AMBIENT_GANG_BALLAS", "AMBIENT_GANG_MEXICAN",
            "AMBIENT_GANG_FAMILY", "AMBIENT_GANG_MARABUNTE", "AMBIENT_GANG_SALVA",
            "AMBIENT_GANG_LOST", "GANG_1", "GANG_2", "GANG_9", "GANG_10", "FIREMAN", "MEDIC", "COP"
        ];

        gangGroups.forEach(gang => {
            SetRelationshipBetweenGroups(1, GetHashKey(gang), GetHashKey("PLAYER"));
        });
    });

    // Désactiver le drop d'armes par les PNJ
    setTick(() => {
        SetCanAttackFriendly(PlayerPedId(), true, false);
        SetPedDropsWeaponsWhenDead(PlayerPedId(), false);
    });
});

on('playerSpawned', () => {
    let tick = setTick(async () => {
        if (NetworkIsSessionStarted()) {
            emitNet('orionCore:server:requestPlayerData');
            clearTick(tick);
            return false;
        }
        await Wait(1000);
    });
});