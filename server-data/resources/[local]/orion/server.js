(async () => {
    const PlayerManagerServer = require('./core/server/playerManager.js');
    const { db, r } = require('./core/server/database.js');

    await db.initializeMigration();
    // initialize blips and markers
    await exports['orion'].initializeBlips();

    on('playerDropped', reason => {
        let sourceId = global.source;
        PlayerManagerServer.removePlayer(sourceId);
    });



})();