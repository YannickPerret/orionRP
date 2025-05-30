// src/server.ts - Mise à jour avec les nouveaux services
import './globals';
import 'reflect-metadata'

// Import des nouveaux services
import { ErrorHandler } from "./core/modules/error/error.handler";
import { CacheService } from "./core/modules/cache/cache.service";
import { ConfigService } from "./core/modules/config/config.service";
import { ValidationService } from "./core/modules/validation/validation.service";
import { CleanupService } from "./core/modules/cleanup/cleanup.service";

// Import des contrôleurs existants
import { ItemController } from "./server/modules/items/item.controller";
import { RoleController } from "./server/modules/roles/role.controller";
import { InventoryController } from "./server/modules/inventories/inventory.controller";
import { CharacterController } from "./server/modules/characters/character.controller";
import { VehicleController } from "./server/modules/vehicles/vehicle.controller";
import { UserController } from "./server/modules/users/user.controller";

async function bootstrap() {
    try {
        // Initialiser les services de base en premier
        console.log("Initializing core services...");
        const config = new ConfigService();
        const cache = new CacheService();
        const errorHandler = new ErrorHandler();
        const validation = new ValidationService();

        // Service de nettoyage automatique
        const cleanup = new CleanupService();

        // Puis les contrôleurs
        console.log("Initializing controllers...");
        new RoleController()
        new VehicleController()
        new UserController();
        new CharacterController();
        new InventoryController()
        new ItemController()

        // Configuration des tâches automatiques
        console.log("Setting up automated tasks...");

        // Afficher la configuration au démarrage
        const serverConfig = config.getServerConfig();
        console.log(`Server: ${serverConfig.name} (Max players: ${serverConfig.maxPlayers})`);

        // Statistiques de démarrage
        console.log("Server started successfully");
        console.log(`Cache TTL: ${config.get('cache.defaultTTL')}ms`);
        console.log(`Character default money: ${config.get('character.defaultMoney')}€`);

    } catch (error) {
        const errorHandler = new ErrorHandler();
        errorHandler.handle(error, { action: 'bootstrap' });
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

bootstrap();