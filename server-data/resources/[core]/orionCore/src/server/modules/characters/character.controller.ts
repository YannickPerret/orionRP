import '@citizenfx/server';
import {ServerEvent, Inject, Tick, TickInterval} from '../../../core/decorators';
import { CharacterService } from './character.service';
import { PlayerManagerService } from '../playerManager/playerManager.service';
import {UserService} from "../users/user.service";
import {Interval} from "luxon";

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
  async handleSaveCharacter(playerId: number, position: { x: number, y: number, z: number }, heading: number): Promise<void> {
    try {
      await this.characterService.saveCharacter(playerId, position, heading);
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

  @Tick(TickInterval.EVERY_15_MINUTE)
  handleSaveCharacters() : void {
    const players = this.playerManager.getAllPlayers()
    console.log(`update ${players.size} players`)
    if (players.size > 0) {
      players.forEach(async player => {
        const [x, y, z] = GetEntityCoords(player.source)
        const playerHeading = GetEntityHeading(player.source)
        await this.characterService.saveCharacter(player.id, {x, y, z}, playerHeading)
      })
    }
  }
}
