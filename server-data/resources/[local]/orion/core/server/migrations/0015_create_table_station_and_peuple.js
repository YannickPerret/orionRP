const gazStationsString = LoadResourceFile(GetCurrentResourceName(), 'station/gasStations.json');
const gazStationsBlips = JSON.parse(gazStationsString);

module.exports = {
    version: 15,
    migrate: async (db) => {

        await db.schema.createTable('station')
        gazStationsBlips.forEach((station, index) => {
            db.insert('station', {
                name: `station${index}`,
                position: station.coordinates,
                pumpsEssence: station.pumps,
                pumpsElectric: [],
                currentFuel: 2000,
                maxFuel: 2000,
                priceElectric: 1.5,
                priceEssence: 1.5,
                enabled: true,
            });
        });
    }
};