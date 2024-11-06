"use strict";
const AppDataSource = require('./server/databases/database.js');
on('onServerResourceStart', (resourceName) => {
    if (GetCurrentResourceName() !== resourceName)
        return;
    AppDataSource.initialize().then(async () => {
        console.log('Connecté à la base de données de Orion');
        const initItems = require('./server/scripts/initItems.js');
        await initItems();
        require('./server/events/accountEvents.js');
        require('./server/events/characterEvents.js');
        console.log('Le serveur Orion est prêt');
    }).catch(error => console.log('Erreur :', error));
});
