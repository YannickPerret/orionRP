const gazStations = require('./gasStations.js');

(async () => {
  for (let i = 0; i < gazStations.length; i++) {
    const station = gazStations[i];
    createBlip(station.coordinates, 361, 1, 1, 'Station essence');
  }
})();
