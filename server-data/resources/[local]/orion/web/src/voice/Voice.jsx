import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const SERVER_URL = 'http://127.0.0.1:28469';

const Voice = ({ isGameConnected, voiceToggle }) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const peersRef = useRef([]);
    const localAudioRef = useRef();

    useEffect(() => {
        socketRef.current = io(SERVER_URL);

        // Se connecter initialement à la salle d'attente
        socketRef.current.emit('join_room', 'waiting');

        captureAudio();

        socketRef.current.on('all_users', (users) => {
            const peers = [];
            users.forEach(userID => {
                const peer = createPeer(userID, socketRef.current.id);
                peersRef.current.push({
                    peerID: userID,
                    peer,
                });
                peers.push(peer);
            });
            setPeers(peers);
        });

        socketRef.current.on('user_joined', payload => {
            const peer = addPeer(payload.signal, payload.callerID);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            });

            setPeers(users => [...users, peer]);
        });

        socketRef.current.on('receiving_returned_signal', payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });

        socketRef.current.on('disconnect', reason => {
            console.log(`Déconnecté du serveur: ${reason}`);
            // Afficher un message à l'utilisateur ici
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const targetRoom = isGameConnected ? 'ingame' : 'waiting';
        socketRef.current.emit('switch_room', targetRoom);
    }, [isGameConnected]);

    useEffect(() => {
        if (localAudioRef.current) {
            const audioTracks = localAudioRef.current.getAudioTracks();
            audioTracks.forEach(track => track.enabled = voiceToggle);
        }
    }, [voiceToggle]);

    function captureAudio() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                localAudioRef.current = stream;
                addAudioToPeers(stream);
            })
            .catch(error => {
                console.error("Erreur lors de la capture de l'audio: ", error);
            });
    }

    function addAudioToPeers(stream) {
        peersRef.current.forEach(peer => {
            if (!peer.peer.destroyed) {
                peer.peer.addStream(stream);
            }
        });
    }

    function createPeer(userToSignal, callerID) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: localAudioRef.current,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('sending_signal', { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: localAudioRef.current,
        });

        peer.on('signal', signal => {
            socketRef.current.emit('returning_signal', { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div>
            <h1>Salon: {isGameConnected ? 'In Game' : 'Waiting'}</h1>
        </div>
    );
};

export default Voice;
