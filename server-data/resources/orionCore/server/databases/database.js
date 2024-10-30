require('reflect-metadata');
const { DataSource } = require('typeorm');
const path = require('path');

const User = require('./server/models/User.js');
const Inventory = require('./server/models/Inventory.js');
const InventoryItem = require('./server/models/InventoryItem.js');
const Item = require('./server/models/Item.js');
const Vehicle = require('./server/models/Vehicle.js');
const Character = require('./server/models/Character.js');

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
        './server/databases/migrations/*.js',
    ],
    migrationsTableName: "migration_versions",
};

const AppDataSource = new DataSource(dbConfig)

module.exports = AppDataSource;
