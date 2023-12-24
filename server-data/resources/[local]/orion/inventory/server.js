(async () => {
    const PlayerManager = require('./core/server/playerManager.js');
    const { Inventory } = require('./inventory/inventory.js');

    onNet('orion:inventory:s:useItem', (item) => {
        item.use();
    });

    onNet('orion:inventory:s:giveItem', (item, target) => {
        let player = PlayerManager.getPlayerBySource(target);
        if (player) {
            player.inventory.addItem(item);
        }
    })

    onNet('orion:inventory:s:loadInventory', async (source, inventoryId = undefined) => {
        const source = source ? source : global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const inventory = inventoryId ? inventoryId : player.inventoryId;

        const playerInventory = await Inventory.getById(inventory);
        const fullItems = await playerInventory.getFullItems();

        playerInventory.items = fullItems;

        if (player && playerInventory) {
            console.log("playerInventory")
            emitNet('orion:inventory:c:open', source, playerInventory);
        }
        else {
            emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");
        }
    })

    RegisterCommand('inv', (source, args) => {
        emit('orion:inventory:s:loadInventory', source);
    }, false);

})();


