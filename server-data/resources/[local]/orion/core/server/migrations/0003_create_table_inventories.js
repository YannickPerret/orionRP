
module.exports = {
    version: 3,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('inventories');
    }
};