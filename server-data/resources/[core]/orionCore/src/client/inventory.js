let inventory = [];

// Recevoir la mise à jour de l'inventaire depuis le serveur
onNet('core:updateInventory', (newInventory) => {
    inventory = newInventory;
    // Mettre à jour l'interface utilisateur
    SendNUIMessage({
        action: 'updateInventory',
        inventory: inventory,
    });
});

// Ouvrir l'inventaire avec une touche (par exemple, la touche "I")
setTick(() => {
    if (IsControlJustReleased(0, 0x49)) { // 0x49 est la touche "I"
        SetNuiFocus(true, true);
        SendNUIMessage({ action: 'showInventory' });
    }
});

// Fermer l'inventaire depuis l'UI
RegisterNuiCallbackType('closeInventory');
on('__cfx_nui:closeInventory', (data, cb) => {
    SetNuiFocus(false, false);
    cb('ok');
});

// Utiliser un item depuis l'UI
RegisterNuiCallbackType('useItem');
on('__cfx_nui:useItem', (data, cb) => {
    const itemId = data.itemId;
    emitNet('core:useItem', itemId);
    cb('ok');
});
