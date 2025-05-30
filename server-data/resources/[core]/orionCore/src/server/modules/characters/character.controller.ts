// src/server/modules/characters/character.controller.ts
import '@citizenfx/server';
import { ServerEvent, Inject, Tick, TickInterval, Injectable, Command } from '../../../core/decorators';
import { CharacterService } from './character.service';
import { PlayerManagerService } from '../playerManager/playerManager.service';
import { UserService } from "../users/user.service";
import { NotifierService } from "../notifiers/notifier.service";
import { LoggerService } from "../../../core/modules/logger/logger.service";
import { PlayerData } from "../../../shared/player";
import { RoleType } from "../roles/role.enum";

// Import des nouveaux services
import { CacheService } from "../../../core/modules/cache/cache.service";
import { ConfigService } from "../../../core/modules/config/config.service";
import { ValidationService } from "../../../core/modules/validation/validation.service";
import { ErrorHandler, HandleErrors } from "../../../core/modules/error/error.handler";

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

  @Inject(CacheService)
  private cache!: CacheService

  @Inject(ConfigService)
  private config!: ConfigService

  @Inject(ValidationService)
  private validation!: ValidationService

  @Inject(ErrorHandler)
  private errorHandler!: ErrorHandler

  @ServerEvent('character:login')
  @HandleErrors()
  async handleLoginCharacter(): Promise<void> {
    const source = global.source;

    try {
      const playerData = await this.characterService.loginCharacter(source);

      if (playerData) {
        this.playerManager.addPlayer(playerData);
        emitNet('orionCore:client:loadCharacter', source, playerData.character);
        this.notifierService.notify(
            source,
            `Bienvenue ${playerData.character?.firstName} ${playerData.character?.lastName} !`,
            'info'
        );

        this.logger.log(`Character logged in: ${playerData.character?.firstName} (Source: ${source})`);
      } else {
        emitNet('characterCreator:client:openCharacterCreation', source);
        this.logger.log(`No character found for source ${source}, opening character creation`);
      }
    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'handleLoginCharacter',
        source
      });
      this.notifierService.error(source, 'Erreur lors de la connexion du personnage');
    }
  }

  @ServerEvent('character:register')
  @HandleErrors()
  async handleRegisterCharacter(playerId: number, characterData: any): Promise<void> {
    const license = this.userService.getPlayerIdentifier(source);
    if (!license) {
      this.notifierService.error(source, 'Impossible de récupérer votre identifiant');
      return;
    }

    // Validation des données de personnage
    const validationResult = this.validation.validate(characterData, {
      firstName: [
        ValidationService.Rules.required('Le prénom est requis'),
        ValidationService.Rules.minLength(2, 'Le prénom doit faire au moins 2 caractères'),
        ValidationService.Rules.maxLength(50, 'Le prénom ne peut pas dépasser 50 caractères')
      ],
      lastName: [
        ValidationService.Rules.required('Le nom est requis'),
        ValidationService.Rules.minLength(2, 'Le nom doit faire au moins 2 caractères'),
        ValidationService.Rules.maxLength(50, 'Le nom ne peut pas dépasser 50 caractères')
      ],
      gender: [
        ValidationService.Rules.required('Le genre est requis')
      ]
    });

    if (!validationResult.isValid) {
      this.notifierService.error(source, `Données invalides: ${validationResult.errors.join(', ')}`);
      return;
    }

    try {
      const character = await this.characterService.createCharacter(license, characterData);

      emitNet('orionCharacter:client:loadCharacter', playerId, character);
      emitNet('characterCreator:client:closeCharacterCreation', playerId);

      this.notifierService.success(source, `Personnage ${character.firstName} ${character.lastName} créé avec succès`);
      this.logger.log(`Character created: ${character.firstName} ${character.lastName} for ${license}`);

    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'handleRegisterCharacter',
        source,
        data: { ...characterData, license }
      });
      this.notifierService.error(source, 'Erreur lors de la création du personnage');
    }
  }

  @ServerEvent('character:load')
  @HandleErrors()
  async handleLoadCharacter(playerId: number, characterId: string): Promise<void> {
    try {
      const character = await this.characterService.loadCharacter(playerId, characterId);
      if (character) {
        this.logger.log(`Character loaded: ${character.firstName} ${character.lastName} for player ${playerId}`);
        this.notifierService.success(playerId, `Personnage ${character.firstName} chargé`);
      }
    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'handleLoadCharacter',
        source: playerId,
        characterId
      });
      this.notifierService.error(playerId, 'Erreur lors du chargement du personnage');
    }
  }

  @ServerEvent('character:save')
  @HandleErrors()
  async handleSaveCharacter(position: {x: number, y: number, z: number}, heading: number): Promise<void> {
    const source = global.source;

    try {
      const player = await this.playerManager.getPlayer(source);
      if (!player?.character) {
        this.logger.warn(`No character data found for player ${source}`);
        return;
      }

      // Mettre à jour la position
      player.character.position = position;

      await this.characterService.saveCharacter(source, player.character);
      this.notifierService.success(source, 'Personnage sauvegardé');
      this.logger.log(`Character saved for player ${source}`);

    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'handleSaveCharacter',
        source,
        position,
        heading
      });
      this.notifierService.error(source, 'Erreur lors de la sauvegarde');
    }
  }

  @ServerEvent('character:applyItemEffects')
  @HandleErrors()
  async handleApplyItemEffects(playerId: number, effects: any): Promise<void> {
    try {
      const character = await this.playerManager.getPlayer(playerId);
      if (character?.character) {
        // Application des effets (à implémenter selon vos besoins)
        this.logger.log(`Effects applied to character for player ${playerId}`);
        this.notifierService.success(playerId, 'Effets appliqués');
      }
    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'handleApplyItemEffects',
        source: playerId,
        effects
      });
      this.notifierService.error(playerId, 'Erreur lors de l\'application des effets');
    }
  }

  /**
   * Sauvegarde automatique des personnages toutes les 15 minutes
   */
  @Tick(TickInterval.EVERY_15_MINUTE)
  @HandleErrors()
  async handleSaveCharacters(): Promise<void> {
    const players = await this.playerManager.getPlayers();

    if (players.length === 0) {
      return;
    }

    let savedCount = 0;
    let errorCount = 0;

    for (const player of players) {
      try {
        if (player.character) {
          // Récupérer la position actuelle du joueur
          const coords = GetEntityCoords(GetPlayerPed(player.source.toString()));
          if (coords) {
            player.character.position = {
              x: coords[0],
              y: coords[1],
              z: coords[2]
            };
          }

          await this.characterService.saveCharacter(player.source, player.character);
          savedCount++;
        }
      } catch (error) {
        errorCount++;
        this.errorHandler.handle(error, {
          action: 'autoSaveCharacter',
          source: player.source,
          citizenid: player.character?.citizenid
        });
      }
    }

    if (savedCount > 0) {
      this.logger.log(`Auto-saved ${savedCount} characters (${errorCount} errors)`);
    }
  }

  @Command({
    name: 'login',
    description: 'Connecte l\'utilisateur au serveur.',
    role: RoleType.ADMIN,
  })
  @HandleErrors()
  async loginCommand(source: number) {
    try {
      const playerData = await this.characterService.loginCharacter(source);
      if (playerData) {
        this.playerManager.addPlayer(playerData);
        emitNet('orionCore:client:loadCharacter', source, playerData.character);
        this.notifierService.success(source, 'Connexion réussie');
      } else {
        emitNet('characterCreator:client:openCharacterCreation', source);
        this.notifierService.info(source, 'Aucun personnage trouvé, création en cours...');
      }
    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'loginCommand',
        source
      });
      this.notifierService.error(source, 'Erreur lors de la connexion');
    }
  }

  @Command({
    name: 'saveall',
    description: 'Sauvegarde tous les personnages connectés.',
    role: RoleType.ADMIN,
  })
  @HandleErrors()
  async saveAllCommand(source: number) {
    try {
      const players = await this.playerManager.getPlayers();
      let savedCount = 0;

      for (const player of players) {
        if (player.character) {
          await this.characterService.saveCharacter(player.source, player.character);
          savedCount++;
        }
      }

      this.notifierService.success(source, `${savedCount} personnages sauvegardés`);
      this.logger.log(`Manual save completed: ${savedCount} characters saved by admin ${source}`);
    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'saveAllCommand',
        source
      });
      this.notifierService.error(source, 'Erreur lors de la sauvegarde');
    }
  }

  @Command({
    name: 'clearcache',
    description: 'Vide le cache des personnages.',
    role: RoleType.ADMIN,
  })
  @HandleErrors()
  async clearCacheCommand(source: number) {
    try {
      // Nettoyer tous les caches liés aux personnages
      const players = await this.playerManager.getPlayers();
      let clearedCount = 0;

      for (const player of players) {
        this.cache.delete(`character_login_${player.source}`);
        if (player.character?.citizenid) {
          this.cache.delete(`character_${player.character.citizenid}`);
        }
        clearedCount++;
      }

      // Nettoyer le cache général
      this.cache.delete('all_players');

      this.notifierService.success(source, `Cache vidé pour ${clearedCount} personnages`);
      this.logger.log(`Cache cleared by admin ${source}: ${clearedCount} entries`);
    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'clearCacheCommand',
        source
      });
      this.notifierService.error(source, 'Erreur lors du nettoyage du cache');
    }
  }

  @Command({
    name: 'charstats',
    description: 'Affiche les statistiques des personnages.',
    role: RoleType.ADMIN,
  })
  @HandleErrors()
  async characterStatsCommand(source: number) {
    try {
      const players = await this.playerManager.getPlayers();
      const stats = {
        totalConnected: players.length,
        withCharacters: players.filter(p => p.character).length,
        byGender: players.reduce((acc, p) => {
          if (p.character?.gender) {
            acc[p.character.gender] = (acc[p.character.gender] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>),
        avgMoney: Math.round(
            players
                .filter(p => p.character?.money)
                .reduce((sum, p) => sum + p.character.money.money, 0) /
            players.filter(p => p.character?.money).length
        ) || 0
      };

      const message = `
📊 **Statistiques des Personnages** 📊
👥 Joueurs connectés: ${stats.totalConnected}
👤 Avec personnage: ${stats.withCharacters}
♂️ Hommes: ${stats.byGender.MALE || 0}
♀️ Femmes: ${stats.byGender.FEMALE || 0}
💰 Argent moyen: ${stats.avgMoney.toLocaleString()}€
            `;

      emit('chat:addMessage', {
        args: ['Admin', message],
        source: source
      });

    } catch (error) {
      this.errorHandler.handle(error, {
        action: 'characterStatsCommand',
        source
      });
      this.notifierService.error(source, 'Erreur lors de la récupération des statistiques');
    }
  }
}