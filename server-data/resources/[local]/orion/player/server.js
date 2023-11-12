onNet("orion:savePlayerPosition", async (x, y, z) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  console.log("player", player);
  if (player) {
    player.position = { x, y, z };
    await player.save();
  }
});
