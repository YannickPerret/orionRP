const gasStations = require('./gasStations.js');
const blips = [];

setInterval(() => {
  console.log('Creating blips');

  console.log(gasStations);
  for (let i = 0; i < gasStations.length; i++) {
    const station = gasStations[i];
    createBlip(station.coordinates, 361, 1, 1, 'Station essence');
  }
}, 10);
