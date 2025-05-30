import { Inject } from '../../../core/decorators';
import {PrismaService} from "../../../core/database/PrismaService";

export class InventoryService {
    @Inject(PrismaService)
    private prisma: PrismaService;

    async addItemToInventory(inventoryId: number, itemId: number, quantity: number) {
        const inventory = await this.prisma.inventory.findUnique({ where: { id: inventoryId } });
        const item = await this.prisma.item.findUnique({ where: { id: itemId } });

        if (inventory && item) {
            await this.prisma.inventoryItem.create({
                data: {
                    inventoryId: inventory.id,
                    itemId: item.id,
                    quantity,
                },
            });
        }
    }

    async createInventory(characterId: string): Promise<any> {
        return this.prisma.inventory.create({
            data: {
                characterId,
                weight: 0,
            },
        });
    }
}
