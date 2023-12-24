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
})();