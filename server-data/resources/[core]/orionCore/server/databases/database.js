require('reflect-metadata');
const { DataSource } = require('typeorm');

const User = require('../models/User.js');
const Inventory = require('../models/Inventory.js');
const InventoryItem = require('../models/InventoryItem.js');
const Item = require('../models/Item.js');
const Vehicle = require('../models/Vehicle.js');
const Character = require('../models/Character.js');
const Role = require('../models/Role.js');


const dbConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Suplivent27',
    database: 'orion',
    synchronize: false,
    logging: false,
    entities: [User, Inventory, InventoryItem, Item, Vehicle, Character, Role],
    migrations: [
        './server/databases/migrations/*-migrations.js',
    ],
    migrationsTableName: "migration_versions",
};

const AppDataSource = new DataSource(dbConfig)

module.exports = AppDataSource;

//npm run migration:generate -- -- server/databases/migrations/InitialMigration
// mettre module.exports = {AppDataSource};