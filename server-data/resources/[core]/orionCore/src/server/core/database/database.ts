import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config({
    path: path.resolve(__dirname, '.env'),
});
import * as path from "node:path";
import {Inventory} from "../../modules/inventories/inventory.entity";
import {Item} from "../../modules/items/item.entity";
import {InventoryItem} from "../../modules/inventoryItems/inventoryItem.entity";
import {User} from "../../modules/users/user.entity";
import {Character} from "../../modules/characters/character.entity";
import {Vehicle} from "../../modules/vehicles/vehicle.entity";
import {Role} from "../../modules/roles/role.entity";

function getConvarOrEnv(varName: string, defaultValue: string): string {
    try {
        return typeof GetConvar === 'function' ? GetConvar(varName, defaultValue) : process.env[varName] || defaultValue;
    } catch (error) {
        return process.env[varName] || defaultValue;
    }
}

const AppDataSource = new DataSource({
    type: getConvarOrEnv('DATABASE_DRIVER', 'mysql') as any,
    host: getConvarOrEnv('DATABASE_HOST', 'localhost'),
    port: Number(getConvarOrEnv('DATABASE_PORT', '3306')),
    username: getConvarOrEnv('DATABASE_USERNAME', 'root'),
    password: getConvarOrEnv('DATABASE_PASSWORD', 'Suplivent27'),
    database: getConvarOrEnv('DATABASE_NAME', 'orion'),
    synchronize: true,
    logging: true,
    migrations: ['src/server/core/database/migrations/*.ts'],
    entities: [Role,Character,  Inventory, Item, InventoryItem, User, Vehicle],
});

export default AppDataSource;

//npm run typeorm:migration:generate -- -d src/server/core/database/database.ts src/server/core/database/migrations/initialMigration
//npm run typeorm:migration:run -- -d src/server/core/database/database.ts