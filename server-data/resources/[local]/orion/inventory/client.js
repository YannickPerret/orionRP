(async () => {
    let inventoryUiOpen = false;

    // Open inventory

    onNet('orion:inventory:c:open', (inventory) => {
        inventoryUiOpen = !inventoryUiOpen;
        SetNuiFocus(inventoryUiOpen, inventoryUiOpen);
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
            emitNet('orion:inventory:s:open');
        },
        false
    );
})();