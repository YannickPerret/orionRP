// Ajouter les serveurs au file dans manifest

const PlayerManagerServer = require('./core/playerManager.js');

on('playerDropped', reason => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManagerServer.removePlayer(sourceId);
});
