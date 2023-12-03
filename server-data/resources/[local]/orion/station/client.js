const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);

(async () => {
  try {
    for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
      const station = gazStationsBlips.GasStations[i];
      createBlip(station.coordinates, 361, 0, 'Station essence');
    }

    while (true) {
      await Wait(0); // Important pour éviter de surcharger le thread
      const playerPed = PlayerPedId();
      const playerCoords = GetEntityCoords(playerPed, false);

      for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
        const station = gazStationsBlips.GasStations[i];
        const stationCoords = station.pumps;

        for (let j = 0; j < stationCoords.length; j++) {
          const pump = stationCoords[j];
          const distance = GetDistanceBetweenCoords(
            playerCoords[0],
            playerCoords[1],
            playerCoords[2],
            pump.x,
            pump.y,
            pump.z,
            true
          );

          console.log(distance);
          if (distance < 2) {
            if (!IsPedInAnyVehicle(PlayerPedId(), false)) {
              //DrawText3Ds(pump.x, pump.y, pump.z, 'Appuyez sur ~g~E~w~ pour prendre un tuyau');
              exports['orion'].showText('Appuyez sur ~g~E~w~ pour prendre un tuyau');

              if (IsControlJustReleased(0, 38)) {
                const props = CreateObject(GetHashKey('prop_gascyl_01a'), pump.x, pump.y, pump.z, true, true, true);

                AttachEntityToEntity(
                  props,
                  playerPed,
                  GetPedBoneIndex(playerPed, 28422),
                  0.15, // Ajustez ces valeurs pour positionner correctement le tuyau
                  -0.15,
                  0,
                  0,
                  0,
                  90, // Ajustez l'angle si nécessaire
                  true,
                  true,
                  false,
                  false,
                  0,
                  true
                );

                // Configurez ces paramètres selon vos besoins
                SetEntityCollision(props, true, true);
                SetEntityDynamic(props, true);
                SetEntityVisible(props, true, true);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
})();

function DrawText3Ds(x, y, z, text) {
  // Implémentez la fonction pour afficher le texte en 3D aux coordonnées spécifiées
}

function Wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
