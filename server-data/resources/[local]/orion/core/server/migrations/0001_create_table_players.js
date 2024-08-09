
module.exports = {
    version: 1,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('players');
    }
};
