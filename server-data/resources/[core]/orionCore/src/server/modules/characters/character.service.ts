import {Inject, Injectable} from '../../../core/decorators';
import {PlayerManagerService} from '../playerManager/playerManager.service';
import {PrismaService} from "../../../core/database/PrismaService";
import {randomUUID} from "node:crypto";
import {Character, CharacterGender} from "@prisma/client";

@Injectable()
export class CharacterService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    @Inject(PlayerManagerService)
    private playerManager!: PlayerManagerService;

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
                    money: 500,
                    bank: 1000,
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

    async saveCharacter(playerId: number, position: { x: number, y: number, z: number }, heading: number): Promise<void> {
        try {
            const player = this.playerManager.getPlayer(playerId);
            if (!player || !player.activeCharacter) {
                throw new Error('Aucun personnage actif trouvé');
            }

            const character = await this.prisma.character.findUnique({
                where: { id: player.activeCharacter },
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            await this.prisma.character.update({
                where: { id: character.id },
                data: {
                    position: position,
                },
            });

            console.log(`Personnage sauvegardé pour le joueur ${playerId}`);
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

    async modifyMoney(sourcePlayerId:number, targetPlayerId: number, amount: number): Promise<number> {
        return this.prisma.$transaction(async (prisma) => {
            const character = await prisma.character.findUnique({
                where: {id: characterId},
                select: {money: true},
            });

            if (!character) {
                throw new Error('Personnage non trouvé');
            }

            const newBalance = character.money + amount;
            if (newBalance < 0) {
                throw new Error('Fonds insuffisants');
            }
            const updatedCharacter = await prisma.character.update({
                where: {id: characterId},
                data: {
                    money: newBalance,
                },
                select: {money: true},
            });

            console.log(`Le nouveau solde pour le personnage ${characterId} est de ${updatedCharacter.money} unités.`);

            return updatedCharacter.money;
        });
    }
}
