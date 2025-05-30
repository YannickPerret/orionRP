// src/server/modules/characters/character.service.ts
import { Inject, Injectable } from '../../../core/decorators';
import { PlayerManagerService } from '../playerManager/playerManager.service';
import { PrismaService } from "../../../core/database/PrismaService";
import { randomUUID } from "node:crypto";
import { CharacterGender } from "@prisma/client";
import { CharInfo, PlayerData, Skin } from "../../../shared/player";
import { LoggerService } from "../../../core/modules/logger/logger.service";
import { UserService } from "../users/user.service";
import { RoleType } from "../roles/role.enum";

// Import des nouveaux services
import { CacheService } from "../../../core/modules/cache/cache.service";
import { ConfigService } from "../../../core/modules/config/config.service";
import { ValidationService } from "../../../core/modules/validation/validation.service";
import { ErrorHandler, HandleErrors } from "../../../core/modules/error/error.handler";
import { Cacheable } from "../../../core/modules/cache/cache.service";
import { Validate } from "../../../core/modules/validation/validation.service";

@Injectable()
export class CharacterService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    @Inject(PlayerManagerService)
    private playerManager!: PlayerManagerService;

    @Inject(LoggerService)
    private logger!: LoggerService;

    @Inject(UserService)
    private userService!: UserService;

    @Inject(CacheService)
    private cache!: CacheService;

    @Inject(ConfigService)
    private config!: ConfigService;

    @Inject(ValidationService)
    private validation!: ValidationService;

    @Inject(ErrorHandler)
    private errorHandler!: ErrorHandler;

    /**
     * Login avec cache et gestion d'erreurs
     */
    @HandleErrors()
    @Cacheable((source: number) => `character_login_${source}`, 300000) // 5 minutes
    async loginCharacter(source: number): Promise<PlayerData | null> {
        const license = this.userService.getPlayerIdentifier(source);
        if (!license) {
            throw new Error('Unable to get player identifier');
        }

        const user = await this.userService.findUserByLicense(license);
        if (!user) {
            this.logger.error(`User not found with license ${license}`);
            return null;
        }

        if (user.characters && user.characters.length > 0) {
            const activeCharacter = user.characters.find((char) => char.id === user.activeCharacter) || null;

            if (!activeCharacter) {
                this.logger.log('No active character found for this user.');
                return null;
            }

            const skin = activeCharacter.appearance as Skin;
            const position = activeCharacter.position as { x: number; y: number; z: number };

            const playerData: PlayerData = {
                id: user.id,
                license: user.license,
                username: user.username,
                steamId: user.steamId || null,
                active: user.active,
                role: user.role.name as RoleType,
                source: source,
                activeCharacter: activeCharacter.id,
                character: {
                    citizenid: activeCharacter.citizenid,
                    firstName: activeCharacter.firstName,
                    lastName: activeCharacter.lastName,
                    user_id: activeCharacter.userId,
                    gender: activeCharacter.gender,
                    phone: activeCharacter.phone || null,
                    money: {
                        marked_money: 0,
                        money: activeCharacter.money,
                    },
                    bank: activeCharacter.bank,
                    skin: skin,
                    position: position,
                    health: activeCharacter.health,
                    armor: activeCharacter.armor,
                    hunger: activeCharacter.hunger,
                    thirst: activeCharacter.thirst,
                },
            };

            return playerData;
        } else {
            this.logger.log(`No active character found for user ${user.username}`);
            return null;
        }
    }

    /**
     * Création de personnage avec validation
     */
    @HandleErrors()
    @Validate({
        firstName: [
            ValidationService.Rules.required('First name is required'),
            ValidationService.Rules.minLength(2, 'First name must be at least 2 characters'),
            ValidationService.Rules.maxLength(50, 'First name must be less than 50 characters')
        ],
        lastName: [
            ValidationService.Rules.required('Last name is required'),
            ValidationService.Rules.minLength(2, 'Last name must be at least 2 characters'),
            ValidationService.Rules.maxLength(50, 'Last name must be less than 50 characters')
        ],
        gender: [
            ValidationService.Rules.required('Gender is required')
        ]
    })
    async createCharacter(license: string, characterData: any) {
        try {
            const user = await this.prisma.user.findUnique({ where: { license: license } });
            if (!user) {
                throw new Error('User not found');
            }

            const genderEnumValue = characterData.gender === 'male' ? CharacterGender.MALE : CharacterGender.FEMALE;

            // Utiliser la configuration centralisée
            const characterConfig = this.config.getCharacterConfig();

            const newCharacter = await this.prisma.character.create({
                data: {
                    userId: user.id,
                    citizenid: randomUUID(),
                    firstName: characterData.firstName,
                    lastName: characterData.lastName,
                    gender: genderEnumValue,
                    appearance: characterData.appearance,
                    clothes: characterData.clothes,
                    model: characterData.model || 'mp_m_freemode_01',
                    position: characterConfig.spawnPosition,
                    money: characterConfig.defaultMoney,
                    bank: characterConfig.defaultBank,
                },
            });

            await this.switchActiveCharacter(user.id, newCharacter.id);

            // Invalider le cache de login pour ce joueur
            this.cache.delete(`character_login_${user.source}`);

            this.logger.log(`Character created: ${newCharacter.firstName} ${newCharacter.lastName}`);
            return newCharacter;

        } catch (error) {
            this.errorHandler.handle(error, {
                action: 'createCharacter',
                userId: license,
                data: characterData
            });
            throw error;
        }
    }

    /**
     * Chargement de personnage avec cache
     */
    @HandleErrors()
    @Cacheable((playerId: number, characterId: string) => `character_${characterId}`, 600000) // 10 minutes
    async loadCharacter(playerId: number, characterId: string) {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId },
            include: {
                inventory: true,
                vehicles: true,
            },
        });

        if (!character) {
            throw new Error('Character not found');
        }

        emitNet('orionCore:client:loadCharacter', playerId, {
            position: character.position,
            model: character.model,
            appearance: character.appearance,
            clothes: character.clothes
        });

        return character;
    }

    /**
     * Sauvegarde avec gestion d'erreurs et invalidation de cache
     */
    @HandleErrors()
    async saveCharacter(playerId: number, character: CharInfo): Promise<void> {
        const characterData = {
            firstName: character.firstName,
            lastName: character.lastName,
            userId: character.user_id,
            gender: character.gender,
            phone: character.phone,
            money: character.money.money,
            bank: character.bank,
            appearance: character.skin,
            position: character.position,
            health: character.health,
            armor: character.armor,
            hunger: character.hunger,
            thirst: character.thirst,
        };

        await this.prisma.character.update({
            where: { citizenid: character.citizenid },
            data: characterData,
        });

        // Invalider les caches pertinents
        this.cache.delete(`character_${character.citizenid}`);
        this.cache.delete(`character_login_${playerId}`);

        this.logger.log(`Character saved for player ${playerId}`);
    }

    /**
     * Mise à jour avec cache et retry automatique
     */
    @HandleErrors()
    async updateCharacterAndCache(
        playerId: number,
        characterId: string,
        updateData: Partial<any>
    ): Promise<void> {
        // Retry automatique en cas d'échec de base de données
        const updatedCharacter = await this.prisma.executeWithRetry(async () => {
            return this.prisma.character.update({
                where: { id: characterId },
                data: updateData,
            });
        });

        const player = this.playerManager.getPlayer(playerId);
        if (player && player.activeCharacter === characterId) {
            const updatedUser = {
                ...player,
                activeCharacterData: updatedCharacter,
            };
            this.playerManager.updatePlayer(updatedUser);
        }

        // Invalider tous les caches liés à ce personnage
        this.cache.delete(`character_${characterId}`);
        this.cache.delete(`character_login_${playerId}`);

        this.logger.log(`Character ${characterId} updated for player ${playerId}`);
    }

    @HandleErrors()
    async deleteCharacter(characterId: string): Promise<void> {
        await this.prisma.character.delete({
            where: { id: characterId },
        });

        // Nettoyer le cache
        this.cache.delete(`character_${characterId}`);

        this.logger.log(`Character ${characterId} deleted.`);
    }

    @HandleErrors()
    async switchActiveCharacter(userId: string, characterId: string): Promise<void> {
        const character = await this.prisma.character.findFirst({
            where: {
                id: characterId,
                userId: userId,
            },
        });

        if (!character) {
            throw new Error(`Character ${characterId} not found or doesn't belong to user ${userId}`);
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                activeCharacter: characterId,
            },
        });

        // Invalider le cache de login pour tous les joueurs de cet utilisateur
        // (un utilisateur pourrait être connecté sur plusieurs sessions)
        const allPlayers = this.playerManager.getPlayers();
        const userPlayers = allPlayers.filter(p => p.id === userId);
        userPlayers.forEach(player => {
            this.cache.delete(`character_login_${player.source}`);
        });

        this.logger.log(`Character ${characterId} selected for user ${userId}.`);
    }
}