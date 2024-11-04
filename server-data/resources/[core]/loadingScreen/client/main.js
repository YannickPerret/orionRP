let playerSpawned = false

on('playerSpawned', () => {
    if (!playerSpawned) {
        ShutdownLoadingScreenNui()
        playerSpawned = true
    }
})