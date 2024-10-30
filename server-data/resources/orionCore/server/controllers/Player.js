// server/controllers/playerController.js
const { AppDataSource } = require('../main');
const Player = require('../models/Player');
const inventoryController = require('./Inventory');

module.exports = {
    async handlePlayerConnecting(playerId, name, deferrals) {
        try {
            const identifier = getPlayerIdentifier(playerId);
            const playerRepository = AppDataSource.getRepository('Player');

            let player = await playerRepository.findOne({
                where: { identifier },
                relations: ['inventory'],
            });

            if (!player) {
                // Créer un nouveau joueur avec des besoins initiaux
                player = playerRepository.create({
                    identifier,
                    name,
                    state: {},
                    needs: {
                        hunger: 100,
                        thirst: 100,
                        rest: 100,
                        smoking: 100,
                        drugs: 100,
                        exercise: 100,
                    },
                });

                // Créer l'inventaire du joueur
                player.inventory = await inventoryController.createInventory();

                await playerRepository.save(player);
            }

            // Charger les données du joueur en mémoire ou dans Redis si nécessaire
            // ...

            deferrals.done();
        } catch (error) {
            console.log('Erreur lors de la connexion du joueur:', error);
            deferrals.done('Erreur lors de la connexion au serveur.');
        }
    },

    async handlePlayerDropped(playerId, reason) {
        try {
            const identifier = getPlayerIdentifier(playerId);
            const playerRepository = AppDataSource.getRepository('Player');

            let player = await playerRepository.findOne({ where: { identifier } });

            if (player) {
                // Sauvegarder l'état du joueur
                await playerRepository.save(player);
            }

            // Supprimer le joueur de la mémoire ou de Redis si nécessaire
            // ...

        } catch (error) {
            console.log('Erreur lors de la déconnexion du joueur:', error);
        }
    },

    async decreasePlayerNeeds() {
        const playerRepository = AppDataSource.getRepository('Player');
        const players = await playerRepository.find();

        for (let player of players) {
            let needs = player.needs;

            if (!needs) continue; // Si les besoins ne sont pas initialisés

            // Diminuer les besoins
            needs.hunger = Math.max(0, needs.hunger - 0.5);
            needs.thirst = Math.max(0, needs.thirst - 0.5);
            needs.rest = Math.max(0, needs.rest - 0.2);
            needs.smoking = Math.max(0, needs.smoking - 0.1);
            needs.drugs = Math.max(0, needs.drugs - 0.05);
            needs.exercise = Math.max(0, needs.exercise - 0.1);

            // Mettre à jour le joueur
            player.needs = needs;
            await playerRepository.save(player);

            // Si certains besoins sont à 0, appliquer des effets
            if (needs.hunger === 0 || needs.thirst === 0) {
                // Réduire la santé du joueur
                emitNet('core:reducePlayerHealth', player.id, 5);
            }

            // Vous pouvez ajouter d'autres effets en fonction des besoins
        }
    },

    async applyItemEffects(playerId, effects) {
        const playerRepository = AppDataSource.getRepository('Player');
        let player = await playerRepository.findOne({ where: { id: playerId } });

        if (player && player.needs) {
            let needs = player.needs;

            for (let effect of effects) {
                if (needs.hasOwnProperty(effect.type)) {
                    needs[effect.type] = Math.min(100, needs[effect.type] + effect.amount);
                }
            }

            player.needs = needs;
            await playerRepository.save(player);

            // Envoyer les besoins mis à jour au client
            emitNet('core:updatePlayerNeeds', playerId, player.needs);
        }
    },
};

function getPlayerIdentifier(playerId) {
    for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
        const identifier = GetPlayerIdentifier(playerId, i);
        if (identifier.includes('license:')) {
            return identifier;
        }
    }
    return null;
}
