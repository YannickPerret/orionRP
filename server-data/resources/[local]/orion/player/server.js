const PlayerManager = require("../system/playerManager.js");
//register event for save position player
onNet("orion:savePositionPlayer", async (position) => {
  console.log("save position player");
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  if (player) {
    player.position = {
      x: position[0],
      y: position[1],
      z: position[2],
    };
    await player.save();

    //show message for player
    emitNet("orion:showNotification", source, "Position sauvegardée");
  }
});
