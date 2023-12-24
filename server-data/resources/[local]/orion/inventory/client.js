(async () => {
    let inventoryUiOpen = false;

    // Open inventory

    onNet('orion:inventory:c:open', (inventory) => {
        inventoryUiOpen = !inventoryUiOpen;
        SetNuiFocus(false, inventoryUiOpen);
        SetNuiFocusKeepInput(true)
        SendNuiMessage(JSON.stringify({
            action: 'inventoryHUD',
            payload: {
                inventoryHUD: inventoryUiOpen,
                inventory: inventory,
            }
        }));
    });

    RegisterKeyMapping('inventory', 'Ouvrir l\'inventaire', 'keyboard', 'I');
    RegisterCommand(
        'inventory',
        () => {
            emitNet('orion:inventory:s:loadInventory');
        },
        false
    );

    // drop Item
    RegisterNuiCallbackType('dropItem');
    on('__cfx_nui:dropItem', (data, cb) => {
        if (data.itemId == undefined) return;
        emitNet('orion:inventory:s:dropItem', data.itemId);
        cb({ ok: true });
    });

    // use Item
    RegisterNuiCallbackType('useItem');
    on('__cfx_nui:useItem', (data, cb) => {
        if (data.itemId == undefined) return;
        emitNet('orion:inventory:s:useItem', data.itemId);
        cb({ ok: true });
    });

    // give Item
    RegisterNuiCallbackType('giveItem');
    on('__cfx_nui:giveItem', (data, cb) => {
        if (data.itemId == undefined || data.quantity < 1) return;
        emitNet('orion:inventory:s:giveItem', data.itemId, data.target);
        cb({ ok: true });
    });

    onNet('orion:inventory:s:dropItem', (itemId) => {
        emitNet('orion:inventory:s:dropItem', itemId);
    });

    onNet('orion:inventory:s:useItem', (itemId) => {
        emitNet('orion:inventory:s:useItem', itemId);
    });

    onNet('orion:inventory:s:giveItem', (itemId, target) => {
        emitNet('orion:inventory:s:giveItem', itemId, target);
    });
})();