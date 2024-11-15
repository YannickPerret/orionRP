import {Injectable} from "../../core/decorators";

@Injectable()
export class GasStationService {
    private gasStations: { coords: { x: number, y: number, z: number }, radius: number }[] = [
        { coords: { x: 64.55, y: 20.4, z: 68.9 }, radius: 8 },
        { coords: { x: 200.5, y: -500.4, z: 43.9 }, radius: 8 },
    ];

    initialize() {
        console.log('GasStationService initialized.');
    }

    public isVehicleAtGasStation(vehicleCoords: [number, number, number]): boolean {
        return this.gasStations.some(gasStation => {
            const dist = Math.sqrt(
                Math.pow(vehicleCoords[0] - gasStation.coords.x, 2) +
                Math.pow(vehicleCoords[1] - gasStation.coords.y, 2) +
                Math.pow(vehicleCoords[2] - gasStation.coords.z, 2)
            );
            return dist <= gasStation.radius;
        });
    }

    public displayFuelMessage(vehicle: number, fuelLevel: number): void {
        const tankVolume = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolTankVolume");
        SetTextComponentFormat("STRING");
        AddTextComponentString(`Essence: ${fuelLevel.toFixed(2)} / ${tankVolume}L. Appuyez sur ~g~G~s~ pour remplir.`);
        DisplayHelpTextFromStringLabel(0, false, true, -1);

        // Remplir le réservoir quand le joueur appuie sur "G"
        if (IsControlJustPressed(0, 58)) {
            this.fillVehicleTank(vehicle);
            emitNet('chat:addMessage', { args: ["Système", "Réservoir rempli !"] });
        }
    }

    private fillVehicleTank(vehicle: number): void {
        const tankVolume = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fPetrolTankVolume");
        SetVehicleFuelLevel(vehicle, tankVolume); // Remplir le réservoir
    }
}
