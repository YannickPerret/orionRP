import '@citizenfx/server';
import { ServerEvent } from '../../core/decorators';
import { CharacterService } from './character.service';
import {PlayerManagerService} from "../playerManager/playerManager.service";

export class CharacterController {
  private characterService: CharacterService;

  constructor() {
    this.characterService = new CharacterService();
  }

  @ServerEvent('character:register')
  async handleRegisterCharacter(playerId: number, characterData: any): Promise<void> {
    try {
      const character = await this.characterService.createCharacter(playerId, characterData);
      console.log(`Personnage enregistré pour l'utilisateur ${character.fullname}`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du personnage:', error);
    }
  }

  @ServerEvent('character:load')
  async handleLoadCharacter(playerId: number, characterId: number): Promise<void> {
    try {
      const character = await this.characterService.loadCharacter(playerId, characterId);
      if (character) {
        console.log(`Personnage ${character.firstName} ${character.lastName} chargé pour le joueur ${playerId}`);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du personnage:', error);
    }
  }

  @ServerEvent('character:save')
  async handleSaveCharacter(playerId: number): Promise<void> {
    try {
      await this.characterService.saveCharacter(playerId);
      console.log(`Personnage du joueur ${playerId} sauvegardé.`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du personnage:', error);
    }
  }

  @ServerEvent('character:applyItemEffects')
  async handleApplyItemEffects(playerId: number, effects: any): Promise<void> {
    try {
      const character = PlayerManagerService.getInstance().getPlayer(playerId);
      if (character && character.activeCharacter) {
        //await this.characterService.applyItemEffects(character.activeCharacter, effects);
        console.log(`Effets appliqués au personnage du joueur ${playerId}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'application des effets:', error);
    }
  }
}
