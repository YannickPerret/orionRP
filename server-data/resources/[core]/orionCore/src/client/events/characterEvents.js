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


onNet('orionCore:applyCharacterData', (data) => {
    const playerPed = PlayerPedId();

    // Position
    SetEntityCoords(playerPed, data.position.x, data.position.y, data.position.z, false, false, false, true);

    // Apparence et habits
    SetPedComponentVariation(playerPed, data.model);
    data.clothes.forEach(part => SetPedComponentVariation(playerPed, part.componentId, part.drawableId, part.textureId, 0));

    // Armes
    data.weapons.forEach(weapon => GiveWeaponToPed(playerPed, GetHashKey(weapon), 250, false, true));

    console.log("Données de personnage appliquées côté client");
});

