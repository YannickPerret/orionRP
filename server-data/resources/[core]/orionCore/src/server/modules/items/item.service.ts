import { Inject, Injectable } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";

@Injectable()
export class ItemService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    async getItemById(itemId: string) {
        return this.prisma.item.findUnique({
            where: {id: itemId},
        });
    }

    async getAllItems() {
        return this.prisma.item.findMany();
    }

    async createItem(itemData: Partial<any>) {
        return this.prisma.item.create({
            data: itemData,
        });
    }

    async removeItemFromInventory(inventoryId: string, itemId: string, quantity: number): Promise<void> {
        // Récupérer l'item dans l'inventaire
        const inventoryItem = await this.prisma.inventoryItem.findFirst({
            where: {
                inventoryId,
                itemId,
            },
        });

        if (!inventoryItem) {
            console.log(`Item ${itemId} non trouvé dans l'inventaire ${inventoryId}`);
            return;
        }

        if (inventoryItem.quantity > quantity) {
            await this.prisma.inventoryItem.update({
                where: { id: inventoryItem.id },
                data: { quantity: inventoryItem.quantity - quantity },
            });
        } else {
            await this.prisma.inventoryItem.delete({
                where: { id: inventoryItem.id },
            });
        }

        console.log(`Item ${itemId} retiré de l'inventaire ${inventoryId}`);
    }

    async getItemMetadata(itemId: string) {
        const item = await this.getItemById(itemId);

        if (!item) {
            console.log(`Item introuvable: ${itemId}`);
            return null;
        }

        return item.metadata || {};
    }

    async hasMetadata(itemId: string, key: string): Promise<boolean> {
        const metadata = await this.getItemMetadata(itemId);
        return metadata && key in metadata;
    }
}
