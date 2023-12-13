(() => {
    const PlayerManagerServer = require('./core/server/playerManager.js');

    on('playerDropped', reason => {
    let sourceId = global.source;
    PlayerManagerServer.removePlayer(sourceId);
    });


    
})();