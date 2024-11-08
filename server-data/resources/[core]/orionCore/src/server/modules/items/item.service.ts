import { Item } from './item.entity';
import { getRepository } from 'typeorm';

export class ItemService {
    async getItemById(itemId: number): Promise<Item | undefined> {
        return await getRepository(Item).findOne({ where: { id: itemId } });
    }

    async getAllItems(): Promise<Item[]> {
        return await getRepository(Item).find();
    }

    async createItem(itemData: Partial<Item>): Promise<Item> {
        const item = getRepository(Item).create(itemData);
        await getRepository(Item).save(item);
        return item;
    }

    async removeItemFromInventory(inventoryId: number, itemId: number, quantity: number): Promise<void> {
        // Implémenter la logique de suppression de l'item de l'inventaire
        console.log(`Item ${itemId} retiré de l'inventaire ${inventoryId}`);
    }

    async getItemMetadata(itemId: number): Promise<any | null> {
        const item = await this.getItemById(itemId);

        if (!item) {
            console.log(`Item introuvable: ${itemId}`);
            return null;
        }

        return item.metadata || {};
    }

    async hasMetadata(itemId: number, key: string): Promise<boolean> {
        const metadata = await this.getItemMetadata(itemId);
        return metadata && key in metadata;
    }
}
