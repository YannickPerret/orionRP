
module.exports = {
    version: 7,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('jobs_grades');
    }
};