import { Injectable, Inject } from "../../core/decorators";
import { config } from "../config/gasStation.config";
import { UtilsBlipsServices } from "../utils/utils.blips.services";
import { LoggerService } from "../../core/modules/logger/logger.service";

@Injectable()
export class GasStationService {
    @Inject(UtilsBlipsServices)
    private utilsBlipsServices: UtilsBlipsServices;

    @Inject(LoggerService)
    private loggerService: LoggerService;

    private outlinedPumps: Set<number> = new Set();

    private handleFueling: boolean = false;

    get isFueling(): boolean {
        return this.handleFueling
    }

    set isFueling(value: boolean) {
        this.handleFueling = value
    }

    initialize() {
        config.gasStations.forEach((station) => {
            const blipData = {
                coords: { x: station.coords.x, y: station.coords.y, z: station.coords.z },
                sprite: 361,
                color: 1,
                scale: 1.0,
                name: station.title,
                range: true
            };

            this.utilsBlipsServices.loadBlip(blipData);
        });
    }

    /**
     * Vérifie si le joueur est proche d'une station et retourne les détails de la station active.
     */
    checkProximityToPumps(playerCoords: [number, number, number]): {station: any, pricePerLiter: number, entity : any } | null {
        for (const station of config.gasStations) {
            const distance = Vdist(
                playerCoords[0], playerCoords[1], playerCoords[2],
                station.coords.x, station.coords.y, station.coords.z
            );

            if (distance <= 17) {
                const pumps = this.findAllNearbyPumps(station.coords, station.radius);

                for (const pump of pumps) {
                    if (!this.outlinedPumps.has(pump)) {
                        SetEntityDrawOutline(pump, true);
                        this.outlinedPumps.add(pump);
                    }

                    const pumpCoords = GetEntityCoords(pump, true) as [number, number, number];
                    const playerToPumpDistance = Vdist(
                        playerCoords[0], playerCoords[1], playerCoords[2],
                        pumpCoords[0], pumpCoords[1], pumpCoords[2]
                    );

                    if (playerToPumpDistance <= 1.5) {
                        return { station, pricePerLiter: station.pricePerLiter, entity: pump };
                    }
                }
            } else {
                this.clearOutlinedPumps();
            }
        }

        return null;
    }

    /**
     * Trouve toutes les pompes proches d'une station.
     */
    findAllNearbyPumps(stationCoords: { x: number, y: number, z: number }, radius: number): number[] {
        const pumps: number[] = [];
        const pumpModels = [
            GetHashKey("prop_gas_pump_1a"),
            GetHashKey("prop_gas_pump_1b"),
            GetHashKey("prop_gas_pump_1c"),
            GetHashKey("prop_gas_pump_1d"),
            GetHashKey("prop_gas_pump_old2"),
            GetHashKey("prop_gas_pump_old3")
        ];

        const objects = GetGamePool('CObject');

        for (const obj of objects) {
            if (DoesEntityExist(obj) && pumpModels.includes(GetEntityModel(obj))) {
                const entityCoords = GetEntityCoords(obj, true) as [number, number, number];
                const distance = Vdist(
                    stationCoords.x, stationCoords.y, stationCoords.z,
                    entityCoords[0], entityCoords[1], entityCoords[2]
                );

                if (distance <= radius) {
                    pumps.push(obj);
                }
            }
        }

        return pumps;
    }

    /**
     * Nettoie les pompes surlignées.
     */
    clearOutlinedPumps(): void {
        for (const pump of this.outlinedPumps) {
            if (DoesEntityExist(pump)) {
                SetEntityDrawOutline(pump, false);
            }
        }
        this.outlinedPumps.clear();
    }
}
