(async () => {

    on('PlayerSpawned', async () => {
        emitNet('orion:garage:c:initializeGarages');
    })

})();