const {loginToCharacter} = require('../controllers/Character.js')

onNet('orionCore:server:requestPlayerData', async () => {
    const playerId = source;
    if (!playerId) {
        console.error('Erreur: `source` est null ou non défini');
        return;
    }

    try {
        const identifier = getPlayerIdentifier(playerId);

        const character = await loginToCharacter(playerId, identifier);
        emitNet('orionCore:client:sendCharacterInfo', playerId, {
            position: character.position,
            appearance: character.appearance,
            clothes: character.clothes,
            weapons: character.weapons,
        });
        console.log(`Données du personnage ${character.name} envoyées au joueur.`);
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
