import {config} from "../config/config";
import {Injectable} from "../../core/decorators";
import {Delay} from "../../utils/fivem";

@Injectable()
export class VehicleSnowService {
    private snowChainsEquipped: boolean = false;
    private defaultTractionMax: number | null = null;
    private defaultTractionMin: number | null = null;
    private enableSnowCheck: boolean = config.events.christmas || false

    initialize() {
        console.log('VehicleSnowService initialized.');
        if (this.enableSnowCheck) {
            this.monitorTraction();
        }
    }

    public toggleSnowChains() {
        this.snowChainsEquipped = !this.snowChainsEquipped;
        const status = this.snowChainsEquipped ? "équipées" : "retirées";
        console.log(`Les chaînes à neige sont maintenant ${status}.`);
        emitNet('chat:addMessage', -1, { args: ["Système", `Les chaînes à neige sont maintenant ${status}.`] });
    }

    private async monitorTraction() {
        setTick(async () => {
            const playerPed = PlayerPedId();
            const isInVehicle = IsPedInAnyVehicle(playerPed, false);
            const vehicle = GetVehiclePedIsIn(playerPed, false);

            if (isInVehicle && vehicle) {
                const isSnowyWeather = this.isWeatherSnowy();

                if (this.snowChainsEquipped && isSnowyWeather) {
                    if (this.defaultTractionMax === null && this.defaultTractionMin === null) {
                        this.defaultTractionMax = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMax");
                        this.defaultTractionMin = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMin");
                    }
                    this.adjustTraction(vehicle, 3.0, 2.6);
                } else if (this.defaultTractionMax !== null && this.defaultTractionMin !== null) {
                    this.adjustTraction(vehicle, this.defaultTractionMax, this.defaultTractionMin);
                }
            }

            await Delay(400);
        });
    }

    private adjustTraction(vehicle: number, tractionMax: number, tractionMin: number) {
        SetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMax", tractionMax);
        SetVehicleHandlingFloat(vehicle, "CHandlingData", "fTractionCurveMin", tractionMin);
    }

    private isWeatherSnowy(): boolean {
        const currentWeather = GetPrevWeatherTypeHashName();
        return currentWeather === GetHashKey("XMAS") || currentWeather === GetHashKey("SNOW");
    }
}
