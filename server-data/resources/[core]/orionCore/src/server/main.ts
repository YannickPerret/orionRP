import "@citizenfx/server";
import { AppDataSource } from "./databases/database";
import initItems from './scripts/initItems'
import './events/accountEvents';
import './events/characterEvents';

// Initialisation du serveur
on('onServerResourceStart', (resourceName: string) => {
    if (GetCurrentResourceName() !== resourceName) return;

    // Initialisation de la base de données
    AppDataSource.initialize().then(async () => {
        console.log('Connecté à la base de données de Orion');

        // Initialiser les items
        await initItems();

        console.log('Le serveur Orion est prêt');
    }).catch((error: any) => console.log('Erreur :', error));
});
