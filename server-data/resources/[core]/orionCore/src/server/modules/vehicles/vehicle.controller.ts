import '@citizenfx/server';
import {ServerEvent, Inject, Command, Injectable} from '../../../core/decorators';
import { VehicleService } from './vehicle.service';
import {RoleType} from "../roles/role.enum";
import {UserService} from "../users/user.service";
import {PlayerManagerService} from "../playerManager/playerManager.service";
import {LoggerService} from "../../../core/modules/logger/logger.service";

@Injectable()
export class VehicleController {
    @Inject(VehicleService)
    private vehicleService!: VehicleService;

    @Inject(UserService)
    private userService!: UserService;

    @Inject(PlayerManagerService)
    private playerManagerService!: PlayerManagerService;

    @Inject(LoggerService)
    private loggerService!: LoggerService;

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
        const vehicleName = args[0];
        if (!vehicleName) {
            emitNet('chat:addMessage', source, { args: ["Admin", "Vous devez spécifier un nom de véhicule."] });
            return;
        }
        const user = await this.playerManagerService.getPlayer(source)
        if (!user) {
            this.loggerService.error(`Le joueur ${source} a tenté de spawn un véhicule sans être connecté.`);
            emitNet('chat:addMessage', source, { args: ["Admin", "Vous n'êtes pas connecté."] });
            return;
        }
        if(!await this.userService.hasRoleOf(user.id, RoleType.ADMIN)) {
            this.loggerService.error(`Le joueur ${user.id} a tenté de spawn un véhicule sans les permissions.`);
            emitNet('chat:addMessage', source, { args: ["Admin", "Vous n'avez pas les permissions pour utiliser cette commande."] });
            return;
        }
        emitNet('orionCore:client:vehicle:spawn', source, vehicleName);
    }
}