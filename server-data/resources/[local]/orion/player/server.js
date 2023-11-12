//register event for save position player
registerNetEvent("orion:savePositionPlayer");
onNet("orion:savePositionPlayer", (x, y, z) => {
  const player = PlayerManager.getPlayer(source);
  if (player) {
    player.position = {
      x: x,
      y: y,
      z: z,
    };
    player.save();
  }
});
