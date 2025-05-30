// src/server/modules/playerManager/playerManager.service.ts
import { Injectable, Inject } from "../../../core/decorators";
import { PlayerData } from "../../../shared/player";
import { CacheService } from "../../../core/modules/cache/cache.service";
import { LoggerService } from "../../../core/modules/logger/logger.service";
import { ErrorHandler, HandleErrors } from "../../../core/modules/error/error.handler";

@Injectable()
export class PlayerManagerService {
    @Inject(CacheService)
    private cache: CacheService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(ErrorHandler)
    private errorHandler: ErrorHandler;

    private connectedPlayers: Map<number, PlayerData> = new Map();

    /**
     * Récupère tous les joueurs connectés avec cache
     */
    async getPlayers(): Promise<PlayerData[]> {
        return this.cache.getOrSet(
            'all_players',
            () => Promise.resolve(Array.from(this.connectedPlayers.values())),
            30000 // 30 secondes
        );
    }

    /**
     * Ajoute un joueur avec validation et gestion d'erreurs
     */
    @HandleErrors()
    addPlayer(player: PlayerData): void {
        if (!player?.source) {
            this.logger.error('Invalid player data provided');
            return;
        }

        if (this.connectedPlayers.has(player.source)) {
            this.logger.warn(`Player ${player.source} already exists, updating...`);
        }

        this.connectedPlayers.set(player.source, player);
        this.cache.delete('all_players'); // Invalider le cache

        this.logger.log(`Player added: ${player.character?.firstName} (Source: ${player.source})`);
    }

    /**
     * Récupère un joueur avec cache individuel
     */
    async getPlayer(source: number): Promise<PlayerData | null> {
        return this.cache.getOrSet(
            `player_${source}`,
            () => Promise.resolve(this.connectedPlayers.get(source) || null),
            60000 // 1 minute
        );
    }

    /**
     * Met à jour un joueur avec invalidation de cache et gestion d'erreurs
     */
    @HandleErrors()
    updatePlayer(player: PlayerData): void {
        if (!this.connectedPlayers.has(player.source)) {
            this.logger.warn(`Cannot update non-existent player: ${player.source}`);
            return;
        }

        this.connectedPlayers.set(player.source, player);

        // Invalider les caches pertinents
        this.cache.delete(`player_${player.source}`);
        this.cache.delete('all_players');

        this.logger.log(`Player updated: ${player.character?.firstName} (Source: ${player.source})`);
    }

    /**
     * Supprime un joueur avec nettoyage de cache
     */
    removePlayer(source: number): boolean {
        const existed = this.connectedPlayers.delete(source);

        if (existed) {
            this.cache.delete(`player_${source}`);
            this.cache.delete('all_players');
            this.logger.log(`Player removed: ${source}`);
        }

        return existed;
    }

    /**
     * Trouve des joueurs par critères
     */
    findPlayers(predicate: (player: PlayerData) => boolean): PlayerData[] {
        return Array.from(this.connectedPlayers.values()).filter(predicate);
    }

    /**
     * Statistiques des joueurs connectés
     */
    getStats(): PlayerStats {
        const players = Array.from(this.connectedPlayers.values());

        return {
            total: players.length,
            byRole: this.groupBy(players, p => p.role),
            averagePlayTime: this.calculateAveragePlayTime(players)
        };
    }

    private groupBy<T, K extends string | number>(
        array: T[],
        keyFn: (item: T) => K
    ): Record<K, number> {
        return array.reduce((acc, item) => {
            const key = keyFn(item);
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<K, number>);
    }

    private calculateAveragePlayTime(players: PlayerData[]): number {
        // Implémentation basique - à améliorer selon vos besoins
        return players.length > 0 ? 60 : 0; // Placeholder
    }
}

interface PlayerStats {
    total: number;
    byRole: Record<string, number>;
    averagePlayTime: number;
}