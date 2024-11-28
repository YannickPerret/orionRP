import {UserService} from './user.service';
import {GameEvent, Inject, Injectable} from '../../../core/decorators';
import {PlayerManagerService} from '../playerManager/playerManager.service';
import {LoggerService} from "../../../core/modules/logger/logger.service";

@Injectable()
export class UserController {
  @Inject(UserService)
  private userService!: UserService;

  @Inject(PlayerManagerService)
  private playerManager!: PlayerManagerService;

  @Inject(LoggerService)
    private logger: LoggerService;

  @GameEvent('playerConnecting')
  async handleUserConnecting(name: string, setKickReason: any, deferrals: any): Promise<void> {
    deferrals.defer();
    try {
      const user = await this.userService.login(source);
      if (!user) {
        deferrals.done('Impossible de récupérer votre identifiant.');
        return;
      }
      this.logger.log(`Utilisateur ${user.role.name}:${name} connecté avec succès`);
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
}
