
module.exports = {
    version: 10,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('players_skins');
    }
};