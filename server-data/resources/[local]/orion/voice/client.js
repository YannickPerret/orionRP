(async () => {
    const OpusScript = require("opusscript");
    const socket = "http://127.0.0.1:28469"
    let localStream;
    let peerConnection;
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}; // Configuration STUN/TURN

    const sampleRate = 48000; // Taux d'échantillonnage typique pour Opus
    const channels = 2; // Stéréo
    const encoder = new OpusScript(sampleRate, channels, OpusScript.Application.AUDIO);

    console.log("test")
    
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
        console.log("ddsdsdsd")
        let inputMicrophone = GetProfileSetting(724);
        if (inputMicrophone == 0) {
            emit('orion:showNotification', 'Vous devez avoir un microphone pour parler.');
            return;
        }

        emitNet('orion:voice:s:toggle', GetPlayerServerId(PlayerId()));
    }, false);




    // Commencer la capture audio
    function startCapture() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false, echoCancellation: true, noiseSuppression: true })
        .then(stream => {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = e => {
                const inputData = e.inputBuffer.getChannelData(0); // ou stéréo si nécessaire
                const outputData = new Float32Array(inputData.length);

                // Encodez ici avec OpusScript
                const encodedData = encoder.encode(inputData);
                
                // Envoyez les données encodées
                // Par exemple, via WebSocket ou une connexion WebRTC
            };
    }).catch(err => console.error(err));
    }

    // Créer la connexion peer
    function createPeerConnection() {
        try {
            peerConnection = new RTCPeerConnection(configuration);

            // Envoyer les ICE candidates au serveur
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('relayICECandidate', {
                        'candidate': event.candidate
                    });
                }
            };
        } catch (err) {
            console.error('Erreur lors de la création de la connexion peer : ', err);
        }
    }

    // Gestionnaire pour envoyer l'audio
    function handleKeyDown(event) {
        if (event.key === 'n' || event.key === 'N') {
            if (!localStream) {
                console.log("Micro non capturé ou non autorisé");
                return;
            }

            if (!peerConnection) createPeerConnection();

            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });

            // Créer une offre et l'envoyer via le serveur
            peerConnection.createOffer()
                .then(offer => peerConnection.setLocalDescription(offer))
                .then(() => {
                    socket.emit('relaySessionDescription', {
                        'sessionDescription': peerConnection.localDescription
                    });
                }).catch(err => console.error('Erreur lors de la création de l\'offre : ', err));

            console.log('Envoi du flux audio');
        }
    }

    // Gestionnaire pour arrêter l'envoi de l'audio
    function handleKeyUp(event) {
        if (event.key === 'n' || event.key === 'N') {
            // Ici, vous pouvez ajouter la logique pour arrêter d'envoyer le flux audio
            console.log('Arrêt de l\'envoi du flux audio');
        }
    }

    // Ecouteurs d'événements
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Socket.io handlers pour la signalisation
    socket.on('iceCandidate', (config) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(config.candidate));
    });

    socket.on('sessionDescription', (config) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(config.sessionDescription));
    });

    startCapture();
})();