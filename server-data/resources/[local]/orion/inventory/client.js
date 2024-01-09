(async () => {
    let inventoryUiOpen = false;

    onNet('orion:inventory:c:open', (inventory) => {
        inventoryUiOpen = true;
        SetNuiFocus(inventoryUiOpen, inventoryUiOpen);
        SetNuiFocusKeepInput(inventoryUiOpen)
        SendNuiMessage(JSON.stringify({
            action: 'inventoryHUD',
            payload: {
                inventoryHUD: inventoryUiOpen,
                inventory: inventory,
            }
        }));
    });

    onNet('orion:inventory:c:close', () => {
        inventoryUiOpen = false;
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false)
        SendNuiMessage(JSON.stringify({
            action: 'inventoryHUD',
            payload: {
                inventoryHUD: false,
            }
        }));
    });


    RegisterKeyMapping('inventory', 'Ouvrir l\'inventaire', 'keyboard', 'I');
    RegisterCommand('inventory', () => {
        if (inventoryUiOpen) {
            emitNet('orion:inventory:c:close');
        }
        else {
            emitNet('orion:inventory:s:loadInventory');
        }
    }, false);

    // drop Item
    RegisterNuiCallbackType('dropItem');
    on('__cfx_nui:dropItem', (data, cb) => {
        if (data.itemId == undefined || data.quantity < 1) return cb({ ok: false });
        emitNet('orion:inventory:s:dropItem', data.itemId, data.quantity);
        cb({ ok: true });
    });

    // use Item
    RegisterNuiCallbackType('useItem');
    on('__cfx_nui:useItem', (data, cb) => {
        if (data.id == undefined) return;
        emitNet('orion:inventory:s:useItem', data.id);
        cb({ ok: true });
    });

    // give Item
    RegisterNuiCallbackType('giveItem');
    on('__cfx_nui:giveItem', (data, cb) => {
        if (data.itemId == undefined || data.quantity < 1) return;
        const targetPlayer = exports['orion'].findNearbyPlayers(3)[0];
        if (!targetPlayer) return emit('orion:showNotification', 'Aucun joueur à proximité');
        emitNet('orion:inventory:s:giveItem', data.id, targetPlayer);
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


    exports('item:attachProp', (propName, boneIndex, x, y, z, xR, yR, zR) => {
        const bone = GetPedBoneIndex(PlayerPedId(), boneIndex);
        const prop = CreateObject(GetHashKey(propName), x, y, z, true, true, true);
        AttachEntityToEntity(prop, PlayerPedId(), bone, xR, yR, zR, 0.0, 0.0, 0.0, true, true, false, true, 1, true);
        return prop;
    });

    exports('item:detachProp', (prop) => {
        ClearPedProp(PlayerPedId(), prop);
        DeleteEntity(prop);
    })

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