import {loginToCharacter, registerCharacter, loadCharacter, saveCharacter} from '../controllers/Character'
import PlayerManagerService from '../services/PlayerManagerServices';
import {Character} from "../models/Character";

onNet('orionCore:server:registerCharacter', async (characterData: Character) => {
    const playerId = source;
    const identifier = getPlayerIdentifier(playerId);

    try {
        const user = await registerCharacter(identifier, characterData);
        const character = user.characters.find(char => char.id === user.activeCharacter);
        loadCharacter(playerId, character);
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
        loadCharacter(playerId, character)
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

setInterval(() => {
    const players = PlayerManagerService.getAllPlayers()
    if (players.length > 0) {
        players.forEach(async (player) => {
            await saveCharacter(player.identifier)
        });
    }
    console.log('Sauvegarde automatique : demande de sauvegarde envoyée à tous les joueurs.');
},10 * 60 * 1000);