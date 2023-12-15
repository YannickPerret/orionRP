const OpusScript = require("opusscript");
const io = require("socket.io-client");
let socket = io.connect('http://127.0.0.1:28469');

(async () => {
    const PlayerManager = require('./core/server/playerManager.js');

    onNet('orion:voice:s:toggle', (playerId) => {
        let player = PlayerManager.getPlayerBySource(playerId);
        if (player) {
            // Commencez à capturer l'audio ici
            // Éventuellement, encodez l'audio avec Opus
            const encoder = new OpusScript(48000, 2);
            // Supposons que `audioData` est l'audio capturé
            const encodedAudio = encoder.encode(audioData);
            // Envoyez l'audio encodé au serveur Node.js via Socket.IO
            socket.emit('audioMessage', encodedAudio);
        }
    })
})();