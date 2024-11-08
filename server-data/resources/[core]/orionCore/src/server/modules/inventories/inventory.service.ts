import { getRepository } from 'typeorm';
import { Inventory } from './inventory.entity';
import { InventoryItem } from '../inventoryItems/inventoryItem.entity';
import { Item } from '../items/item.entity';
import { Character } from '../characters/character.entity';

export class InventoryService {
    async addItemToInventory(inventoryId: number, itemId: number, quantity: number) {
        const inventoryRepo = getRepository(Inventory);
        const itemRepo = getRepository(Item);
        const inventoryItemRepo = getRepository(InventoryItem);

        const inventory = await inventoryRepo.findOne({ where: { id: inventoryId } });
        const item = await itemRepo.findOne({ where: { id: itemId } });

        if (inventory && item) {
            const inventoryItem = new InventoryItem();
            inventoryItem.inventory = inventory;
            inventoryItem.item = item;
            inventoryItem.quantity = quantity;

            await inventoryItemRepo.save(inventoryItem);
        }
    }

    async createInventory(character: Character, items: Item[] = []): Promise<Inventory> {
        const inventoryRepo = getRepository(Inventory);
        const inventoryItemRepo = getRepository(InventoryItem);

        const newInventory = inventoryRepo.create({ character });
        await inventoryRepo.save(newInventory);

        for (const item of items) {
            const inventoryItem = inventoryItemRepo.create({
                inventory: newInventory,
                item: item,
                quantity: 1,
            });
            await inventoryItemRepo.save(inventoryItem);
        }

        return newInventory;
    }
}

export default new InventoryService();
