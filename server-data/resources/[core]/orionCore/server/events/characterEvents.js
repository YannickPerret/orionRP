const {loginToCharacter, registerCharacter, loadCharacter} = require('../controllers/Character.js')
const PlayerManagerService = require('../services/PlayerManagerServices.js')

onNet('orionCore:server:registerCharacter', async (characterData, cb) => {
    const playerId = source;
    const identifier =  getPlayerIdentifier(playerId)
    await registerCharacter(identifier, characterData).then((user) => {
        // load character
        cb({status:'ok'})
        loadCharacter(playerId, user)
    })
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
