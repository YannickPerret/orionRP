const AppDataSource = require('../databases/database.ts');
const inventoryController = require('./Inventory.ts');
const characterController = require('./Character.ts');

module.exports = {
    async useItem(playerId, itemId) {
        const itemRepository = AppDataSource.getRepository('Item');
        const item = await itemRepository.findOne({ where: { id: itemId } });

        if (!item || !item.usable) {
            console.log(`Item non utilisable ou introuvable: ${itemId}`);
            return;
        }

        // Appliquer les effets de l'item sur les besoins du joueur
        if (item.effects) {
            await characterController.applyItemEffects(playerId, item.effects);
        }

        // Retirer l'item de l'inventaire du joueur
        const characterRepository = AppDataSource.getRepository('Character');
        const player = await characterRepository.findOne({ where: { id: playerId }, relations: ['inventory'] });

        if (player) {
            await inventoryController.removeItemFromInventory(player.inventory, itemId, 1);
        }
    },

    async getAllItems() {
        const itemRepository = AppDataSource.getRepository('Item');
        return await itemRepository.find();
    },

    async createItem(itemData) {
        const itemRepository = AppDataSource.getRepository('Item');
        const item = itemRepository.create(itemData);
        await itemRepository.save(item);
        return item;
    },

    async getItemMetadata(itemId) {
        const itemRepository = AppDataSource.getRepository('Item');
        const item = await itemRepository.findOne({ where: { id: itemId } });

        if (!item) {
            console.log(`Item introuvable: ${itemId}`);
            return null;
        }

        return item.metadata || {};
    },

    async hasMetadata(itemId, key) {
        const metadata = await this.getItemMetadata(itemId);
        return metadata && metadata.hasOwnProperty(key);
    }
};
