    require('reflect-metadata');
    const { DataSource } = require('typeorm');

    // Créer une instance de DataSource
    const AppDataSource = new DataSource(dbConfig);

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

            const playerController = require('./controllers/Player.js');


            setInterval(async () => {
                await playerController.decreasePlayerNeeds();
            }, 60000);


            console.log('Le serveur est prêt');
        }).catch(error => console.log('Erreur de connexion à la base de données:', error));
    });