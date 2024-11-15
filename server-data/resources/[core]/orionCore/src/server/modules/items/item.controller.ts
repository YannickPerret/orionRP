import '@citizenfx/server';
import { ServerEvent, Inject } from '../../../core/decorators';
import { ItemService } from './item.service';
import { CharacterService } from '../characters/character.service';

export class ItemController {
    @Inject(ItemService)
    private itemService!: ItemService;

    @Inject(CharacterService)
    private characterService!: CharacterService;

    @ServerEvent('item:use')
    async handleUseItem(playerId: number, itemId: string): Promise<void> {
        try {
            const item = await this.itemService.getItemById(itemId);

            if (!item || !item.usable) {
                console.log(`Item non utilisable ou introuvable: ${itemId}`);
                return;
            }

            // Appliquer les effets de l'item sur les besoins du joueur
            if (item.effects) {
                //await this.characterService.applyItemEffects(playerId, item.effects);
            }

            // Retirer l'item de l'inventaire du joueur
            const character = await this.characterService.loadCharacter(playerId, itemId); // Adapter selon votre logique

            if (character && character.inventory) {
                await this.itemService.removeItemFromInventory(character.inventory.id, itemId, 1);
            }

            console.log(`Item ${item.name} utilisé par le joueur ${playerId}`);
        } catch (error) {
            console.error('Erreur lors de l\'utilisation de l\'item:', error);
        }
    }
}
