const AppDataSource = require('../databases/database.js');
const User = require('../models/User');

onNet('character:spawned', async (playerId) => {
    try {
        const identifier = getPlayerIdentifier(playerId);
        const userRepository = AppDataSource.getRepository(User);

        // Récupérer l'utilisateur en fonction de son identifiant
        const user = await userRepository.findOne({
            where: { identifier },
            relations: ['characters'],
        });

        if (user && user.characters.length > 0) {
            const character = user.characters[0];

            if (character && character.position) {
                const { x, y, z } = character.position;

                // Émission côté client pour téléporter le joueur
                emitNet('admin:teleportToPosition', playerId, x, y, z);
                console.log(`Le personnage ${character.name} a été téléporté à sa position sauvegardée.`);
            } else {
                console.log('Position de personnage non définie.');
            }
        } else {
            console.log(`Aucun utilisateur ou personnage trouvé pour l'identifiant ${identifier}.`);
        }
    } catch (error) {
        console.error('Erreur lors de la téléportation du personnage:', error);
    }
});

function getPlayerIdentifier(playerId) {
    for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
        const identifier = GetPlayerIdentifier(playerId, i);
        if (identifier.includes('license:')) {
            return identifier;
        }
    }
    return null;
}