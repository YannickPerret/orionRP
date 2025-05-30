import {Inject, Injectable} from '../../../core/decorators';
import {PlayerManagerService} from '../playerManager/playerManager.service';
import {PrismaService} from "../../../core/database/PrismaService";
import {randomUUID} from "node:crypto";
import {CharacterGender} from "@prisma/client";
import {config} from "../../config/config";
import {CharInfo, PlayerData, Skin} from "../../../shared/player";
import {LoggerService} from "../../../core/modules/logger/logger.service";
import {UserService} from "../users/user.service";
import {RoleType} from "../roles/role.enum";

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

    async loginCharacter(source: number, user): Promise<PlayerData | null> {
        const license = this.userService.getPlayerIdentifier(source);
        const user = await this.userService.findUserByLicense(license);

        if (!user) {
            this.logger.error(`Utilisateur introuvable avec la licence ${license}`);
            return null;
        }

        if (user.characters && user.characters.length > 0) {
            const activeCharacter = user.characters.find((char) => char.id === user.activeCharacter) || null;

            if (!activeCharacter) {
                this.logger.log('Aucun personnage actif trouvé pour cet utilisateur.');
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
            this.logger.log(`Aucun personnage actif trouvé pour l'utilisateur ${user.username}`);
            return null;
        }
    }

    async createCharacter(license: string, characterData: any) {
        try {
            const user = await this.prisma.user.findUnique({ where: { license: license } });
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            const genderEnumValue = characterData.gender === 'male' ? CharacterGender.MALE : CharacterGender.FEMALE;

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
                    position: { x: -1037.79, y: -2737.87, z: 13.77 },
                    money: config.character.money,
                    bank: config.character.bank,
                },
            });

            await this.switchActiveCharacter(user.id, newCharacter.id)

            return newCharacter;
        } catch (error) {
            throw new Error(`Erreur lors de la création du personnage: ${error.message}`);
        }
    }

    async loadCharacter(playerId: number, characterId: string) {
        try {
            const character = await this.prisma.character.findUnique({
                where: { id: characterId },
                include: {
                    inventory: true,
                    vehicles: true,
                },
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }
            emitNet('orionCore:client:loadCharacter', playerId, {position: character.position, model: character.model, appearance: character.appearance, clothes: character.clothes})
            return character;
        } catch (error) {
            throw new Error(`Erreur lors du chargement du personnage: ${error.message}`);
        }
    }

    async saveCharacter(playerId: number, character: CharInfo): Promise<void> {
        try {

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

            this.logger.log(`Personnage sauvegardé pour le joueur ${playerId}`);
        } catch (error) {
            throw new Error(`Erreur lors de la sauvegarde du personnage: ${error.message}`);
        }
    }

    async updateCharacterAppearance(characterId: string, appearance: any, clothes: any) {
        try {
            return await this.prisma.character.update({
                where: { id: characterId },
                data: {
                    appearance,
                    clothes,
                },
            });

        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de l'apparence: ${error.message}`);
        }
    }

    async deleteCharacter(characterId: string): Promise<void> {
        try {
            await this.prisma.character.delete({
                where: { id: characterId },
            });

            console.log(`Personnage avec l'ID ${characterId} supprimé.`);
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du personnage: ${error.message}`);
        }
    }

    async switchActiveCharacter(userId: string, characterId: string): Promise<void> {
        try {
            const character = await this.prisma.character.findFirst({
                where: {
                    id: characterId,
                    userId: userId,
                },
            });

            if (!character) {
                throw new Error(`Le personnage avec l'ID ${characterId} n'appartient pas à l'utilisateur ${userId} ou n'existe pas.`);
            }

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    activeCharacter: characterId,
                },
            });

            console.log(`Personnage ${characterId} sélectionné pour l'utilisateur ${userId}.`);
        } catch (error) {
            throw new Error(`Erreur lors du changement de personnage: ${error.message}`);
        }
    }

    async updateCharacterAndCache(
        playerId: number,
        characterId: string,
        updateData: Partial<any>
    ): Promise<void> {
        try {
            const updatedCharacter = await this.prisma.character.update({
                where: { id: characterId },
                data: updateData,
            });

            const player = this.playerManager.getPlayer(playerId);
            if (player && player.activeCharacter === characterId) {
                const updatedUser = {
                    ...player,
                    activeCharacterData: updatedCharacter,
                };
                this.playerManager.addPlayer(playerId, updatedUser)
            }

            console.log(`Personnage ${characterId} mis à jour pour le joueur ${playerId}`);
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du personnage ${characterId} : ${error.message}`);
        }
    }
}
