
module.exports = {
    version: 5,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('cards');
    }
};