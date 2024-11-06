// server/controllers/inventoryController.js
const AppDataSource = require('../databases/database.ts');

module.exports = {
    async createInventory() {
        const inventoryRepository = AppDataSource.getRepository('Inventory');
        const inventory = inventoryRepository.create();
        await inventoryRepository.save(inventory);
        return inventory;
    },

    async addItemToInventory(inventory, itemId, quantity = 1) {
        const inventoryItemRepository = AppDataSource.getRepository('InventoryItem');
        const itemRepository = AppDataSource.getRepository('Item');

        const item = await itemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            console.log(`Item avec l'ID ${itemId} non trouvé`);
            return;
        }

        let inventoryItem = await inventoryItemRepository.findOne({
            where: { inventory, item },
        });

        if (inventoryItem) {
            inventoryItem.quantity += quantity;
        } else {
            inventoryItem = inventoryItemRepository.create({
                inventory,
                item,
                quantity,
            });
        }

        await inventoryItemRepository.save(inventoryItem);
    },

    async removeItemFromInventory(inventory, itemId, quantity = 1) {
        const inventoryItemRepository = AppDataSource.getRepository('InventoryItem');
        const itemRepository = AppDataSource.getRepository('Item');

        const item = await itemRepository.findOne({ where: { id: itemId } });
        if (!item) return;

        let inventoryItem = await inventoryItemRepository.findOne({
            where: { inventory, item },
        });

        if (inventoryItem) {
            inventoryItem.quantity -= quantity;
            if (inventoryItem.quantity <= 0) {
                await inventoryItemRepository.remove(inventoryItem);
            } else {
                await inventoryItemRepository.save(inventoryItem);
            }
        }
    },

    async getInventoryItems(inventory) {
        const inventoryItemRepository = AppDataSource.getRepository('InventoryItem');
        return await inventoryItemRepository.find({
            where: { inventory },
            relations: ['item'],
        });
    },
};
