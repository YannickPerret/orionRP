
module.exports = {
    version: 2,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('accounts');
    }
};