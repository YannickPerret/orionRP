import {UserService} from './user.service';
import {Command, GameEvent, Inject, Injectable} from '../../../core/decorators';
import {CharacterService} from '../characters/character.service';
import {PlayerManagerService} from '../playerManager/playerManager.service';
import {RoleType} from "../roles/role.enum";

@Injectable()
export class UserController {
  @Inject(UserService)
  private userService!: UserService;

  @Inject(CharacterService)
  private characterService!: CharacterService;

  @Inject(PlayerManagerService)
  private playerManager!: PlayerManagerService;

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

      const user = await this.userService.findUserByLicense(identifier);
      if (!user) {
        deferrals.done('Vous n\'êtes pas enregistré sur la whitelist.');
        return;
      }

      console.log(`Utilisateur ${user.role.name}:${name} connecté avec succès`);
      deferrals.update(`Bienvenue, ${name}. Connexion en cours...`);
      deferrals.done();
    } catch (error) {
      deferrals.done('Erreur lors de la connexion au serveur.');
    }
  }

  @GameEvent('playerDropped')
  async handleUserDropped(reason: string): Promise<void> {
    try {
      this.playerManager.removePlayer(source);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  @Command({
    name: 'login',
    description: 'Connecte l\'utilisateur au serveur.',
    role: RoleType.ADMIN,
  })
  async loginCommand(source: number) {
    await this.userService.handleLoginCommand(source);
  }
}
