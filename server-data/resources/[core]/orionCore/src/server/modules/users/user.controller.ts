import { UserService } from './user.service';
import { GameEvent } from '../../core/decorators';
import { CharacterService } from '../characters/character.service';
import {PlayerManagerService} from "../playerManager/playerManager.service";

export class UserController {
  private userService: UserService;
  private characterService: CharacterService;

  constructor() {
    this.userService = new UserService();
    this.characterService = new CharacterService();
  }

  @GameEvent('playerConnecting')
  async handleUserConnecting(name: string, setKickReason: any, deferrals: any): Promise<void> {
    deferrals.defer();
    const playerId = global.source;

    try {
      const identifier = this.userService.getPlayerIdentifier(playerId);
      if (!identifier) {
        deferrals.done('Impossible de récupérer votre identifiant.');
        return;
      }

      const user = await this.userService.findUserByIdentifier(identifier);
      if (!user) {
        deferrals.done('Vous n\'êtes pas enregistré sur la whitelist.');
        return;
      }

      console.log(`Utilisateur ${user.role.name}:${name} connecté avec succès`);
      deferrals.update(`Bienvenue, ${name}. Connexion en cours...`);
      deferrals.done();
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      deferrals.done('Erreur lors de la connexion au serveur.');
    }
  }

  @GameEvent('playerDropped')
  async handleUserDropped(reason: string): Promise<void> {
    const playerId = source;
    try {
      await this.userService.saveUserPosition(playerId);
      await this.characterService.saveCharacter(playerId);
      PlayerManagerService.getInstance().removePlayer(playerId);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}