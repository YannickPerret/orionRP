import { Injectable, Inject } from "../../core/decorators";
import { Delay } from "../../utils/fivem";
import {GasStationService} from "../gasStation/gazStation.service";

@Injectable()
export class VehicleFuelService {
    private lastFuelLevel: number = 100;
    private globalFuelConsumptionRateMultiplier: number = 1.0;

    @Inject(GasStationService)
    private gasStationService!: GasStationService;

    initialize() {
        console.log('VehicleFuelService initialized.');
        this.monitorFuel();
    }

    private consumeFuel(vehicle: number): number {
        const rpm = GetVehicleCurrentRpm(vehicle);
        const fuelLevel = GetVehicleFuelLevel(vehicle);
        const fuelConsumptionRate = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolConsumptionRate") || 0.5;
        const consumption = GetFrameTime() * rpm * fuelConsumptionRate * this.globalFuelConsumptionRateMultiplier;

        const newFuelLevel = Math.max(fuelLevel - consumption, 0);
        SetVehicleFuelLevel(vehicle, newFuelLevel);
        return newFuelLevel;
    }

    private async monitorFuel() {
        setTick(async () => {
            const playerPed = PlayerPedId();
            const vehicle = GetVehiclePedIsIn(playerPed, false);

            if (vehicle && DoesVehicleUseFuel(vehicle)) {
                const currentFuelLevel = this.consumeFuel(vehicle);

                const vehicleCoords = GetEntityCoords(vehicle) as [number, number, number];
                const atGasStation = this.gasStationService.isVehicleAtGasStation(vehicleCoords);

                if (atGasStation) {
                    this.gasStationService.displayFuelMessage(vehicle, currentFuelLevel);
                }

                this.lastFuelLevel = currentFuelLevel;
            }

            await Delay(1000);
        });
    }
}
