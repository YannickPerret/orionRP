
module.exports = {
    version: 6,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('jobs');
    }
};