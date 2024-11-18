import '@citizenfx/client';
import { Injectable, ClientEvent, Inject } from '../../core/decorators';
import { VehicleService } from './vehicle.service';
import {LoggerService} from "../../core/modules/logger/logger.service";
import {NotifierService} from "../../server/modules/notifiers/notifier.service";

@Injectable()
export class VehicleController {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(NotifierService)
    private notifier: NotifierService;

    initialize(): void {
        console.log("Initialisation du contrôleur de véhicule.");
    }

    @ClientEvent('vehicle:spawn')
    async handleSpawnVehicleEvent(modelName: string): Promise<void> {
        try {
            if (!modelName) {
                console.error("Modèle de véhicule non spécifié.");
                return;
            }

            const playerPed = PlayerPedId();
            const [x, y, z] = GetEntityCoords(playerPed, true);
            const heading = GetEntityHeading(playerPed);

            const vehicle = await this.vehicleService.spawnVehicle(modelName, x, y, z, heading);

            if (vehicle !== 0) {
                this.notifier.notify(source,`Véhicule ${modelName} spawné avec succès.`, 'success');
            } else {
                this.logger.error("Échec du spawn du véhicule.");
            }
        } catch (error) {
            this.logger.error(`Erreur lors de l'événement de spawn du véhicule: ${error}`);
        }
    }
}
