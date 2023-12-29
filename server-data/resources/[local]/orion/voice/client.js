(async () => {
    let inputMicrophone = 243; // 243: CAPS_LOCK
    let microphoneEnabled = false;
    let microphoneMuted = false;
    let microphoneVolume = 1.0;
    let microphoneDistance = 1.0;
    let microphoneSampleRate = 48000;
    let microphoneChannels = 2;
    let microphoneBitrate = 64000;

    let isPushingToTalk = false;

    let voice = { default: 5.0, shout: 12.0, whisper: 1.0, current: 0, level: null }


    on('ResourceStart', async (resourceName) => {
        if (GetCurrentResourceName() !== resourceName) {
            return;
        }
        console.log('Voice started');

        if (voice.current == 0) {
            voice.level = voice.default;
            NetworkSetTalkerProximity(voice.level);
        } else if (voice.current == 1) {
            voice.level = voice.shout;
            NetworkSetTalkerProximity(voice.level);
        }
        else if (voice.current == 2) {
            voice.level = voice.whisper;
            NetworkSetTalkerProximity(voice.level);
        }
        else {
            voice.level = voice.default;
            NetworkSetTalkerProximity(voice.level);
        }
    });

    on("PlayerSpawned", () => {
        NetworkSetTalkerProximity(7.0);
    })

    setTick(async () => {
        RequestAnimDict("mp_facial");
        RequestAnimDict("facials@gen_male@variations@normal");

        while (true) {
            await exports['orion'].delay(300);
            let playerId = PlayerId();

            for (let playerIndex = 0; playerIndex < GetActivePlayers().length; playerIndex++) {
                let boolTalking = NetworkIsPlayerTalking(playerIndex);
                if (playerIndex != playerId) {
                    if (boolTalking) {
                        PlayFacialAnim(GetPlayerPed(playerIndex), "mic_chatter", "mp_facial");
                    }
                    else if (!boolTalking) {
                        PlayFacialAnim(GetPlayerPed(playerIndex), "mood_normal_1", "facials@gen_male@variations@normal");
                    }
                }
            }
        }
    })

    setTick(async () => {
        inputMicrophone = GetProfileSetting(724);
        //console.log(inputMicrophone)
        if (inputMicrophone == 0) {
            microphoneEnabled = false;
            //send message disconnect because microphone is not set up 30 seconds, 15 seconds, 5 seconds and after disconnect
            /*exports['orion'].showNotification('Configurer votre microphone sinon vous serez déconnecté dans 30 secondes');
            await exports['orion'].delay(15000);
            exports['orion'].showNotification('Configurer votre microphone sinon vous serez déconnecté dans 15 secondes');
            await exports['orion'].delay(10000);
            exports['orion'].showNotification('Configurer votre microphone sinon vous serez déconnecté dans 5 secondes');
            await exports['orion'].delay(5000);
            exports['orion'].showNotification('Vous avez été déconnecté pour ne pas avoir configuré votre microphone');
            await exports['orion'].delay(1000);
            //exports['orion'].disconnect();*/
            return;
        }

        if (NetworkIsPlayerTalking(PlayerId()) && !isPushingToTalk) {
            console.log('Player started talking');
            isPushingToTalk = true;
            NetworkSetVoiceActive(true);
        }
        else if (!NetworkIsPlayerTalking(PlayerId()) && isPushingToTalk) {
            console.log('Player stopped talking');
            isPushingToTalk = false;
            NetworkSetVoiceActive(false);
        }
    });

    RegisterNuiCallbackType('toggleMicrophone');
    on('__cfx_nui:toggleMicrophone', (data, cb) => {
        microphoneEnabled = data.state;
        cb({});
    });

    RegisterNuiCallbackType('toggleMute');
    on('__cfx_nui:toggleMute', (data, cb) => {
        microphoneMuted = data.state;
        cb({});
    });
})();