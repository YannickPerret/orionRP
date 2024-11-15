import '@citizenfx/server';
import { ServerEvent, Inject } from '../../../core/decorators';
import { InventoryService } from './inventory.service';
import {PrismaService} from "../../../core/database/PrismaService";

export class InventoryController {
    private inventoryService: InventoryService;

    @Inject(PrismaService)
    private prisma!: PrismaService;

    constructor() {
        this.inventoryService = new InventoryService();
    }

    @ServerEvent('inventory:create')
    async handleCreateInventory(playerId: number, characterId: number): Promise<void> {
        try {
            const character = await this.prisma.character.findUnique({
                where: { id: characterId },
            });

            if (!character) {
                throw new Error(`Personnage avec l'ID ${characterId} introuvable.`);
            }

            const newInventory = await this.inventoryService.createInventory(character);
            console.log(`Inventaire créé pour le personnage ${character.firstName} ${character.lastName}.`);

             emitNet('orionCore:client:inventoryCreated', playerId, newInventory);
        } catch (error) {
            console.error('Erreur lors de la création de l\'inventaire:', error);
            emitNet('orionCore:client:inventoryError', playerId, 'Erreur lors de la création de l\'inventaire');
        }
    }

    @ServerEvent('inventory:addItem')
    async handleAddItem(playerId: number, inventoryId: number, itemId: number, quantity: number): Promise<void> {
        try {
            await this.inventoryService.addItemToInventory(inventoryId, itemId, quantity);
            console.log(`Item ajouté à l'inventaire ${inventoryId}.`);

            emitNet('orionCore:client:itemAdded', playerId, itemId, quantity);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'item:', error);
            emitNet('orionCore:client:inventoryError', playerId, 'Erreur lors de l\'ajout de l\'item');
        }
    }

    @ServerEvent('inventory:getItems')
    async handleGetItems(playerId: number, inventoryId: number): Promise<void> {
        try {
            const inventory = await this.prisma.inventory.findUnique({
                where: { id: inventoryId },
                include: {
                    items: true,
                },
            });

            if (!inventory) {
                throw new Error(`Inventaire avec l'ID ${inventoryId} introuvable.`);
            }

            emitNet('orionCore:client:inventoryItems', playerId, inventory.items);
        } catch (error) {
            console.error('Erreur lors de la récupération des items de l\'inventaire:', error);
            emitNet('orionCore:client:inventoryError', playerId, 'Erreur lors de la récupération des items');
        }
    }
}
