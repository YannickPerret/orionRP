
module.exports = {
    version: 4,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('items');
    }
};