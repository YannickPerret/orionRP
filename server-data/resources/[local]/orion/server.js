(async () => {
    const PlayerManagerServer = require('./core/server/playerManager.js');
    const { db, r } = require('./core/server/database.js');

    db.initializeMigration().then(async () => {
        // Les actions à effectuer après la fin de la migration
        //emit('orion:blips:s:createBlips')

        //emit('orion:s:initializeServer')
        //await exports['orion'].initializeMarkers();
    }).catch(error => {
        // Gérer les erreurs éventuelles de la migration
        console.error("Erreur lors de l'initialisation de la migration :", error);
    });

    onNet('orion:s:initializeServer', async () => {
        const source = global.source;
        const blipList = await exports['orion'].initializeBlips();

        emit('orion:blips:c:createBlips', source, blipList)

    })

    on('playerDropped', reason => {
        let sourceId = global.source;
        PlayerManagerServer.removePlayer(sourceId);
    });



})();