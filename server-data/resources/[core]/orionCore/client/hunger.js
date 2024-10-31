import { config } from '../config/config.js';

let hunger = config.hunger.max;

setInterval(() => {
    hunger -= config.hunger.decayRate;
    if (hunger <= 0) {
        hunger = 0;
        // Le joueur commence à perdre de la santé
        const playerPed = PlayerPedId();
        const health = GetEntityHealth(playerPed);
        SetEntityHealth(playerPed, health - 5); // Perte de santé progressive
    }
    // Mettre à jour l'interface utilisateur ici si nécessaire
}, 60000); // Toutes les minutes

// Évent pour restaurer la faim (par exemple, en mangeant)
onNet('core:restoreHunger', (amount) => {
    hunger += amount;
    if (hunger > config.hunger.max) hunger = config.hunger.max;
});


// Commande pour manger et restaurer la faim
RegisterCommand('manger', () => {
    emitNet('core:eatFood');
}, false);
