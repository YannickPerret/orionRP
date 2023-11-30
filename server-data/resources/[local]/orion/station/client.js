const gazStationsString = LoadResourceFile('orion', 'gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);

(async () => {
  console.log(gazStationsBlips);
  for (let i = 0; i < gazStationsBlips.length; i++) {
    const station = gazStationsBlips[i];
    createBlip(station.coordinates, 361, 0, 'Station essence');
  }
})();
