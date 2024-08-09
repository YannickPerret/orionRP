
module.exports = {
    version: 12,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('banks');
    }
};