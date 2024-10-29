// server/models/Player.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Player',
    tableName: 'players',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        identifier: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
        },
        state: {
            type: 'simple-json',
            nullable: true,
        },
        needs: {
            type: 'simple-json',
            nullable: true,
        },
    },
    relations: {
        inventory: {
            target: 'Inventory',
            type: 'one-to-one',
            joinColumn: true,
            cascade: true,
        },
        vehicles: {
            target: 'Vehicle',
            type: 'one-to-many',
            inverseSide: 'owner',
        },
    },
});
