(async () => {
    let inventoryUiOpen = false;

    // Open inventory

    onNet('orion:inventory:c:open', (inventory) => {
        inventoryUiOpen = !inventoryUiOpen;
        SetNuiFocus(inventoryUiOpen, inventoryUiOpen);
        SendNuiMessage(JSON.stringify({
            action: 'inventoryHUD',
            payload: {
                inventoryOpen: inventoryUiOpen,
                iventory: inventory,
            }
        }));
    });


})();