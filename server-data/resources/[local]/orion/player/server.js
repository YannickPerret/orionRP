//register event for save position player
onNet("orion:savePositionPlayer", (x, y, z) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  if (player) {
    player.position = {
      x: x,
      y: y,
      z: z,
    };
    player.save();
  }
});
