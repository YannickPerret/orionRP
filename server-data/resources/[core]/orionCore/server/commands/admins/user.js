const PlayerManagerService = require("./server/services/PlayerManagerServices.js");

RegisterCommand('login', async (source) => {
    const playerId = source;
    const identifier = getPlayerIdentifier(playerId);

    const userRepository = AppDataSource.getRepository('User');
    const user = await userRepository.findOne({
        where: { identifier },
        relations: ['role'],
    });

    if (user) {
        PlayerManagerService.removePlayer(playerId);
        user.source = playerId;
        PlayerManagerService.addPlayer(playerId, user);

        emitNet('chat:addMessage', playerId, { args: ["Admin", `Reconnexion réussie pour ${user.username}.`] });
    } else {
        emitNet('chat:addMessage', playerId, { args: ["Erreur", "Utilisateur non trouvé."] });
    }
}, false);

RegisterCommand('loginAs', async (source, args) => {
    if (!await UserController.isAdmin(source)) {
        emitNet('chat:addMessage', source, { args: ["Erreur", "Permission refusée pour cette action."] });
        return;
    }
    const playerId = source;
    const targetUserId = args[0];

    const userRepository = AppDataSource.getRepository('User');
    const adminUser = await userRepository.findOne({
        where: { id: playerId },
        relations: ['role'],
    });

    if (adminUser && adminUser.role.name === 'admin') {
        const targetUser = await userRepository.findOne({
            where: { id: targetUserId },
            relations: ['role'],
        });

        if (targetUser) {
            emitNet('chat:addMessage', playerId, { args: ["Admin", `Vous êtes maintenant connecté en tant que ${targetUser.username}.`] });
        } else {
            emitNet('chat:addMessage', playerId, { args: ["Erreur", "Utilisateur cible non trouvé."] });
        }
    } else {
        emitNet('chat:addMessage', playerId, { args: ["Erreur", "Permission refusée pour cette action."] });
    }
}, false);

function getPlayerIdentifier(playerId) {
    for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
        const identifier = GetPlayerIdentifier(playerId, i);
        if (identifier.includes('license:')) {
            return identifier;
        }
    }
    return null;
}