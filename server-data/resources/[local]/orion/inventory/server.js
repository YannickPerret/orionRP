(async () => {
    const PlayerManager = require('./core/server/playerManager.js');
    const Inventory = require('./inventory/inventory.js');

    onNet('orion:inventory:s:useItem', (item) => {
        item.use();
    });

    onNet('orion:inventory:s:giveItem', (item, target) => {
        let player = PlayerManager.getPlayerBySource(target);
        if (player) {
            player.inventory.addItem(item);
        }
    })

    RegisterCommand('inv', async (source, args) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const playerInventory = Inventory.getById(player.inventoryId);

        if (player && playerInventory) {
            emitNet('orion:inventory:c:open', source, playerInventory);
        }
        else {
            emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");
        }
    });
})()

