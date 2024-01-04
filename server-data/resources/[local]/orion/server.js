(async () => {
    const PlayerManagerServer = require('./core/server/playerManager.js');
    const { db, r } = require('./core/server/database.js');

    db.initializeMigration().then(async () => {
        // Les actions à effectuer après la fin de la migration
        //emit('orion:blips:s:createBlips')

        //await exports['orion'].initializeMarkers();
    }).catch(error => {
        // Gérer les erreurs éventuelles de la migration
        console.error("Erreur lors de l'initialisation de la migration :", error);
    });

    onNet('orion:s:initializeServer', async () => {
        let sourceId = global.source;
        await exports['orion'].initializeBlips(sourceId);
    })

    on('playerDropped', reason => {
        let sourceId = global.source;
        PlayerManagerServer.removePlayer(sourceId);
    });



})();