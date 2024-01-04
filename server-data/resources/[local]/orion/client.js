(async () => {

  const spawnLogin = () => {
    const ped = GetPlayerPed(-1);
    SetPlayerInvincible(ped, false);
    SetPlayerHealthRechargeMultiplier(PlayerId(), 0.0);
    SetEntityCoordsNoOffset(ped, parseFloat(-1037.0), parseFloat(-2738.0), parseFloat(20.0), false, false, false, true);

    SetCanAttackFriendly(PlayerPedId(), true, false);
    NetworkSetFriendlyFireOption(true);
    console.log(1)
    emitNet('orion:player:s:playerSpawned');
  };

  exports('spawnLogin', spawnLogin);


  on('playerSpawned', () => {
    spawnLogin();
    //SendNuiMessage(JSON.stringify({ action: 'connectVoice' }));

  });

})()