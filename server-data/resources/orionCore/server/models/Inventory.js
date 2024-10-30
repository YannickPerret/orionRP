// server/models/Inventory.js
const inventory = new EntitySchema({
    name: 'Inventory',
    tableName: 'inventories',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
    },
    relations: {
        player: {
            target: 'Player',
            type: 'one-to-one',
            inverseSide: 'inventory',
        },
        items: {
            target: 'InventoryItem',
            type: 'one-to-many',
            inverseSide: 'inventory',
            cascade: true,
        },
    },
});

module.exports = inventory;