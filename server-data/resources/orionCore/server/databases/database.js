require('reflect-metadata');
const { DataSource } = require('typeorm');
const path = require('path');

const User = require('../models/User');
const Inventory = require('../models/Inventory');
const InventoryItem = require('../models/InventoryItem');
const Item = require('../models/Item');
const Vehicle = require('../models/Vehicle');
const Character = require('../models/Character');

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
        path.join(__dirname, 'migrations', '*.js')
    ],
    migrationsTableName: "migration_versions",
};

const AppDataSource = new DataSource(dbConfig)

module.exports = AppDataSource;
