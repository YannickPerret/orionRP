import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../models/User';
import { Inventory } from '../models/Inventory';
import { InventoryItem } from '../models/InventoryItem';
import { Item } from '../models/Item';
import { Vehicle } from '../models/Vehicle';
import { Character } from '../models/Character';
import { Role } from '../models/Role';

const dbConfig = {
    type: process.env.DATABASE_DRIVER as any,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    entities: [User, Inventory, InventoryItem, Item, Vehicle, Character, Role],
    migrations: ['migrations/*.ts'],
    migrationsTableName: 'migration_versions',
};

export const AppDataSource = new DataSource(dbConfig);

//npm run migration:generate -- -- server/databases/migrations/InitialMigration
// mettre module.exports = {AppDataSource};