onNet("orion:savePlayerPosition", async (x, y, z) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  if (player) {
    player.position = { x, y, z };
    await player.save();
    emitNet("orion:showNotification", source, "Position sauvegardée !");
  }
});

onNet("orion:player:giveAmount", (target, amount) => {
  emitNet("orion:showNotification", target, `Vous avez reçu ${amount} $ !`);
  emitNet(
    "orion:showNotification",
    global.source,
    `Vous avez donné ${amount} $ !`
  );
});
