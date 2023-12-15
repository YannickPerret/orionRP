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

    setTick(async () => {
        inputMicrophone = GetProfileSetting(724);
        console.log(inputMicrophone)
        if (inputMicrophone == 0) {
            //send message disconnect because microphone is not set up 30 seconds, 15 seconds, 5 seconds and after disconnect
            exports['orion'].showNotification('Configurer votre microphone sinon vous serez déconnecté dans 30 secondes');
            await exports['orion'].delay(15000);
            exports['orion'].showNotification('Configurer votre microphone sinon vous serez déconnecté dans 15 secondes');
            await exports['orion'].delay(10000);
            exports['orion'].showNotification('Configurer votre microphone sinon vous serez déconnecté dans 5 secondes');
            await exports['orion'].delay(5000);
            exports['orion'].showNotification('Vous avez été déconnecté pour ne pas avoir configuré votre microphone');
            await exports['orion'].delay(1000);
            //exports['orion'].disconnect();
            return;
        }

        if (IsControlJustPressed(1, inputMicrophone)) { // 243: CAPS_LOCK
            SendNuiMessage(JSON.stringify({ action: 'toggleMicrophone', state: true }));
        }

        if (IsControlJustReleased(1, inputMicrophone)) {
            SendNuiMessage(JSON.stringify({ action: 'toggleMicrophone', state: false }));
        }
    });
})();