(async () => {
    const OpusScript = require("opusscript");

    SetTick(() => {
        // Commencez à capturer l'audio ici
        // Éventuellement, encodez l'audio avec Opus
        const encoder = new OpusScript(48000, 2);
        // Supposons que `audioData` est l'audio capturé
        const encodedAudio = encoder.encode(audioData);
        // Envoyez l'audio encodé au serveur Node.js via Socket.IO
        socket.emit('audioMessage', encodedAudio);
    });

    RegisterKeyMapping('Talk', 'Talk', 'keyboard', 'N');
    RegisterCommand('Talk', () => {
        emitNet('orion:voice:s:toggle', GetPlayerServerId(PlayerId()));
    }, false);
})();