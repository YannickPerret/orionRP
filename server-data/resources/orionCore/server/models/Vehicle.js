// server/models/Vehicle.js
const vehicle = new EntitySchema({
    name: 'Vehicle',
    tableName: 'vehicles',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        model: {
            type: String,
        },
        state: {
            type: 'simple-json',
            nullable: true,
        },
    },
    relations: {
        owner: {
            target: 'Player',
            type: 'many-to-one',
            joinColumn: true,
            inverseSide: 'vehicles',
        },
    },
});
module.exports = vehicle;