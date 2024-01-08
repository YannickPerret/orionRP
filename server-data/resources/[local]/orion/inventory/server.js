(async () => {
    const PlayerManager = require('./core/server/playerManager.js');
    const Inventory = require('./inventory/inventory.js');
    const { Item } = require('./inventory/item.js');

    onNet('orion:inventory:s:useItem', async (itemId) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);

        if (!player) return emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");

        const playerInventory = await Inventory.getById(player.inventoryId);
        const itemInstance = await playerInventory.getItem(itemId);

        if (playerInventory.hasItem(itemInstance)) {
            if (Number(itemInstance.quantity) > 0) {
                if (itemInstance.type !== 'special') {
                    emit(`orion:inventory:s:useItem:${itemInstance.type}`, itemInstance, source);
                }
                else {
                    console.log("special item")
                    emit(`orion:inventory:s:useItem:${itemInstance.name}`, source, itemInstance);
                }
                playerInventory.removeItem(itemInstance.id, 1);
                await playerInventory.save();
            }
        }
    });

    onNet('orion:inventory:s:giveItem', async (itemId, quantity, target) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const targetPlayer = PlayerManager.getPlayerBySource(target);

        if (!player) return emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");
        if (!targetPlayer) return emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");
        if (player.id === targetPlayer.id) return emitNet('orion:showNotification', source, "Vous ne pouvez pas vous donner d'item à vous même !");
        if (targetPlayer.id === null) return emitNet('orion:showNotification', source, "Vous ne pouvez pas vous donner d'item à vous même !");

        const playerInventory = await Inventory.getById(player.inventoryId);
        const targetInventory = await Inventory.getById(targetPlayer.inventoryId);
        const itemInstance = await playerInventory.getItem(itemId);

        if (itemInstance.quantity < quantity) return emitNet('orion:showNotification', source, "Vous n'avez pas assez d'item !");

        if (playerInventory.hasItem(itemInstance)) {
            if (Number(itemInstance.quantity) > 0) {
                if (playerInventory.removeItem(itemInstance.id, quantity)) {
                    targetInventory.addItem(itemInstance, quantity);
                    await targetInventory.save();
                    await playerInventory.save();
                    emitNet('orion:showNotification', target, `${player.firstname} ${player.lastname} vous a donné ${quantity} ${itemInstance.name}`);
                }
            }
        }
    })

    onNet('orion:inventory:s:dropItem', async (itemId, quantity) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);

        if (!player) return emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");
        if (Number(quantity) < 1) return emitNet('orion:showNotification', source, "Vous devez entrer une quantité valide !");

        const playerInventory = await Inventory.getById(player.inventoryId);
        const itemInstance = await playerInventory.getItem(itemId);

        if (itemInstance) {
            if (itemInstance > Number(quantity)) return emitNet('orion:showNotification', source, "Vous n'avez pas assez d'item !");

            if (Number(itemInstance.quantity) > 0) {
                playerInventory.removeItem(itemInstance.id, quantity);
                await playerInventory.save();
            }
            else {
                emitNet('orion:showNotification', source, `Vous n'avez pas assez de ${itemInstance.label} !`);
            }
        }

    });

    onNet('orion:inventory:s:loadInventory', async (_source, _inventoryId) => {
        const source = _source || global.source;
        const player = PlayerManager.getPlayerBySource(source);
        if (!player) return emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");

        const inventory = _inventoryId || player.inventoryId;

        const playerInventory = await Inventory.getById(inventory);

        const fullItems = await playerInventory.getFullItems();

        playerInventory.items = fullItems;

        if (player && playerInventory) {
            emitNet('orion:inventory:c:open', source, playerInventory);
        } else {
            emitNet('orion:showNotification', source, "Vous devez être connecté pour voir l'inventaire !");
        }
    });

    RegisterCommand('inv', (source, args) => {
        emit('orion:inventory:s:loadInventory', source);
    }, false);

    RegisterCommand('addItem', async (source, args) => {
        // si player source n'est pas donné, prendre soi-même. Sinon addItem pour le joueur donné source
        if (!args[0]) return emitNet('orion:showNotification', source, "Vous devez entrer un nom d'item !");
        const item = await Item.getByName(args[0]);
        const targetSource = args[2] || source;
        const player = PlayerManager.getPlayerBySource(targetSource);
        const inventory = await Inventory.getById(player.inventoryId);
        const quantity = args[1] || 1;
        if (item) {
            inventory.addItem(item, quantity);
            await inventory.save();
        }
        else
            emitNet('orion:showNotification', source, "Vous devez entrer un nom d'item valide !");

    }, false);


    //item effects
    onNet('orion:inventory:s:useItem:item_consumable', (item, _source = undefined) => {
        const source = _source || global.source;
        const player = PlayerManager.getPlayerBySource(source);
        console.log(item)
        emitNet('orion:core:c:animations:playAnimationWithTime', source, item.animation.dict, item.animation.name, item.animation.duration, 49, 49, 49, 49, 49);
        emitNet('orion:player:c:modifyNeeds', source, item.animation.duration, item.hunger, item.thirst);

    })


})();


