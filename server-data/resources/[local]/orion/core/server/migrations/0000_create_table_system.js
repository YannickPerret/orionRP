
module.exports = {
    version: 0,
    migrate: async (db) => {
        // Insertion d'un document avec un ID spécifique dans la table 'system'
        await db.insert('system', {
            id: '1',
            version: 0, // Version initiale
            lastUpdate: new Date(), // Date de la dernière mise à jour
            name: "Orion", // Autres champs
            dateCreated: new Date(),
            maxPlayers: 64
        });
    }
};