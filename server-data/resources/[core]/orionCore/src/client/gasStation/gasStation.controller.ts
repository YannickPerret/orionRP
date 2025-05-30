import { Inject, Injectable, Tick, TickInterval } from "../../core/decorators";
import { GasStationService } from "./gazStation.service";
import { LoggerService } from "../../core/modules/logger/logger.service";
import { RopeService } from "../utils/utils.rope.services";
import {VehicleService} from "../vehicles/vehicle.service";

type Station = {
    station: any,
    pricePerLiter: number,
    entity: any
}

@Injectable()
export class GasStationController {
    @Inject(GasStationService)
    private gasStationService: GasStationService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(RopeService)
    private ropeService: RopeService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    private handleRopeNozzle: boolean = false;

    private currentStation: Station | null = null;


    /**
     * Gère la proximité avec les pompes pour attacher/détacher la buse.
     */
    @Tick(TickInterval.EVERY_FRAME)
    private async monitorPumpProximity() {
        const playerPed = PlayerPedId();
        const playerCoords = GetEntityCoords(playerPed, true) as [number, number, number];

        if (!IsPedInAnyVehicle(playerPed, false)) {
            const activePump = this.gasStationService.checkProximityToPumps(playerCoords);

            if (activePump && !this.gasStationService.isFueling) {
                const actionMessage = this.handleRopeNozzle
                    ? "Appuyez sur ~g~E~s~ pour raccrocher la pompe"
                    : `Appuyez sur ~g~E~s~ pour prendre la pompe ${activePump.pricePerLiter}€/L`;

                SetTextComponentFormat("STRING");
                AddTextComponentString(actionMessage);
                DisplayHelpTextFromStringLabel(0, false, true, -1);

                if (IsControlJustPressed(0, 38)) {
                    try {
                        if (this.handleRopeNozzle) {
                            this.ropeService.deleteRope();
                            this.handleRopeNozzle = false;
                            this.logger.log("Corde et buse détachées avec succès.");
                        } else {
                            const pumpCoords = GetEntityCoords(activePump.entity, true) as [number, number, number];
                            const adjustedPumpCoords: [number, number, number] = [
                                pumpCoords[0],
                                pumpCoords[1],
                                pumpCoords[2] + 2.5,
                            ];
                            this.handleRopeNozzle = true;
                            this.currentStation = activePump

                            await this.ropeService.createNewRope(
                                adjustedPumpCoords,
                                activePump.entity,
                                4,
                                4.0,
                                "prop_cs_fuel_nozle",
                            );
                            this.logger.log("Corde créée avec succès entre le joueur et la pompe.");
                        }
                    } catch (error) {
                        this.logger.error(`Erreur lors de la gestion de la corde : ${error}`);
                    }
                }
            }
        }
    }

    /**
     * Gère le remplissage des réservoirs si la buse est prise.
     */
    @Tick(TickInterval.EVERY_FRAME)
    private async monitorFuelingProximity() {
        if (this.handleRopeNozzle && !this.gasStationService.isFueling) {
            const playerPed = PlayerPedId();
            const playerCoords = GetEntityCoords(playerPed, true) as [number, number, number];
            const closestVehicle = this.vehicleService.getClosestVehicle(playerCoords, 3.0);
            if (closestVehicle) {
                const fuelTankCoords = this.vehicleService.getVehicleFuelTankPosition(closestVehicle);
                const distanceToTank = Vdist(
                    playerCoords[0],
                    playerCoords[1],
                    playerCoords[2],
                    fuelTankCoords[0],
                    fuelTankCoords[1],
                    fuelTankCoords[2]
                );

                if (distanceToTank <= 2) {
                    SetTextComponentFormat("STRING");
                    AddTextComponentString("Appuyez sur ~g~E~s~ pour remplir le réservoir");
                    DisplayHelpTextFromStringLabel(0, false, true, -1);

                    if (IsControlJustPressed(0, 38)) {
                        this.gasStationService.isFueling = true;
                        emitNet("orionCore:server:vehicle:fuel:checkFunds", VehToNet(closestVehicle), this.currentStation?.pricePerLiter);
                    }
                }
            }
        }
    }
}
