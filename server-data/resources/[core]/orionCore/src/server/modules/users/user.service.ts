import { Inject, Injectable } from '../../../core/decorators';
import {CharacterService} from "../characters/character.service";
import {PrismaService} from "../../../core/database/PrismaService";
import {RoleType} from "../roles/role.enum";
import {PlayerManagerService} from "../playerManager/playerManager.service";
import {Character, User} from "@prisma/client";

@Injectable()
export class UserService {
    @Inject(CharacterService)
    private characterServices!: CharacterService;

    @Inject(PrismaService)
    private prisma: PrismaService

    @Inject(PlayerManagerService)
    private playerManager!: PlayerManagerService;

    async findUserByLicense(license: string) : Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {license: license},
            include: {
                role: true,
                characters: true,
            },
        });
    }

    getPlayerIdentifier(playerId: number): string | null {
        for (let i = 0; i < GetNumPlayerIdentifiers(playerId.toString()); i++) {
            const identifier = GetPlayerIdentifier(playerId.toString(), i);
            if (identifier.includes('license:')) {
                return identifier;
            }
        }
        return null;
    }

    async handleLoginCommand(playerId: number) {
        const license = this.getPlayerIdentifier(playerId);

        if (!license) {
            emitNet('chat:addMessage', playerId, { args: ['Erreur', 'Impossible de récupérer l\'identifiant du joueur.'] });
            return;
        }

        try {
            const user = await this.prisma.user.findUnique({
                where: { license },
                include: {
                    characters: {
                        include: {
                            inventory: true,
                            vehicles: true,
                        },
                    },
                    role: true,
                },
            });
            if (user) {
                this.playerManager.removePlayer(playerId);
                user.source = playerId;
                const character = user.characters.find((char: { id: number; }) => char.id === user.activeCharacter);

                if (character) {
                   await this.characterServices.loadCharacter(playerId, character.id);
                    this.playerManager.addPlayer(playerId, user);
                    emitNet('chat:addMessage', playerId, { args: ['Admin', `Reconnexion réussie pour ${user.username}.`] });
                    return;
                } else {
                    emitNet('characterCreator:client:startCharacterCreation', playerId);
                    emitNet('chat:addMessage', playerId, { args: ['Admin', `Création d'un nouveau personnage nécessaire.`] });
                    return;
                }
            } else {
                emitNet('chat:addMessage', playerId, { args: ['Erreur', 'Utilisateur non trouvé.'] });
            }
        } catch (error) {
            console.error('Erreur lors de la connexion de l\'utilisateur:', error);
            emitNet('chat:addMessage', playerId, { args: ['Erreur', 'Une erreur s\'est produite lors de la connexion.'] });
        }
    }
    async getActiveCharacter(userId: string): Promise<Character | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                characters: true,
            },
        });

        if (!user) {
            return null;
        }
        return user.characters.find((char) => char.id === user.activeCharacter) || null;
    }

    async hasRoleOf(userId: string, roleName: RoleType): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });
        console.log(user.role.name, roleName)
        return user.role.name === roleName;
    }
}
