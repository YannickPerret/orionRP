const PlayerManager = require('./system/playerManager.js');

on('playerDropped', reason => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManager.removePlayer(sourceId);
});
