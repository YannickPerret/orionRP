// src/server/modules/vehicles/vehicle.service.ts
import { Injectable, Inject } from '../../../core/decorators';
import { PrismaService } from "../../../core/database/PrismaService";
import { Vehicle } from "@prisma/client";
import { Delay } from "../../../utils/fivem";

// Import des nouveaux services
import { CacheService } from "../../../core/modules/cache/cache.service";
import { ConfigService } from "../../../core/modules/config/config.service";
import { ValidationService } from "../../../core/modules/validation/validation.service";
import { ErrorHandler, HandleErrors } from "../../../core/modules/error/error.handler";
import { Cacheable } from "../../../core/modules/cache/cache.service";
import { Validate } from "../../../core/modules/validation/validation.service";

@Injectable()
export class VehicleService {
    @Inject(PrismaService)
    private prisma!: PrismaService;

    @Inject(CacheService)
    private cache!: CacheService;

    @Inject(ConfigService)
    private config!: ConfigService;

    @Inject(ValidationService)
    private validation!: ValidationService;

    @Inject(ErrorHandler)
    private errorHandler!: ErrorHandler;

    // Cache des plaques générées pour éviter les doublons
    private generatedPlates: Set<string> = new Set();

    /**
     * Spawn de véhicule avec validation et gestion d'erreurs
     */
    @HandleErrors()
    @Validate({
        modelName: [
            ValidationService.Rules.required('Model name is required'),
            ValidationService.Rules.minLength(3, 'Model name too short')
        ],
        playerId: [
            ValidationService.Rules.required('Player ID is required'),
            ValidationService.Rules.isNumber('Player ID must be a number'),
            ValidationService.Rules.isPositive('Player ID must be positive')
        ]
    })
    async spawnNewVehicle(
        playerId: number,
        modelName: string,
        position?: [number, number, number, number],
        warp: boolean = true
    ): Promise<[number, number]> {

        if (!position) {
            const ped = GetPlayerPed(playerId);
            if (!ped) {
                throw new Error('Invalid or non-existent player specified.');
            }
            const [x, y, z] = GetEntityCoords(ped, true) as [number, number, number];
            const heading = GetEntityHeading(ped);
            position = [x, y, z, heading];
        }

        const modelHash = typeof modelName === 'string' ? GetHashKey(modelName) : modelName;
        const vehicleType = typeof modelName === 'string' ? 'automobile' : 'aircraft';
        const [x, y, z, heading] = position;

        const vehicle = CreateVehicleServerSetter(modelHash, vehicleType, x, y, z, heading);

        while (!DoesEntityExist(vehicle)) {
            await Delay(10);
        }

        if (warp) {
            await Delay(400)
            TaskWarpPedIntoVehicle(GetPlayerPed(playerId), vehicle, -1);
        }

        const networkId = NetworkGetNetworkIdFromEntity(vehicle);

        // Cache du véhicule spawné
        this.cache.set(`spawned_vehicle_${networkId}`, {
            playerId,
            modelName,
            spawnTime: Date.now()
        }, 600000); // 10 minutes

        return [networkId, vehicle];
    }

    /**
     * Enregistrement de véhicule avec validation
     */
    @HandleErrors()
    @Validate({
        characterId: [
            ValidationService.Rules.required('Character ID is required')
        ],
        model: [
            ValidationService.Rules.required('Vehicle model is required'),
            ValidationService.Rules.minLength(3, 'Model name too short')
        ],
        plate: [
            ValidationService.Rules.required('Plate is required'),
            ValidationService.Rules.minLength(1, 'Plate cannot be empty'),
            ValidationService.Rules.maxLength(8, 'Plate too long')
        ]
    })
    async registerNewVehicle(characterId: string, vehicleData: Partial<any>): Promise<Vehicle> {
        const character = await this.prisma.character.findUnique({
            where: { id: characterId }
        });

        if (!character) {
            throw new Error('Character not found');
        }

        // Vérifier que la plaque n'existe pas déjà
        const existingVehicle = await this.prisma.vehicle.findFirst({
            where: { plate: vehicleData.plate }
        });

        if (existingVehicle) {
            vehicleData.plate = this.generateVehiclePlate();
        }

        const vehicle = await this.prisma.vehicle.create({
            data: {
                ...vehicleData,
                character: {
                    connect: { id: characterId },
                },
            },
        });

        // Invalider le cache des véhicules du personnage
        this.cache.delete(`vehicles_character_${characterId}`);

        return vehicle;
    }

    /**
     * Récupération de véhicule par ID avec cache
     */
    @HandleErrors()
    @Cacheable((vehicleId: string) => `vehicle_${vehicleId}`, 300000) // 5 minutes
    async getVehicleById(vehicleId: string) {
        return this.prisma.vehicle.findUnique({
            where: { id: vehicleId },
            include: { character: true },
        });
    }

    /**
     * Récupération des véhicules par personnage avec cache
     */
    @HandleErrors()
    @Cacheable((characterId: string) => `vehicles_character_${characterId}`, 600000) // 10 minutes
    async getVehiclesByCharacter(characterId: string) {
        return this.prisma.vehicle.findMany({
            where: { characterId },
        });
    }

    /**
     * Mise à jour de véhicule avec invalidation de cache
     */
    @HandleErrors()
    async updateVehicle(vehicleId: string, updateData: Partial<any>) {
        const vehicle = await this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: updateData,
        });

        // Invalider les caches pertinents
        this.cache.delete(`vehicle_${vehicleId}`);
        this.cache.delete(`vehicles_character_${vehicle.characterId}`);

        return vehicle;
    }

    /**
     * Suppression de véhicule avec nettoyage de cache
     */
    @HandleErrors()
    async deleteVehicle(vehicleId: string): Promise<void> {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        await this.prisma.vehicle.delete({
            where: { id: vehicleId },
        });

        // Nettoyer les caches
        this.cache.delete(`vehicle_${vehicleId}`);
        this.cache.delete(`vehicles_character_${vehicle.characterId}`);
    }

    /**
     * Génération de plaque optimisée avec évitement des doublons
     */
    generateVehiclePlate(): string {
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let plate = '';

            for (let i = 0; i < 8; i++) {
                plate += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            // Vérifier dans le cache local d'abord (plus rapide)
            if (!this.generatedPlates.has(plate)) {
                this.generatedPlates.add(plate);

                // Nettoyer le cache local périodiquement
                if (this.generatedPlates.size > 10000) {
                    this.generatedPlates.clear();
                }

                return plate;
            }

            attempts++;
        }

        // Fallback avec timestamp si on n'arrive pas à générer une plaque unique
        return `PLT${Date.now().toString().slice(-5)}`;
    }

    /**
     * Nettoyage automatique des véhicules abandonnés
     */
    @HandleErrors()
    async cleanupAbandonedVehicles(): Promise<number> {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - 24); // 24h sans activité

        const abandonedVehicles = await this.prisma.vehicle.findMany({
            where: {
                updatedAt: {
                    lt: cutoffTime
                }
            }
        });

        let cleanedCount = 0;
        for (const vehicle of abandonedVehicles) {
            try {
                await this.deleteVehicle(vehicle.id);
                cleanedCount++;
            } catch (error) {
                this.errorHandler.handle(error, {
                    action: 'cleanupAbandonedVehicles',
                    vehicleId: vehicle.id
                });
            }
        }

        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} abandoned vehicles`);
        }

        return cleanedCount;
    }

    /**
     * Statistiques des véhicules avec cache
     */
    @Cacheable(() => 'vehicle_stats', 900000) // 15 minutes
    async getVehicleStats() {
        const total = await this.prisma.vehicle.count();
        const byModel = await this.prisma.vehicle.groupBy({
            by: ['model'],
            _count: true
        });

        return {
            total,
            byModel: byModel.reduce((acc, item) => {
                acc[item.model] = item._count;
                return acc;
            }, {} as Record<string, number>)
        };
    }
}