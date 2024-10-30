require('reflect-metadata');
const { DataSource } = require('typeorm');

const User = require('../models/User.js');
const Inventory = require('../models/Inventory.js');
const InventoryItem = require('../models/InventoryItem.js');
const Item = require('../models/Item.js');
const Vehicle = require('../models/Vehicle.js');
const Character = require('../models/Character.js');

console.log('where im i?', __dirname)

const dbConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Suplivent27',
    database: 'orion',
    synchronize: false,
    logging: true,
    entities: [User, Inventory, InventoryItem, Item, Vehicle, Character],
    migrations: [
        './server/databases/migrations/1730285117518-migrations.js',
    ],
    migrationsTableName: "migration_versions",
};

const AppDataSource = new DataSource(dbConfig)

module.exports = AppDataSource;
