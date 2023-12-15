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

    setTick(() => {
        inputMicrophone = GetProfileSetting(724);
        if (inputMicrophone == 0) {
            emit('orion:showNotification', 'Vous devez avoir un microphone pour parler.');
            freezeEntityPosition(PlayerPedId(), true);
            emit('orion:showNotification', 'Vous allez être déconnecté dans 1 minute.');

            setTimeout(() => {
                on('disconnect', () => {
                    emit('orion:showNotification', 'Vous avez été déconnecté pour ne pas avoir de micro.');
                });
            }, 30000);

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