(async () => {
    const PlayerManager = require('./core/server/playerManager.js');

    onNet('orion:station:s:attachRope', (netIdProp, coordPumps, model) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
    
        emitNet('orion:station:c:attachRope',source , netIdProp, coordPumps, model, player.id);
    })
    
    onNet('orion:station:s:detachRope', (netIdProp) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
    
        console.log('detach rope')
        emitNet('orion:station:c:detachRope', source, netIdProp, player.id);
    })

})()
