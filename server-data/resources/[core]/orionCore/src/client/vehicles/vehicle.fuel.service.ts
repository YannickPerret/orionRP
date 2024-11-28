import { Injectable, Inject } from "../../core/decorators";
import {GasStationService} from "../gasStation/gazStation.service";


@Injectable()
export class VehicleFuelService {
    private lastFuelLevel: number = 100;
    private globalFuelConsumptionRateMultiplier: number = 7;

    @Inject(GasStationService)
    private gasStationService!: GasStationService;


    getFuelLevel(): number {
        return this.lastFuelLevel;
    }

    setFuelLevel(vehicleId: number, fuelLevel: number): void {
        SetVehicleFuelLevel(vehicleId, fuelLevel);
    }

    consumeFuel(vehicle: number): number {
        if (GetIsVehicleEngineRunning(vehicle)) {
            const rpm = GetVehicleCurrentRpm(vehicle);
            const fuelLevel = GetVehicleFuelLevel(vehicle);
            const fuelConsumptionRate = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolConsumptionRate");
            const consumption = GetFrameTime() * rpm * fuelConsumptionRate * this.globalFuelConsumptionRateMultiplier;

            const newFuelLevel = Math.max(fuelLevel - consumption, 0);
            SetVehicleFuelLevel(vehicle, newFuelLevel);
            return newFuelLevel;
        }
        return GetVehicleFuelLevel(vehicle);
    }


}
