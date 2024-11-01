// Gestion des événements liés au joueur côté client
async function getGroundLevel(x, y, z) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const [foundGround, groundZ] = GetGroundZFor_3dCoord(x, y, z);
            if (foundGround) {
                clearInterval(interval);
                resolve(groundZ);
            } else {
                z -= 10;
                if (z < 0) {
                    clearInterval(interval);
                    resolve(0);
                }
            }
        }, 50);
    });
}


onNet('admin:teleportToGPS', async () => {
    console.log("kfkfkfk")
    const playerPed = PlayerPedId();
    const waypointBlip = GetFirstBlipInfoId(8);

    console.log("llll")

    if (DoesBlipExist(waypointBlip)) {
        const [x, y, z] = GetBlipCoords(waypointBlip);

        const groundZ = await getGroundLevel(x, y, z);
        console.log(`Niveau du sol: ${groundZ}`);

        // Téléportation au-dessus du niveau du sol
        SetEntityCoords(playerPed, x, y, groundZ + 1.0, false, false, false, true);
    } else {
        emit('chat:addMessage', { args: ["Admin", "Aucun point GPS trouvé."] });
    }
});

onNet('admin:teleportToPosition', (x, y, z) => {
    const playerPed = PlayerPedId();
    SetEntityCoords(playerPed, x, y, z, false, false, false, true);
});

onNet('admin:revivePlayer', () => {
    const playerPed = PlayerPedId();

    // Remettre la santé et nettoyer les dégâts visibles
    SetEntityHealth(playerPed, 200);
    ClearPedBloodDamage(playerPed);
    ResetPedVisibleDamage(playerPed);

    // Réinitialiser la position et lever le joueur
    const [x, y, z] = GetEntityCoords(playerPed);
    SetEntityCoords(playerPed, x, y, z + 1.0, false, false, false, true);
    ClearPedTasksImmediately(playerPed);

    // Désactiver le ragdoll
    if (IsPedRagdoll(playerPed)) {
        ClearPedTasksImmediately(playerPed);
    }

    // Réactiver le contrôle du joueur
    EnableControlAction(0, 37, true); // Active la roue des armes (37 est l'ID pour weapon wheel)
    EnableAllControlActions(0); // Réactive toutes les actions du joueur

    // Afficher un message pour confirmer la réanimation
    console.log("Vous avez été réanimé par un administrateur.");
});

onNet('orionCore:client:loadCharacter', (characterData) => {
    const playerPed = PlayerPedId();
    // Position
    SetEntityCoords(playerPed, characterData.position.x, characterData.position.y, characterData.position.z, false, false, false, true);

    // Apparence et habits
    SetPedComponentVariation(playerPed, characterData.model);
    characterData.clothes.forEach(part => SetPedComponentVariation(playerPed, part.componentId, part.drawableId, part.textureId, 0));

    // Armes
    characterData.weapons.forEach(weapon => GiveWeaponToPed(playerPed, GetHashKey(weapon), 250, false, true));
    console.log("Données de personnage appliquées côté client après spawn");
});

onNet('orionCore:client:applyCharacterModel', async (model, cb) => {
    const modelHash = GetHashKey(model)
    RequestModel(modelHash)
    while (!HasModelLoaded(modelHash)) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (IsModelInCdimage(modelHash) && IsModelValid(modelHash)) {
        SetPlayerModel(PlayerId(), modelHash)
        const playerPed = PlayerPedId();

        SetPedComponentVariation(playerPed, 0, 0, 0, 2)
        SetPedComponentVariation(playerPed, 2, 11, 4, 2)
        SetPedComponentVariation(playerPed, 4, 1, 5, 2)
        SetPedComponentVariation(playerPed, 6, 1, 0, 2)
        SetPedComponentVariation(playerPed, 11, 7, 2, 2)
    }
    SetModelAsNoLongerNeeded(modelHash)
})

onNet('orionCore:client:applyCharacterClothes', (clothes) => {
    const playerPed = PlayerPedId();
    clothes.forEach((clothe) => {
        SetPedComponentVariation(playerPed, clothe.componentId, clothes.drawableId, clothe.textureId, 0);
    })
})

onNet('orionCore:client:applyCharacterAppearance', (appearance) => {
    const playerPed = PlayerPedId();
    SetPedComponentVariation(playerPed, appearance.model)
})

onNet('orionCore:openCharacterCreation', () => {
    console.log("Ouvrir l'interface de création de personnage");
});

on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;
    console.log('Ressource client démarrée : ' + resourceName);

    setTick(() => {
        const playerId = PlayerId();
        SetPoliceIgnorePlayer(playerId, true);
        SetDispatchCopsForPlayer(playerId, false);
        SetMaxWantedLevel(0);
        ClearPlayerWantedLevel(playerId);
    });
});

