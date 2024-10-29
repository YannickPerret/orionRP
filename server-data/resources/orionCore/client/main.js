import { config } from '../config/config.js';

// Désactiver la régénération de santé
setInterval(() => {
    const playerId = PlayerId();
    DisablePlayerHealthRegen(playerId);
}, 1000);
