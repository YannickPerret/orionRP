
module.exports = {
    version: 11,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('vehicles');
    }
};