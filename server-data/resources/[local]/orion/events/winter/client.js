const snowBall = {
  Wait: 2000,
  AnimDict: 'anim@mp_snowball',
  AnimName: 'pickup_snowball',
};

const loadAnimDict = animDict => {
  RequestAnimDict(animDict);
  while (!HasAnimDictLoaded(animDict)) {
    Delay(0);
  }
};

SetTick(() => {
  if (
    !IsPedInAnyVehicle(PlayerPedId(), true) &&
    !IsPedUsingAnyScenario(PlayerId()) &&
    !IsPedInCover(PlayerPedId()) &&
    !IsPedSwimming(PlayerPedId()) &&
    !IsPedFalling(PlayerPedId()) &&
    !IsPedRunning(PlayerPedId()) &&
    !IsPedRagdoll(PlayerPedId()) &&
    !IsPedSprinting(PlayerPedId()) &&
    GetInteriorFromEntity(PlayerPedId()) == 0 &&
    !IsPlayerFreeAiming(PlayerPedId()) &&
    !IsPedSwimmingUnderWater(PlayerPedId()) &&
    !IsPedShooting(PlayerPedId(), 0)
  ) {
    snowBall.Wait = 0;
    if (IsControlJustReleased(0, 58)) {
      loadAnimDict(snowBall.AnimDict);
      TaskPlayAnim(PlayerPedId(), snowBall.AnimDict, snowBall.AnimName, 8.0, -1, -1, 0, 1, 0, 0, 0);
      snowBall.Wait = 2000;
      GiveWeaponToPed(PlayerPedId(), GetHashKey('weapon_snowball'), 1);
      SetCurrentPedWeapon(PlayerPedId(), GetHashKey('weapon_snowball'), true);
    } else {
      snowBall.Wait = 2000;
    }
  }
}, snowBall.Wait);
