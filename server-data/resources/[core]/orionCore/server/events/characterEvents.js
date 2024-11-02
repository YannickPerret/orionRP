const {loginToCharacter, registerCharacter, loadCharacter} = require('../controllers/Character.js')

onNet('orionCore:server:registerCharacter', async (characterData) => {
    const playerId = source;
    const identifier = getPlayerIdentifier(playerId);

    try {
        const user = await registerCharacter(identifier, characterData);
        loadCharacter(playerId, user);
        emitNet('characterCreator:client:closeCharacterCreation', playerId);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du personnage:', error);
    }
});

onNet('orionCore:server:requestPlayerData', async () => {
    const playerId = source;
    if (!playerId) {
        console.error('Erreur: `source` est null ou non défini');
        return;
    }

    try {
        const identifier = getPlayerIdentifier(playerId);
        const character = await loginToCharacter(playerId, identifier);
        await loadCharacter(playerId, character)
    } catch (error) {
        console.error(error.message);
        emitNet('characterCreator:client:startCharacterCreation', playerId);
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
