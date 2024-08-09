(async => {
    let loudOpacity = 0.01
    let muteSound = true

    const toggleSound = (state) => {
        if (state) {
            StartAudioScene("MP_LEADERBOARD_SCENE");
        }
        else {
            StopAudioScene("MP_LEADERBOARD_SCENE");
        }
    }

    const initialSetup = () => {
        SetManualShutdownLoadingScreenNui(true);
        toggleSound(muteSound);

        if (!IsPlayerSwitchInProgress()) {
            SwitchOutPlayer(PlayerPedId(), 0, 1);
        }
    }

    const clearScreen = () => {
        SetCloudHatOpacity(loudOpacity);
        HideHudAndRadarThisFrame();

        SetDrawOrigin(0, 0, 0, 0);
    }

    initialSetup();


    (async () => {
        initialSetup();

        while (GetPlayerSwitchState() != 5) {
            await exports['orion'].delay(0)
            clearScreen();
        }

        ShutdownLoadingScreen()
        clearScreen();
        await exports['orion'].delay(0)
        DoScreenFadeOut(0)

        ShutdownLoadingScreenNui()
        clearScreen();
        await exports['orion'].delay(0)
        clearScreen();

        DoScreenFadeIn(500)

        while (!IsScreenFadedIn()) {
            await exports['orion'].delay(0)
            clearScreen();
        }

        let timer = GetGameTimer();

        toggleSound(false);

        while (true) {
            clearScreen();
            await exports['orion'].delay(0)

            if (GetGameTimer() - timer > 5000) {
                SwitchInPlayer(PlayerPedId());

                clearScreen();

                while (GetPlayerSwitchState() != 12) {
                    await exports['orion'].delay(0)
                    clearScreen();
                }
                break;
            }
        }

        ClearDrawOrigin();
    })()



})()
