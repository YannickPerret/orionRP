module.exports = {
    version: 0,
    migrate: async (db) => {
        // Création d'une table
        await db.createTable('system');
        await db.insert('system', { version: 0, lastUpdate: new Date(), name: "Orion", dateCreated: new Date(), maxPlayers: 64 });
    }
};