const gasStations = require('./gasStations.js');
const blips = [];

setInterval(() => {
  const playerPed = PlayerPedId();
  for (let i = 0; i < gasStations.length; i++) {
    const station = gasStations[i];
    createBlip(station.coordinates, 361, 1, 1, 'Station essence');
  }
}, 10);
