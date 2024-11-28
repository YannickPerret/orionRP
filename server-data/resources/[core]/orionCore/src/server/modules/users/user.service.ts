import { Inject, Injectable } from '../../../core/decorators';
import { CharacterService } from "../characters/character.service";
import { PrismaService } from "../../../core/database/PrismaService";
import { RoleType } from "../roles/role.enum";
import { Character, User } from "@prisma/client";
import { PlayerManagerService } from "../playerManager/playerManager.service";
import {LoggerService} from "../../../core/modules/logger/logger.service";

@Injectable()
export class UserService {
    @Inject(CharacterService)
    private characterServices!: CharacterService;

    @Inject(PrismaService)
    private prisma: PrismaService;

    @Inject(PlayerManagerService)
    private playerManager: PlayerManagerService;

    @Inject(LoggerService)
    private logger: LoggerService;

    async findUserByLicense(license: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { license },
            include: {
                role: true,
                characters: {
                    include: {
                        inventory: true,
                        vehicles: true,
                    }
                }
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

    async login(playerId: number) {
        try {
            const license = this.getPlayerIdentifier(playerId);
            if (!license) {
                this.logger.error('Impossible de récupérer l\'identifiant du joueur.');
                return;
            }
            const user = await this.prisma.user.findUnique({
                where: { license },
                include: {
                    characters: true,
                    role: true,
                },
            });

            if (!user) {
                this.logger.error('Utilisateur non trouvé.');
                return;
            }
            return user;
        }
        catch (error) {
            this.logger.error('Erreur lors de la connexion de l\'utilisateur:');
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

        if (!user || !user.role) {
            return false;
        }

        return user.role.name === roleName;
    }
}
