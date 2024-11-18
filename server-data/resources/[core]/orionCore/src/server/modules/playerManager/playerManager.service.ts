import {Injectable} from "../../../core/decorators";
import { User } from '@prisma/client';

@Injectable()
export class PlayerManagerService {
    private readonly players: Map<number, User>;

    constructor() {
        this.players = new Map<number, User>();
    }

    addPlayer(playerId: number, user: User): void {
        console.log(`Joueur ajouté : ${user.username} (ID: ${playerId})`);

        this.players.set(playerId, user);
    }

    removePlayer(playerId: number): void {
        const removed = this.players.delete(playerId);
        if (removed) {
            console.log(`Joueur supprimé avec l'ID : ${playerId}`);
        } else {
            console.log(`Aucun joueur trouvé avec l'ID : ${playerId}`);
        }
    }

    getPlayer(playerId: number): User | undefined {
        const user = this.players.get(playerId);
        if (!user) {
            console.log(`Aucun utilisateur trouvé pour l'ID de joueur : ${playerId}`);
        }
        return user;
    }

    getAllPlayers(): Map<number, User> {
        return this.players;
    }
}
