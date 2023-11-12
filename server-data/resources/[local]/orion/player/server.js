onNet("orion:savePlayerPosition", async (x, y, z) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  if (player) {
    player.position = { x, y, z };
    await player.save();
    TriggerClientEvent(
      "orion:showNotification",
      source,
      "Votre position a été sauvegardée."
    );
  }
});
