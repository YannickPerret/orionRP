import '@citizenfx/server';
import {ServerEvent, Inject, Command} from '../../../core/decorators';
import { VehicleService } from './vehicle.service';
import {RoleType} from "../roles/role.enum";

export class VehicleController {
    @Inject(VehicleService)
    private vehicleService!: VehicleService;

    @ServerEvent('vehicle:create')
    async handleCreateVehicle(playerId: number, characterId: number, vehicleData: Partial<any>): Promise<void> {
        try {
            const vehicle = await this.vehicleService.registerNewVehicle(characterId, vehicleData);
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

    @Command({
        name: 'spawnVehicle',
        description: 'Commande pour spawn un véhicule',
        role: RoleType.ADMIN,
    })
    async spawnVehicleCommand(source: number, args: string[]): Promise<void> {
        try {
            const vehicleName = args[0];
            if (!vehicleName) {
                emitNet('chat:addMessage', source, { args: ["Admin", "Vous devez spécifier un nom de véhicule."] });
                return;
            }
            console.log("llllss")
            await this.vehicleService.spawnNewVehicle(source, vehicleName)
        }
        catch (error) {
            console.error(`Erreur lors du spawn du véhicule: ${error}`)
        }
    }
}