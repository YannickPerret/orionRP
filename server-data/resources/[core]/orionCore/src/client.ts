// src/client.ts - Mise à jour côté client
import 'reflect-metadata';
import './globals';

// Import des services côté client
import { CacheService } from "./core/modules/cache/cache.service";
import { ConfigService } from "./core/modules/config/config.service";

// Import des contrôleurs existants
import { WorldClientService } from "./client/world.services";
import { SoundService } from "./client/sound.service";
import { PlayerModule } from "./client/players/player.module";
import { MenuController } from "./client/menu/menu.controller";
import { UtilsController } from "./client/utils/utils.controller";
import { GasStationController } from "./client/gasStation/gasStation.controller";
import { VehicleController } from "./client/vehicles/vehicle.controller";

async function bootstrap() {
    try {
        // Services de base
        new ConfigService();
        new CacheService();

        // Contrôleurs
        new UtilsController()
        new MenuController()
        new WorldClientService()
        new SoundService()
        new GasStationController()
        new VehicleController()
        new PlayerModule();

        console.log("Client initialized successfully");
    } catch (error) {
        console.error("Failed to initialize client:", error);
    }
}

bootstrap()