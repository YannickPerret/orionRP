(async () => {
  const gazStationsString = LoadResourceFile('orion', 'gasStations.json');
  const gazStationsBlips = JSON.parse(gazStationsString);
  console.log(gazStationsBlips);
  for (let i = 0; i < gazStationsBlips.GasStations.length; i++) {
    const station = gazStationsBlips.GasStations[i];
    createBlip(station.coordinates, 361, 0, 'Station essence');
  }
})();
