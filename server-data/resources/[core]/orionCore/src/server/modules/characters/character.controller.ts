import '@citizenfx/server';
import {ServerEvent, Inject, Tick, TickInterval} from '../../../core/decorators';
import { CharacterService } from './character.service';
import { PlayerManagerService } from '../playerManager/playerManager.service';
import {UserService} from "../users/user.service";
import {Character, User} from "@prisma/client";
import {NotifierService} from "../notifiers/notifier.service";
import {getClosestPlayer} from "../../../utils/fivem";
import {LoggerService} from "../../../core/modules/logger/logger.service";

export class CharacterController {
  @Inject(CharacterService)
  private characterService!: CharacterService;

  @Inject(PlayerManagerService)
  private playerManager!: PlayerManagerService;

  @Inject(UserService)
  private userService!: UserService

  @Inject(NotifierService)
    private notifierService!: NotifierService

  @Inject(LoggerService)
    private logger!: LoggerService

  @ServerEvent('character:login')
  async handleLoginCharacter(source: number): Promise<void> {
    try {
      const license = this.userService.getPlayerIdentifier(source);
      const user = await this.userService.findUserByLicense(license);

      if (!user) {
        console.log(`Utilisateur introuvable avec la licence ${license}`);
        return;
      }

      if (user.characters && user.characters.length > 0) {
        const character: Character = await this.userService.getActiveCharacter(user.id);
        emitNet('orionCore:client:loadCharacter', source, character);
        this.playerManager.addPlayer(source, user)
        this.notifierService.notify(source, `Bienvenue ${character.firstName} ${character.lastName} !`, 'info')

      } else {
        console.log(`Aucun personnage actif trouvé pour l'utilisateur ${user.username}`);
        emitNet('characterCreator:client:openCharacterCreation', source);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du personnage:', error);
    }
  }


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

  @ServerEvent('money:send')
  handleSendMoney(targetPlayer:number, amount: number): void {
    if (targetPlayer) {
      console.log(`Le joueur ${source} envoie ${amount} $ au joueur ${targetPlayer}`);
      this.characterService.modifyMoney(source, targetPlayer, amount);
    }
    else {
      this.logger.error('Aucun joueur à proximité pour envoyer de l\'argent');
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
