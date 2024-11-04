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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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