(async () => {

    RegisterCommand('blips', async (source, args) => {
        //add blip for all players connected
        const blips = [];
        const players = await PlayerManager.getAllPlayers();
        players.forEach(player => {
            blips.push({
                position: player.position,
                sprite: 1,
                color: 2,
                text: player.name
            });
        });

        emitNet('orion:blips:c:createBlips', source, player);

    }, true);

    RegisterCommand('spectate', async (source, args) => {
        const target = args[0];
        emit('orion:admin:s:spectate', target);
    }, true);

    exports('getPlayers', () => {
        let source = [];
        for (let i = 0; i < GetActivePlayers(); i++) {
            source.push(GetPlayerPed(i));
        }
        return source;
    })
})();