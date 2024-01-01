const bankCoordsJson = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'bank/bank.json'));

module.exports = {
    version: 16,
    migrate: async (db) => {

        bankCoordsJson.bank_nation.forEach(async (bank, index) => {
            await db.insert('bank_nation', {
                name: `Banque Nationale`,
                type: 'bank_nation',
                position: bank.coords,
                enabled: true,
                reservedMoney: 100000000,
                maxReservedMoney: 100000000,
            });

            await db.insert('banks', {
                name: `Banque`,
                type: 'bank',
                position: bank.coords,
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
                position: atm.coords,
                enabled: true,
                reservedMoney: 100000,
                maxReservedMoney: 100000,
            });
            console.log(`Distributeur ${index} créée`);
        });

        bankCoordsJson.managements.forEach(async (management, index) => {
            await db.insert('banks', {
                name: `Management`,
                type: 'management',
                position: management.coords,
                enabled: true,
            });
            console.log(`Management ${index} créée`);
        });
    }
};