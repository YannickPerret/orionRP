onNet('orion:savePlayerPosition', async (x, y, z) => {
  const source = global.source;
  const player = PlayerManager.getPlayerBySource(source);
  if (player) {
    player.position = { x, y, z };
    await player.save();
    emitNet('orion:showNotification', source, 'Position sauvegardée !');
  }
});

onNet('orion:player:giveAmount', (target, amount) => {
  if (isNaN(amount) || amount <= 0) {
    emitNet('orion:showNotification', source, 'Montant invalide !');
    return;
  }
  emitNet('orion:showNotification', target, `Vous avez reçu ${amount} $ !`);
  emitNet('orion:showNotification', global.source, `Vous avez donné ${amount} $ !`);

  emitNet('orion:player:addMoney', target, amount);
  emitNet('orion:player:removeMoney', global.source, amount);
});
