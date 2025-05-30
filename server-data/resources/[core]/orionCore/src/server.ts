import './globals';
import 'reflect-metadata'
import {ItemController} from "./server/modules/items/item.controller";
import {RoleController} from "./server/modules/roles/role.controller";
import {InventoryController} from "./server/modules/inventories/inventory.controller";
import {CharacterController} from "./server/modules/characters/character.controller";
import {VehicleController} from "./server/modules/vehicles/vehicle.controller";
import {UserController} from "./server/modules/users/user.controller";

async function bootstrap() {
    try {

        // Initialiser les contrôleurs
        new RoleController()
        new VehicleController()
        new UserController();
        new CharacterController();
        new InventoryController()
        new ItemController()

        console.log("Serveur démarré");
    } catch (error) {
        console.error("Erreur lors du démarrage:", error);
    }
}

bootstrap();