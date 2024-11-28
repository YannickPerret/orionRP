import '@citizenfx/client';
import {Injectable, ClientEvent, Inject, Tick, TickInterval} from '../../core/decorators';
import { VehicleService } from './vehicle.service';
import {LoggerService} from "../../core/modules/logger/logger.service";
import {NotifierService} from "../../server/modules/notifiers/notifier.service";
import {UtilsServices} from "../utils/utils.services";
import {VehicleFuelService} from "./vehicle.fuel.service";
import {Delay} from "../../utils/fivem";
import {GasStationService} from "../gasStation/gazStation.service";

@Injectable()
export class VehicleController {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleFuelService)
    private vehicleFuelService: VehicleFuelService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(NotifierService)
    private notifier: NotifierService;

    @Inject(UtilsServices)
    private utilsServices: UtilsServices;

    @Inject(GasStationService)
    private gasStationService: GasStationService;

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
            await this.vehicleService.spawnVehicle(modelName, x, y, z, heading, true, true, (vehicle, error) => {
                    if (error) {
                        this.logger.error(error);
                        this.notifier.notify(PlayerId(), error, 'error');
                        return;
                    }

                    this.logger.log(`Véhicule spawné avec succès : ${modelName}`);
                    this.notifier.notify(PlayerId(), `Véhicule ${modelName} spawné avec succès.`, 'success');
                }
            );
        } catch (error) {
            this.notifier.notify(PlayerId(), `Erreur : ${error.message}`, 'error');
        }
    }

    @ClientEvent('vehicle:fuel:start')
    async refuelVehicle(maxFuelPossible: number, pricePerLiter: number, vehicleNetId: number) {
        const vehicle = NetToVeh(vehicleNetId);

        if (vehicle === 0 || !DoesEntityExist(vehicle)) {
            this.logger.error(`Erreur : véhicule introuvable pour l'ID ${vehicle}.`);
            return;
        }

        let fuelLevel = GetVehicleFuelLevel(vehicle);
        const maxFuel = 100.0
        let totalFuelAdded = 0;

        if (fuelLevel >= maxFuel) {
            this.logger.log(`Le réservoir est déjà plein.`);
            this.gasStationService.isFueling = false;
            return;
        }

        while (fuelLevel < maxFuel || totalFuelAdded < maxFuelPossible) {
            this.gasStationService.isFueling = true;
            fuelLevel = Math.min(fuelLevel + 0.1, maxFuel);
            SetVehicleFuelLevel(vehicle, fuelLevel);
            totalFuelAdded += 1;

            SetTextComponentFormat("STRING");
            AddTextComponentString(`Ravitaillement : ${(fuelLevel).toFixed(0)} / ${maxFuel}L | Prix : ${totalFuelAdded * pricePerLiter} $`);
            DisplayHelpTextFromStringLabel(0, false, true, -1);


            if (IsControlJustPressed(0, 73)) { // Touche X pour annuler
                this.gasStationService.isFueling = false;
                emitNet('orionCore:server:vehicle:fuel:stop', totalFuelAdded, pricePerLiter);
                this.logger.log(`Ravitaillement annulé.`);
                return;
            }
            await Delay(350);
        }

        this.gasStationService.isFueling = false;
        emitNet('orionCore:server:vehicle:fuel:stop', totalFuelAdded, pricePerLiter);
    }

    @ClientEvent('vehicle:applyProperties')
    async handleApplyProperties(properties: any, vehicleNetId: number) {

        const vehicle = NetToVeh(vehicleNetId);

        if (vehicle === 0 || !DoesEntityExist(vehicle)) {
            this.logger.error(`Erreur : véhicule introuvable pour le Net ID ${vehicleNetId}.`);
            return;
        }

        for (const [key, value] of Object.entries(properties)) {
            if (key === 'fuelLevel') {
                if (typeof value === "number") {
                    this.vehicleFuelService.setFuelLevel(vehicle, value);
                }
            } else if (key === 'plate') {
                if (typeof value === "string")
                this.vehicleService.setVehiclePlate(vehicle, value);
            } else {
                if (typeof value === "number") {
                    SetVehicleMod(vehicle, parseInt(key), value, false);
                }
            }
        }
    }

    @Tick(TickInterval.EVERY_SECOND)
    async consumeFuelTick(): Promise<void> {
        const playerPed = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(playerPed, false);

        if (vehicle && GetIsVehicleEngineRunning(vehicle)) {
            const newFuel = this.vehicleFuelService.consumeFuel(vehicle);

            if (newFuel <= 0) {
                SetVehicleEngineOn(vehicle, false, true, true);
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    showSpeedometer(): void {
        const playerPed = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(playerPed, false);

        if (vehicle && GetIsVehicleEngineRunning(vehicle)) {
            const isDriver = GetPedInVehicleSeat(vehicle, -1) === playerPed;
            const isFrontPassenger = GetPedInVehicleSeat(vehicle, 0) === playerPed;

            if (isDriver || isFrontPassenger) {
                const speed = GetEntitySpeed(vehicle);
                const speedKmh = Math.floor(speed * 2.236936);
                const fuelLevel = GetVehicleFuelLevel(vehicle);
                if (isDriver) {
                    this.utilsServices.drawHudText(
                        `Vitesse: ${speedKmh} km/h | Essence: ${fuelLevel.toFixed(0)}%`,
                        0.5,
                        0.95,
                        4,
                        0.5,
                        [255, 255, 255, 255],
                        true
                    );
                } else {
                    this.utilsServices.drawHudText(
                        `Vitesse: ${speedKmh} km/h`,
                        0.5,
                        0.95,
                        4,
                        0.5,
                        [255, 255, 255, 255],
                        true
                    );
                }

                if (!IsVehicleOnAllWheels(vehicle)) {
                    DisableControlAction(2, 59);
                    DisableControlAction(2, 60);
                }
            }
        }
    }
}
