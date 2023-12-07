const PlayerManagerServer = require('./core/server/playerManager.js');

on('playerDropped', reason => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManagerServer.removePlayer(sourceId);
});
