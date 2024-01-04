const garagesJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'garage/garages.json'));
module.exports = {
    version: 17,
    migrate: async (db) => {
        garagesJson.forEach(async (garage, index) => {
            await db.insert('garages', {
                name: garage.name,
                type: garage.type,
                position: garage.position,
                maxSlots: garage.maxSlots,
                allowsVehicleTypes: garage.allowsVehicleTypes,
                price: garage.parkingFee,
                owner: [],
                spawnPlaces: garage.spawnPlaces,
                isActive: true,
            });
            console.log(`Garage ${index} créée`);
        });
    }
};