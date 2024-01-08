let isFlymodeEnabled = false;
let isBlackout = false;
const flymodeSpeed = 100;
let isAdminEnable = false;
let adminShowEntityOwner = false;

RegisterCommand('admin', (aource, args) => {
  isAdminEnable = !isAdminEnable;
  let playerPed = GetPlayerPed(-1);
  if (isAdminEnable) {
    emit('orion:showNotification', 'Admin activé');
    SetPlayerInvincible(playerPed, true);
    DisplayRadar(true);
    NetworkSetEntityInvisibleToNetwork(playerPed, true);

    // NetworkGetEntityOwner

  } else {
    emit('orion:showNotification', 'Admin désactivé');
    SetPlayerInvincible(playerPed, false);
    DisplayRadar(false);
    NetworkSetEntityInvisibleToNetwork(playerPed, false);
  }

}, false);

RegisterCommand('tp', (source, args) => {
  SetEntityCoordsNoOffset(
    GetPlayerPed(),
    parseFloat(args[0]),
    parseFloat(args[1]),
    parseFloat(args[2]),
    false,
    false,
    true
  );
});

RegisterCommand(
  'tpto',
  (source, args) => {
    const playerPed = GetPlayerPed(-1);
    const blip = GetFirstBlipInfoId(8); // ID 8 correspond à un waypoint
    if (blip !== 0) {
      const coord = GetBlipInfoIdCoord(blip);
      RequestCollisionAtCoord(coord[0], coord[1], coord[2]);

      // Attendre que la hauteur du sol soit chargée
      let groundZ = 0;
      let groundCheck = false;

      setTimeout(() => {
        [groundCheck, groundZ] = GetGroundZFor_3dCoord(coord[0], coord[1], coord[2], 0, false);
        if (groundCheck) {
          SetEntityCoordsNoOffset(playerPed, coord[0], coord[1], groundZ + 1.0, false, false, true); // Ajouté un petit offset pour éviter de se retrouver sous le sol
        } else {
          SetEntityCoords(playerPed, coord[0], coord[1], coord[2], false, false, false, true);
        }
      }, 1000); // Attendre 1 seconde pour laisser le temps au jeu de charger la hauteur du sol
    } else {
      console.log('Aucun waypoint trouvé.');
    }
  },
  false
);

RegisterCommand(
  'noclip',
  () => {
    const playerPed = GetPlayerPed(-1);

    if (!isFlymodeEnabled) {
      isFlymodeEnabled = true;
      SetEntityInvincible(playerPed, true);
      SetEntityMaxSpeed(playerPed, flymodeSpeed);
      SetEntityCollision(playerPed, false, false);

      SetEntityVisible(playerPed, false, false);
      SetEntityAlpha(playerPed, 100, false); // Rendre le joueur partiellement transparent localement
      SetEveryoneIgnorePlayer(playerPed, true);

      DisableControlAction(0, 22, true); // Disable forward
      DisableControlAction(0, 23, true); // Disable backward
      DisableControlAction(0, 24, true); // Disable left
      DisableControlAction(0, 25, true); // Disable right

      intervalId = setInterval(() => {
        SetEntityLocallyVisible(playerPed);
        SetLocalPlayerVisibleLocally(true);
      }, 0);

      // Désactiver certains contrôles...
      emit('orion:showNotification', 'Flymode activé');
    } else {
      isFlymodeEnabled = false;
      SetEntityInvincible(playerPed, false);
      SetEntityMaxSpeed(playerPed, 20);
      SetEntityCollision(playerPed, true, true);

      SetEntityVisible(playerPed, true, false);
      SetEntityAlpha(playerPed, 255, false);
      SetEveryoneIgnorePlayer(playerPed, false);

      EnableControlAction(0, 22, true); // Enable forward
      EnableControlAction(0, 23, true); // Enable backward
      EnableControlAction(0, 24, true); // Enable left
      EnableControlAction(0, 25, true); // Enable right

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      emit('orion:showNotification', 'Flymode désactivé');
    }
  },
  0
);

RegisterCommand(
  'blackout',
  () => {
    isBlackout = !isBlackout;
    SetArtificialLightsState(isBlackout);
  },
  false
);

RegisterCommand('giveWeapon', (source, args) => {
  if (!args[0]) return emit('orion:showNotification', 'Vous devez entrer un nom d\'arme !');
  const weapon = args[0];
  const number = args[1] || 1;
  const targetSource = args[2] || source;
  GiveWeaponToPed(GetPlayerPed(targetSource), GetHashKey(weapon), number, false, true);
}, false);
