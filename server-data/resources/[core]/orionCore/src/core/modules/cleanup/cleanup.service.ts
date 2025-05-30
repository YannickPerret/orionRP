// src/core/modules/cleanup/cleanup.service.ts
import { Injectable, Inject, Tick, TickInterval } from '../../decorators';
import { CacheService } from '../cache/cache.service';
import { LoggerService } from '../logger/logger.service';
import { VehicleService } from '../../../server/modules/vehicles/vehicle.service';

@Injectable()
export class CleanupService {
    @Inject(CacheService)
    private cache: CacheService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    /**
     * Nettoyage du cache toutes les minutes
     */
    @Tick(TickInterval.EVERY_MINUTE)
    cleanupCache(): void {
        try {
            this.cache.cleanup();
            this.logger.debug('Cache cleanup completed');
        } catch (error) {
            this.logger.error('Error during cache cleanup:', error);
        }
    }

    /**
     * Nettoyage des véhicules abandonnés toutes les heures
     */
    @Tick(TickInterval.EVERY_HOUR)
    async cleanupVehicles(): Promise<void> {
        try {
            const cleanedCount = await this.vehicleService.cleanupAbandonedVehicles();
            if (cleanedCount > 0) {
                this.logger.log(`Cleaned up ${cleanedCount} abandoned vehicles`);
            }
        } catch (error) {
            this.logger.error('Error during vehicle cleanup:', error);
        }
    }

    /**
     * Statistiques système toutes les 15 minutes
     */
    @Tick(TickInterval.EVERY_15_MINUTE)
    logSystemStats(): void {
        try {
            const memUsage = process.memoryUsage();
            const stats = {
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
                external: Math.round(memUsage.external / 1024 / 1024),
                uptime: Math.round(process.uptime() / 60) // en minutes
            };

            this.logger.log('System Stats:', stats);
        } catch (error) {
            this.logger.error('Error getting system stats:', error);
        }
    }
}