const AppDataSource = require('./server/databases/database.js');
    // Initialisation du serveur
    on('onServerResourceStart', (resourceName) => {
        if (GetCurrentResourceName() !== resourceName) return;

        // Initialisation de la base de données
        AppDataSource.initialize().then(async () => {
            console.log('Connecté à la base de données de Orion');

            // Initialiser les items
            const initItems = require('./server/scripts/initItems.js');
            await initItems();

            // Importer les événements serveur
            require('./server/events/characterEvents.js');
            require('./server/events/itemEvents.js');
            require('./server/events/inventoryEvents.js');

            const characterController = require('./server/controllers/Character.js');


            setInterval(async () => {
                await characterController.decreasePlayerNeeds();
            }, 60000);


            console.log('Le serveur est prêt');
        }).catch(error => console.log('Erreur :', error));
    });