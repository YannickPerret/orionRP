import {Injectable} from "../../../core/decorators";
import {PlayerData} from "../../../shared/player";

@Injectable()
export class PlayerManagerService {
    // Gestion des joueurs connectés avec un Record.
    private connectedPlayers: Record<number, PlayerData> = {};

    /**
     * Récupère tous les joueurs connectés.
     */
    public getPlayers(): PlayerData[] {
        return Object.values(this.connectedPlayers);
    }

    /**
     * Ajoute un joueur au cache global.
     * @param player Les données du joueur à ajouter.
     */
    public addPlayer(player: PlayerData): void {
        if (this.connectedPlayers[player.source]) {
            console.warn(`Le joueur avec la source ${player.source} est déjà ajouté.`);
            return;
        }
        this.connectedPlayers[player.source] = player;
        console.log(`Joueur ajouté : ${player.character.firstname} (Source: ${player.source})`);
    }

    /**
     * Récupère les informations d'un joueur par sa source.
     * @param source La source du joueur.
     * @returns Les données du joueur ou null si non trouvé.
     */
    public getPlayer(source: number): PlayerData | null {
        const player = this.connectedPlayers[source] || null;
        if (!player) {
            console.warn(`Aucun joueur trouvé pour la source ${source}.`);
        }
        return player;
    }

    /**
     * Met à jour les données d'un joueur existant.
     * @param player Les nouvelles données du joueur.
     */
    public updatePlayer(player: PlayerData): void {
        if (!this.connectedPlayers[player.source]) {
            console.warn(`Impossible de mettre à jour : joueur avec la source ${player.source} introuvable.`);
            return;
        }
        this.connectedPlayers[player.source] = player;
        console.log(`Données mises à jour pour le joueur : ${player.character.firstname} (Source: ${player.source})`);
    }

    /**
     * Supprime un joueur du cache global.
     * @param source La source du joueur à supprimer.
     */
    public removePlayer(source: number): void {
        if (!this.connectedPlayers[source]) {
            console.warn(`Aucun joueur trouvé avec la source ${source} à supprimer.`);
            return;
        }
        delete this.connectedPlayers[source];
        console.log(`Joueur supprimé avec la source ${source}.`);
    }
}
