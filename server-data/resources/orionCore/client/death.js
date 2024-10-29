import { config } from '../config/config.js';

setTick(() => {
    const playerPed = PlayerPedId();
    const health = GetEntityHealth(playerPed);

    if (health <= config.coma.healthThreshold) {
        // Le joueur tombe dans le coma
        SetEntityHealth(playerPed, 1); // Empêche la mort complète
        SetEntityInvincible(playerPed, true);
        SetPedToRagdoll(playerPed, 1000, 1000, 0, false, false, false);

        // Envoyer un événement au serveur
        emitNet('core:playerInComa');

        // Afficher un message ou une interface de coma
        // Exemple : afficher un écran noir ou un message d'aide
    }
});
