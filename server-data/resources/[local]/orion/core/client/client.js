(async () => {

  let isNuiOpen = false;

  RegisterKeyMapping('openPlayerMenu', 'Open Player Menu', 'keyboard', 'F2');
  RegisterCommand(
    'openPlayerMenu',
    () => {
      emitNet('orion:getPlayerData');
    },
    false
  );



  onNet('orion:openPlayerMenu', playerData => {
    isNuiOpen = !isNuiOpen;
    SetNuiFocus(isNuiOpen, isNuiOpen);
    SendNuiMessage(
      JSON.stringify({
        action: isNuiOpen ? 'ShowPlayerMenu' : 'closeNUI',
        data: playerData,
      })
    );
  });

  // UI REGISTER
  RegisterNuiCallbackType('closeNUI');
  on('__cfx_nui:closeNUI', (data, cb) => {
    if (isNuiOpen) {
      isNuiOpen = false;
      SetNuiFocus(false, false);
    }
    cb({ ok: true });
  });


  onNet('orion:core:c:animations:playAnimation', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5) => {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await exports['orion'].delay(0);
    }
    TaskPlayAnim(PlayerPedId(), dict, anim, duration, flag, flag2, flag3, flag4, flag5);
  });

  onNet('orion:core:c:animations:playAnimationWithTime', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5) => {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await exports['orion'].delay(0);
    }
    TaskPlayAnim(PlayerPedId(), dict, anim, 1.0, -1.0, -1, 1, 1, true, true, true);
    await exports['orion'].delay(duration);
    ClearPedTasks(PlayerPedId());
  });

  onNet('orion:core:c:animations:playAnimationWithProp', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5, propDict, prop, bone, x, y, z, xRot, yRot, zRot, flag6, flag7) => {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await exports['orion'].delay(0);
    }
    RequestModel(propDict);
    while (!HasModelLoaded(propDict)) {
      await exports['orion'].delay(0);
    }
    TaskPlayAnim(PlayerPedId(), dict, anim, duration, flag, flag2, flag3, flag4, flag5);
    await exports['orion'].delay(100);
    const boneIndex = GetPedBoneIndex(PlayerPedId(), bone);
    const propSpawn = CreateObject(GetHashKey(propDict), x, y, z, true, true, true);
    AttachEntityToEntity(propSpawn, PlayerPedId(), boneIndex, x, y, z, xRot, yRot, zRot, flag6, flag7, true, true, false, true);
    await exports['orion'].delay(duration);
    ClearPedTasks(PlayerPedId());
    DeleteEntity(propSpawn);
  });


  onNet('orion:core:c:animations:playAnimationLoop', async (dict, anim, duration, flag, flag2, flag3, flag4, flag5) => {
    RequestAnimDict(dict);
    while (!HasAnimDictLoaded(dict)) {
      await exports['orion'].delay(0);
    }
    TaskPlayAnim(PlayerPedId(), dict, anim, duration, flag, flag2, flag3, flag4, flag5);
  });

  onNet('orion:core:c:animations:stopAllAnimations', async () => {
    ClearPedTasks(PlayerPedId());
  });

  RegisterNuiCallbackType('hideFrame');
  on('__cfx_nui:hideFrame', (data, cb) => {
    SetNuiFocus(false, false);
    cb({ ok: true });
  });


  onNet('orion:core:c:hideFrame', async () => {
    SetNuiFocus(false, false);
    SendNuiMessage(
      JSON.stringify({
        action: 'hideFrame',
      })
    );
  });

  (async () => {
    for (var i = 1; i <= 15; i++) {
      EnableDispatchService(i, false);
    }

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


      //disable prison ped attack player
      SetRelationshipBetweenGroups(0, GetHashKey('PRISONER'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(0, GetHashKey('SECURITY_GUARD'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(0, GetHashKey('HATES_PLAYER'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('CIVMALE'), GetHashKey('PLAYER'));
      SetRelationshipBetweenGroups(1, GetHashKey('CIVFEMALE'), GetHashKey('PLAYER'));




      HideHudComponentThisFrame(3);
      HideHudComponentThisFrame(4);
      HideHudComponentThisFrame(13);
      HideHudComponentThisFrame(14);
      await exports['orion'].delay(0);
    });

  })();

})()
