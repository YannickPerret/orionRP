const PlayerManager = require('./system/playerManager.js');

on('playerDropped', reason => {
  let sourceId = global.source; // Obtenez l'ID unique du joueur
  PlayerManager.removePlayer(sourceId);
});

const getPlayerCoords = player => {
  const ped = GetPlayerPed(player);
  const [playerX, playerY, playerZ] = GetEntityCoords(ped, true);
  return { x: playerX, y: playerY, z: playerZ };
};

// save all player position every 15 minutes
setInterval(async () => {
  // Get all players from the playerManager
  const players = playerManager.getPlayers();

  // Update the position of each player
  for (const player of players) {
    player.position = getPlayerCoords(player.source);
    await player.save();
    emitNet('orion:showNotification', source, 'Position sauvegardée !');
  }
}, 900000);
