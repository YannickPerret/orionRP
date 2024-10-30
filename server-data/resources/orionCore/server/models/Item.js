// server/models/Item.js
const item = new EntitySchema({
    name: 'Item',
    tableName: 'items',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        stackable: {
            type: Boolean,
            default: true,
        },
        usable: {
            type: Boolean,
            default: false,
        },
        giveable: {
            type: Boolean,
            default: true,
        },
        effects: {
            type: 'simple-json',
            nullable: true,
        },
    },
});

module.exports = item;