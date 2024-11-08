import {User} from "./user.entity";
import {Character} from "../characters/character.entity";
import {PlayerManagerService} from "../playerManager/playerManager.service";

export class UserService {
    private playerManager = PlayerManagerService.getInstance();

    async findUserByIdentifier(identifier: string): Promise<User | null> {
        return await User.findOne({
            where: { identifier },
            relations: ['role', 'characters']
        });
    }

    isAdmin(playerId: number): boolean {
        return this.playerManager.isAdmin(playerId);
    }

    getPlayerIdentifier(playerId: number): string | null {
        const playerIdStr = playerId.toString();
        for (let i = 0; i < GetNumPlayerIdentifiers(playerIdStr); i++) {
            const identifier = GetPlayerIdentifier(playerIdStr, i);
            if (identifier.includes('licence:')) {
                return identifier;
            }
        }
        return null;
    }

    async saveUserPosition(playerId: number): Promise<void> {
        const identifier = this.getPlayerIdentifier(playerId);
        if (!identifier) return;

        const user = await this.findUserByIdentifier(identifier);
        if (!user?.activeCharacter) return;

        const character = await Character.findOne({
            where: { id: user.activeCharacter }
        });

        if (character) {
            character.position = GetEntityCoords(playerId);
            await character.save();
        }
    }
}
