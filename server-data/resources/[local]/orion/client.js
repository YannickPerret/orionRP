(async () => {

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

    setTick(async () => {

      if (GetPlayerWantedLevel(PlayerId()) > 0) {
        SetPlayerWantedLevel(PlayerId(), 0, false);
        SetPlayerWantedLevelNow(PlayerId(), false);
        SetPlayerWantedLevelNoDrop(PlayerId(), 0, false);
      }

      SetRelationshipBetweenGroups(0, GetHashKey('COP'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_HILLBILLY'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_BALLAS'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_MEXICAN'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_FAMILY'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_MARABUNTE'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_SALVA'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('AMBIENT_GANG_LOST'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('GANG_1'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('GANG_2'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('GANG_9'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('GANG_10'), GetHashKey('PLAYER'));

      HideHudComponentThisFrame(3);
      HideHudComponentThisFrame(4);
      HideHudComponentThisFrame(13);
      HideHudComponentThisFrame(14);
      await exports['orion'].delay(5);

      
    });
  });

})()