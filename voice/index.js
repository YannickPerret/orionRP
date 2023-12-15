const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const OpusScript = require('opusscript');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const SAMPLE_RATE = 48000; // Fréquence d'échantillonnage typique pour Opus
const CHANNELS = 2; // Stéréo

const encoder = new OpusScript(SAMPLE_RATE, CHANNELS, OpusScript.Application.AUDIO);
const decoder = new OpusScript(SAMPLE_RATE, CHANNELS, OpusScript.Application.AUDIO);


let rooms = {
    'waiting': { enabled: true, default: true, users: new Set(), voiceChatEnabled: false, maxUsers: -1 },
    'ingame': { enabled: true, default: false, users: new Set(), voiceChatEnabled: true, maxUsers: 64},
    'afk': { enabled: true, default: false, users: new Set(), voiceChatEnabled: false, maxUsers: -1 },
};

let users = [];

const defaultRoom = Object.keys(rooms).find(room => rooms[room].default);

io.on('connection', (socket) => {
    console.log(`Un utilisateur s'est connecté avec l'ID : ${socket.id}`);

    // Ajouter l'utilisateur au tableau users
    users.push({ id: socket.id, room: defaultRoom });

    // Connecter l'utilisateur au salon par défaut
    if (defaultRoom && rooms[defaultRoom].enabled) {
        socket.join(defaultRoom);
        rooms[defaultRoom].users.add(socket.id);
        console.log(`Utilisateur ${socket.id} connecté au salon par défaut: ${defaultRoom}`);
    }

    socket.on('join_room', (room) => {
        if (rooms[room] && rooms[room].enabled) {
            socket.leave(users.find(u => u.id === socket.id).room);  // Quitter le salon actuel
            socket.join(room);
            rooms[room].users.add(socket.id);
            // Mise à jour du salon de l'utilisateur
            let user = users.find(u => u.id === socket.id);
            if (user) user.room = room;
            console.log(`Utilisateur ${socket.id} a rejoint le salon: ${room}`);
        } else {
            console.log(`Tentative de rejoindre un salon non disponible ou désactivé: ${room}`);
        }
    });

    socket.on('switch_room', (newRoom) => {
      const oldRoom = users.find(u => u.id === socket.id).room;
      if (rooms[newRoom] && rooms[newRoom].enabled) {
          socket.leave(oldRoom);
          socket.join(newRoom);
          // Mise à jour du salon de l'utilisateur
          let user = users.find(u => u.id === socket.id);
          if (user) user.room = newRoom;
          console.log(`Utilisateur ${socket.id} a changé de salon: ${newRoom}`);
      }
  });

    socket.on('audioMessage', (data) => {
        const decodedAudio = decoder.decode(data);
        socket.to(users.find(u => u.id === socket.id).room).emit('audioMessage', decodedAudio);
    })

    socket.on('leave_room', (room) => {
        if (rooms[room]) {
            socket.leave(room);
            rooms[room].users.delete(socket.id);
            console.log(`Utilisateur ${socket.id} a quitté le salon: ${room}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Utilisateur ${socket.id} déconnecté`);
        // Retirer l'utilisateur de tous les salons et du tableau users
        users = users.filter(user => user.id !== socket.id);
        for (let room in rooms) {
            rooms[room].users.delete(socket.id);
        }
    });
});

const PORT = 28469;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
