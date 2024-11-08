import {User} from "../users/user.entity";
import {RoleType} from "../roles/role.entity";

export class PlayerManagerService {
    private static instance: PlayerManagerService;
    private readonly players: Map<number, User>;

    private constructor() {
        this.players = new Map<number, User>();
    }

    static getInstance(): PlayerManagerService {
        if (!PlayerManagerService.instance) {
            PlayerManagerService.instance = new PlayerManagerService();
        }
        return PlayerManagerService.instance;
    }

    addPlayer(playerId: number, user: User): void {
        this.players.set(playerId, user);
    }

    removePlayer(playerId: number): void {
        this.players.delete(playerId);
    }

    isAdmin(playerId: number): boolean {
        const player = this.players.get(playerId);
        return player !== undefined && player.role !== undefined && player.role.name === RoleType.ADMIN;
    }

    getPlayer(playerId: number): User | undefined {
        return this.players.get(playerId);
    }

    getAllPlayers(): Map<number, User> {
        return this.players;
    }
}