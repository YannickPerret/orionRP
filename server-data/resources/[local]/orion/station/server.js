(async () => {
    const PlayerManager = require('./core/server/playerManager.js');

    onNet('orion:station:s:attachRope', (netIdProp, coordPumps, model) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);

        if (!player) {
            emitNet('orion:showNotification', source, 'Vous n\'êtes pas connecté.');
            emitNet('orion:station:c:detachRope', source);
        }
        emitNet('orion:station:c:attachRope', source, netIdProp, coordPumps, model, player.id);
    })

    onNet('orion:station:s:detachRope', () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);

        if (!player) {
            emitNet('orion:showNotification', source, 'Vous n\'êtes pas connecté.');
            return;
        }

        emitNet('orion:station:c:detachRope', source, player.id);
    })

    onNet('orion:station:s:payRefuelVehicle', async (money) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        if (!player) {
            emit('orion:showNotification', source, 'Vous n\'êtes pas connecté.');
            return;
        }
        player.money -= money;
        if (player.money < 0) {
            emitNet('orion:station:c:canceledRefuel', source, 'Vous n\'avez pas assez d\'argent.');
            return;
        }
        await player.save();
    })

})()
