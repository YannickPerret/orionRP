let playerComponents = {};

const components = {
    mask: { id: 1, wearing: true },
    hair: { id: 2, wearing: true },
    torso: { id: 3, wearing: true },
    legs: { id: 4, wearing: true },
    bags: { id: 5, wearing: true },
    shoes: { id: 6, wearing: true },
    accessories: { id: 7, wearing: true },
    undershirt: { id: 8, wearing: true },
    bodyArmor: { id: 9, wearing: true },
    decals: { id: 10, wearing: true },
    tops: { id: 11, wearing: true },
    // Props
    hats: { id: 'prop_0', wearing: true },
    glasses: { id: 'prop_1', wearing: true },
    ears: { id: 'prop_2', wearing: true },
    watches: { id: 'prop_6', wearing: true },
    bracelets: { id: 'prop_7', wearing: true },
};

const initializeComponents = () => {
    const ped = PlayerPedId();
    for (const [compName, component] of Object.entries(components)) {
        const compId = component.id;
        const isProp = typeof compId === 'string' && compId.startsWith('prop_');
        let actualCompId = isProp ? parseInt(compId.split('_')[1]) : compId;

        if (isProp) {
            const drawable = GetPedPropIndex(ped, actualCompId);
            component.wearing = drawable !== -1;
        } else {
            const drawable = GetPedDrawableVariation(ped, actualCompId);
            component.wearing = drawable !== 0;
        }
    }
};

const savePlayerComponents = () => {
    const ped = PlayerPedId();
    playerComponents = {};
    for (const [compName, component] of Object.entries(components)) {
        const compId = component.id;
        const isProp = typeof compId === 'string' && compId.startsWith('prop_');
        let actualCompId = isProp ? parseInt(compId.split('_')[1]) : compId;

        if (isProp) {
            const drawable = GetPedPropIndex(ped, actualCompId);
            const texture = GetPedPropTextureIndex(ped, actualCompId);
            playerComponents[compName] = { drawable, texture };
        } else {
            const drawable = GetPedDrawableVariation(ped, actualCompId);
            const texture = GetPedTextureVariation(ped, actualCompId);
            playerComponents[compName] = { drawable, texture };
        }
    }
};

function handleClothingComponent(componentName) {
    const ped = PlayerPedId();
    const component = components[componentName];

    if (!component) {
        console.log('Nom de composant invalide :', componentName);
        return;
    }

    const compId = component.id;
    const isProp = typeof compId === 'string' && compId.startsWith('prop_');
    let actualCompId = isProp ? parseInt(compId.split('_')[1]) : compId;

    console.log(component.wearing)
    if (component.wearing) {
        if (isProp) {
            if (!playerComponents[componentName]) {
                const drawable = GetPedPropIndex(ped, actualCompId);
                const texture = GetPedPropTextureIndex(ped, actualCompId);
                playerComponents[componentName] = { drawable, texture };
            }
            ClearPedProp(ped, actualCompId);
        } else {
            if (!playerComponents[componentName]) {
                const drawable = GetPedDrawableVariation(ped, actualCompId);
                const texture = GetPedTextureVariation(ped, actualCompId);
                playerComponents[componentName] = { drawable, texture };
            }

            // Sauvegarder le torse si on retire le haut
            if (componentName === 'tops' && !playerComponents['torso']) {
                const torsoDrawable = GetPedDrawableVariation(ped, components['torso'].id);
                const torsoTexture = GetPedTextureVariation(ped, components['torso'].id);
                playerComponents['torso'] = { drawable: torsoDrawable, texture: torsoTexture };
            }

            // Définir l'index pour "pas de vêtement"
            let noClothingIndex = 0; // Valeur par défaut
            if (componentName === 'tops' || componentName === 'undershirt') {
                noClothingIndex = 15; // Index pour "pas de vêtement"
            }

            if (componentName === 'tops') {
                // Retirer le haut
                SetPedComponentVariation(ped, actualCompId, noClothingIndex, 0, 2);
                // Ajuster le torse pour correspondre
                const torsoIndex = 15; // Vous devrez peut-être ajuster cette valeur en fonction du modèle
                SetPedComponentVariation(ped, components['torso'].id, torsoIndex, 0, 2);
            } else {
                SetPedComponentVariation(ped, actualCompId, noClothingIndex, 0, 2);
            }
        }
        component.wearing = false;
    } else {
        const compData = playerComponents[componentName];
        if (compData) {
            if (isProp) {
                if (compData.drawable >= 0) {
                    SetPedPropIndex(ped, actualCompId, compData.drawable, compData.texture, true);
                }
            } else {
                SetPedComponentVariation(ped, actualCompId, compData.drawable, compData.texture, 2);

                // Restaurer le torse si on remet le haut
                if (componentName === 'tops') {
                    const torsoData = playerComponents['torso'];
                    if (torsoData) {
                        SetPedComponentVariation(ped, components['torso'].id, torsoData.drawable, torsoData.texture, 2);
                    }
                }
            }
            component.wearing = true;
        } else {
            console.log('Aucune donnée sauvegardée pour le composant :', componentName);
        }
    }
}

on('clothes:client:handleClothingComponent', (componentName) => {
    handleClothingComponent(componentName);
});


on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() === resourceName) {
        savePlayerComponents();
        initializeComponents();
    }
});
