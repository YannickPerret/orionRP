
module.exports = {
    version: 13,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('garages');
    }
};