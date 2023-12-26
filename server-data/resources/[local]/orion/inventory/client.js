(async () => {
    let inventoryUiOpen = false;

    onNet('orion:inventory:c:open', (inventory) => {
        inventoryUiOpen = !inventoryUiOpen;
        SetNuiFocus(inventoryUiOpen, inventoryUiOpen);
        //SetNuiFocusKeepInput(true)

        console.log(inventory)
        SendNuiMessage(JSON.stringify({
            action: 'inventoryHUD',
            payload: {
                inventoryHUD: inventoryUiOpen,
                inventory: inventory,
            }
        }));
    });

    RegisterKeyMapping('inventory', 'Ouvrir l\'inventaire', 'keyboard', 'I');
    RegisterCommand('inventory', () => {
        emitNet('orion:inventory:s:loadInventory');
    }, false);

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
        console.log(data);
        if (data.id == undefined) return;
        emitNet('orion:inventory:s:useItem', data.id);
        cb({ ok: true });
    });

    // give Item
    RegisterNuiCallbackType('giveItem');
    on('__cfx_nui:giveItem', (data, cb) => {
        if (data.id == undefined || data.quantity < 1) return;

        emitNet('orion:inventory:s:giveItem', data.id, data.target);
        cb({ ok: true });
    });

    onNet('orion:inventory:c:dropItem', (itemId) => {
        emitNet('orion:inventory:s:dropItem', itemId);
    });

    onNet('orion:inventory:c:useItem', (itemId) => {
        emitNet('orion:inventory:s:useItem', itemId);
    });

    onNet('orion:inventory:c:giveItem', (itemId, target) => {
        emitNet('orion:inventory:s:giveItem', itemId, target);
    });


    setTick(() => {
        if (inventoryUiOpen) {
            DisableControlAction(0, 1, inventoryUiOpen);
            DisableControlAction(0, 2, inventoryUiOpen);

            DisableControlAction(0, 24, inventoryUiOpen);
            DisableControlAction(0, 25, inventoryUiOpen);

            DisableControlAction(0, 263, inventoryUiOpen)
            DisableControlAction(0, 264, inventoryUiOpen)
            DisableControlAction(0, 257, inventoryUiOpen)
            DisableControlAction(0, 140, inventoryUiOpen)
            DisableControlAction(0, 141, inventoryUiOpen)
            DisableControlAction(0, 142, inventoryUiOpen)
            DisableControlAction(0, 143, inventoryUiOpen)

            DisableControlAction(0, 270, inventoryUiOpen);
            DisableControlAction(0, 271, inventoryUiOpen);
            DisableControlAction(0, 272, inventoryUiOpen);
            DisableControlAction(0, 273, inventoryUiOpen);
        }
    });
})();