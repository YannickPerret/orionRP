const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));

module.exports = {
    version: 16,
    migrate: async (db) => {
        bankCoordsJson.banks.forEach(async (bank, index) => {
            await db.insert('banks', {
                name: `Banque`,
                type: 'bank',
                position: bank.coordinates,
                enabled: true,
                reservedMoney: 1000000,
                maxReservedMoney: 1000000,
            });
            console.log(`Banque ${index} créée`);
        });
        bankCoordsJson.atms.forEach(async (atm, index) => {
            await db.insert('banks', {
                name: `Distributeur`,
                type: 'atm',
                position: atm.coordinates,
                enabled: true,
                reservedMoney: 10000,
                maxReservedMoney: 10000,
            });
            console.log(`Distributeur ${index} créée`);
        });

        bankCoordsJson.managements.forEach(async (management, index) => {
            await db.insert('banks', {
                name: `Management`,
                type: 'management',
                position: management.coordinates,
                enabled: true,
            });
            console.log(`Management ${index} créée`);
        });
    }
};