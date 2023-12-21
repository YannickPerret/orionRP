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

    onNet('orion:inventory:s:loadInventory', async (source) => {
        console.log(source)
        const player = PlayerManager.getPlayerBySource(source);

        console.log(player)
        const inventory = player.inventoryId;

        console.log(inventory)
        const playerInventory = await Inventory.getById(inventory);



        if (player && playerInventory) {
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


