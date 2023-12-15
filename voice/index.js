const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let channels = {};
let sockets = {};

io.on('connection', socket => {
    socket.channels = {};
    sockets[socket.id] = socket;
    console.log(`[${socket.id}] connection accepted`);

    socket.on('disconnect', () => {
        for (let channel in socket.channels) {
            part(channel);
        }
        console.log(`[${socket.id}] disconnected`);
        delete sockets[socket.id];
    });

    socket.on('join-room', config => {
        let channel = config.channel;
        if (channel in socket.channels) {
            console.log(`[${socket.id}] ERROR: already joined `, channel);
            return;
        }
        if (!(channel in channels)) {
            channels[channel] = {};
        }
        for (let id in channels[channel]) {
            channels[channel][id].emit('addPeer-room', {'peer_id': socket.id, 'should_create_offer': false});
            socket.emit('addPeer-room', {'peer_id': id, 'should_create_offer': true});
        }
        socket.join(channel);
        socket.broadcast.to(channel).emit('room-users', config);
        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;
    });

    const part = channel => {
        if (!(channel in socket.channels)) {
            console.log(`[${socket.id}] ERROR: not in `, channel);
            return;
        }
        delete socket.channels[channel];
        delete channels[channel][socket.id];
        for (let id in channels[channel]) {
            channels[channel][id].emit('removePeer', {'peer_id': socket.id});
            socket.emit('removePeer', {'peer_id': id});
        }
    };

    socket.on('part', part);

    socket.on('relayICECandidate-room', config => {
        let peer_id = config.peer_id;
        let ice_candidate = config.ice_candidate;
        console.log(`[${socket.id}] relaying ICE candidate to [${peer_id}] `, ice_candidate);
        if (peer_id in sockets) {
            sockets[peer_id].emit('iceCandidate-room', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        }
    });

    socket.on('relaySessionDescription-room', config => {
        let peer_id = config.peer_id;
        let session_description = config.session_description;
        console.log(`[${socket.id}] relaying session description to [${peer_id}] `, session_description);
        if (peer_id in sockets) {
            sockets[peer_id].emit('sessionDescription-room', {
                'peer_id': socket.id,
                'session_description': session_description
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
