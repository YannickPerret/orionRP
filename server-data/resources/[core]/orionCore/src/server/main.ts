import 'reflect-metadata'
import AppDataSource from "./core/database/database";
import {UserController} from "./modules/users/user.controller";
import {CharacterController} from "./modules/characters/character.controller";
import {InventoryController} from "./modules/inventories/inventory.controller";
import {RoleController} from "./modules/roles/role.controller";
import {ItemController} from "./modules/items/item.controller";
import initItems from "./core/scripts/initItems";
import {VehicleController} from "./modules/vehicles/vehicle.controller";

async function bootstrap() {
    try {
        // Initialiser la base de données
        AppDataSource.initialize()
            .then(() => {
                console.log('Data Source has been initialized!');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization:', err);
            });


        // Initialiser les contrôleurs
        new RoleController()
        new InventoryController()
        new ItemController()
        new UserController();
        new CharacterController();
        new VehicleController()

        /* Initialiser */
        await initItems()

        console.log("Serveur démarré");
    } catch (error) {
        console.error("Erreur lors du démarrage:", error);
    }
}

bootstrap();