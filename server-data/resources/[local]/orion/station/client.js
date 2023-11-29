const gazStations = require('./gasStations.js');

async () => {
  for (let i = 0; i < gasStations.length; i++) {
    const station = gasStations[i];
    createBlip(station.coordinates, 361, 1, 1, 'Station essence');
  }
};
