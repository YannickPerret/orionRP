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
    setTick(async () => {
        if (NetworkIsSessionStarted()) {
            emitNet('orionCore:requestCharacterData');
            return false;
        }
        await Wait(1000);
    });
});

onNet('orionCore:sendCharacterData', (characterData) => {
    const playerPed = PlayerPedId();

    // Appliquer la position du personnage
    SetEntityCoords(playerPed, characterData.position.x, characterData.position.y, characterData.position.z, false, false, false, true);

    // Apparence et habits
    SetPedComponentVariation(playerPed, characterData.model);
    characterData.clothes.forEach(part => SetPedComponentVariation(playerPed, part.componentId, part.drawableId, part.textureId, 0));

    // Armes
    characterData.weapons.forEach(weapon => GiveWeaponToPed(playerPed, GetHashKey(weapon), 250, false, true));

    console.log("Données de personnage appliquées côté client après spawn");
});

// Gère l'ouverture de l'interface de création de personnage si aucun personnage n'existe
onNet('orionCore:openCharacterCreation', () => {
    console.log("Ouvrir l'interface de création de personnage");
    // Code pour afficher l'interface de création de personnage
});