import '@citizenfx/server';
import {ServerEvent, Inject, Command, Injectable} from '../../../core/decorators';
import { VehicleService } from './vehicle.service';
import {RoleType} from "../roles/role.enum";
import {UserService} from "../users/user.service";
import {PlayerManagerService} from "../playerManager/playerManager.service";
import {LoggerService} from "../../../core/modules/logger/logger.service";
import {NotifierService} from "../notifiers/notifier.service";

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

    @Inject(NotifierService)
    private notifierService!: NotifierService;

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

    @ServerEvent('vehicle:fuel:checkFunds')
    async handleRequestRefuel(fuelNeeded: number, vehicleNetId: number, pricePerLiter: number) {
        try {
            const source = global.source;
            const user = await this.playerManagerService.getPlayer(source);
            if (!user) {
                this.loggerService.error(`Joueur introuvable pour le ravitaillement: ${source}`);
                return;
            }

            const character = await this.userService.getActiveCharacter(user.id);
            if (character.money <= 0) {
                this.notifierService.notify(source, "Fonds insuffisants", "error");
            }

            const vehicle = NetworkGetEntityFromNetworkId(vehicleNetId);
            if (vehicle === 0 || !DoesEntityExist(vehicle)) {
                this.loggerService.error(`Véhicule introuvable pour Net ID: ${vehicleNetId}`);
                return;
            }

            const maxFuelPossible = Math.min(fuelNeeded, Math.floor(character.money / pricePerLiter));

            if (maxFuelPossible <= 0) {
                this.loggerService.error(`Fonds insuffisants pour ravitailler le véhicule ${vehicleNetId}`);
                return;
            }
            emitNet('orionCore:client:vehicle:fuel:start', source, maxFuelPossible, pricePerLiter, vehicleNetId);
        }
        catch (error) {
            this.loggerService.error(`Erreur lors de la demande de ravitaillement: ${error}`);
        }
    }

    @ServerEvent('vehicle:fuel:stopRefuel')
    async handleStopRefuel(totalFuelAdded: number, pricePerLiter: number) {
        const user = await this.playerManagerService.getPlayer(source);
        if (!user) {
            this.loggerService.error(`Joueur introuvable pour le paiement: ${source}`);
            return;
        }

        const totalCost = Math.ceil(totalFuelAdded * pricePerLiter);
        if (user.character.money.money < totalCost) {
            this.loggerService.error(`Fonds insuffisants détectés après ravitaillement pour le joueur ${source}`);
            return;
        }
        user.character.money.money -= totalCost;
        await
        this.playerManagerService.updatePlayer(user);
        this.loggerService.log(`Joueur ${source} a payé $${totalCost} pour le ravitaillement.`);
    }

    @Command({
        name: 'spawnVehicle',
        description: 'Commande pour spawn un véhicule',
        role: RoleType.ADMIN,
    })
    async spawnVehicleCommand(source: number, args: string[]): Promise<void> {
        const vehicleName = args[0];
        if (!vehicleName) {
            this.loggerService.error(`Le joueur ${source} a tenté de spawn un véhicule sans spécifier de nom.`);
            return;
        }
        const user = await this.playerManagerService.getPlayer(source)
        if (!user) {
            this.loggerService.error(`Le joueur ${source} a tenté de spawn un véhicule sans être connecté.`);
            return;
        }
        if (!await this.userService.hasRoleOf(user.id, RoleType.ADMIN)) {
            this.loggerService.error(`Le joueur ${user.id} a tenté de spawn un véhicule sans les permissions.`);
            return;
        }
        const [vehicleNetId, vehicle] = await this.vehicleService.spawnNewVehicle(source, vehicleName, GetEntityCoords(GetPlayerPed(source)), true)
        emitNet('orionCore:client:vehicle:applyProperties', source, {fuelLevel: 100.0, plate: this.vehicleService.generateVehiclePlate()}, vehicleNetId);
    }
}