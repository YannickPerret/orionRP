const itemsList = require('../../shared/items.js');

module.exports = {
    version: 14,
    migrate: async (db) => {

        itemsList.forEach(async (item) => {
            console.log(`Adding item ${item.name}`)
            await db.insert('items', item);
        });
    }
};