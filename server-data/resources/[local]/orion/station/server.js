(async () => {
    onNet('orion:station:s:AttachRope', (netIdProp, coordPumps, model) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
    
        emitNet('orion:station:c:AttachRope', source, netIdProp, coordPumps, model, player.id);
    })
    
    onNet('orion:station:s:DetachRope', (netIdProp) => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
    
        emitNet('orion:station:c:DetachRope', source, netIdProp, player.id);
    })

})
