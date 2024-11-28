import '@citizenfx/server';
import {ServerEvent, Inject, Tick, TickInterval, Injectable, Command} from '../../../core/decorators';
import { CharacterService } from './character.service';
import { PlayerManagerService } from '../playerManager/playerManager.service';
import {UserService} from "../users/user.service";
import {NotifierService} from "../notifiers/notifier.service";
import {LoggerService} from "../../../core/modules/logger/logger.service";
import {PlayerData} from "../../../shared/player";
import {RoleType} from "../roles/role.enum";

@Injectable()
export class CharacterController {
  @Inject(CharacterService)
  private characterService: CharacterService;

  @Inject(PlayerManagerService)
  private playerManager!: PlayerManagerService;

  @Inject(UserService)
  private userService!: UserService

  @Inject(NotifierService)
    private notifierService!: NotifierService

  @Inject(LoggerService)
    private logger!: LoggerService

  @ServerEvent('character:login')
  async handleLoginCharacter(): Promise<void> {
    const source = global.source;
    try {
      const playerData = await this.characterService.loginCharacter(source);

      if (playerData) {
        this.playerManager.addPlayer(playerData);
        emitNet('orionCore:client:loadCharacter', source, playerData.character);
        this.notifierService.notify(source, `Bienvenue ${playerData.character?.firstName} ${playerData.character?.lastName} !`, 'info');
      } else {
        emitNet('characterCreator:client:openCharacterCreation', source);
      }
    } catch (error) {
      this.logger.error(`Erreur lors du login du personnage : ${error.message}`);
    }
  }

  @ServerEvent('character:register')
  async handleRegisterCharacter(playerId: number, characterData: any): Promise<void> {
    const license = this.userService.getPlayerIdentifier(source)
    try {
      const character = await this.characterService.createCharacter(license, characterData);
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
  async handleSaveCharacter(player: PlayerData): Promise<void> {
    try {
      await this.characterService.saveCharacter(player.source, player.character);
      console.log(`Personnage du joueur ${player.source} sauvegardé.`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du personnage:', error);
    }
  }

  @ServerEvent('character:applyItemEffects')
  async handleApplyItemEffects(playerId: number, effects: any): Promise<void> {
    try {
      const character = this.playerManager.getPlayer(playerId);
      if (character && character.character) {
        console.log(`Effets appliqués au personnage du joueur ${playerId}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'application des effets:', error);
    }
  }

  @Tick(TickInterval.EVERY_15_MINUTE)
  handleSaveCharacters() : void {
    const players = this.playerManager.getPlayers()
    if (players.length > 0) {
      players.forEach(async player => {
        const [x, y, z] = GetEntityCoords(player.source)
        player.character.position = {x, y, z}
        await this.characterService.saveCharacter(player.source, player.character)
      })
    }
  }

  @Command({
    name: 'login',
    description: 'Connecte l\'utilisateur au serveur.',
    role: RoleType.ADMIN,
  })
  async loginCommand(source: number) {
    const user = this.userService
    const playerData = await this.characterService.loginCharacter(source);
    if (playerData) {
      this.playerManager.addPlayer(playerData);
      emitNet('orionCore:client:loadCharacter', source, playerData.character);
    } else {
      emitNet('characterCreator:client:openCharacterCreation', source);
    }
  }
}
