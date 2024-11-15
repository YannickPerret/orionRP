import '@citizenfx/server';
import { ServerEvent, Inject } from '../../../core/decorators';
import { VehicleService } from './vehicle.service';

export class VehicleController {
    @Inject(VehicleService)
    private vehicleService!: VehicleService;

    @ServerEvent('vehicle:create')
    async handleCreateVehicle(playerId: number, characterId: number, vehicleData: Partial<any>): Promise<void> {
        try {
            const vehicle = await this.vehicleService.createVehicle(characterId, vehicleData);
            console.log(`Véhicule créé : ${vehicle.model} pour le personnage ${characterId}`);
            emitNet('orionCore:client:vehicleCreated', playerId, vehicle);
        } catch (error) {
            console.error('Erreur lors de la création du véhicule:', error);
            emitNet('orionCore:client:vehicleError', playerId, 'Erreur lors de la création du véhicule');
        }
    }

    @ServerEvent('vehicle:getById')
    async handleGetVehicleById(playerId: number, vehicleId: string): Promise<void> {
        try {
            const vehicle = await this.vehicleService.getVehicleById(vehicleId);
            if (vehicle) {
                emitNet('orionCore:client:vehicleData', playerId, vehicle);
            } else {
                emitNet('orionCore:client:vehicleError', playerId, 'Véhicule introuvable');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du véhicule:', error);
        }
    }

    @ServerEvent('vehicle:getByCharacter')
    async handleGetVehiclesByCharacter(playerId: number, characterId: string): Promise<void> {
        try {
            const vehicles = await this.vehicleService.getVehiclesByCharacter(characterId);
            emitNet('orionCore:client:vehicleList', playerId, vehicles);
        } catch (error) {
            console.error('Erreur lors de la récupération des véhicules par personnage:', error);
        }
    }

    @ServerEvent('vehicle:update')
    async handleUpdateVehicle(playerId: number, vehicleId: string, updateData: Partial<any>): Promise<void> {
        try {
            const vehicle = await this.vehicleService.updateVehicle(vehicleId, updateData);
            if (vehicle) {
                emitNet('orionCore:client:vehicleUpdated', playerId, vehicle);
            } else {
                emitNet('orionCore:client:vehicleError', playerId, 'Véhicule introuvable pour mise à jour');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du véhicule:', error);
        }
    }

    @ServerEvent('vehicle:delete')
    async handleDeleteVehicle(playerId: number, vehicleId: string): Promise<void> {
        try {
            await this.vehicleService.deleteVehicle(vehicleId);
            emitNet('orionCore:client:vehicleDeleted', playerId, vehicleId);
            console.log(`Véhicule avec l'ID ${vehicleId} supprimé.`);
        } catch (error) {
            console.error('Erreur lors de la suppression du véhicule:', error);
        }
    }
}

export default new VehicleController();
