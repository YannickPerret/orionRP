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

const applyCharacterModel = async (model) => {
    const modelHash = GetHashKey(model)
    RequestModel(modelHash)
    while (!HasModelLoaded(modelHash)) {
        await new Promise(resolve => setTimeout(resolve, 40));
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
}

const applyCharacterAppearance = (appearance) => {
    const playerPed = PlayerPedId();

    if (appearance !== undefined){
        if (appearance.hairStyle !== undefined) {
            SetPedComponentVariation(playerPed, 2, parseInt(appearance.hairStyle),0,0);
            console.log("change hair")
        }
        if (appearance.hairPrimaryColor !== undefined && appearance.hairSecondaryColor !== undefined) {
            //setPedHairColor(playerPed, parseInt(appearance.hairPrimaryColor), parseInt(appearance.hairSecondaryColor))
            SetPedHairTint(playerPed, parseInt(appearance.hairPrimaryColor), parseInt(appearance.hairSecondaryColor));
            console.log("change hair color")
        }

        // Beard
        if (appearance.beardStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 1, parseInt(appearance.beardStyle), 1.0);
        }
        if (appearance.beardColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 1, 1, parseInt(appearance.beardColor), parseInt(appearance.beardColor)); // colorType 1 for beard
        }

        // Eyebrows
        if (appearance.eyebrowStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 2, parseInt(appearance.eyebrowStyle), 1.0);
        }
        if (appearance.eyebrowColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 2, 1, parseInt(appearance.eyebrowColor), parseInt(appearance.eyebrowColor)); // colorType 1 for eyebrows
        }

        // Makeup
        if (appearance.makeupStyle !== undefined) {
            SetPedHeadOverlay(playerPed, 4, parseInt(appearance.makeupStyle), 1.0);
        }
        if (appearance.makeupColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 4, 2, parseInt(appearance.makeupColor), parseInt(appearance.makeupColor)); // colorType 2 for makeup
        }

        // Skin problems (like freckles, acne, etc.)
        if (appearance.skinProblem !== undefined) {
            SetPedHeadOverlay(playerPed, 9, parseInt(appearance.skinProblem), parseFloat(appearance.opacity || 1.0));
        }

        if (appearance.blemishes !== undefined) {
            SetPedHeadOverlay(playerPed, 0, parseInt(appearance.blemishes), 1.0);
        }
        if (appearance.sunDamage !== undefined) {
            SetPedHeadOverlay(playerPed, 7, parseInt(appearance.sunDamage), 1.0);
        }
        if (appearance.freckles !== undefined) {
            SetPedHeadOverlay(playerPed, 9, parseInt(appearance.freckles), 1.0);
        }
        if (appearance.moles !== undefined) {
            SetPedHeadOverlay(playerPed, 12, parseInt(appearance.moles), 1.0);
        }

        // Chest Hair
        if (appearance.chestHair !== undefined) {
            SetPedHeadOverlay(playerPed, 10, parseInt(appearance.chestHair), 1.0);
        }
        if (appearance.chestHairColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 10, 1, parseInt(appearance.chestHairColor), parseInt(appearance.chestHairColor));
        }

        // Blush
        if (appearance.blush !== undefined) {
            SetPedHeadOverlay(playerPed, 5, parseInt(appearance.blush), 1.0);
        }
        if (appearance.blushColor !== undefined) {
            SetPedHeadOverlayColor(playerPed, 5, 2, parseInt(appearance.blushColor), parseInt(appearance.blushColor));
        }

        // Nose features
        if (appearance.noseWidth !== undefined) SetPedFaceFeature(playerPed, 0, (parseFloat(appearance.noseWidth) - 5) / 10);
        if (appearance.noseHeight !== undefined) SetPedFaceFeature(playerPed, 1, (parseFloat(appearance.noseHeight) - 5) / 10);
        if (appearance.noseLength !== undefined) SetPedFaceFeature(playerPed, 2, (parseFloat(appearance.noseLength) - 5) / 10);
        if (appearance.noseLowering !== undefined) SetPedFaceFeature(playerPed, 3, (parseFloat(appearance.noseLowering) - 5) / 10);
        if (appearance.nosePeakLowering !== undefined) SetPedFaceFeature(playerPed, 4, (parseFloat(appearance.nosePeakLowering) - 5) / 10);
        if (appearance.noseTwist !== undefined) SetPedFaceFeature(playerPed, 5, (parseFloat(appearance.noseTwist) - 5) / 10);

        // Eyebrow features
        if (appearance.eyebrowHeight !== undefined) SetPedFaceFeature(playerPed, 6, (parseFloat(appearance.eyebrowHeight) - 5) / 10);
        if (appearance.eyebrowDepth !== undefined) SetPedFaceFeature(playerPed, 7, (parseFloat(appearance.eyebrowDepth) - 5) / 10);

    }
}

const applyCharacterClothes = (clothes) => {
    const playerPed = PlayerPedId();

    if (clothes !== undefined) {
        // Clothing components
        SetPedComponentVariation(playerPed, 8, parseInt(clothes.tshirtStyle || 0), parseInt(clothes.tshirtColor || 0), 0);  // T-shirt
        SetPedComponentVariation(playerPed, 11, parseInt(clothes.torsoStyle || 0), parseInt(clothes.torsoColor || 0), 0); // Torso
        SetPedComponentVariation(playerPed, 4, parseInt(clothes.legsStyle || 0), parseInt(clothes.pantsColor || 0), 0);   // Pants
        SetPedComponentVariation(playerPed, 6, parseInt(clothes.shoesStyle || 0), parseInt(clothes.shoesColor || 0), 0);  // Shoes

        // Additional components (like arms and glasses)
        SetPedComponentVariation(playerPed, 3, parseInt(clothes.armsStyle || 0), parseInt(clothes.armsColor || 0), 0);    // Arms
        SetPedPropIndex(playerPed, 1, parseInt(clothes.glassesStyle || -1), 0, true);
    }
}

onNet('admin:teleportToGPS', async () => {
    const playerPed = PlayerPedId();
    const waypointBlip = GetFirstBlipInfoId(8);
    if (DoesBlipExist(waypointBlip)) {
        const [x, y, z] = GetBlipCoords(waypointBlip);

        const groundZ = await getGroundLevel(x, y, z);
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

onNet('orionCore:client:loadCharacter', async (characterData) => {
    const playerPed = PlayerPedId();
    console.log(characterData)
    // Position
    SetEntityCoords(playerPed, characterData.position.x, characterData.position.y, characterData.position.z, false, false, false, true);

    // Apparence et habits
    await applyCharacterModel(characterData.model)
    applyCharacterAppearance(characterData.appearance)
    applyCharacterClothes(characterData.clothes)
    // Armes
    //characterData.weapons.forEach(weapon => GiveWeaponToPed(playerPed, GetHashKey(weapon), 250, false, true));
    console.log("Données de personnage appliquées côté client après spawn");
});

onNet('orionCore:client:applyCharacterClothes', (clothes) => {
    applyCharacterClothes(clothes)
})

onNet('orionCore:client:applyCharacterAppearance', (appearance) => {
    applyCharacterAppearance(appearance)
})

onNet('orionCore:client:applyCharacterModel', async (model) => {
    await applyCharacterModel(model)
})

onNet('orionCore:client:applyCharacterClothes', (clothes) => {
    const playerPed = PlayerPedId();
    clothes.forEach((clothe) => {
        SetPedComponentVariation(playerPed, clothe.componentId, clothes.drawableId, clothe.textureId, 0);
    })
})

on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;
    setTick(() => {
        const playerId = PlayerId();

    });
});

