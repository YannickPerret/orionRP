RegisterCommand('openSkinCreator', (source) => {
    const playerId = source;
        emitNet('characterCreator:client:startCharacterCreation', playerId);
        console.log(`Commande openSkinCreator exécutée pour le joueur ID ${playerId}`);
}, false);