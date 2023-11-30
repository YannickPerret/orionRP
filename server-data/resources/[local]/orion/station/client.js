(async () => {
  try {
    const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
    const gazStationsBlips = JSON.parse(gazStationsString);

    for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
      const station = gazStationsBlips.GasStations[i];
      createBlip(station.coordinates, 361, 0, 'Station essence');
    }
  } catch (error) {
    console.log(error);
  }
})();
