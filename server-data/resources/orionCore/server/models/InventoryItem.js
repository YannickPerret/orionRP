// server/models/InventoryItem.js
const inventoryItem = new EntitySchema({
    name: 'InventoryItem',
    tableName: 'inventory_items',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    relations: {
        inventory: {
            target: 'Inventory',
            type: 'many-to-one',
            joinColumn: true,
            inverseSide: 'items',
        },
        item: {
            target: 'Item',
            type: 'many-to-one',
            joinColumn: true,
        },
    },
});

module.exports = inventoryItem;