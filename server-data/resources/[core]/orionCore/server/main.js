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


            // Initialiser les accounts
            require('./server/events/accountEvents.js')
            require('./server/events/characterEvents.js')

            console.log('Le serveur Orion est prêt');
        }).catch(error => console.log('Erreur :', error));
    });