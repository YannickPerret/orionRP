(() => {
    const PlayerManagerServer = require('./core/server/playerManager.js');

    on('playerDropped', reason => {
        const sourceId = global.source;
        PlayerManagerServer.removePlayer(sourceId);
    });


    
})();