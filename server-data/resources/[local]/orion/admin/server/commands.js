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

    RegisterCommand('setBlip', async (source, args) => {
        //get position by x,y,z
        const x = args[0];
        const y = args[1];
        const z = args[2];
        const blip = [{
            position: [x, y, z],
            sprite: 1,
            color: 2,
            text: 'custom blip'
        }]
        emitNet('orion:blips:c:createBlips', source, blip);
    }, false)
})();