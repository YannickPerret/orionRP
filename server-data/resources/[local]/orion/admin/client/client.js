(async () => {
    let isSpectating = false
    let lastSpectateCoord = null

    onNet('orion:admin:c:spectate', async (targetId, targetCoords) => {
        let playerPed = PlayerPedId();
        let targetPed = GetPlayerFromServerId(targetId);
        let target = GetPlayerPed(targetPed);

        if (!isSpectating) {
            isSpectating = true
            SetEntityVisible(playerPed, true);
            SetEntityCollision(playerPed, false, false);
            SetEntityInvincible(playerPed, true)
            NetworkSetEntityInvisibleToNetwork(playerPed, true)
            lastSpectateCoord = GetEntityCoords(playerPed)
            NetworkSetInSpectatorMode(true, target)
        }
        else {
            isSpectating = false
            NetworkSetInSpectatorMode(false, target)
            NetworkSetEntityInvisibleToNetwork(playerPed, false)
            SetEntityCollision(playerPed, true, true);
            SetEntityCoords(playerPed, lastSpectateCoord)
            SetEntityVisible(playerPed, true);
            SetEntityInvincible(playerPed, false)
            lastSpectateCoord = null
        }
    })

    /* setTick(async () => {
 
         if (isAdminEnable) {
             const playerPed = PlayerPedId();
 
             if (adminShowEntityOwner) {
                 // get all pnj around the player and show their owner
                 const playerCoords = GetEntityCoords(playerPed);
 
 
                 const entity = GetEntityPlayerIsFreeAimingAt(PlayerId());
                 NetworkGetEntityOwner(playerPed)
             }
         }
 
         await exports['orion'].delay(5);
     })*/

})()