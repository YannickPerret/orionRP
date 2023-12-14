onNet('orion:station:s:AttachRope', (netIdProp, coordPumps, model) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    emitNet('orion:station:c:AttachRope', -1, netIdProp, coordPumps, model, player.id);
})

onNet('orion:station:s:DetachRope', (netIdProp) => {
    const source = global.source;
    const player = PlayerManager.getPlayerBySource(source);

    emitNet('orion:station:c:DetachRope', -1, netIdProp, player.id);
})