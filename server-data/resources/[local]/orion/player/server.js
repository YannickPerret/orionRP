const PlayerManager = require("../system/playerManager.js");
//register event for save position player
onNet("orion:savePositionPlayer", (position) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  console.log(position, player);
  if (player) {
    player.position = {
      x: position[0],
      y: position[1],
      z: position[2],
    };
    player.save();

    //show message for player
    emitNet("orion:showNotification", source, "Position sauvegardée");
  }
});
