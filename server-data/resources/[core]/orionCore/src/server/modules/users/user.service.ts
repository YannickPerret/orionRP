import { Inject, Injectable } from '../../../core/decorators';
import {CharacterService} from "../characters/character.service";
import {PrismaService} from "../../../core/database/PrismaService";
import {RoleType} from "../roles/role.enum";
import {PlayerManagerService} from "../playerManager/playerManager.service";

@Injectable()
export class UserService {
    @Inject(CharacterService)
    private characterServices!: CharacterService;

    @Inject(PrismaService)
    private prisma: PrismaService

    @Inject(PlayerManagerService)
    private playerManager!: PlayerManagerService;

    async findUserByLicense(license: string) {
        return this.prisma.user.findUnique({
            where: {license: license},
            include: {
                role: true,
                characters: true,
            },
        });
    }

    async isAdmin(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        return user?.role?.name === RoleType.ADMIN;
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

    async saveUserPosition(playerId: number): Promise<void> {
        const license = this.getPlayerIdentifier(playerId);
        if (!license) return;

        const user = await this.findUserByLicense(license);
        if (!user?.activeCharacter) return;

        const character = await this.prisma.character.findUnique({
            where: { id: user.activeCharacter },
        });

        if (character) {
            const [x, y, z] = GetEntityCoords(GetPlayerPed(playerId));
            await this.prisma.character.update({
                where: { id: character.id },
                data: {
                    position: { x, y, z },
                },
            });
        }
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
}
