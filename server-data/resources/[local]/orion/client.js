const spawnLogin = () => {
  const ped = GetPlayerPed(-1);
  SetPlayerInvincible(ped, false);
  SetPlayerHealthRechargeMultiplier(PlayerId(), 0.0);
  SetEntityCoordsNoOffset(ped, parseFloat(-1037.0), parseFloat(-2738.0), parseFloat(20.0), false, false, false, true);

  SetCanAttackFriendly(PlayerPedId(), true, false);
  NetworkSetFriendlyFireOption(true);

  emitNet('orion:player:s:playerSpawned');
};

exports('spawnLogin', spawnLogin);


on('playerSpawned', () => {
  spawnLogin();
  //SendNuiMessage(JSON.stringify({ action: 'connectVoice' }));

});

onNet('orion:playerConnected', playerData => {

  exports['orion'].setPlayerData(playerData);

  SetEntityCoords(
    GetPlayerPed(-1),
    parseFloat(playerData.position.x),
    parseFloat(playerData.position.y),
    parseFloat(playerData.position.z),
    false,
    false,
    false,
    false);

  //SendNuiMessage(JSON.stringify({ action: 'switchToIngame' }));

  setInterval(() => {
    const [playerPositionX, playerPositionY, playerPositionZ] = GetEntityCoords(GetPlayerPed(-1), true);
    emitNet('orion:savePlayerPosition', playerPositionX, playerPositionY, playerPositionZ);
  }, 900000);

  emitNet('orion:s:initializeServer')

});