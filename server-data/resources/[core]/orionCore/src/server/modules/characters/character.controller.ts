import '@citizenfx/server';
import { ServerEvent, Inject } from '../../../core/decorators';
import { CharacterService } from './character.service';
import { PlayerManagerService } from '../playerManager/playerManager.service';
import {UserService} from "../users/user.service";

export class CharacterController {
  @Inject(CharacterService)
  private characterService!: CharacterService;

  @Inject(PlayerManagerService)
  private playerManager!: PlayerManagerService;

  @Inject(UserService)
  private userService!: UserService

  @ServerEvent('character:register')
  async handleRegisterCharacter(playerId: number, characterData: any): Promise<void> {
    const license = this.userService.getPlayerIdentifier(source)
    try {
      const character = await this.characterService.createCharacter(license, characterData);
      console.log(`Personnage enregistré pour l'utilisateur ${character.firstName} ${character.lastName}`);
      emitNet('orionCharacter:client:loadCharacter', playerId, character)
      emitNet('characterCreator:client:closeCharacterCreation', playerId)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du personnage:', error);
    }
  }

  @ServerEvent('character:load')
  async handleLoadCharacter(playerId: number, characterId: string): Promise<void> {
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
      const character = this.playerManager.getPlayer(playerId);
      if (character && character.activeCharacter) {
        console.log(`Effets appliqués au personnage du joueur ${playerId}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'application des effets:', error);
    }
  }
}
