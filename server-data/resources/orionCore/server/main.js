// server/main.js
require('reflect-metadata');
const { DataSource } = require('typeorm');
const ormconfig = require('./ormconfig.js');

// Créer une instance de DataSource
const AppDataSource = new DataSource(ormconfig);

// Exporter AppDataSource pour l'utiliser dans d'autres modules
module.exports = { AppDataSource };

// Initialisation du serveur
on('onServerResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName) return;

    // Initialisation de la base de données
    AppDataSource.initialize().then(async () => {
        console.log('Connecté à la base de données MySQL avec TypeORM');

        // Initialiser les items
        const initItems = require('./scripts/initItems.js');
        await initItems();

        // Importer les événements serveur
        require('./events/playerEvents.js');
        require('./events/itemEvents.js');
        require('./events/inventoryEvents.js');
        // ... importer d'autres événements si nécessaire

        const playerController = require('./controllers/playerController.js');
        setInterval(async () => {
            await playerController.decreasePlayerNeeds();
        }, 60000);


        console.log('Le serveur est prêt');
    }).catch(error => console.log('Erreur de connexion à la base de données:', error));
});
