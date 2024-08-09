(async () => {
    const PlayerManagerServer = require('./core/server/playerManager.js');
    const { db, r } = require('./core/server/database.js');

    db.initializeMigration().then(async () => {
        //initialize garages
        emit('orion:garage:s:init')
        emit('orion:station:s:init')
        emit('orion:jobs:s:init')

    }).catch(error => {
        // Gérer les erreurs éventuelles de la migration
        console.error("Erreur lors de l'initialisation de la migration :", error);
    });


    on('playerDropped', reason => {
        let sourceId = global.source;
        PlayerManagerServer.removePlayer(sourceId);
    });



})();